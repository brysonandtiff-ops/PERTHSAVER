import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Download, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface FinancialReport {
  id: string;
  title: string;
  reportType: string;
  dateRange: { startDate: string; endDate: string };
  createdAt: string;
  summary?: string;
}

export default function FinancialReports() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [reportType, setReportType] = useState("comprehensive");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sections, setSections] = useState({
    spending: true,
    savings: true,
    goals: true,
    investments: true,
  });

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Financial Report",
          reportType,
          dateRange: { startDate, endDate },
          sections,
          data: {
            totalSavings: "$0",
            spendingTrend: "Stable",
            goalProgress: "0%",
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to create report");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Report created successfully!");
      setShowForm(false);
      setTitle("");
      setReportType("comprehensive");
      setStartDate("");
      setEndDate("");
    },
    onError: () => {
      toast.error("Failed to create report");
    },
  });

  const exportMutation = useMutation({
    mutationFn: async ({ id, format }: { id: string; format: string }) => {
      const res = await fetch(`/api/reports/${id}/export?format=${format}`);
      if (!res.ok) throw new Error("Failed to export report");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const contentDisposition = res.headers.get("content-disposition");
      const filename = contentDisposition?.split("filename=")[1]?.replace(/"/g, "") || "report";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: () => {
      toast.error("Failed to export report");
    },
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-cyan-500" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">Financial Reports</h1>
          </div>
          <p className="text-white/60 text-base sm:text-lg">
            Generate and customize your financial reports with export options
          </p>
        </motion.div>

        {/* Create Report Form */}
        {showForm ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-8"
          >
            <Card className="bg-white/5 border-cyan-500/30">
              <CardHeader>
                <CardTitle>Create New Report</CardTitle>
                <CardDescription>Customize your financial report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">Report Title</label>
                  <Input
                    placeholder="e.g., Monthly Spending Report"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    data-testid="input-report-title"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Report Type</label>
                    <Select value={reportType} onValueChange={setReportType}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spending">Spending Analysis</SelectItem>
                        <SelectItem value="savings">Savings Summary</SelectItem>
                        <SelectItem value="budget">Budget Report</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      data-testid="input-start-date"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white mb-2 block">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      data-testid="input-end-date"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-white block">Report Sections</label>
                  <div className="space-y-2">
                    {Object.entries(sections).map(([key, value]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox
                          checked={value}
                          onCheckedChange={(checked) =>
                            setSections({ ...sections, [key]: checked })
                          }
                          data-testid={`checkbox-section-${key}`}
                        />
                        <span className="text-white/80 capitalize">{key} Summary</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={createMutation.isPending || !title.trim()}
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                    data-testid="button-create-report"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create Report"
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowForm(false)}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-8"
          >
            <Button
              onClick={() => setShowForm(true)}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-6 text-base"
              data-testid="button-new-report"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Report
            </Button>
          </motion.div>
        )}

        {/* Reports List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : reportsData?.reports?.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center py-12"
            >
              <p className="text-white/60">No reports yet. Create your first report to get started!</p>
            </motion.div>
          ) : (
            reportsData?.reports?.map((report: FinancialReport, idx: number) => (
              <motion.div
                key={report.id}
                initial="hidden"
                animate="visible"
                variants={{ ...containerVariants, visible: { transition: { delay: idx * 0.1 } } }}
              >
                <Card className="bg-white/5 border-cyan-500/30 hover:border-cyan-500/60 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white">{report.title}</CardTitle>
                        <CardDescription className="text-white/60">
                          {report.reportType} • {new Date(report.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportMutation.mutate({ id: report.id, format: "csv" })}
                        disabled={exportMutation.isPending}
                        className="border-white/20 text-white hover:bg-white/10"
                        data-testid={`button-export-csv-${report.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        CSV
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportMutation.mutate({ id: report.id, format: "json" })}
                        disabled={exportMutation.isPending}
                        className="border-white/20 text-white hover:bg-white/10"
                        data-testid={`button-export-json-${report.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        JSON
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => exportMutation.mutate({ id: report.id, format: "pdf" })}
                        disabled={exportMutation.isPending}
                        className="border-white/20 text-white hover:bg-white/10"
                        data-testid={`button-export-pdf-${report.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
