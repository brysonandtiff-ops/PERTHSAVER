import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Wallet, Zap, Shield, DollarSign } from "lucide-react";

interface YieldOpportunity {
  id: number;
  platform: string;
  coin: string;
  rate: number;
  risk: "low" | "medium" | "high";
  lockup: string;
  minDeposit: number;
}

const YIELD_FARMS: YieldOpportunity[] = [
  { id: 1, platform: "Kraken", coin: "Ethereum", rate: 4.5, risk: "low", lockup: "None", minDeposit: 0.1 },
  { id: 2, platform: "Crypto.com", coin: "Bitcoin", rate: 5.0, risk: "low", lockup: "3 months", minDeposit: 0.01 },
  { id: 3, platform: "Aave", coin: "USDC", rate: 8.2, risk: "medium", lockup: "None", minDeposit: 100 },
  { id: 4, platform: "Compound", coin: "DAI", rate: 6.5, risk: "medium", lockup: "None", minDeposit: 50 },
];

export default function CryptoYield() {
  const [selectedYield, setSelectedYield] = useState<YieldOpportunity | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "bg-cyan-500/20 text-cyan-300";
      case "medium": return "bg-cyan-500/20 text-cyan-300";
      case "high": return "bg-red-500/20 text-red-300";
      default: return "bg-purple-500/20 text-purple-300";
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500"
            animate={{ boxShadow: ["0 0 20px rgba(234,179,8,0.3)", "0 0 35px rgba(234,179,8,0.5)", "0 0 20px rgba(234,179,8,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Wallet className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Crypto Yield Optimizer
            </h1>
            <p className="text-white/60 text-sm">Passive income on crypto holdings</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-yellow-500/20 to-yellow-500/10 rounded-xl p-3 border border-yellow-500/30">
            <p className="text-white/60 text-xs uppercase">Avg APY</p>
            <p className="text-2xl font-bold text-yellow-400">6.0%</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Opportunities</p>
            <p className="text-2xl font-bold text-purple-400">{YIELD_FARMS.length}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl p-3 border border-cyan-500/30">
            <p className="text-white/60 text-xs uppercase">Low Risk</p>
            <p className="text-2xl font-bold text-cyan-400">2</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        <div className="space-y-3">
          {YIELD_FARMS.map((yield_, idx) => (
            <motion.div
              key={yield_.id}
              className="bg-zinc-900/50 rounded-xl p-4 border border-white/5 hover:border-yellow-500/20 cursor-pointer transition-all"
              onClick={() => setSelectedYield(selectedYield?.id === yield_.id ? null : yield_)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`yield-${yield_.id}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold">{yield_.platform}</p>
                  <p className="text-white/40 text-xs">{yield_.coin}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-400">{yield_.rate}%</p>
                  <Badge className={`${getRiskColor(yield_.risk)} text-xs mt-1`}>{yield_.risk}</Badge>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl py-6" data-testid="button-invest">
          <TrendingUp className="w-5 h-5 mr-2" />
          Invest in Yield Opportunity
        </Button>
      </div>
    </div>
  );
}
