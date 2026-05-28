import { useState } from "react";
import { useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Users, Plus, TrendingUp, DollarSign, Target, Award, Trash2, PieChart } from "lucide-react";
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from "recharts";

const INITIAL_MEMBERS = [
  {
    id: "1",
    name: "Alex",
    avatar: "A",
    contribution: 850,
    savingsTarget: 1000,
    color: "hsl(168 78% 40%)",
  },
  {
    id: "2",
    name: "Sarah",
    avatar: "S",
    contribution: 920,
    savingsTarget: 1000,
    color: "hsl(48 96% 53%)",
  },
  {
    id: "3",
    name: "Jamie",
    avatar: "J",
    contribution: 680,
    savingsTarget: 800,
    color: "hsl(220 30% 50%)",
  },
  {
    id: "4",
    name: "Taylor",
    avatar: "T",
    contribution: 550,
    savingsTarget: 600,
    color: "hsl(120 73% 75%)",
  },
];

const EXPENSE_CATEGORIES = [
  { name: "Groceries", value: 1200, color: "hsl(168 78% 40%)" },
  { name: "Utilities", value: 450, color: "hsl(48 96% 53%)" },
  { name: "Entertainment", value: 320, color: "hsl(220 30% 50%)" },
  { name: "Transport", value: 580, color: "hsl(120 73% 75%)" },
  { name: "Other", value: 250, color: "hsl(167 71% 62%)" },
];

const MONTHLY_TREND = [
  { month: "Aug", spent: 2600, saved: 400 },
  { month: "Sep", spent: 2450, saved: 550 },
  { month: "Oct", spent: 2800, saved: 200 },
  { month: "Nov", spent: 2300, saved: 700 },
];

const FAMILY_GOALS = [
  {
    id: "vacation",
    name: "Family Vacation",
    target: 5000,
    current: 3200,
    deadline: "2025-12-01",
  },
  {
    id: "emergency",
    name: "Emergency Fund",
    target: 10000,
    current: 6500,
    deadline: "2026-06-01",
  },
];

