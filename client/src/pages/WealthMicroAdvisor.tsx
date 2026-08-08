import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, TrendingUp, BookOpen } from "lucide-react";

interface MicroTip {
  id: number;
  title: string;
  category: string;
  tip: string;
  potentialSavings: string;
  difficulty: "easy" | "medium" | "hard";
}

const MICRO_TIPS: MicroTip[] = [
  { id: 1, title: "Round-Up Savings", category: "Savings", tip: "Save the difference between rounded purchases and actual amount", potentialSavings: "$50-200/year", difficulty: "easy" },
  { id: 2, title: "Credit Card Rewards", category: "Credit", tip: "Use 2% cashback card for all expenses, pay off monthly", potentialSavings: "$300-600/year", difficulty: "easy" },
  { id: 3, title: "Investment Strategy", category: "Investing", tip: "Start with low-cost ETFs (VAS, VGS) via PEXA or Spaceship", potentialSavings: "$100-500/year", difficulty: "medium" },
  { id: 4, title: "Tax Optimization", category: "Tax", tip: "Maximize deductions: home office, vehicle, professional fees", potentialSavings: "$500-2000/year", difficulty: "hard" },
];

export default function WealthMicroAdvisor() {
  const [selectedTip, setSelectedTip] = useState<MicroTip | null>(null);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "bg-cyan-500/20 text-cyan-300";
      case "medium": return "bg-cyan-500/20 text-cyan-300";
      case "hard": return "bg-red-500/20 text-red-300";
      default: return "bg-purple-500/20 text-purple-300";
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div className="p-3 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-500" animate={{ boxShadow: ["0 0 20px rgba(217,70,239,0.3)", "0 0 35px rgba(217,70,239,0.5)", "0 0 20px rgba(217,70,239,0.3)"] }} transition={{ duration: 2, repeat: Infinity }}>
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">Wealth Micro-Advisor</h1>
            <p className="text-white/60 text-sm">Quick wealth-building tips & strategies</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/10 rounded-xl p-3 border border-fuchsia-500/30">
            <p className="text-white/60 text-xs uppercase">Total Tips</p>
            <p className="text-2xl font-bold text-fuchsia-400">{MICRO_TIPS.length}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Completed</p>
            <p className="text-2xl font-bold text-purple-400">{completed.size}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Max Potential</p>
            <p className="text-2xl font-bold text-purple-400">$5.7K+</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Wealth Tips</h3>
          {MICRO_TIPS.map((tip, idx) => (
            <motion.div
              key={tip.id}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${selectedTip?.id === tip.id ? "bg-gradient-to-r from-fuchsia-500/15 to-purple-500/10 border-fuchsia-500/40" : "bg-zinc-900/50 border-white/5 hover:border-fuchsia-500/20"}`}
              onClick={() => setSelectedTip(selectedTip?.id === tip.id ? null : tip)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`tip-${tip.id}`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{tip.title}</p>
                    <p className="text-white/40 text-xs">{tip.category}</p>
                  </div>
                  <Badge className={`${getDifficultyColor(tip.difficulty)} text-xs border`}>{tip.difficulty}</Badge>
                </div>
                <p className="text-cyan-400 text-sm font-semibold">{tip.potentialSavings}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedTip && (
          <motion.div className="bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 rounded-xl p-5 border border-fuchsia-500/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="tip-details">
            <div className="space-y-3">
              <p className="text-white font-semibold">{selectedTip.title}</p>
              <p className="text-white/80 text-sm">{selectedTip.tip}</p>
              <Button
                onClick={() => setCompleted(new Set([...Array.from(completed), selectedTip.id]))}
                disabled={completed.has(selectedTip.id)}
                className={`w-full rounded-lg ${completed.has(selectedTip.id) ? "bg-cyan-500/20 text-cyan-300" : "bg-fuchsia-500 text-white hover:bg-fuchsia-600"}`}
                data-testid="button-implement"
              >
                {completed.has(selectedTip.id) ? "✓ Implemented" : "Implement"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
