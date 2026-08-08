import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
  DollarSign, ShoppingCart, Zap, Target, 
  ArrowUpRight, Receipt, ChevronRight,
  Sparkles, Bell, Flame, Clock, Tag, Gift, Ticket, Fuel, BadgePercent, ExternalLink
} from "lucide-react";
import { DashboardSkeletons } from "@/components/Skeleton";
import OnboardingWizard from "@/components/OnboardingWizard";
import { useAuth, useSavingsGoals } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useDashboardLayout, WidgetCustomizer } from "@/components/DashboardWidgets";

const isWidgetVisible = (widgets: { id: string; visible: boolean }[], id: string): boolean => {
  const widget = widgets.find(w => w.id === id);
  return widget?.visible ?? true;
};

const savingsData = [
  { month: "Jan", savings: 280, target: 300 },
  { month: "Feb", savings: 320, target: 300 },
  { month: "Mar", savings: 290, target: 300 },
  { month: "Apr", savings: 380, target: 350 },
  { month: "May", savings: 420, target: 350 },
  { month: "Jun", savings: 450, target: 400 },
];

const getQuickActions = (goalProgress: number, goalsCount: number) => [
  { icon: ShoppingCart, label: "Groceries", href: "/groceries", color: "from-cyan-500 to-cyan-600", badge: "230+" },
  { icon: Zap, label: "Utilities", href: "/utilities", color: "from-purple-500 to-purple-600", badge: null },
  { icon: Receipt, label: "Scan", href: "/receipt-scanner", color: "from-emerald-500 to-emerald-600", badge: "New" },
  { icon: Target, label: "Goals", href: "/savings-goals", color: "from-pink-500 to-pink-600", badge: goalsCount > 0 ? `${goalProgress}%` : "Add" },
];

const recentSavings = [
  { store: "Woolworths", amount: 12.50, item: "Weekly groceries", time: "2 hours ago", icon: ShoppingCart },
  { store: "Synergy", amount: 45.00, item: "Bill discount", time: "Yesterday", icon: Zap },
  { store: "ALDI", amount: 15.20, item: "Special buys", time: "2 days ago", icon: Tag },
];

