import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ListSkeleton } from "@/components/Skeleton";
import { ExportButton } from "@/components/ExportButton";
import { useBills, useCreateBill, useUpdateBill, useDeleteBill } from "@/lib/api";
import { exportBills, ExportFormat } from "@/lib/export";
import { 
  Calendar, Plus, CheckCircle, XCircle, DollarSign, AlertTriangle, 
  Trash2, Receipt, Clock, TrendingDown, Zap
} from "lucide-react";
import { format, parseISO, isBefore, isAfter, addDays } from "date-fns";
import { toast } from "@/hooks/use-toast";

const categoryColors: Record<string, string> = {
  "Utilities": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "Subscriptions": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Insurance": "bg-green-500/20 text-green-400 border-green-500/30",
  "Rent": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Internet": "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

export default function BillTracker() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [billName, setBillName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [category, setCategory] = useState("");

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  const { data, isLoading } = useBills();
  const createBill = useCreateBill();
  const updateBill = useUpdateBill();
  const deleteBill = useDeleteBill();

  const bills = data?.bills || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!billName || !amount || !dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBill.mutateAsync({
        name: billName,
        amount,
        dueDate: new Date(dueDate).toISOString(),
        frequency,
        category: category || null,
      });

      toast({
        title: "Bill Added",
        description: `${billName} has been added to your bill tracker`,
      });

      setBillName("");
      setAmount("");
      setDueDate("");
      setFrequency("monthly");
      setCategory("");
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create bill",
        variant: "destructive",
      });
    }
  };

  const togglePaid = async (id: string, isPaid: boolean) => {
    try {
      await updateBill.mutateAsync({
        id,
        data: { isPaid: !isPaid },
      });
      toast({
        title: isPaid ? "Marked as Unpaid" : "Marked as Paid",
        description: isPaid ? "Bill status updated" : "Great! Bill marked as paid",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update bill",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBill.mutateAsync(id);
      toast({
        title: "Bill Deleted",
        description: "Bill has been removed from tracker",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete bill",
        variant: "destructive",
      });
    }
  };

  const today = new Date();
  const overdueBills = bills.filter((bill: any) => !bill.isPaid && isBefore(parseISO(bill.dueDate), today));
  const upcomingBills = bills.filter((bill: any) => !bill.isPaid && isAfter(parseISO(bill.dueDate), today) && isBefore(parseISO(bill.dueDate), addDays(today, 7)));
  const paidBills = bills.filter((bill: any) => bill.isPaid);
  const totalMonthly = bills
    .filter((bill: any) => bill.frequency === "monthly")
    .reduce((sum: number, bill: any) => sum + parseFloat(bill.amount), 0);

  const sortedBills = [...bills].sort((a: any, b: any) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  const handleExport = (format: ExportFormat) => {
    if (!bills || bills.length === 0) {
      throw new Error("No bills to export");
    }
    exportBills(bills, format);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Receipt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="text-page-title">
                  Bill Tracker
                </h1>
                <p className="text-sm text-white/60">Never miss a payment</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-2"
                  data-testid="button-add-bill"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Bill</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Bill</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Track your recurring bills and never miss a payment
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="billName" className="text-white text-sm">Bill Name *</Label>
                    <Input
                      id="billName"
                      placeholder="e.g., Electricity, Internet, Rent"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={billName}
                      onChange={(e) => setBillName(e.target.value)}
                      data-testid="input-bill-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount" className="text-white text-sm">Amount (AUD) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="99.99"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      data-testid="input-amount"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-white text-sm">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      className="bg-white/5 border-white/10 text-white"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      data-testid="input-due-date"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="text-white text-sm">Frequency *</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white" data-testid="select-frequency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-white/10">
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="once">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-white text-sm">Category (Optional)</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Utilities, Subscriptions"
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      data-testid="input-category"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-white/10 text-white hover:bg-white/5"
                      onClick={() => setIsAddDialogOpen(false)}
                      data-testid="button-cancel"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                      disabled={createBill.isPending}
                      data-testid="button-save-bill"
                    >
                      {createBill.isPending ? "Adding..." : "Add Bill"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-zinc-900/60 border-white/5 p-4" data-testid="card-total-bills">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Total Bills</span>
            </div>
            <div className="text-2xl font-bold text-purple-400" data-testid="text-total-bills">
              {bills.length}
            </div>
            <div className="text-xs text-white/50">tracked</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4" data-testid="card-monthly-total">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">Monthly</span>
            </div>
            <div className="text-2xl font-bold text-white" data-testid="text-monthly-total">
              ${totalMonthly.toFixed(0)}
            </div>
            <div className="text-xs text-white/50">recurring</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4" data-testid="card-overdue">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-white/60">Overdue</span>
            </div>
            <div className="text-2xl font-bold text-red-400" data-testid="text-overdue">
              {overdueBills.length}
            </div>
            <div className="text-xs text-white/50">need attention</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4 col-span-2 md:col-span-1" data-testid="card-upcoming">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/60">Due Soon</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400" data-testid="text-upcoming">
              {upcomingBills.length}
            </div>
            <div className="text-xs text-white/50">within 7 days</div>
          </Card>
        </div>

        {/* Export Button */}
        {bills.length > 0 && (
          <div className="flex justify-end mb-4">
            <ExportButton 
              onExport={handleExport}
              label="Export"
              variant="outline"
              className="border-white/10 text-white/70 hover:bg-white/5"
              disabled={bills.length === 0}
              dataTestId="button-export-bills"
            />
          </div>
        )}

        {/* Bills List */}
        {isLoading ? (
          <ListSkeleton count={4} />
        ) : bills.length === 0 ? (
          <Card className="bg-zinc-900/60 border-white/5 p-8 text-center" data-testid="card-empty-state">
            <Receipt className="h-12 w-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No Bills Tracked Yet</h3>
            <p className="text-white/50 text-sm mb-6">
              Start tracking your bills to never miss a payment
            </p>
            <Button
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-2"
              onClick={() => setIsAddDialogOpen(true)}
              data-testid="button-create-first-bill"
            >
              <Plus className="h-4 w-4" />
              Add Your First Bill
            </Button>
          </Card>
        ) : (
          <div className="space-y-3">
            {sortedBills.map((bill: any, index: number) => {
              const billDueDate = parseISO(bill.dueDate);
              const isOverdue = !bill.isPaid && isBefore(billDueDate, today);
              const isDueSoon = !bill.isPaid && isAfter(billDueDate, today) && isBefore(billDueDate, addDays(today, 7));

              return (
                <motion.div
                  key={bill.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Card 
                    className={`bg-zinc-900/60 border-white/5 p-4 transition-all hover:scale-[1.01] ${
                      isOverdue ? 'ring-1 ring-red-500/50 bg-red-500/5' : 
                      isDueSoon ? 'ring-1 ring-cyan-500/30 bg-cyan-500/5' : 
                      bill.isPaid ? 'opacity-60' : ''
                    }`}
                    data-testid={`card-bill-${bill.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          bill.isPaid 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-white/5 text-white/30 hover:text-white/60'
                        }`}
                        onClick={() => togglePaid(bill.id, bill.isPaid)}
                        data-testid={`button-toggle-paid-${bill.id}`}
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={`font-semibold text-sm sm:text-base ${bill.isPaid ? 'text-white/50 line-through' : 'text-white'}`} data-testid={`text-bill-name-${bill.id}`}>
                            {bill.name}
                          </h3>
                          {bill.category && (
                            <Badge className={`text-[10px] ${categoryColors[bill.category] || 'bg-slate-500/20 text-slate-400'}`}>
                              {bill.category}
                            </Badge>
                          )}
                          {isOverdue && (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[10px]">
                              Overdue
                            </Badge>
                          )}
                          {isDueSoon && !isOverdue && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-[10px]">
                              Due Soon
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-white/50 mt-1">
                          <span className={isOverdue ? 'text-red-400' : isDueSoon ? 'text-cyan-400' : ''}>
                            {format(billDueDate, 'MMM d, yyyy')}
                          </span>
                          <span className="capitalize">{bill.frequency}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="text-right">
                          <p className={`text-lg sm:text-xl font-bold ${isOverdue ? 'text-red-400' : 'text-white'}`} data-testid={`text-amount-${bill.id}`}>
                            ${parseFloat(bill.amount).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/30 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleDelete(bill.id)}
                          data-testid={`button-delete-${bill.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 p-4 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Smart bill tracking</span>
          </div>
          <p className="text-xs text-white/40">
            Get reminders before bills are due and track your spending
          </p>
        </div>
      </div>
    </div>
  );
}
