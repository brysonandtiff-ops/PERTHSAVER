import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Trash2, RotateCcw, TrendingDown, Clock, Bell } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6,  } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6,  } },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

const subscriptions = [
  { name: "Netflix", cost: "$15.99", frequency: "Monthly", status: "active", lastUsed: "2 days ago", autoRenew: true, nextBilling: "Dec 24" },
  { name: "Spotify", cost: "$11.99", frequency: "Monthly", status: "active", lastUsed: "Today", autoRenew: true, nextBilling: "Dec 24" },
  { name: "Adobe Creative Cloud", cost: "$79.99", frequency: "Monthly", status: "active", lastUsed: "5 days ago", autoRenew: true, nextBilling: "Dec 25" },
  { name: "Gym Membership", cost: "$49", frequency: "Monthly", status: "inactive", lastUsed: "3 months ago", autoRenew: false, nextBilling: "N/A" },
  { name: "Audible", cost: "$14.95", frequency: "Monthly", status: "inactive", lastUsed: "2 months ago", autoRenew: false, nextBilling: "N/A" },
  { name: "Microsoft 365", cost: "$119", frequency: "Yearly", status: "active", lastUsed: "Today", autoRenew: true, nextBilling: "Nov 25, 2025" },
];

export default function SubscriptionManager() {
  const total = subscriptions.reduce((sum, s) => {
    const amount = parseFloat(s.cost.replace('$', ''));
    return sum + (s.frequency === 'Monthly' ? amount * 12 : amount);
  }, 0);

  const inactive = subscriptions.filter(s => s.status === 'inactive');

  return (
    <div className="min-h-screen flex flex-col">
      
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Subscription Manager</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Track and cancel unwanted subscriptions</p>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 gap-3 mb-6 sm:mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-active-subs" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <p className="text-white/60 text-xs sm:text-sm" data-testid="text-active-label">Active Subscriptions</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary mt-1 sm:mt-2" data-testid="text-active-count">{subscriptions.filter(s => s.status === 'active').length}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-annual-spend" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-spend-label">Annual Spend</p>
                <p className="text-3xl font-display font-bold text-white mt-2" data-testid="text-spend-amount">${total.toFixed(0)}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-can-save" className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 backdrop-blur hover:border-accent/50 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/80 text-sm font-semibold" data-testid="text-save-label">Can Cancel & Save</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-save-amount">${(inactive.reduce((sum, s) => {
                  const amount = parseFloat(s.cost.replace('$', ''));
                  return sum + (s.frequency === 'Monthly' ? amount * 12 : amount);
                }, 0)).toFixed(0)}</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Alert */}
        {inactive.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card data-testid="card-alert" className="bg-slate-500/10 border-slate-500/20 backdrop-blur mb-8">
              <CardContent className="p-4 flex gap-3">
                <AlertCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-slate-300 mb-1" data-testid="text-alert-title">Unused Subscriptions Detected</p>
                  <p className="text-xs text-slate-400" data-testid="text-alert-message">{inactive.length} subscriptions haven't been used in the last 30 days. Cancelling these could save you ${(inactive.reduce((sum, s) => {
                    const amount = parseFloat(s.cost.replace('$', ''));
                    return sum + (s.frequency === 'Monthly' ? amount * 12 : amount);
                  }, 0)).toFixed(0)}/year</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div className="space-y-4" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Active Subscriptions</p>
          {subscriptions.filter(s => s.status === 'active').map((sub, i) => (
            <motion.div key={`active-${sub.name}`} variants={itemVariants}>
              <Card data-testid={`card-active-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-display font-semibold text-white" data-testid={`text-name-${i}`}>{sub.name}</p>
                    <p className="text-xs text-white/60 mt-1" data-testid={`text-used-${i}`}>Used {sub.lastUsed}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold" data-testid={`text-cost-${i}`}>{sub.cost}/{sub.frequency.toLowerCase()}</p>
                    <div className="flex gap-2 mt-2">
                      <Button data-testid={`button-manage-${i}`} size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">Manage</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <p className="text-xs font-semibold text-white/60 uppercase mt-8">Unused - Recommend Cancelling</p>
          {subscriptions.filter(s => s.status === 'inactive').map((sub, i) => (
            <motion.div key={`inactive-${sub.name}`} variants={itemVariants}>
              <Card data-testid={`card-inactive-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300 opacity-75">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-display font-semibold text-white" data-testid={`text-inactive-name-${i}`}>{sub.name}</p>
                    <p className="text-xs text-white/60 mt-1" data-testid={`text-inactive-used-${i}`}>Last used {sub.lastUsed}</p>
                  </div>
                  <div className="text-right">
                    <Badge data-testid={`badge-unused-${i}`} className="bg-accent/20 text-accent mb-2">Unused</Badge>
                    <p className="text-white font-bold" data-testid={`text-inactive-cost-${i}`}>{sub.cost}/{sub.frequency.toLowerCase()}</p>
                    <div className="flex gap-2 mt-2">
                      <Button data-testid={`button-cancel-${i}`} size="sm" className="bg-accent hover:bg-accent/90 text-background gap-1">
                        <Trash2 className="h-3 w-3" /> Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Pro Tips */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">💡 Subscription Hacks</p>
              {[
                "Free trials: Always set reminders before charges begin",
                "Shared plans: Split Netflix/Spotify costs with friends ($3-4/person)",
                "Annual billing: Most services offer 15-20% discount on yearly plans",
                "Student discounts: Use your student email for Spotify, MS Office, etc.",
                "Pause instead of cancel: Pause for 3 months instead of losing data",
              ].map((tip, i) => (
                <p key={`tip-${i}`} className="text-xs text-white/70" data-testid={`text-tip-${i}`}>• {tip}</p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
