import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, TrendingUp, DollarSign, Target, Trophy, Plus, Award,
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon
} from "lucide-react";
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

interface FamilyMember {
  id: string;
  name: string;
  initials: string;
  totalSaved: number;
  monthlyTarget: number;
  savings: number[];
  role: "admin" | "member";
  color: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: "1",
    name: "You (Owner)",
    initials: "YO",
    totalSaved: 4250,
    monthlyTarget: 500,
    savings: [150, 180, 220, 250, 320, 280, 290],
    role: "admin",
    color: "#06b6d4",
  },
  {
    id: "2",
    name: "Sarah",
    initials: "SR",
    totalSaved: 2180,
    monthlyTarget: 300,
    savings: [80, 95, 120, 140, 160, 155, 170],
    role: "member",
    color: "#10b981",
  },
  {
    id: "3",
    name: "Jamie",
    initials: "JM",
    totalSaved: 1890,
    monthlyTarget: 250,
    savings: [60, 70, 85, 110, 130, 125, 140],
    role: "member",
    color: "#f59e0b",
  },
];

const MONTHLY_DATA = [
  { month: "Aug", savings: 290, budget: 1050 },
  { month: "Sep", savings: 345, budget: 1050 },
  { month: "Oct", savings: 425, budget: 1050 },
  { month: "Nov", savings: 500, budget: 1050 },
  { month: "Dec (Proj)", savings: 580, budget: 1050 },
];

const CATEGORY_BREAKDOWN = [
  { name: "Groceries", value: 1200, fill: "#06b6d4" },
  { name: "Utilities", value: 450, fill: "#10b981" },
  { name: "Entertainment", value: 320, fill: "#f59e0b" },
  { name: "Transport", value: 580, fill: "#8b5cf6" },
];

const SHARED_GOALS = [
  { id: "1", name: "Holiday Fund", target: 8000, current: 5240, deadline: "Dec 2025", members: 3 },
  { id: "2", name: "Emergency Fund", target: 15000, current: 8500, deadline: "Jun 2026", members: 3 },
  { id: "3", name: "New Furniture", target: 3000, current: 1950, deadline: "Jan 2026", members: 2 },
];

export default function FamilyDashboard() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  const totalFamilySavings = FAMILY_MEMBERS.reduce((sum, m) => sum + m.totalSaved, 0);
  const totalMonthlyTarget = FAMILY_MEMBERS.reduce((sum, m) => sum + m.monthlyTarget, 0);
  const currentMonthSavings = FAMILY_MEMBERS.reduce((sum, m) => sum + (m.savings[6] || 0), 0);
  const avgSavingsPerPerson = totalFamilySavings / FAMILY_MEMBERS.length;

  const getMemberRank = (index: number) => {
    const sorted = [...FAMILY_MEMBERS].sort((a, b) => b.totalSaved - a.totalSaved);
    return sorted.findIndex(m => m.id === FAMILY_MEMBERS[index].id) + 1;
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500"
            animate={{ boxShadow: ["0 0 20px rgba(59,130,246,0.3)", "0 0 35px rgba(59,130,246,0.5)", "0 0 20px rgba(59,130,246,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Users className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Family Savings Dashboard
            </h1>
            <p className="text-white/60 text-sm">Combined savings & group achievements</p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div 
            className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-white/60 text-xs uppercase tracking-wide">Total Saved</p>
            <p className="text-2xl font-bold text-purple-400">${(totalFamilySavings / 1000).toFixed(1)}k</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl p-3 border border-green-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <p className="text-white/60 text-xs uppercase tracking-wide">This Month</p>
            <p className="text-2xl font-bold text-green-400">${currentMonthSavings}</p>
          </motion.div>
          <motion.div 
            className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl p-3 border border-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-white/60 text-xs uppercase tracking-wide">Members</p>
            <p className="text-2xl font-bold text-cyan-400">{FAMILY_MEMBERS.length}</p>
          </motion.div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <Button
            variant={viewMode === "overview" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("overview")}
            className="flex-1 rounded-lg text-xs"
            data-testid="view-overview"
          >
            <BarChart3 className="w-3 h-3 mr-1" />
            Overview
          </Button>
          <Button
            variant={viewMode === "detailed" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("detailed")}
            className="flex-1 rounded-lg text-xs"
            data-testid="view-detailed"
          >
            <LineChartIcon className="w-3 h-3 mr-1" />
            Detailed
          </Button>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {/* Family Members */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Family Members
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {FAMILY_MEMBERS.map((member, idx) => (
              <motion.div
                key={member.id}
                className={`rounded-xl p-4 border cursor-pointer transition-all ${
                  selectedMember === member.id
                    ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/50"
                    : "bg-zinc-900/50 border-white/5 hover:border-purple-500/20"
                }`}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-testid={`member-${member.id}`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: member.color + "33", border: `2px solid ${member.color}` }}
                      >
                        {member.initials}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{member.name}</p>
                        <p className="text-white/40 text-xs">Rank #{getMemberRank(idx)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-400">${member.totalSaved}</p>
                      <p className="text-xs text-white/40">total saved</p>
                    </div>
                  </div>

                  {/* Monthly Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/60 text-xs">Monthly Progress</p>
                      <p className="text-white text-xs font-semibold">
                        ${member.savings[6]} / ${member.monthlyTarget}
                      </p>
                    </div>
                    <Progress
                      value={(member.savings[6] / member.monthlyTarget) * 100}
                      className="bg-white/10"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Charts */}
        {viewMode === "overview" && (
          <>
            {/* Monthly Trend */}
            <motion.div
              className="bg-zinc-900/50 rounded-xl p-5 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="chart-monthly"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-purple-400" />
                Monthly Savings Trend
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)", border: "1px solid rgba(255,255,255,0.1)" }} />
                  <Line type="monotone" dataKey="savings" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
                  <Line type="monotone" dataKey="budget" stroke="rgba(255,255,255,0.2)" strokeWidth={2} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Breakdown */}
            <motion.div
              className="bg-zinc-900/50 rounded-xl p-5 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              data-testid="chart-categories"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <PieChartIcon className="w-5 h-5 text-cyan-400" />
                Savings by Category
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={CATEGORY_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {CATEGORY_BREAKDOWN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}

        {/* Shared Goals */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-cyan-400" />
            Shared Family Goals
          </h3>
          {SHARED_GOALS.map((goal, idx) => (
            <motion.div
              key={goal.id}
              className="bg-zinc-900/50 rounded-xl p-4 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`goal-${goal.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{goal.name}</p>
                    <p className="text-white/40 text-xs">Target: ${goal.target} • Due: {goal.deadline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-purple-400">${goal.current}</p>
                    <p className="text-xs text-white/40">{Math.round((goal.current / goal.target) * 100)}%</p>
                  </div>
                </div>
                <Progress
                  value={(goal.current / goal.target) * 100}
                  className="bg-white/10"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Member Button */}
        <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl py-6" data-testid="button-add-member">
          <Plus className="w-5 h-5 mr-2" />
          Invite Another Family Member
        </Button>
      </div>
    </div>
  );
}
