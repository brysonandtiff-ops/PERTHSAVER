import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, Home, CreditCard, Heart, Car, Users, 
  ExternalLink, CheckCircle, Info, DollarSign, Calendar
} from "lucide-react";

interface Rebate {
  id: string;
  name: string;
  amount: string;
  icon: React.ElementType;
  color: string;
  description: string;
  eligibility: string[];
  link: string;
  expires?: string;
}

const rebates: Rebate[] = [
  {
    id: "electricity-credit",
    name: "WA Household Electricity Credit",
    amount: "$400",
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    description: "Automatic credit applied to residential power accounts to help with electricity costs.",
    eligibility: [
      "Residential electricity account holder",
      "Primary residence in WA",
      "Automatically applied - no application needed"
    ],
    link: "https://www.wa.gov.au/service/community-services/grants-and-subsidies/household-electricity-credit"
  },
  {
    id: "cost-of-living",
    name: "Cost of Living Rebate",
    amount: "$150",
    icon: DollarSign,
    color: "from-emerald-500 to-teal-500",
    description: "Additional one-off payment to help WA households with rising costs.",
    eligibility: [
      "WA resident",
      "Eligible concession card holder",
      "Check eligibility online"
    ],
    link: "https://www.wa.gov.au/organisation/department-of-the-premier-and-cabinet/cost-of-living-support"
  },
  {
    id: "hugs",
    name: "Hardship Utility Grant Scheme (HUGS)",
    amount: "Up to $870",
    icon: Heart,
    color: "from-pink-500 to-rose-500",
    description: "Emergency assistance for those struggling to pay electricity, gas, or water bills.",
    eligibility: [
      "Experiencing financial hardship",
      "Risk of disconnection",
      "Must contact financial counsellor first"
    ],
    link: "https://www.wa.gov.au/service/community-services/grants-and-subsidies/apply-for-hardship-utilities-grant-scheme-hugs"
  },
  {
    id: "seniors-card",
    name: "WA Seniors Card",
    amount: "Various",
    icon: Users,
    color: "from-purple-500 to-indigo-500",
    description: "Discounts on utilities, transport, and services for WA seniors.",
    eligibility: [
      "60+ years old",
      "WA resident for 12+ months",
      "Working 25 hours or less per week"
    ],
    link: "https://www.seniorscard.wa.gov.au/"
  },
  {
    id: "solar-fit",
    name: "Solar Feed-in Tariff",
    amount: "7.135c/kWh",
    icon: Zap,
    color: "from-amber-500 to-yellow-500",
    description: "Get paid for excess solar power you export back to the grid.",
    eligibility: [
      "Solar panel system installed",
      "Connected to SWIS grid",
      "Synergy customer"
    ],
    link: "https://www.synergy.net.au/Your-home/Manage-account/Solar-and-batteries"
  },
  {
    id: "rego-concession",
    name: "Vehicle Registration Concession",
    amount: "50% off",
    icon: Car,
    color: "from-blue-500 to-cyan-500",
    description: "Reduced vehicle registration fees for eligible concession card holders.",
    eligibility: [
      "Pensioner Concession Card",
      "Health Care Card",
      "One vehicle per household"
    ],
    link: "https://www.transport.wa.gov.au/licensing/concessions.asp"
  },
];

export default function WArebates() {
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="rebates-title">
                WA Government Rebates
              </h1>
              <p className="text-sm text-white/60">Save $1,500+ with these programs</p>
            </div>
          </div>
        </div>

        <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/20 p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">2024-25 Support Package</p>
              <p className="text-xs text-white/60">
                The WA Government provides significant cost of living support. Most rebates are automatically 
                applied or easy to claim. Perth Saver helps you track and maximize these savings.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-white/60">Power Credit</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">$400</div>
            <div className="text-xs text-white/50">automatic</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-white/60">CoL Rebate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">$150</div>
            <div className="text-xs text-white/50">eligible cards</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-4 h-4 text-pink-400" />
              <span className="text-xs text-white/60">HUGS Max</span>
            </div>
            <div className="text-2xl font-bold text-pink-400">$870</div>
            <div className="text-xs text-white/50">hardship support</div>
          </Card>
        </div>

        <div className="space-y-4">
          {rebates.map((rebate, idx) => (
            <motion.div
              key={rebate.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="bg-zinc-900/60 border-white/5 overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${rebate.color} flex items-center justify-center flex-shrink-0`}>
                      <rebate.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white">{rebate.name}</h3>
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs flex-shrink-0">
                          {rebate.amount}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/60 mb-3">{rebate.description}</p>
                      
                      <div className="space-y-1.5 mb-3">
                        {rebate.eligibility.map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            <span className="text-xs text-white/50">{item}</span>
                          </div>
                        ))}
                      </div>

                      <a 
                        href={rebate.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                      >
                        Learn more & apply
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 p-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-1">Don't Miss Out!</p>
              <p className="text-xs text-white/60 mb-2">
                Set up price alerts in Perth Saver to get notified when new rebates become available 
                or when deadlines are approaching.
              </p>
              <Button variant="outline" size="sm" className="text-xs h-7 border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                Set Up Alerts
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
