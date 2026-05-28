import { useState } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, Shield, DollarSign, PieChart, BarChart3,
  AlertTriangle, CheckCircle2, Info, ArrowUpRight, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";

export default function InflationHedge() {
  const [riskTolerance, setRiskTolerance] = useState([50]);
  const [investmentAmount, setInvestmentAmount] = useState(10000);

  const inflationRate = 4.1;
  const cashErosion = (investmentAmount * (inflationRate / 100)).toFixed(2);

  const hedgeStrategies = [
    { 
      id: 1, 
      name: "High-Yield Savings", 
      rate: 5.25, 
      risk: "Low", 
      protection: 95,
      description: "ING, Ubank, Macquarie accounts",
      color: "emerald"
    },
    { 
      id: 2, 
      name: "Term Deposits", 
      rate: 4.85, 
      risk: "Low", 
      protection: 90,
      description: "6-12 month fixed rates",
      color: "cyan"
    },
    { 
      id: 3, 
      name: "Australian ETFs", 
      rate: 7.2, 
      risk: "Medium", 
      protection: 75,
      description: "VAS, A200, IOZ index funds",
      color: "blue"
    },
    { 
      id: 4, 
      name: "Gold & Commodities", 
      rate: 6.8, 
      risk: "Medium", 
      protection: 80,
      description: "Traditional inflation hedge",
      color: "amber"
    },
    { 
      id: 5, 
      name: "I-Bonds / TIPS", 
      rate: inflationRate + 1.5, 
      risk: "Low", 
      protection: 100,
      description: "Inflation-linked securities",
      color: "purple"
    },
  ];

  const portfolioAllocation = [
    { category: "Cash", percentage: 20, color: "bg-cyan-500" },
    { category: "Fixed Income", percentage: 30, color: "bg-purple-500" },
    { category: "Equities", percentage: 35, color: "bg-purple-500" },
    { category: "Alternatives", percentage: 15, color: "bg-cyan-500" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="px-6 pt-6 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500"
              animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 35px rgba(6,182,212,0.5)", "0 0 20px rgba(6,182,212,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="inflation-title">
                Inflation Hedge
              </h1>
              <p className="text-white/60 text-sm">Investment coach & simulator</p>
            </div>
          </div>

          <motion.div 
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-5 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="stats-inflation-impact"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-medium">Current Inflation Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-bold text-purple-400">{inflationRate}%</p>
                <p className="text-xs text-white/40">Australian CPI</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">-${cashErosion}</p>
                <p className="text-xs text-white/40">Yearly purchasing power loss</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            Investment Amount
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-white/60">Amount to protect</span>
              <span className="text-2xl font-bold text-white">${investmentAmount.toLocaleString()}</span>
            </div>
            <Slider
              value={[investmentAmount]}
              onValueChange={(v) => setInvestmentAmount(v[0])}
              min={1000}
              max={100000}
              step={1000}
              data-testid="slider-investment-amount"
            />
            <div className="flex justify-between text-xs text-white/40">
              <span>$1,000</span>
              <span>$100,000</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Risk Tolerance
          </h3>
          <Slider
            value={riskTolerance}
            onValueChange={setRiskTolerance}
            min={0}
            max={100}
            step={10}
            data-testid="slider-risk-tolerance"
          />
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-cyan-400">Conservative</span>
            <span className="text-cyan-400">Moderate</span>
            <span className="text-purple-400">Aggressive</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Recommended Strategies
          </h3>
          
          {hedgeStrategies.map((strategy, idx) => (
            <motion.div
              key={strategy.id}
              className="rounded-xl p-4 bg-zinc-900/50 border border-white/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              data-testid={`strategy-${strategy.id}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">{strategy.name}</p>
                    <Badge className={`text-xs ${
                      strategy.risk === "Low" ? "bg-cyan-500/20 text-cyan-300" :
                      strategy.risk === "Medium" ? "bg-cyan-500/20 text-cyan-300" :
                      "bg-purple-500/20 text-purple-300"
                    }`}>
                      {strategy.risk} Risk
                    </Badge>
                  </div>
                  <p className="text-white/40 text-sm">{strategy.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-cyan-400">{strategy.rate}%</p>
                  <p className="text-white/40 text-xs">Expected return</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-xs">Inflation Protection</span>
                <Progress value={strategy.protection} className="flex-1 h-1.5" />
                <span className="text-white/60 text-xs">{strategy.protection}%</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-purple-400" />
            Suggested Allocation
          </h3>
          <div className="flex h-4 rounded-full overflow-hidden mb-4">
            {portfolioAllocation.map((item) => (
              <div 
                key={item.category}
                className={`${item.color}`}
                style={{ width: `${item.percentage}%` }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {portfolioAllocation.map((item) => (
              <div key={item.category} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${item.color}`} />
                <span className="text-white/60 text-sm">{item.category}</span>
                <span className="text-white font-medium text-sm ml-auto">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cyan-500/10 rounded-2xl p-4 border border-cyan-500/20">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 font-medium text-sm">ASIC Compliance Notice</p>
              <p className="text-white/50 text-xs mt-1">
                This is general information only, not personal financial advice. 
                Consider consulting a licensed financial adviser for your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
