import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Leaf, Zap, DollarSign, AlertCircle } from "lucide-react";

interface SeasonalEvent {
  id: number;
  month: string;
  category: string;
  event: string;
  savingsTip: string;
  potentialSavings: number;
  color: string;
}

const SEASONAL_EVENTS: SeasonalEvent[] = [
  { id: 1, month: "Jan", category: "Shopping", event: "Summer Sale Season", savingsTip: "Electronics & clothing 40% off", potentialSavings: 800, color: "text-red-400" },
  { id: 2, month: "Feb", category: "Energy", event: "Peak AC Usage", savingsTip: "Use smart thermostat settings", potentialSavings: 150, color: "text-cyan-400" },
  { id: 3, month: "Apr", category: "Travel", event: "Autumn Breaks", savingsTip: "Book mid-week flights early", potentialSavings: 300, color: "text-purple-400" },
  { id: 4, month: "Jun", category: "Shopping", event: "Mid-Year Sale", savingsTip: "Furniture & home goods deals", potentialSavings: 600, color: "text-cyan-400" },
  { id: 5, month: "Oct", category: "Energy", event: "Heating Season", savingsTip: "Switch to winter utility plans", potentialSavings: 200, color: "text-purple-400" },
  { id: 6, month: "Dec", category: "Shopping", event: "Christmas Sales", savingsTip: "Buy gifts in November sales", potentialSavings: 1200, color: "text-pink-400" },
];

export default function SeasonalCalendar() {
  const [selectedMonth, setSelectedMonth] = useState<SeasonalEvent | null>(null);

  const totalPotentialSavings = SEASONAL_EVENTS.reduce((sum, e) => sum + e.potentialSavings, 0);

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500"
            animate={{ boxShadow: ["0 0 20px rgba(244,63,94,0.3)", "0 0 35px rgba(244,63,94,0.5)", "0 0 20px rgba(244,63,94,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Calendar className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Seasonal Savings Calendar
            </h1>
            <p className="text-white/60 text-sm">Perth annual savings opportunities</p>
          </div>
        </div>

        <motion.div className="bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-xl p-4 border border-rose-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs uppercase">Annual Potential</p>
              <p className="text-3xl font-bold text-rose-400">${totalPotentialSavings}</p>
            </div>
            <Calendar className="w-8 h-8 text-rose-400 opacity-50" />
          </div>
        </motion.div>
      </motion.div>

      <div className="px-6 space-y-6">
        <div className="space-y-3">
          {SEASONAL_EVENTS.map((event, idx) => (
            <motion.div
              key={event.id}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${
                selectedMonth?.id === event.id
                  ? "bg-gradient-to-r from-rose-500/15 to-pink-500/10 border-rose-500/40"
                  : "bg-zinc-900/50 border-white/5 hover:border-rose-500/20"
              }`}
              onClick={() => setSelectedMonth(selectedMonth?.id === event.id ? null : event)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`event-${event.id}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={`${event.color.replace("text", "bg")} text-xs font-bold`}>{event.month}</Badge>
                    <p className="text-white font-semibold">{event.event}</p>
                  </div>
                  <p className="text-white/40 text-xs">{event.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-rose-400">${event.potentialSavings}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl py-6" data-testid="button-view-calendar">
          <Calendar className="w-5 h-5 mr-2" />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
}
