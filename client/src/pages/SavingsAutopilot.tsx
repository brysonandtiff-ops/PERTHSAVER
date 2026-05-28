import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Bot, Zap, TrendingUp, DollarSign, Settings, Play, Pause,
  Target, Calendar, Bell, ChevronRight, Sparkles, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

export default function SavingsAutopilot() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [aggressiveness, setAggressiveness] = useState([50]);
  const [weeklyBudget, setWeeklyBudget] = useState(500);

  const autopilotActions = [
    { id: 1, action: "Switched electricity provider", savings: 127, date: "2 days ago", status: "completed" },
    { id: 2, action: "Applied smart fuel timing", savings: 34, date: "Yesterday", status: "completed" },
    { id: 3, action: "Grocery basket optimized", savings: 52, date: "Today", status: "pending" },
    { id: 4, action: "Insurance quote comparison", savings: 89, date: "Scheduled", status: "scheduled" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="bg-gradient-to-b from-blue-950/30 to-transparent">
        <div className="px-6 pt-6 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500"
              animate={{ 
                boxShadow: autopilotEnabled 
                  ? ["0 0 20px rgba(6,182,212,0.4)", "0 0 40px rgba(6,182,212,0.6)", "0 0 20px rgba(6,182,212,0.4)"]
                  : "0 0 10px rgba(6,182,212,0.2)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Bot className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="autopilot-title">
                AI Savings Autopilot
              </h1>
              <p className="text-white/60 text-sm">Automatic weekly budget optimization</p>
            </div>
          </div>

          <motion.div 
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-6 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {autopilotEnabled ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-6 h-6 text-purple-400" />
                  </motion.div>
                ) : (
                  <Pause className="w-6 h-6 text-white/40" />
                )}
                <span className="text-lg font-semibold text-white">
                  {autopilotEnabled ? "Autopilot Active" : "Autopilot Paused"}
                </span>
              </div>
              <Switch
                checked={autopilotEnabled}
                onCheckedChange={setAutopilotEnabled}
                data-testid="autopilot-toggle"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-400">$302</p>
                <p className="text-xs text-white/50">Saved this week</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-cyan-400">12</p>
                <p className="text-xs text-white/50">Actions taken</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            Autopilot Settings
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Weekly Budget</span>
                <span className="text-purple-400 font-semibold">${weeklyBudget}</span>
              </div>
              <Slider
                value={[weeklyBudget]}
                onValueChange={(v) => setWeeklyBudget(v[0])}
                min={100}
                max={2000}
                step={50}
                className="w-full"
                data-testid="slider-weekly-budget"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white/70 text-sm">Savings Aggressiveness</span>
                <span className="text-cyan-400 font-semibold">{aggressiveness[0]}%</span>
              </div>
              <Slider
                value={aggressiveness}
                onValueChange={setAggressiveness}
                min={10}
                max={100}
                step={10}
                className="w-full"
                data-testid="slider-aggressiveness"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-white/40">Conservative</span>
                <span className="text-xs text-white/40">Aggressive</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Recent Autopilot Actions
          </h3>
          
          <div className="space-y-3">
            {autopilotActions.map((action) => (
              <motion.div
                key={action.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{action.action}</p>
                  <p className="text-white/40 text-xs">{action.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 font-semibold">+${action.savings}</span>
                  <Badge className={`text-xs ${
                    action.status === "completed" ? "bg-cyan-500/20 text-cyan-300" :
                    action.status === "pending" ? "bg-cyan-500/20 text-cyan-300" :
                    "bg-purple-500/20 text-purple-300"
                  }`}>
                    {action.status}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">AI Protection</span>
          </div>
          <p className="text-white/60 text-sm">
            All autopilot actions require your approval for amounts over $100. 
            You maintain full control with instant pause capability.
          </p>
        </div>
      </div>
    </div>
  );
}
