import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Apple, Leaf, TrendingDown, Calendar, ShoppingCart, 
  Sun, Cloud, ThermometerSun, AlertCircle, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProduceItem {
  id: number;
  name: string;
  currentPrice: number;
  predictedPrice: number;
  bestTime: string;
  inSeason: boolean;
  savings: number;
  store: string;
}

export default function ProduceOptimizer() {
  const [view, setView] = useState<"seasonal" | "predictions" | "shopping">("seasonal");

  const seasonalProduce: ProduceItem[] = [
    { id: 1, name: "Strawberries", currentPrice: 4.50, predictedPrice: 3.20, bestTime: "Next week", inSeason: true, savings: 29, store: "Coles" },
    { id: 2, name: "Avocados", currentPrice: 2.80, predictedPrice: 1.90, bestTime: "2 weeks", inSeason: true, savings: 32, store: "Woolworths" },
    { id: 3, name: "Broccoli", currentPrice: 3.20, predictedPrice: 2.50, bestTime: "This week", inSeason: true, savings: 22, store: "ALDI" },
    { id: 4, name: "Mangoes", currentPrice: 4.00, predictedPrice: 2.50, bestTime: "December", inSeason: false, savings: 38, store: "Spudshed" },
    { id: 5, name: "Oranges", currentPrice: 5.99, predictedPrice: 3.99, bestTime: "Winter", inSeason: false, savings: 33, store: "IGA" },
  ];

  const monthlyForecast = [
    { month: "Dec", bestBuys: ["Mangoes", "Cherries", "Watermelon"], savings: 45 },
    { month: "Jan", bestBuys: ["Grapes", "Nectarines", "Plums"], savings: 52 },
    { month: "Feb", bestBuys: ["Figs", "Passionfruit", "Lychees"], savings: 38 },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="bg-gradient-to-b from-blue-950/30 to-transparent">
        <div className="px-6 pt-6 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500"
              animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 35px rgba(6,182,212,0.5)", "0 0 20px rgba(6,182,212,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Apple className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="produce-title">
                Produce Optimizer
              </h1>
              <p className="text-white/60 text-sm">Seasonal savings & price predictions</p>
            </div>
          </div>

          <motion.div 
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-5 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="stats-season-info"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sun className="w-6 h-6 text-yellow-400" />
              <div>
                <p className="text-white font-semibold">Perth Season: Late Spring</p>
                <p className="text-white/50 text-sm">Best time for stone fruits & berries</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">$127</p>
                <p className="text-xs text-white/40">Saved this month</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-xs text-white/40">Items in season</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex gap-2">
          {[
            { id: "seasonal", label: "In Season" },
            { id: "predictions", label: "Predictions" },
            { id: "shopping", label: "Smart List" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={view === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setView(tab.id as any)}
              className={`flex-1 rounded-xl ${
                view === tab.id 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {view === "seasonal" && (
          <div className="space-y-3">
            {seasonalProduce.filter(p => p.inSeason).map((item, idx) => (
              <motion.div
                key={item.id}
                className="rounded-xl p-4 bg-zinc-900/70 border border-white/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                data-testid={`produce-item-${item.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <Leaf className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">{item.name}</p>
                        <Badge className="bg-cyan-500/20 text-cyan-300 text-xs">In Season</Badge>
                      </div>
                      <p className="text-white/40 text-sm">{item.store} • Best: {item.bestTime}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">${item.currentPrice.toFixed(2)}</p>
                    <p className="text-cyan-400 text-xs">Save {item.savings}%</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {view === "predictions" && (
          <div className="space-y-4">
            <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                Price Forecast
              </h3>
              {seasonalProduce.map((item, idx) => (
                <div key={item.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-white/40 text-xs">Wait until {item.bestTime}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-white/50 line-through">${item.currentPrice.toFixed(2)}</span>
                    <span className="text-cyan-400 font-bold">${item.predictedPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900/70 rounded-2xl p-5 border border-white/5">
              <h3 className="text-white font-semibold mb-4">Monthly Best Buys</h3>
              {monthlyForecast.map((month, idx) => (
                <div key={month.month} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-400 font-semibold">{month.month}</span>
                    <span className="text-cyan-400">Save ~${month.savings}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {month.bestBuys.map((item) => (
                      <Badge key={item} className="bg-white/5 text-white/70">{item}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "shopping" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-5 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-3">
                <ShoppingCart className="w-5 h-5 text-purple-400" />
                <span className="text-white font-semibold">AI-Optimized List</span>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Based on seasonal availability and price predictions
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl"
                data-testid="button-generate-smart-list"
              >
                Generate Smart Shopping List
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