export default function FamilySavings() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberTarget, setNewMemberTarget] = useState("");

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  const totalContributions = members.reduce((sum, m) => sum + m.contribution, 0);
  const totalTarget = members.reduce((sum, m) => sum + m.savingsTarget, 0);
  const overallProgress = (totalContributions / totalTarget) * 100;

  const handleAddMember = () => {
    if (newMemberName.trim() && newMemberTarget) {
      const colors = [
        "hsl(168 78% 40%)",
        "hsl(48 96% 53%)",
        "hsl(220 30% 50%)",
        "hsl(120 73% 75%)",
        "hsl(167 71% 62%)",
      ];
      const newMember = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        avatar: newMemberName[0].toUpperCase(),
        contribution: 0,
        savingsTarget: parseFloat(newMemberTarget),
        color: colors[members.length % colors.length],
      };
      setMembers([...members, newMember]);
      setNewMemberName("");
      setNewMemberTarget("");
      setIsAddDialogOpen(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const sortedMembers = [...members].sort((a, b) => {
    const progressA = (a.contribution / a.savingsTarget) * 100;
    const progressB = (b.contribution / b.savingsTarget) * 100;
    return progressB - progressA;
  });

  return (
    <div className="min-h-screen">

      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="flex flex-col sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white" data-testid="text-page-title">
              Family Savings
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/60 mt-1 sm:mt-2" data-testid="text-page-subtitle">
              Manage your household budget and savings together
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto h-10 text-sm"
                data-testid="button-add-member"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong border-white/10 text-white" data-testid="dialog-add-member">
              <DialogHeader>
                <DialogTitle className="text-white">Add Family Member</DialogTitle>
                <DialogDescription className="text-white/60">
                  Add a new member to track their savings contributions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Enter name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-member-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target" className="text-white">Monthly Savings Target (AUD)</Label>
                  <Input
                    id="target"
                    type="number"
                    value={newMemberTarget}
                    onChange={(e) => setNewMemberTarget(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-member-target"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 text-white hover:bg-white/5"
                    onClick={() => setIsAddDialogOpen(false)}
                    data-testid="button-cancel-member"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    onClick={handleAddMember}
                    data-testid="button-save-member"
                  >
                    Add Member
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="glass border-white/8" data-testid="card-total-contributions">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Total Saved</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary mt-1" data-testid="text-total-contributions">
                    ${totalContributions.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-family-members">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Family Members</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-accent mt-1" data-testid="text-family-members">
                    {members.length}
                  </p>
                </div>
                <Users className="h-10 w-10 text-accent opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-monthly-target">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Monthly Target</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white mt-1" data-testid="text-monthly-target">
                    ${totalTarget.toFixed(2)}
                  </p>
                </div>
                <Target className="h-10 w-10 text-purple-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-progress">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Overall Progress</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary mt-1" data-testid="text-progress">
                    {overallProgress.toFixed(0)}%
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-8">
          {/* Family Leaderboard */}
          <Card className="lg:col-span-2 glass border-white/8">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Family Leaderboard
              </CardTitle>
              <CardDescription className="text-white/60">Who's saving the most this month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sortedMembers.map((member, index) => {
                const progress = (member.contribution / member.savingsTarget) * 100;
                return (
                  <div key={member.id} className="space-y-2" data-testid={`leaderboard-member-${member.id}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[40px]">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          {index > 2 && <span className="text-white/40 font-bold">#{index + 1}</span>}
                        </div>
                        <Avatar className="h-10 w-10" style={{ backgroundColor: member.color }}>
                          <AvatarFallback className="text-white font-bold">{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium" data-testid={`member-name-${member.id}`}>{member.name}</p>
                          <p className="text-white/60 text-sm" data-testid={`member-contribution-${member.id}`}>
                            ${member.contribution} / ${member.savingsTarget}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold" data-testid={`member-progress-${member.id}`}>
                          {progress.toFixed(0)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400/60 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => handleRemoveMember(member.id)}
                          data-testid={`button-remove-${member.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" style={{ ['--progress-background' as any]: member.color }} />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Expense Breakdown */}
          <Card className="glass border-white/8">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Expense Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPie>
                  <Pie
                    data={EXPENSE_CATEGORIES}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {EXPENSE_CATEGORIES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(20,20,35,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm" data-testid={`expense-${cat.name.toLowerCase()}`}>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-white/70">{cat.name}</span>
                    </div>
                    <span className="text-white font-medium">${cat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Family Goals */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4" data-testid="text-goals-title">
            Shared Family Goals
          </h2>
          <div className="flex flex-col gap-6">
            {FAMILY_GOALS.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              return (
                <Card key={goal.id} className="glass border-white/8" data-testid={`card-goal-${goal.id}`}>
                  <CardHeader>
                    <CardTitle className="text-white" data-testid={`goal-name-${goal.id}`}>{goal.name}</CardTitle>
                    <CardDescription className="text-white/60">
                      Target: {new Date(goal.deadline).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Progress</span>
                        <span className="text-white font-semibold" data-testid={`goal-progress-${goal.id}`}>
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-sm text-white/50">
                        <span data-testid={`goal-current-${goal.id}`}>${goal.current.toLocaleString()}</span>
                        <span data-testid={`goal-target-${goal.id}`}>${goal.target.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/5">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Remaining</span>
                        <span className="text-accent font-semibold" data-testid={`goal-remaining-${goal.id}`}>
                          ${(goal.target - goal.current).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Monthly Trends */}
        <Card className="glass border-white/8">
          <CardHeader>
            <CardTitle className="font-display text-white">Monthly Spending Trends</CardTitle>
            <CardDescription className="text-white/60">Track your family's spending and savings over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={MONTHLY_TREND}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(20,20,35,0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="spent" stroke="hsl(48 96% 53%)" strokeWidth={2} dot={{ fill: 'hsl(48 96% 53%)' }} />
                <Line type="monotone" dataKey="saved" stroke="hsl(168 78% 40%)" strokeWidth={2} dot={{ fill: 'hsl(168 78% 40%)' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
