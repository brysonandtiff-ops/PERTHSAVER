import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Zap, TrendingDown, PlusCircle, Trash2, Loader2, Calculator } from "lucide-react";
import { useDebts, useCreateDebt, useDeleteDebt, useAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";

interface PayoffPlan {
  month: number;
  totalDebt: number;
  totalInterestPaid: number;
}

const DEBT_TYPES = [
  { value: "credit_card", label: "Credit Card" },
  { value: "personal_loan", label: "Personal Loan" },
  { value: "car_loan", label: "Car Loan" },
  { value: "student_loan", label: "Student Loan" },
  { value: "other", label: "Other" },
];

export default function DebtPayoffCalculator() {
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data: debtsData, isLoading: debtsLoading } = useDebts();
  const createDebt = useCreateDebt();
  const deleteDebt = useDeleteDebt();
  const { toast } = useToast();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: "",
    type: "credit_card",
    balance: "",
    interestRate: "",
    minimumPayment: "",
  });
  const [extraPayment, setExtraPayment] = useState(500);
  const [payoffPlan, setPayoffPlan] = useState<PayoffPlan[]>([]);

  const debts = debtsData?.debts || [];
  const totalDebt = debts.reduce((sum: number, d: any) => sum + (d.balance || 0), 0);
  const minPaymentTotal = debts.reduce((sum: number, d: any) => sum + (d.minimumPayment || 0), 0);

  const calculatePayoffPlan = () => {
    if (debts.length === 0) return;

    const workingDebts = debts.map((d: any) => ({ ...d }));
    const plan: PayoffPlan[] = [];
    let month = 0;
    let totalInterestPaid = 0;

    while (workingDebts.some((d: any) => d.balance > 0) && month < 120) {
      month++;
      let monthlyInterest = 0;
      const totalPayment = minPaymentTotal + extraPayment;

      workingDebts.sort((a: any, b: any) => b.interestRate - a.interestRate);

      let remainingPayment = totalPayment;
      workingDebts.forEach((debt: any) => {
        if (debt.balance > 0) {
          const interest = (debt.balance * (debt.interestRate || 0)) / 100 / 12;
          monthlyInterest += interest;
          debt.balance += interest;

          const payment = Math.min(debt.balance, remainingPayment);
          debt.balance = Math.max(0, debt.balance - payment);
          remainingPayment -= payment;
        }
      });

      totalInterestPaid += monthlyInterest;
      plan.push({
        month,
        totalDebt: workingDebts.reduce((sum: number, d: any) => sum + d.balance, 0),
        totalInterestPaid: Math.round(totalInterestPaid),
      });

      if (workingDebts.every((d: any) => d.balance <= 0)) break;
    }

    setPayoffPlan(plan);
  };

  const handleCreateDebt = async () => {
    if (!newDebt.name || !newDebt.balance || !newDebt.interestRate) {
      toast({ title: "Error", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }
    try {
      await createDebt.mutateAsync({
        name: newDebt.name,
        type: newDebt.type,
        balance: parseFloat(newDebt.balance),
        interestRate: parseFloat(newDebt.interestRate),
        minimumPayment: parseFloat(newDebt.minimumPayment) || 0,
      });
      toast({ title: "Debt Added", description: `${newDebt.name} added to your debts.` });
      setNewDebt({ name: "", type: "credit_card", balance: "", interestRate: "", minimumPayment: "" });
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add debt.", variant: "destructive" });
    }
  };

  const handleDeleteDebt = async (id: number) => {
    try {
      await deleteDebt.mutateAsync(id);
      toast({ title: "Debt Removed", description: "Debt removed from your list." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to remove debt.", variant: "destructive" });
    }
  };

  if (authLoading) return <PageLoader />;
  if (!authData?.user) return <AuthRequired message="Please login to track your debts" />;
  if (debtsLoading) return <PageLoader />;

  const debtFreeDate = payoffPlan.length > 0 
    ? new Date(Date.now() + payoffPlan.length * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-AU', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-red-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-red-500 to-pink-500"
              animate={{ boxShadow: ["0 0 20px rgba(239,68,68,0.3)", "0 0 35px rgba(239,68,68,0.5)", "0 0 20px rgba(239,68,68,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingDown className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
                Debt Payoff Calculator
              </h1>
              <p className="text-white/60 text-sm">Accelerate debt elimination</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-500 to-pink-500" data-testid="button-add-debt">
                <PlusCircle className="w-4 h-4 mr-2" /> Add Debt
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-red-500/20">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Debt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Debt Name (e.g., Visa Card)"
                  value={newDebt.name}
                  onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-debt-name"
                />
                <Select value={newDebt.type} onValueChange={(v) => setNewDebt({ ...newDebt, type: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Debt Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEBT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Balance ($)"
                  value={newDebt.balance}
                  onChange={(e) => setNewDebt({ ...newDebt, balance: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-debt-balance"
                />
                <Input
                  type="number"
                  placeholder="Interest Rate (%)"
                  value={newDebt.interestRate}
                  onChange={(e) => setNewDebt({ ...newDebt, interestRate: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-debt-rate"
                />
                <Input
                  type="number"
                  placeholder="Minimum Payment ($)"
                  value={newDebt.minimumPayment}
                  onChange={(e) => setNewDebt({ ...newDebt, minimumPayment: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-debt-min-payment"
                />
                <Button
                  onClick={handleCreateDebt}
                  disabled={createDebt.isPending}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-500"
                  data-testid="button-create-debt"
                >
                  {createDebt.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Debt"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl p-3 border border-red-500/30">
            <p className="text-white/60 text-xs uppercase">Total Debt</p>
            <p className="text-2xl font-bold text-red-400" data-testid="text-total-debt">
              ${totalDebt.toLocaleString()}
            </p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl p-3 border border-orange-500/30">
            <p className="text-white/60 text-xs uppercase">Min Payment</p>
            <p className="text-2xl font-bold text-orange-400" data-testid="text-min-payment">
              ${minPaymentTotal.toLocaleString()}
            </p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl p-3 border border-green-500/30">
            <p className="text-white/60 text-xs uppercase">Extra Payment</p>
            <p className="text-2xl font-bold text-green-400" data-testid="text-extra-payment">
              ${extraPayment}
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {debts.length === 0 ? (
          <div className="text-center py-12">
            <TrendingDown className="w-16 h-16 mx-auto text-red-500/30 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Debts Added</h3>
            <p className="text-white/60 mb-6">Add your debts to create a payoff plan</p>
            <Button
              onClick={() => setDialogOpen(true)}
              className="bg-gradient-to-r from-red-500 to-pink-500"
            >
              <PlusCircle className="w-4 h-4 mr-2" /> Add First Debt
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Your Debts</h3>
              {debts.map((debt: any, idx: number) => (
                <motion.div
                  key={debt.id}
                  className="bg-zinc-900/50 rounded-xl p-4 border border-white/5"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  data-testid={`debt-${debt.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-semibold">{debt.name}</p>
                      <p className="text-white/40 text-xs">
                        {debt.interestRate}% APR • ${debt.minimumPayment || 0}/mo min
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-red-400 font-bold">${(debt.balance || 0).toLocaleString()}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDebt(debt.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                        data-testid={`delete-debt-${debt.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-green-500/15 to-cyan-500/15 rounded-xl p-4 border border-green-500/30">
              <label className="block text-white/60 text-sm mb-2">Extra Monthly Payment</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(parseInt(e.target.value) || 0)}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-extra-payment"
                />
                <Button
                  onClick={calculatePayoffPlan}
                  className="bg-gradient-to-r from-green-500 to-cyan-500"
                  data-testid="button-calculate"
                >
                  <Calculator className="w-4 h-4 mr-2" /> Calculate
                </Button>
              </div>
            </div>

            {payoffPlan.length > 0 && (
              <>
                <motion.div
                  className="bg-gradient-to-r from-green-500/15 to-purple-500/15 rounded-xl p-6 border border-green-500/30 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Zap className="w-12 h-12 mx-auto text-green-400 mb-3" />
                  <h3 className="text-2xl font-bold text-white mb-1">Debt Free by {debtFreeDate}</h3>
                  <p className="text-white/60">
                    {payoffPlan.length} months • Total interest: ${payoffPlan[payoffPlan.length - 1]?.totalInterestPaid.toLocaleString()}
                  </p>
                </motion.div>

                <motion.div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                  <h3 className="text-white font-semibold mb-4">Payoff Timeline</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={payoffPlan.filter((_, i) => i % Math.max(1, Math.floor(payoffPlan.length / 12)) === 0)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" tick={{ fill: "#fff", fontSize: 11 }} label={{ value: "Months", fill: "#fff", position: "bottom" }} />
                      <YAxis tick={{ fill: "#fff", fontSize: 11 }} />
                      <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #F59E0B" }} />
                      <Legend />
                      <Line type="monotone" dataKey="totalDebt" stroke="#EF4444" strokeWidth={2} name="Remaining Debt" dot={false} />
                      <Line type="monotone" dataKey="totalInterestPaid" stroke="#F59E0B" strokeWidth={2} name="Interest Paid" dot={false} />
                    </LineChart>
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
