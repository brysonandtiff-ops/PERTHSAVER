import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Home, Calculator, PlusCircle, Trash2, Loader2, TrendingUp } from "lucide-react";
import { useMortgages, useCreateMortgage, useDeleteMortgage, useAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";

interface RefinanceScenario {
  name: string;
  monthlyPayment: number;
  totalInterest: number;
  savings: number;
}

const LOAN_TYPES = [
  { value: "variable", label: "Variable Rate" },
  { value: "fixed", label: "Fixed Rate" },
  { value: "split", label: "Split Loan" },
  { value: "interest_only", label: "Interest Only" },
];

export default function HomeLoanAdvisor() {
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data: mortgagesData, isLoading: mortgagesLoading } = useMortgages();
  const createMortgage = useCreateMortgage();
  const deleteMortgage = useDeleteMortgage();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newLoan, setNewLoan] = useState({
    name: "",
    principal: "",
    interestRate: "",
    termYears: "30",
    loanType: "variable",
    lender: "",
  });
  const [newRate, setNewRate] = useState("4.5");
  const [scenarios, setScenarios] = useState<RefinanceScenario[]>([]);

  const mortgages = mortgagesData?.mortgages || [];
  const totalLoans = mortgages.length;
  const totalOutstanding = mortgages.reduce((sum: number, l: any) => sum + (l.principal || 0), 0);
  const totalMonthly = mortgages.reduce((sum: number, l: any) => sum + (l.monthlyPayment || 0), 0);

  const calculateMonthlyPayment = (principal: number, rate: number, years: number) => {
    if (rate === 0) return principal / (years * 12);
    const r = rate / 100 / 12;
    const n = years * 12;
    return (principal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  };

  const calculateRefinancing = () => {
    if (mortgages.length === 0) return;

    const currentTotal = mortgages.reduce((sum: number, l: any) => {
      const months = (l.termYears || 30) * 12;
      return sum + (l.monthlyPayment || 0) * months;
    }, 0);

    const refinancedMonthly = mortgages.reduce((sum: number, l: any) => {
      return sum + calculateMonthlyPayment(l.principal || 0, parseFloat(newRate), l.termYears || 30);
    }, 0);

    const refinancedTotal = mortgages.reduce((sum: number, l: any) => {
      const months = (l.termYears || 30) * 12;
      return sum + calculateMonthlyPayment(l.principal || 0, parseFloat(newRate), l.termYears || 30) * months;
    }, 0);

    const newScenarios: RefinanceScenario[] = [
      {
        name: "Current",
        monthlyPayment: Math.round(totalMonthly),
        totalInterest: Math.round(currentTotal - totalOutstanding),
        savings: 0,
      },
      {
        name: `Refinance to ${newRate}%`,
        monthlyPayment: Math.round(refinancedMonthly),
        totalInterest: Math.round(refinancedTotal - totalOutstanding),
        savings: Math.round(currentTotal - refinancedTotal),
      },
    ];

    setScenarios(newScenarios);
  };

  const handleCreateMortgage = async () => {
    if (!newLoan.name || !newLoan.principal || !newLoan.interestRate) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    const principal = parseFloat(newLoan.principal);
    const rate = parseFloat(newLoan.interestRate);
    const years = parseInt(newLoan.termYears);
    const monthly = calculateMonthlyPayment(principal, rate, years);

    try {
      await createMortgage.mutateAsync({
        name: newLoan.name,
        principal,
        interestRate: rate,
        termYears: years,
        monthlyPayment: Math.round(monthly),
      });
      toast({ title: "Mortgage Added", description: `${newLoan.name} added successfully.` });
      setNewLoan({ name: "", principal: "", interestRate: "", termYears: "30", loanType: "variable", lender: "" });
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add mortgage.", variant: "destructive" });
    }
  };

  const handleDeleteMortgage = async (id: number) => {
    try {
      await deleteMortgage.mutateAsync(id);
      toast({ title: "Mortgage Removed", description: "Mortgage removed from your list." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove mortgage.", variant: "destructive" });
    }
  };

  if (authLoading) return <PageLoader />;
  if (!authData?.user) return <AuthRequired message="Please login to manage your mortgages" />;
  if (mortgagesLoading) return <PageLoader />;

  const comparisonData = scenarios.map((s) => ({
    name: s.name,
    monthly: s.monthlyPayment,
    savings: Math.max(0, s.savings),
  }));

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-purple-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500"
              animate={{ boxShadow: ["0 0 20px rgba(139,92,246,0.3)", "0 0 35px rgba(139,92,246,0.5)", "0 0 20px rgba(139,92,246,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Home className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
                Home Loan Advisor
              </h1>
              <p className="text-white/60 text-sm">Optimize your mortgages</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500" data-testid="button-add-mortgage">
                <PlusCircle className="w-4 h-4 mr-2" /> Add Loan
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-purple-500/20">
              <DialogHeader>
                <DialogTitle className="text-white">Add Home Loan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Loan Name (e.g., Primary Home)"
                  value={newLoan.name}
                  onChange={(e) => setNewLoan({ ...newLoan, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-loan-name"
                />
                <Input
                  type="number"
                  placeholder="Loan Amount ($)"
                  value={newLoan.principal}
                  onChange={(e) => setNewLoan({ ...newLoan, principal: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-loan-principal"
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Interest Rate (%)"
                  value={newLoan.interestRate}
                  onChange={(e) => setNewLoan({ ...newLoan, interestRate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-loan-rate"
                />
                <Select value={newLoan.termYears} onValueChange={(v) => setNewLoan({ ...newLoan, termYears: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Loan Term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 Years</SelectItem>
                    <SelectItem value="20">20 Years</SelectItem>
                    <SelectItem value="25">25 Years</SelectItem>
                    <SelectItem value="30">30 Years</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Lender (optional)"
                  value={newLoan.lender}
                  onChange={(e) => setNewLoan({ ...newLoan, lender: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={handleCreateMortgage}
                  disabled={createMortgage.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500"
                  data-testid="button-create-mortgage"
                >
                  {createMortgage.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Loan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Loans</p>
            <p className="text-2xl font-bold text-purple-400" data-testid="text-total-loans">{totalLoans}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 rounded-xl p-3 border border-indigo-500/30">
            <p className="text-white/60 text-xs uppercase">Outstanding</p>
            <p className="text-2xl font-bold text-indigo-400" data-testid="text-outstanding">
              ${(totalOutstanding / 1000).toFixed(0)}K
            </p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Monthly</p>
            <p className="text-2xl font-bold text-purple-400" data-testid="text-monthly">
              ${totalMonthly.toLocaleString()}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {mortgages.length === 0 ? (
          <div className="text-center py-12">
            <Home className="w-16 h-16 mx-auto text-purple-500/30 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Mortgages Added</h3>
            <p className="text-white/60 mb-6">Add your home loans to analyze refinancing options</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-500"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add First Loan
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Your Loans</h3>
              {mortgages.map((loan: any, idx: number) => (
                <motion.div
                  key={loan.id}
                  className="bg-zinc-900/50 rounded-xl p-4 border border-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  data-testid={`loan-${loan.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{loan.name}</p>
                      <p className="text-white/40 text-xs">
                        {loan.interestRate}% • {loan.termYears || 30} year term • ${loan.monthlyPayment?.toLocaleString()}/mo
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-purple-400 font-bold">${(loan.principal || 0).toLocaleString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMortgage(loan.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                        data-testid={`delete-loan-${loan.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-purple-500/15 to-indigo-500/15 rounded-xl p-4 border border-purple-500/30">
              <label className="block text-white/60 text-sm mb-2">Compare Refinancing Rate</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  step="0.01"
                  value={newRate}
                  onChange={(e) => setNewRate(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="New interest rate %"
                  data-testid="input-new-rate"
                />
                <Button
                  onClick={calculateRefinancing}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500"
                  data-testid="button-compare"
                >
                  <Calculator className="w-4 h-4 mr-2" /> Compare
                </Button>
              </div>
            </div>

            {scenarios.length > 0 && (
              <>
                {scenarios[1]?.savings > 0 && (
                  <motion.div
                    className="bg-gradient-to-r from-green-500/15 to-purple-500/15 rounded-xl p-6 border border-green-500/30 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <TrendingUp className="w-12 h-12 mx-auto text-green-400 mb-3" />
                    <h3 className="text-2xl font-bold text-white mb-1">
                      Save ${scenarios[1].savings.toLocaleString()}
                    </h3>
                    <p className="text-white/60">
                      By refinancing to {newRate}% • ${(totalMonthly - scenarios[1].monthlyPayment).toLocaleString()} less per month
                    </p>
                  </motion.div>
                )}

                <motion.div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                  <h3 className="text-white font-semibold mb-4">Comparison</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 11 }} />
                      <YAxis tick={{ fill: "#fff", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #8B5CF6" }} />
                      <Legend />
                      <Bar dataKey="monthly" fill="#8B5CF6" name="Monthly Payment" />
                      <Bar dataKey="savings" fill="#F59E0B" name="Potential Savings" />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
