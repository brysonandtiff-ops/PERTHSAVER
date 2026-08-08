import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Leaf, Zap, Fuel, ShoppingCart, TrendingUp, Globe,
  Heart, Target, PieChart
} from "lucide-react";
import { PieChart as PieChartIcon, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface CarbonSource {
  id: number;
  category: string;
  source: string;
  kgCO2e: number;
  icon: any;
  color: string;
  offset?: number;
}

const CARBON_SOURCES: CarbonSource[] = [
  { id: 1, category: "Energy", source: "Home Electricity", kgCO2e: 2400, icon: Zap, color: "#f59e0b", offset: 1200 },
  { id: 2, category: "Transport", source: "Car Fuel (Perth)", kgCO2e: 1800, icon: Fuel, color: "#ef4444", offset: 900 },
  { id: 3, category: "Shopping", source: "Groceries & Goods", kgCO2e: 800, icon: ShoppingCart, color: "#10b981", offset: 400 },
  { id: 4, category: "Gas", source: "Home Heating", kgCO2e: 600, icon: Zap, color: "#f97316", offset: 300 },
];

const OFFSET_OPTIONS = [
  { id: 1, project: "Perth Tree Planting", region: "WA Forests", trees: 50, cost: 75, impact: 2500 },
  { id: 2, project: "Solar Panel Rebates", region: "Perth Metro", capacity: "5kW", cost: 2000, impact: 8000 },
  { id: 3, project: "Renewable Energy Fund", region: "Australia", type: "Wind Energy", cost: 100, impact: 4000 },
  { id: 4, project: "Ocean Cleanup Initiative", region: "Western Australia", tons: 100, cost: 50, impact: 1000 },
];

const MONTHLY_DATA = [
  { month: "Jan", actual: 2800, offset: 1400, target: 2000 },
  { month: "Feb", actual: 2600, offset: 1300, target: 2000 },
  { month: "Mar", actual: 2400, offset: 1200, target: 2000 },
  { month: "Apr", actual: 2200, offset: 1100, target: 2000 },
];

export default function CarbonOffset() {
  const [selectedSource, setSelectedSource] = useState<CarbonSource | null>(null);
  const [offsets, setOffsets] = useState<Set<number>>(new Set());

  const totalCarbonEmissions = CARBON_SOURCES.reduce((sum, s) => sum + s.kgCO2e, 0);
  const totalCarbonOffset = CARBON_SOURCES.reduce((sum, s) => sum + (s.offset || 0), 0);
  const netEmissions = totalCarbonEmissions - totalCarbonOffset;
  const offsetPercentage = (totalCarbonOffset / totalCarbonEmissions) * 100;

  const toggleOffset = (id: number) => {
    const newSet = new Set(offsets);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setOffsets(newSet);
  };

  const pieData = CARBON_SOURCES.map(s => ({
    name: s.source,
    value: s.kgCO2e,
    fill: s.color,
  }));

  const offsetCost = OFFSET_OPTIONS.filter(o => offsets.has(o.id)).reduce((sum, o) => sum + o.cost, 0);

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500 to-lime-500"
            animate={{ boxShadow: ["0 0 20px rgba(16,185,129,0.3)", "0 0 35px rgba(16,185,129,0.5)", "0 0 20px rgba(16,185,129,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Leaf className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Carbon Offset Tracker
            </h1>
            <p className="text-white/60 text-sm">Track & offset Perth household emissions</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-red-500/20 to-red-500/10 rounded-xl p-3 border border-red-500/30">
            <p className="text-white/60 text-xs uppercase">Total Emissions</p>
            <p className="text-2xl font-bold text-red-400">{(totalCarbonEmissions / 1000).toFixed(1)}t CO₂e</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl p-3 border border-cyan-500/30">
            <p className="text-white/60 text-xs uppercase">Offset</p>
            <p className="text-2xl font-bold text-cyan-400">{offsetPercentage.toFixed(0)}%</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Net Emissions</p>
            <p className="text-2xl font-bold text-purple-400">{(netEmissions / 1000).toFixed(1)}t</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {/* Emissions Breakdown */}
        <motion.div
          className="bg-zinc-900/50 rounded-xl p-5 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-testid="emissions-chart"
        >
          <h3 className="text-white font-semibold mb-4">Annual Emissions by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChartIcon>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChartIcon>
          </ResponsiveContainer>
        </motion.div>

        {/* Carbon Sources */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Your Emissions</h3>
          {CARBON_SOURCES.map((source, idx) => (
            <motion.div
              key={source.id}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${
                selectedSource?.id === source.id
                  ? "bg-gradient-to-r from-cyan-500/15 to-lime-500/10 border-cyan-500/40"
                  : "bg-zinc-900/50 border-white/5 hover:border-cyan-500/20"
              }`}
              onClick={() => setSelectedSource(selectedSource?.id === source.id ? null : source)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`source-${source.id}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <source.icon className="w-5 h-5" style={{ color: source.color }} />
                    <div>
                      <p className="text-white font-semibold">{source.source}</p>
                      <p className="text-white/40 text-xs">{source.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{(source.kgCO2e / 1000).toFixed(1)}t CO₂e</p>
                    {source.offset && (
                      <p className="text-cyan-400 text-xs">↓ {(source.offset / 1000).toFixed(1)}t offset</p>
                    )}
                  </div>
                </div>
                <div>
                  <Progress
                    value={(source.kgCO2e / totalCarbonEmissions) * 100}
                    className="bg-white/10"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Offset Projects */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Offset Projects</h3>
          {OFFSET_OPTIONS.map((project, idx) => (
            <motion.div
              key={project.id}
              className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 hover:border-cyan-500/20 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`offset-${project.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-white font-semibold">{project.project}</p>
                    <p className="text-white/40 text-xs">{project.region}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">${project.cost}</p>
                    <p className="text-white/40 text-xs">{(project.impact / 1000).toFixed(1)}t offset</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className={`w-full rounded-lg text-xs ${
                    offsets.has(project.id)
                      ? "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30"
                      : "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                  }`}
                  onClick={() => toggleOffset(project.id)}
                  data-testid={`button-offset-${project.id}`}
                >
                  {offsets.has(project.id) ? "✓ Selected" : "Add to Cart"}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Monthly Progress */}
        <motion.div
          className="bg-zinc-900/50 rounded-xl p-5 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-testid="chart-monthly"
        >
          <h3 className="text-white font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: "rgba(0,0,0,0.8)" }} />
              <Bar dataKey="actual" fill="#ef4444" radius={[8, 8, 0, 0]} />
              <Bar dataKey="offset" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary Card */}
        {offsets.size > 0 && (
          <motion.div
            className="bg-gradient-to-r from-cyan-500/20 to-lime-500/20 rounded-xl p-5 border border-cyan-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="summary-card"
          >
            <div className="space-y-3">
              <p className="text-white font-semibold">{offsets.size} projects selected</p>
              <p className="text-cyan-400 font-bold text-lg">${offsetCost} to offset emissions</p>
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-lime-500 rounded-lg" data-testid="button-checkout">
                <Heart className="w-4 h-4 mr-2" />
                Commit to Offset
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
