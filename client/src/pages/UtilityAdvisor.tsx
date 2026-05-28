import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Zap, Droplets, Flame, Wifi, ArrowRight, TrendingDown,
  CheckCircle2, AlertTriangle, RefreshCw, Building, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Provider {
  name: string;
  logo: string;
  monthlyEstimate: number;
  savings: number;
  features: string[];
  recommended?: boolean;
}

export default function UtilityAdvisor() {
  const [selectedUtility, setSelectedUtility] = useState<"electricity" | "gas" | "water" | "internet">("electricity");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const utilities = [
    { id: "electricity", icon: Zap, label: "Electricity", color: "text-purple-400" },
    { id: "gas", icon: Flame, label: "Gas", color: "text-cyan-400" },
    { id: "water", icon: Droplets, label: "Water", color: "text-purple-400" },
    { id: "internet", icon: Wifi, label: "Internet", color: "text-purple-400" },
  ];

  const providers: Record<string, Provider[]> = {
    electricity: [
      { name: "Synergy", logo: "S", monthlyEstimate: 285, savings: 0, features: ["Default WA provider", "Reliable service"], recommended: false },
      { name: "Alinta Energy", logo: "A", monthlyEstimate: 248, savings: 37, features: ["15% off first year", "No exit fees", "Smart meter included"], recommended: true },
      { name: "Origin", logo: "O", monthlyEstimate: 262, savings: 23, features: ["Solar feed-in bonus", "App monitoring"] },
      { name: "AGL", logo: "G", monthlyEstimate: 271, savings: 14, features: ["Bundle discounts", "Carbon neutral option"] },
    ],
    gas: [
      { name: "Alinta Gas", logo: "A", monthlyEstimate: 95, savings: 0, features: ["Default provider"] },
      { name: "Kleenheat", logo: "K", monthlyEstimate: 82, savings: 13, features: ["Local WA company", "Loyalty rewards"], recommended: true },
    ],
    water: [
      { name: "Water Corporation", logo: "W", monthlyEstimate: 120, savings: 0, features: ["Sole provider in Perth"] },
    ],
    internet: [
      { name: "Telstra", logo: "T", monthlyEstimate: 99, savings: 0, features: ["Best coverage"] },
      { name: "Aussie Broadband", logo: "AB", monthlyEstimate: 79, savings: 20, features: ["Great support", "No contracts"], recommended: true },
      { name: "TPG", logo: "TP", monthlyEstimate: 69, savings: 30, features: ["Budget friendly"] },
    ],
  };

  const currentProviders = providers[selectedUtility] || [];
  const potentialSavings = currentProviders.reduce((max, p) => Math.max(max, p.savings), 0);

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
              <Zap className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="utility-title">
                Utility Switch Advisor
              </h1>
              <p className="text-white/60 text-sm">Live Perth provider comparison</p>
            </div>
          </div>

          {potentialSavings > 0 && (
            <motion.div 
              className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-4 border border-cyan-500/30"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              data-testid="stats-potential-savings"
            >
              <div className="flex items-center gap-3">
                <TrendingDown className="w-6 h-6 text-cyan-400" />
                <div>
                  <p className="text-white font-semibold">Potential Monthly Savings</p>
                  <p className="text-2xl font-bold text-cyan-400">${potentialSavings}/month</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {utilities.map((utility) => (
            <Button
              key={utility.id}
              variant={selectedUtility === utility.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedUtility(utility.id as any)}
              className={`rounded-xl whitespace-nowrap ${
                selectedUtility === utility.id 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              data-testid={`tab-${utility.id}`}
            >
              <utility.icon className={`w-4 h-4 mr-2 ${utility.color}`} />
              {utility.label}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {currentProviders.map((provider, idx) => (
            <motion.div
              key={provider.name}
              className={`rounded-2xl p-5 border ${
                provider.recommended 
                  ? "bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30" 
                  : "bg-zinc-900/70 border-white/5"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              data-testid={`provider-card-${provider.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                    provider.recommended ? "bg-cyan-500 text-white" : "bg-white/10 text-white"
                  }`}>
                    {provider.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{provider.name}</h3>
                      {provider.recommended && (
                        <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/40 text-sm">${provider.monthlyEstimate}/month estimate</p>
                  </div>
                </div>
                {provider.savings > 0 && (
                  <div className="text-right">
                    <p className="text-cyan-400 font-bold">Save ${provider.savings}</p>
                    <p className="text-white/40 text-xs">per month</p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {provider.features.map((feature, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-lg bg-white/5 text-white/60">
                    {feature}
                  </span>
                ))}
              </div>

              <Button 
                className={`w-full rounded-xl ${
                  provider.recommended 
                    ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white" 
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
                data-testid={`button-switch-${provider.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {provider.savings > 0 ? "Switch & Save" : "Current Provider"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="bg-zinc-900/50 rounded-2xl p-4 border border-white/5">
          <p className="text-white/50 text-xs text-center">
            Rates updated daily. Estimates based on average Perth household usage.
            Final pricing depends on individual usage patterns.
          </p>
        </div>
      </div>
    </div>
  );
}