const topDeals = [
  { name: "50% Off Milk", store: "Coles", savings: "$3.25", expires: "2h left" },
  { name: "Buy 2 Get 1", store: "Woolworths", savings: "$8.50", expires: "Today" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function AnimatedCounter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{displayValue.toLocaleString()}{suffix}</span>;
}

function LiveIndicator() {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className="h-2 w-2 rounded-full bg-emerald-400"
        animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-xs text-emerald-400 font-medium">Live</span>
    </div>
  );
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { data: authData } = useAuth();
  const { data: goalsData } = useSavingsGoals();
  const { widgets, updateWidgets, toggleWidget, resetLayout } = useDashboardLayout();
  const { data: dealsCount } = useQuery({
    queryKey: ["/api/deals/count"],
    queryFn: async () => {
      const res = await fetch("/api/deals?limit=1");
      if (!res.ok) return { count: 48 };
      const data = await res.json();
      return { count: data.deals?.length || 48 };
    },
    staleTime: 60000,
  });
  
  const firstName = authData?.user?.firstName || "Saver";
  const totalSaved = parseFloat(authData?.user?.totalSaved || "0");
  const monthlyTarget = parseFloat(authData?.user?.monthlyTarget || "2000");
  const goals = goalsData?.goals || [];
  const avgGoalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum: number, g: any) => sum + (parseFloat(g.currentSavings) / parseFloat(g.targetSavings) * 100), 0) / goals.length)
    : 0;
  const goalProgress = monthlyTarget > 0 ? Math.min(Math.round((totalSaved / monthlyTarget) * 100), 100) : 0;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (authData?.user && !authData.user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [authData]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const greeting = useCallback(() => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, [currentTime]);

  if (isLoading) {
    return <DashboardSkeletons />;
  }

  return (
    <div className="min-h-full pb-24">
      <motion.div
        className="w-full max-w-3xl mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white" data-testid="text-greeting">
                {greeting()}, {firstName} 
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-white/50 text-sm">Your savings overview</p>
                <LiveIndicator />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <WidgetCustomizer
                widgets={widgets}
                onReorder={updateWidgets}
                onToggle={toggleWidget}
                onReset={resetLayout}
              />
              <Link href="/notifications">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/10" data-testid="button-notifications">
                    <Bell className="h-5 w-5" />
                    <motion.span 
                      className="absolute top-1 right-1 h-2.5 w-2.5 bg-purple-500 rounded-full"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </Button>
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Main Savings Hero Card */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="relative overflow-hidden bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-cyan-500/20 border-purple-500/30" data-testid="card-savings-hero">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-cyan-500/10" />
            <CardContent className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white/60 text-xs uppercase tracking-wider">Total Saved This Month</p>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] border-0 h-5">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                      12%
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-bold text-white" data-testid="text-monthly-savings">
                      $<AnimatedCounter value={totalSaved > 0 ? totalSaved : 847} />
                    </span>
                  </div>
                  <p className="text-white/40 text-sm mt-2">Goal: ${monthlyTarget.toLocaleString()}/month</p>
                  
                  {/* Progress to goal */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-white/50">Monthly goal: ${monthlyTarget.toLocaleString()}</span>
                      <span className="text-purple-400 font-medium">{goalProgress}%</span>
                    </div>
                    <Progress value={goalProgress > 0 ? goalProgress : 42} className="h-2 bg-white/10" />
                  </div>
                </div>
                <motion.div 
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl bg-gradient-to-br from-purple-500/40 to-cyan-500/40 flex items-center justify-center backdrop-blur-xl"
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(168,85,247,0.3)",
                      "0 0 40px rgba(168,85,247,0.5)",
                      "0 0 20px rgba(168,85,247,0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        {isWidgetVisible(widgets, 'quick-actions') && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {getQuickActions(avgGoalProgress, goals.length).map((action, idx) => (
              <Link key={idx} href={action.href}>
                <motion.div 
                  className="relative flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer min-h-[80px]"
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  data-testid={`action-${action.label.toLowerCase().replace(' ', '-')}`}
                >
                  {action.badge && (
                    <Badge className="absolute -top-1.5 -right-1.5 text-[9px] h-4 px-1.5 bg-purple-500 text-white border-0">
                      {action.badge}
                    </Badge>
                  )}
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-2 shadow-lg`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs text-white/70 text-center leading-tight font-medium">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>)}

        {/* Stats Grid - Enhanced */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2 sm:gap-3 mb-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/60 border-white/5 hover:border-emerald-500/20 transition-colors" data-testid="card-stat-weekly">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">$<AnimatedCounter value={326} /></p>
                    <p className="text-xs text-white/50">Weekly savings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/60 border-white/5 hover:border-purple-500/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 flex items-center justify-center">
                    <Tag className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white"><AnimatedCounter value={48} /></p>
                    <p className="text-xs text-white/50">Deals found</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/60 border-white/5 hover:border-cyan-500/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/20 flex items-center justify-center">
                    <Target className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white"><AnimatedCounter value={75} suffix="%" /></p>
                    <p className="text-xs text-white/50">Goal progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/60 border-white/5 hover:border-orange-500/20 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center">
                    <Flame className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white"><AnimatedCounter value={12} /></p>
                    <p className="text-xs text-white/50">Day streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Daily Games & Rewards */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Daily Games</h2>
              <Badge className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-[10px] border-0">
                <Gift className="h-3 w-3 mr-0.5" />
                Win Rewards
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/daily-spin">
              <motion.div
                className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="link-daily-spin"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Gift className="h-5 w-5 text-white" />
                    </motion.div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-[9px] border-0">Ready!</Badge>
                  </div>
                  <p className="text-sm font-semibold text-white">Wheel Spin</p>
                  <p className="text-[11px] text-white/50">Spin daily for rewards</p>
                </div>
              </motion.div>
            </Link>
            
            <Link href="/scratch-cards">
              <motion.div
                className="relative p-4 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-emerald-600/30 border border-cyan-500/30 cursor-pointer overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                data-testid="link-scratch-cards"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Ticket className="h-5 w-5 text-white" />
                    </motion.div>
                    <Badge className="bg-yellow-500/20 text-yellow-400 text-[9px] border-0">3 Cards</Badge>
                  </div>
                  <p className="text-sm font-semibold text-white">Scratch Cards</p>
                  <p className="text-[11px] text-white/50">Win up to $50 credit</p>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Hot Deals Alert */}
        {isWidgetVisible(widgets, 'grocery-deals') && (
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Hot Deals</h2>
              <Badge className="bg-red-500/20 text-red-400 text-[10px] border-0 animate-pulse">
                <Flame className="h-3 w-3 mr-0.5" />
                Live
              </Badge>
            </div>
            <Link href="/deals">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 text-xs h-7 px-2">
                See All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {topDeals.map((deal, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 w-[200px] p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20"
                whileHover={{ scale: 1.02 }}
                data-testid={`deal-card-${idx}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500/20 text-red-400 text-[10px] border-0">
                    <Clock className="h-3 w-3 mr-0.5" />
                    {deal.expires}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-white mb-1">{deal.name}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{deal.store}</span>
                  <span className="text-sm font-bold text-emerald-400">{deal.savings}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>)}

        {/* Fuel Prices & WA Rebates Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/fuel">
            <motion.div
              className="relative p-4 rounded-2xl bg-gradient-to-br from-orange-600/30 to-red-600/30 border border-orange-500/30 cursor-pointer overflow-hidden h-full"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="link-fuel-prices"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
                  <Fuel className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-green-500/20 text-green-400 text-[9px] border-0">Live</Badge>
              </div>
              <p className="text-sm font-semibold text-white">Fuel Prices</p>
              <p className="text-[11px] text-white/50">FuelWatch Perth</p>
            </motion.div>
          </Link>
          
          <Link href="/rebates">
            <motion.div
              className="relative p-4 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/30 overflow-hidden cursor-pointer h-full"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              data-testid="link-wa-rebates"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <BadgePercent className="h-5 w-5 text-white" />
                </div>
                <Badge className="bg-yellow-500/20 text-yellow-400 text-[9px] border-0">$700+</Badge>
              </div>
              <p className="text-sm font-semibold text-white">WA Rebates</p>
              <p className="text-[11px] text-white/50">$400 power + $150 CoL</p>
            </motion.div>
          </Link>
        </motion.div>

        {/* Savings Chart */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="bg-zinc-900/60 border-white/5">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-white">Savings Trend</CardTitle>
                  <CardDescription className="text-white/50 text-xs">Your 6-month progress</CardDescription>
                </div>
                <Link href="/analytics">
                  <Button variant="ghost" size="sm" className="text-white/50 hover:text-white text-xs">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={savingsData}>
                  <defs>
                    <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#A855F7" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(24,24,27,0.95)', 
                      border: '1px solid rgba(168,85,247,0.3)', 
                      borderRadius: '12px',
                      fontSize: '12px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                    }} 
                  />
                  <Area type="monotone" dataKey="savings" stroke="#A855F7" strokeWidth={2.5} fill="url(#savingsGradient)" />
                  <Line type="monotone" dataKey="target" stroke="#06B6D4" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Savings */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wide">Recent Savings</h2>
            <Link href="/analytics">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 text-xs h-7 px-2">
                See All <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Link>
          </div>
          <Card className="bg-zinc-900/60 border-white/5 overflow-hidden">
            <CardContent className="p-0">
              {recentSavings.map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-all border-b border-white/5 last:border-0"
                  whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.03)" }}
                  data-testid={`recent-saving-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                      <item.icon className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.store}</p>
                      <p className="text-xs text-white/40">{item.item}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-400">+${item.amount.toFixed(2)}</p>
                    <p className="text-xs text-white/40">{item.time}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Coach Prompt - Enhanced */}
        <motion.div variants={itemVariants} className="mt-6">
          <Link href="/financial-coach">
            <motion.div 
              className="relative p-4 rounded-2xl bg-gradient-to-r from-purple-500/15 via-purple-500/10 to-cyan-500/15 border border-purple-500/25 flex items-center gap-4 cursor-pointer group overflow-hidden"
              whileHover={{ scale: 1.01, borderColor: "rgba(168,85,247,0.4)" }}
              whileTap={{ scale: 0.99 }}
              data-testid="cta-ai-coach"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div 
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 0 15px rgba(168,85,247,0.4)",
                    "0 0 25px rgba(168,85,247,0.6)",
                    "0 0 15px rgba(168,85,247,0.4)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0 relative">
                <p className="font-semibold text-white">AI Financial Coach</p>
                <p className="text-xs text-white/50 truncate">Get personalized savings advice from our AI</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40 group-hover:text-white/70 group-hover:translate-x-1 transition-all" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>

      <OnboardingWizard open={showOnboarding} onComplete={() => setShowOnboarding(false)} />
    </div>
  );
}
