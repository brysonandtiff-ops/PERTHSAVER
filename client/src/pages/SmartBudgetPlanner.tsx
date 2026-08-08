import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { PlusCircle, Trash2, TrendingUp, Loader2, Edit2 } from "lucide-react";
import { useBudgets, useCreateBudget, useDeleteBudget, useBudgetCategories, useCreateBudgetCategory, useDeleteBudgetCategory, useAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";

const CATEGORY_COLORS = ["#3B82F6", "#F59E0B", "#F59E0B", "#EC4899", "#A78BFA", "#60A5FA", "#34D399", "#FBBF24"];

export default function SmartBudgetPlanner() {
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data: budgetsData, isLoading: budgetsLoading } = useBudgets();
  const createBudget = useCreateBudget();
  const deleteBudget = useDeleteBudget();
  const createCategory = useCreateBudgetCategory();
  const deleteCategory = useDeleteBudgetCategory();
  const { toast } = useToast();

  const [selectedBudgetId, setSelectedBudgetId] = useState<number | null>(null);
  const [newBudgetName, setNewBudgetName] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryAmount, setNewCategoryAmount] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const { data: categoriesData } = useBudgetCategories(selectedBudgetId || 0);

  const budgets = budgetsData?.budgets || [];
  const categories = categoriesData?.categories || [];

  useEffect(() => {
    if (budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].id);
    }
  }, [budgets, selectedBudgetId]);

  const selectedBudget = budgets.find((b: any) => b.id === selectedBudgetId);
  const totalAllocated = selectedBudget?.totalAmount || 0;
  const totalSpent = categories.reduce((sum: number, cat: any) => sum + (cat.spentAmount || 0), 0);
  const totalCategoryAllocated = categories.reduce((sum: number, cat: any) => sum + (cat.allocatedAmount || 0), 0);
  const remaining = totalAllocated - totalSpent;
  const percentSpent = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  const pieData = categories.map((cat: any, idx: number) => ({
    name: cat.name,
    value: cat.allocatedAmount || 0,
    color: cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  const barData = categories.map((cat: any) => ({
    name: cat.name,
    allocated: cat.allocatedAmount || 0,
    spent: cat.spentAmount || 0,
  }));

  const handleCreateBudget = async () => {
    if (!newBudgetName || !newBudgetAmount) return;
    try {
      await createBudget.mutateAsync({
        name: newBudgetName,
        totalAmount: parseFloat(newBudgetAmount),
        period: "monthly",
      });
      toast({ title: "Budget Created", description: `${newBudgetName} budget created successfully.` });
      setNewBudgetName("");
      setNewBudgetAmount("");
      setDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create budget.", variant: "destructive" });
    }
  };

  const handleDeleteBudget = async (id: number) => {
    try {
      await deleteBudget.mutateAsync(id);
      toast({ title: "Budget Deleted", description: "Budget removed successfully." });
      if (selectedBudgetId === id) {
        setSelectedBudgetId(null);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete budget.", variant: "destructive" });
    }
  };

  const handleCreateCategory = async () => {
    if (!selectedBudgetId || !newCategoryName || !newCategoryAmount) return;
    try {
      await createCategory.mutateAsync({
        budgetId: selectedBudgetId,
        data: {
          name: newCategoryName,
          allocatedAmount: parseFloat(newCategoryAmount),
          color: CATEGORY_COLORS[categories.length % CATEGORY_COLORS.length],
        },
      });
      toast({ title: "Category Added", description: `${newCategoryName} category added.` });
      setNewCategoryName("");
      setNewCategoryAmount("");
      setCategoryDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to add category.", variant: "destructive" });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!selectedBudgetId) return;
    try {
      await deleteCategory.mutateAsync({ id, budgetId: selectedBudgetId });
      toast({ title: "Category Deleted", description: "Category removed successfully." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
    }
  };

  if (authLoading) return <PageLoader />;
  if (!authData?.user) return <AuthRequired message="Please login to access your budgets" />;
  if (budgetsLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500"
              animate={{ boxShadow: ["0 0 20px rgba(245,158,11,0.3)", "0 0 35px rgba(245,158,11,0.5)", "0 0 20px rgba(245,158,11,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
                Smart Budget Planner
              </h1>
              <p className="text-white/60 text-sm">AI-powered monthly budgeting</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500" data-testid="button-new-budget">
                <PlusCircle className="w-4 h-4 mr-2" /> New Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-900 border-purple-500/20">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Budget</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Budget Name (e.g., December 2024)"
                  value={newBudgetName}
                  onChange={(e) => setNewBudgetName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-budget-name"
                />
                <Input
                  type="number"
                  placeholder="Total Amount ($)"
                  value={newBudgetAmount}
                  onChange={(e) => setNewBudgetAmount(e.target.value)}
                  className="bg-white/5 border-white/10 text-white"
                  data-testid="input-budget-amount"
                />
                <Button
                  onClick={handleCreateBudget}
                  disabled={createBudget.isPending}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  data-testid="button-create-budget"
                >
                  {createBudget.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Budget"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {budgets.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {budgets.map((budget: any) => (
              <Button
                key={budget.id}
                variant={selectedBudgetId === budget.id ? "default" : "outline"}
                onClick={() => setSelectedBudgetId(budget.id)}
                className={selectedBudgetId === budget.id 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" 
                  : "border-white/20 text-white/70"}
                data-testid={`budget-tab-${budget.id}`}
              >
                {budget.name}
              </Button>
            ))}
          </div>
        )}

        {selectedBudget && (
          <div className="grid grid-cols-3 gap-3">
            <motion.div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl p-3 border border-green-500/30">
              <p className="text-white/60 text-xs uppercase">Allocated</p>
              <p className="text-2xl font-bold text-green-400" data-testid="text-total-allocated">
                ${totalAllocated.toLocaleString()}
              </p>
            </motion.div>
            <motion.div className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl p-3 border border-orange-500/30">
              <p className="text-white/60 text-xs uppercase">Spent</p>
              <p className="text-2xl font-bold text-orange-400" data-testid="text-total-spent">
                ${totalSpent.toLocaleString()}
              </p>
            </motion.div>
            <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
              <p className="text-white/60 text-xs uppercase">Remaining</p>
              <p className="text-2xl font-bold text-purple-400" data-testid="text-remaining">
                ${remaining.toLocaleString()}
              </p>
            </motion.div>
          </div>
        )}
      </motion.div>

      {budgets.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <TrendingUp className="w-16 h-16 mx-auto text-purple-500/30 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Budgets Yet</h3>
          <p className="text-white/60 mb-6">Create your first budget to start tracking your spending</p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-purple-500 to-cyan-500"
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Create First Budget
          </Button>
        </div>
      ) : selectedBudget && (
        <div className="px-6 space-y-6">
          <motion.div className="bg-gradient-to-r from-green-500/15 to-cyan-500/15 rounded-xl p-4 border border-green-500/30">
            <p className="text-white/60 text-xs uppercase mb-2">Overall Budget Usage</p>
            <Progress value={percentSpent} className="bg-white/10" data-testid="budget-progress" />
            <p className="text-white/60 text-xs mt-2">{percentSpent}% spent • ${remaining.toLocaleString()} remaining</p>
          </motion.div>

          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Categories</h3>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400" data-testid="button-add-category">
                  <PlusCircle className="w-4 h-4 mr-2" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-zinc-900 border-purple-500/20">
                <DialogHeader>
                  <DialogTitle className="text-white">Add Category</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Category Name (e.g., Groceries)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="input-category-name"
                  />
                  <Input
                    type="number"
                    placeholder="Allocated Amount ($)"
                    value={newCategoryAmount}
                    onChange={(e) => setNewCategoryAmount(e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                    data-testid="input-category-amount"
                  />
                  <Button
                    onClick={handleCreateCategory}
                    disabled={createCategory.isPending}
                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    data-testid="button-create-category"
                  >
                    {createCategory.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Category"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-8 bg-zinc-900/50 rounded-xl border border-white/5">
              <p className="text-white/60">No categories yet. Add categories to track spending.</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {categories.map((cat: any, idx: number) => (
                  <motion.div
                    key={cat.id}
                    className="bg-zinc-900/50 rounded-xl p-4 border border-white/5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    data-testid={`category-${cat.id}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }}
                        />
                        <span className="text-white font-medium">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/60 text-sm">
                          ${(cat.spentAmount || 0).toLocaleString()} / ${(cat.allocatedAmount || 0).toLocaleString()}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                          data-testid={`delete-category-${cat.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress
                      value={cat.allocatedAmount > 0 ? ((cat.spentAmount || 0) / cat.allocatedAmount) * 100 : 0}
                      className="h-2 bg-white/10"
                    />
                  </motion.div>
                ))}
              </div>

              {categories.length > 0 && (
                <>
                  <motion.div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                    <h3 className="text-white font-semibold mb-4">Budget vs Spending</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 11 }} />
                        <YAxis tick={{ fill: "#fff", fontSize: 11 }} />
                        <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #3B82F6" }} />
                        <Legend />
                        <Bar dataKey="allocated" fill="#3B82F6" name="Allocated" />
                        <Bar dataKey="spent" fill="#F59E0B" name="Spent" />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>

                  <motion.div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                    <h3 className="text-white font-semibold mb-4">Budget Distribution</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </>
              )}
            </>
          )}

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => handleDeleteBudget(selectedBudgetId!)}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              data-testid="button-delete-budget"
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete Budget
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
