import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { GoalCardSkeleton, CardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { ExportButton } from "@/components/ExportButton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth, useSavingsGoals, useCreateSavingsGoal, useUpdateSavingsGoal, useDeleteSavingsGoal } from "@/lib/api";
import { exportSavingsGoals, ExportFormat } from "@/lib/export";
import { Target, Plus, Edit, Trash2, TrendingUp, Calendar, DollarSign, Trophy } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageLoader } from "@/components/PageLoader";
import { AuthRequired } from "@/components/AuthRequired";

const goalFormSchema = z.object({
  category: z.string().min(1, "Category is required"),
  priority: z.enum(["low", "medium", "high"]).optional().default("medium"),
  targetSavings: z.string().min(1, "Target amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Must be a positive number"),
  currentSavings: z.string().refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), "Must be a non-negative number"),
  deadline: z.string().optional(),
  notes: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

const CATEGORY_COLORS: Record<string, string> = {
  groceries: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  utilities: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  entertainment: "text-teal-400 border-teal-500/30 bg-teal-500/10",
  travel: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  insurance: "text-slate-400 border-slate-500/30 bg-slate-500/10",
  healthcare: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  transport: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  education: "text-teal-400 border-teal-500/30 bg-teal-500/10",
  shopping: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  other: "text-slate-400 border-slate-500/30 bg-slate-500/10",
};

const CATEGORIES = [
  "groceries",
  "utilities",
  "entertainment",
  "travel",
  "insurance",
  "healthcare",
  "transport",
  "education",
  "shopping",
  "other",
];

const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "text-purple-400 border-purple-500/30 bg-purple-500/10" },
  { value: "medium", label: "Medium", color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
  { value: "high", label: "High", color: "text-teal-400 border-teal-500/30 bg-teal-500/10" },
];

function triggerConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: any) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export default function SavingsGoals() {
  const { data: user, isLoading: authLoading } = useAuth();

  if (authLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <AuthRequired message="Please login to manage savings goals" />;
  }

  return <SavingsGoalsContent />;
}

function SavingsGoalsContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);
  const [deleteGoalId, setDeleteGoalId] = useState<string | null>(null);

  const { data, isLoading } = useSavingsGoals();
  const createGoal = useCreateSavingsGoal();
  const updateGoal = useUpdateSavingsGoal();
  const deleteGoal = useDeleteSavingsGoal();

  const goals = data?.goals || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      category: "",
      targetSavings: "",
      currentSavings: "0",
      deadline: "",
      notes: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (formData: GoalFormData) => {
    try {
      const payload = {
        category: formData.category,
        targetSavings: formData.targetSavings,
        currentSavings: formData.currentSavings || "0",
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : null,
        notes: formData.notes || null,
      };

      if (editingGoal) {
        await updateGoal.mutateAsync({ id: editingGoal.id, data: payload });
        toast({
          title: "Goal Updated",
          description: "Your savings goal has been updated successfully.",
        });
      } else {
        await createGoal.mutateAsync(payload);
        toast({
          title: "Goal Created",
          description: "Your new savings goal has been created.",
        });
      }

      reset();
      setIsAddDialogOpen(false);
      setEditingGoal(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setValue("category", goal.category);
    setValue("targetSavings", goal.targetSavings);
    setValue("currentSavings", goal.currentSavings || "0");
    setValue("deadline", goal.deadline ? format(new Date(goal.deadline), "yyyy-MM-dd") : "");
    setValue("notes", goal.notes || "");
    setIsAddDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteGoalId) return;

    try {
      await deleteGoal.mutateAsync(deleteGoalId);
      toast({
        title: "Goal Deleted",
        description: "Your savings goal has been removed.",
      });
      setDeleteGoalId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsAddDialogOpen(false);
    setEditingGoal(null);
    reset();
  };

  const totalSaved = goals.reduce((sum: number, goal: any) => sum + parseFloat(goal.currentSavings || "0"), 0);
  const totalTarget = goals.reduce((sum: number, goal: any) => sum + parseFloat(goal.targetSavings || "0"), 0);
  const completedGoals = goals.filter((goal: any) => {
    const progress = (parseFloat(goal.currentSavings || "0") / parseFloat(goal.targetSavings || "1")) * 100;
    return progress >= 100;
  }).length;
  const completionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const getProgressPercentage = (current: string, target: string) => {
    const currentNum = parseFloat(current || "0");
    const targetNum = parseFloat(target || "1");
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  const checkAndCelebrateCompletion = (goal: any) => {
    const progress = getProgressPercentage(goal.currentSavings, goal.targetSavings);
    if (progress >= 100) {
      triggerConfetti();
    }
  };

  const handleExport = (format: ExportFormat) => {
    if (!goals || goals.length === 0) {
      throw new Error("No goals to export");
    }
    
    exportSavingsGoals(goals, format);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="text-page-title">
                  Savings Goals
                </h1>
                <p className="text-sm text-white/60" data-testid="text-page-subtitle">
                  Track your financial milestones
                </p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-2" 
                  data-testid="button-add-goal"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">Add Goal</span>
                </Button>
              </DialogTrigger>
            <DialogContent className="glass-strong border-white/10 text-white max-w-md max-h-[90vh] overflow-y-auto" data-testid="dialog-goal-form">
              <DialogHeader>
                <DialogTitle className="text-white" data-testid="text-dialog-title">
                  {editingGoal ? "Edit Savings Goal" : "Add New Savings Goal"}
                </DialogTitle>
                <DialogDescription className="text-white/60" data-testid="text-dialog-description">
                  {editingGoal ? "Update your savings goal details." : "Create a new savings goal to track your progress."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(value) => setValue("category", value)}
                  >
                    <SelectTrigger 
                      className="bg-white/5 border-white/10 text-white" 
                      data-testid="select-category"
                    >
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      {CATEGORIES.map((cat) => (
                        <SelectItem 
                          key={cat} 
                          value={cat} 
                          className="text-white capitalize"
                          data-testid={`option-category-${cat}`}
                        >
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-red-400 text-sm" data-testid="error-category">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetSavings" className="text-white">Target Amount (AUD)</Label>
                  <Input
                    id="targetSavings"
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    {...register("targetSavings")}
                    data-testid="input-target-amount"
                  />
                  {errors.targetSavings && (
                    <p className="text-red-400 text-sm" data-testid="error-target-amount">{errors.targetSavings.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentSavings" className="text-white">Current Amount (AUD)</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    {...register("currentSavings")}
                    data-testid="input-current-amount"
                  />
                  {errors.currentSavings && (
                    <p className="text-red-400 text-sm" data-testid="error-current-amount">{errors.currentSavings.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="text-white">Target Date (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    className="bg-white/5 border-white/10 text-white"
                    {...register("deadline")}
                    data-testid="input-deadline"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes or description for this goal..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 min-h-[80px]"
                    {...register("notes")}
                    data-testid="textarea-notes"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5"
                    onClick={handleDialogClose}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    disabled={createGoal.isPending || updateGoal.isPending}
                    data-testid="button-save-goal"
                  >
                    {createGoal.isPending || updateGoal.isPending ? "Saving..." : editingGoal ? "Update Goal" : "Create Goal"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Export Button */}
        {goals.length > 0 && (
          <div className="flex justify-end mb-4">
            <ExportButton 
              onExport={handleExport}
              label="Export"
              variant="outline"
              className="border-white/10 text-white/70 hover:bg-white/5"
              disabled={goals.length === 0}
              dataTestId="button-export-goals"
            />
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-zinc-900/60 border-white/5 p-4" data-testid="card-total-saved">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Total Saved</span>
            </div>
            <div className="text-2xl font-bold text-purple-400" data-testid="text-total-saved">
              ${totalSaved.toFixed(0)}
            </div>
            <div className="text-xs text-white/50">across all goals</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4" data-testid="card-total-goals">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/60">Active Goals</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400" data-testid="text-total-goals">
              {goals.length}
            </div>
            <div className="text-xs text-white/50">in progress</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4" data-testid="card-completed-goals">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60">Completed</span>
            </div>
            <div className="text-2xl font-bold text-green-400" data-testid="text-completed-goals">
              {completedGoals}
            </div>
            <div className="text-xs text-white/50">achieved</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4 col-span-2 md:col-span-1" data-testid="card-completion-rate">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-white" data-testid="text-completion-rate">
              {completionRate}%
            </div>
            <div className="text-xs text-white/50">completion</div>
          </Card>
        </div>

        {/* Goals Grid */}
        {isLoading ? (
          <GoalCardSkeleton count={6} />
        ) : goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No Savings Goals Yet"
            description="Start your savings journey by creating your first goal. Track your progress and celebrate your achievements along the way!"
            actionLabel="Create Your First Goal"
            onAction={() => setIsAddDialogOpen(true)}
          />
        ) : (
          <div className="space-y-3">
            {goals.map((goal: any) => {
              const progress = getProgressPercentage(goal.currentSavings, goal.targetSavings);
              const isCompleted = progress >= 100;
              const categoryColor = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.other;

              return (
                <Card 
                  key={goal.id} 
                  className={`bg-zinc-900/60 border-white/5 p-4 transition-all hover:scale-[1.01] ${isCompleted ? 'ring-1 ring-green-500/50 bg-green-500/5' : ''}`}
                  data-testid={`card-goal-${goal.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mb-2 capitalize ${categoryColor}`} data-testid={`badge-category-${goal.id}`}>
                          {goal.category}
                        </div>
                        <CardTitle className="text-white text-lg" data-testid={`text-goal-title-${goal.id}`}>
                          {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)} Savings
                        </CardTitle>
                        {goal.notes && (
                          <CardDescription className="text-white/50 mt-1 text-sm" data-testid={`text-goal-notes-${goal.id}`}>
                            {goal.notes}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                          onClick={() => handleEdit(goal)}
                          data-testid={`button-edit-${goal.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => setDeleteGoalId(goal.id)}
                          data-testid={`button-delete-${goal.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white font-semibold" data-testid={`text-progress-${goal.id}`}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress 
                        value={progress} 
                        className={`h-3 ${isCompleted ? 'bg-green-900/30' : 'bg-white/10'}`}
                        data-testid={`progress-bar-${goal.id}`}
                      />
                      <div className="flex justify-between text-xs text-white/50">
                        <span data-testid={`text-current-${goal.id}`}>${parseFloat(goal.currentSavings || "0").toFixed(2)}</span>
                        <span data-testid={`text-target-${goal.id}`}>${parseFloat(goal.targetSavings || "0").toFixed(2)}</span>
                      </div>
                    </div>

                    {isCompleted && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 flex items-center gap-2" data-testid={`badge-completed-${goal.id}`}>
                        <Trophy className="h-4 w-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">Goal Achieved! 🎉</span>
                      </div>
                    )}

                    {goal.deadline && (
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="h-4 w-4" />
                        <span data-testid={`text-deadline-${goal.id}`}>
                          Target: {format(new Date(goal.deadline), "MMM dd, yyyy")}
                        </span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Remaining</span>
                        <span className="text-accent font-semibold" data-testid={`text-remaining-${goal.id}`}>
                          ${Math.max(0, parseFloat(goal.targetSavings || "0") - parseFloat(goal.currentSavings || "0")).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteGoalId} onOpenChange={() => setDeleteGoalId(null)}>
        <AlertDialogContent className="glass-strong border-white/10 text-white" data-testid="dialog-delete-confirm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Savings Goal?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This action cannot be undone. This will permanently delete your savings goal and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="border-white/10 text-white hover:bg-white/5" 
              data-testid="button-cancel-delete"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
  );
}
