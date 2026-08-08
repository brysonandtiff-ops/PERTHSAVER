import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Phone, Mail, CheckCircle2, TrendingDown, AlertCircle, Zap,
  DollarSign, Calendar, FileText, Send
} from "lucide-react";

interface Negotiation {
  id: number;
  provider: string;
  category: string;
  currentRate: number;
  marketRate: number;
  savingsPotential: number;
  status: "ready" | "in-progress" | "success" | "failed";
  scriptPath?: string;
}

const NEGOTIABLE_BILLS: Negotiation[] = [
  {
    id: 1,
    provider: "Synergy Energy",
    category: "Electricity",
    currentRate: 0.32,
    marketRate: 0.26,
    savingsPotential: 720,
    status: "ready",
  },
  {
    id: 2,
    provider: "Alinta Gas",
    category: "Gas",
    currentRate: 12.50,
    marketRate: 10.20,
    savingsPotential: 276,
    status: "in-progress",
  },
  {
    id: 3,
    provider: "Telstra NBN",
    category: "Internet",
    currentRate: 89.99,
    marketRate: 69.99,
    savingsPotential: 240,
    status: "ready",
  },
  {
    id: 4,
    provider: "Insurance Western",
    category: "Car Insurance",
    currentRate: 1200,
    marketRate: 850,
    savingsPotential: 420,
    status: "ready",
  },
];

const NEGOTIATION_TEMPLATES = [
  {
    title: "Initial Contact",
    message: "Hi, I've been a loyal customer for [X years] and I'd like to discuss my rates. I've found similar offers from competitors at [rate]. What options do you have to keep my business?",
  },
  {
    title: "Loyalty Pitch",
    message: "I appreciate the service, but my bill has increased while I haven't changed usage. Can you review my account for better rates or loyalty discounts?",
  },
  {
    title: "Competitor Offer",
    message: "I have a competitive quote for $[amount] from [competitor]. I'd prefer to stay with you if you can match or beat this offer.",
  },
];

export default function BillNegotiator() {
  const [selectedBill, setSelectedBill] = useState<Negotiation | null>(null);
  const [showTemplate, setShowTemplate] = useState(false);
  const [negotiatedBills, setNegotiatedBills] = useState<Set<number>>(new Set());

  const totalPotentialSavings = NEGOTIABLE_BILLS.reduce((sum, b) => sum + b.savingsPotential, 0);
  const successCount = NEGOTIABLE_BILLS.filter(b => b.status === "success").length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "in-progress":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
      case "success":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "failed":
        return <AlertCircle className="w-4 h-4" />;
      case "in-progress":
        return <Zap className="w-4 h-4" />;
      default:
        return <Phone className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500"
            animate={{ boxShadow: ["0 0 20px rgba(168,85,247,0.3)", "0 0 35px rgba(168,85,247,0.5)", "0 0 20px rgba(168,85,247,0.3)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Phone className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">
              Bill Negotiation AI
            </h1>
            <p className="text-white/60 text-sm">Smart negotiation scripts for Perth providers</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Potential Savings</p>
            <p className="text-2xl font-bold text-purple-400">${totalPotentialSavings}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Ready to Negotiate</p>
            <p className="text-2xl font-bold text-purple-400">{NEGOTIABLE_BILLS.filter(b => b.status === "ready").length}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-green-500/20 to-green-500/10 rounded-xl p-3 border border-green-500/30">
            <p className="text-white/60 text-xs uppercase">Successful</p>
            <p className="text-2xl font-bold text-green-400">{successCount}</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        <div className="space-y-3">
          <h3 className="text-white font-semibold">Your Bills</h3>
          {NEGOTIABLE_BILLS.map((bill, idx) => (
            <motion.div
              key={bill.id}
              className={`rounded-xl p-4 border transition-all cursor-pointer ${
                selectedBill?.id === bill.id
                  ? "bg-gradient-to-r from-purple-500/15 to-pink-500/10 border-purple-500/40"
                  : "bg-zinc-900/50 border-white/5 hover:border-purple-500/20"
              }`}
              onClick={() => setSelectedBill(selectedBill?.id === bill.id ? null : bill)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`bill-${bill.id}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold">{bill.provider}</p>
                      <Badge className={`${getStatusBadge(bill.status)} text-xs border flex items-center gap-1`}>
                        {getStatusIcon(bill.status)}
                        {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-white/40 text-xs">{bill.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">${bill.savingsPotential}/yr</p>
                    <p className="text-xs text-white/40">potential savings</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white/5 rounded-lg p-2">
                    <p className="text-white/60">Your Rate</p>
                    <p className="text-white font-bold">${bill.currentRate}</p>
                  </div>
                  <div className="bg-green-500/10 rounded-lg p-2 border border-green-500/20">
                    <p className="text-green-300">Market Rate</p>
                    <p className="text-green-400 font-bold">${bill.marketRate}</p>
                  </div>
                </div>

                <div>
                  <Progress
                    value={(bill.savingsPotential / 1000) * 100}
                    className="bg-white/10"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedBill && (
          <motion.div
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="bill-details"
          >
            <div className="space-y-4">
              <h4 className="text-white font-semibold">{selectedBill.provider} - Negotiation Guide</h4>

              <div className="bg-white/5 rounded-lg p-4 space-y-2">
                <p className="text-white/60 text-xs uppercase font-semibold">Contact Options</p>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 rounded-lg text-xs">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" className="bg-pink-500/20 text-pink-300 hover:bg-pink-500/30 rounded-lg text-xs">
                    <Mail className="w-3 h-3 mr-1" />
                    Email
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-white/60 text-xs uppercase font-semibold">AI-Generated Scripts</p>
                {NEGOTIATION_TEMPLATES.map((template, idx) => (
                  <div key={idx} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white text-sm font-semibold mb-1">{template.title}</p>
                    <p className="text-white/60 text-xs">{template.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-sm"
                  data-testid="button-start-negotiation"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Start Negotiation
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-lg text-sm"
                  onClick={() => setShowTemplate(!showTemplate)}
                  data-testid="button-save-script"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Save Scripts
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-5 border border-purple-500/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          data-testid="tips-card"
        >
          <h4 className="text-white font-semibold mb-3">💡 Negotiation Tips</h4>
          <ul className="space-y-2">
            <li className="text-white/70 text-sm flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              Call at start of month for better rates
            </li>
            <li className="text-white/70 text-sm flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              Have competitor quotes ready
            </li>
            <li className="text-white/70 text-sm flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              Ask about loyalty bonuses & bundles
            </li>
            <li className="text-white/70 text-sm flex items-start gap-2">
              <span className="text-purple-400 font-bold">•</span>
              Request written confirmation
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
