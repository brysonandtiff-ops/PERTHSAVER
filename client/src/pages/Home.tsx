import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Tag,
  Zap,
  ShoppingCart,
  Brain,
  Shield,
  Target,
  Users,
  Wallet,
  BarChart3,
  Download,
  CheckCircle2,
  MapPin,
  Clock,
  Cpu,
  TrendingUp,
  PiggyBank,
  Layers,
  CircuitBoard,
  Star,
  Quote,
  Smartphone,
  Search,
  Bell,
  Play,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const testimonials = [
  {
    name: "Sarah M.",
    location: "Joondalup",
    avatar: "SM",
    rating: 5,
    text: "We saved over $18,000 last year just by following the fuel and grocery alerts. The AI coach helped us find savings we never knew existed!",
    savings: "$18,420",
  },
  {
    name: "Michael T.",
    location: "Fremantle",
    avatar: "MT",
    rating: 5,
    text: "As a small business owner, the Fleet Fuel Manager alone saved me $8,500. The Perth-specific data is incredibly accurate.",
    savings: "$32,100",
  },
  {
    name: "Emma & James",
    location: "Rockingham",
    avatar: "EJ",
    rating: 5,
    text: "With two kids, every dollar counts. Perth Saver showed us we were overpaying on utilities by $200/month. Game changer!",
    savings: "$24,800",
  },
];

const howItWorks = [
  {
    step: 1,
    icon: Smartphone,
    title: "Sign Up Free",
    description: "Create your account in 2 minutes. No credit card required. Start with our generous free tier.",
  },
  {
    step: 2,
    icon: Search,
    title: "Track & Compare",
    description: "Our AI scans Perth prices 24/7. Compare fuel, groceries, utilities, and more across 100+ providers.",
  },
  {
    step: 3,
    icon: Bell,
    title: "Get Smart Alerts",
    description: "Receive personalized savings alerts. Know exactly when and where to buy for maximum savings.",
  },
];

const trustedStores = [
  { name: "Woolworths", color: "#00a651" },
  { name: "Coles", color: "#ed1c24" },
  { name: "ALDI", color: "#00005f" },
  { name: "IGA", color: "#e31837" },
  { name: "Synergy", color: "#00b5e2" },
  { name: "ATCO Gas", color: "#ff6600" },
];

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPitch = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch("/api/investors/pitch-document", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to generate document");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Perth-Saver-Investor-Pitch-2025.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download Successful",
        description: "Investor pitch document downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the investor pitch document",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden relative bg-black">
      <PublicNavbar />

      {/* Hero Section - Enhanced */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10" />
          <motion.div 
            className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.4), transparent 70%)' }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10 pt-16">
          <motion.div
            className="text-center space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-none"
            >
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">Save Up To</span>
              <br />
              <motion.span 
                className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent inline-block"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 200%' }}
              >
                $25,000
              </motion.span>
              <br />
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">Every Year</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed"
            >
              The #1 AI-powered savings platform built for Perth families and businesses. 
              Track fuel, groceries, utilities, and investments with real-time local data.
            </motion.p>

            {/* AI Models Badge */}
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)' }}
                whileHover={{ scale: 1.05 }}
              >
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Claude 4.5</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-cyan-300">Gemini 3 Pro</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
                whileHover={{ scale: 1.05 }}
              >
                <Cpu className="h-4 w-4 text-white/70" />
                <span className="text-sm font-medium text-white/70">GPT-5.1</span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/auth"
                  className="inline-flex items-center justify-center w-full sm:w-auto text-white font-bold px-10 py-5 text-lg rounded-2xl transition-all duration-300"
                  style={{ 
                    background: 'linear-gradient(135deg, #A855F7, #06B6D4)',
                    boxShadow: '0 0 50px rgba(6, 182, 212, 0.4), 0 0 100px rgba(16, 185, 129, 0.2)'
                  }}
                  data-testid="button-get-started"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Saving Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/pricing"
                  className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-5 text-lg rounded-2xl text-white/80 hover:text-white transition-all duration-300 font-semibold"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                  data-testid="button-view-pricing"
                >
                  View Pricing
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-8 pt-8 text-slate-500"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-sm">Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-400" />
                <span className="text-sm">2-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-sm">4.9/5 rating</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </section>

      {/* Trusted By Section */}
      <section className="py-16 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <p className="text-sm text-white/40 uppercase tracking-widest font-medium">Data from trusted Perth sources</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12" data-testid="trusted-sources-list">
              {trustedStores.map((store, idx) => (
                <motion.div
                  key={store.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.06)' }}
                  data-testid={`trusted-source-${store.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: store.color }}
                  />
                  <span className="text-white/60 font-medium">{store.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-black">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <motion.div variants={itemVariants}>
                <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">How It Works</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-display font-bold text-white">
                Start saving in 3 simple steps
              </motion.h2>
            </div>

            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8" data-testid="how-it-works-grid">
              {howItWorks.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="relative"
                  data-testid={`how-it-works-step-${item.step}`}
                >
                  <Card 
                    className="h-full text-center p-8 transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(16, 185, 129, 0.02))',
                      border: '1px solid rgba(6, 182, 212, 0.1)',
                    }}
                  >
                    <CardContent className="p-0 space-y-4">
                      <motion.div
                        className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto"
                        style={{ boxShadow: '0 0 40px rgba(6, 182, 212, 0.3)' }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <item.icon className="h-10 w-10 text-white" />
                      </motion.div>
                      <div className="text-purple-400 text-sm font-semibold">Step {item.step}</div>
                      <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                      <p className="text-white/50 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="h-6 w-6 text-purple-500/30" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(0, 0, 0, 1) 50%, rgba(16, 185, 129, 0.1) 100%)'
          }}
        />

        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid md:grid-cols-4 gap-6 text-center"
          >
            {[
              { value: "$24K+", label: "Avg Annual Savings", icon: Wallet, id: "savings" },
              { value: "50+", label: "Savings Categories", icon: Layers, id: "categories" },
              { value: "10,000+", label: "Perth Families", icon: Users, id: "families" },
              { value: "3", label: "AI Models", icon: CircuitBoard, id: "ai-models" },
            ].map((stat, idx) => (
              <motion.div 
                key={idx} 
                variants={itemVariants} 
                className="p-8 rounded-2xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
                whileHover={{ scale: 1.05, background: 'rgba(255, 255, 255, 0.04)' }}
                data-testid={`stat-${stat.id}`}
              >
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center mx-auto mb-4"
                  style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' }}
                  whileHover={{ scale: 1.1 }}
                >
                  <stat.icon className="h-7 w-7 text-white" />
                </motion.div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 relative bg-black">
        <div className="container max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <motion.div variants={itemVariants}>
                <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Features</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-display font-bold text-white">
                Everything you need to save
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-white/50 max-w-2xl mx-auto">
                Comprehensive tools designed specifically for Perth's unique market
              </motion.p>
            </div>

            <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Tag,
                  title: "Deal Finder",
                  description: "Find the best deals and promotions across Perth retailers. Never miss a bargain.",
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: ShoppingCart,
                  title: "Grocery Comparison",
                  description: "Compare prices across Woolworths, Coles, and ALDI. Never overpay for groceries.",
                  gradient: "from-cyan-500 to-cyan-600",
                },
                {
                  icon: Zap,
                  title: "Utilities Optimizer",
                  description: "Synergy plans comparison & gas provider insights. Find the best rates for your home.",
                  gradient: "from-purple-500 to-cyan-500",
                },
                {
                  icon: Brain,
                  title: "AI Financial Coach",
                  description: "Powered by Claude 4.5, Gemini 3 Pro & GPT-5.1. Get personalized Perth-specific advice.",
                  gradient: "from-purple-500 to-purple-600",
                },
                {
                  icon: Target,
                  title: "Savings Goals",
                  description: "Set and track your savings targets. Celebrate milestones with gamification.",
                  gradient: "from-cyan-500 to-purple-500",
                },
                {
                  icon: Users,
                  title: "Family Sharing",
                  description: "Invite family members to share savings insights and track together.",
                  gradient: "from-slate-500 to-purple-500",
                },
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <Card 
                    className="h-full transition-all duration-500"
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(6, 182, 212, 0.1)',
                    }}
                  >
                    <CardContent className="p-8">
                      <motion.div 
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                        style={{ boxShadow: '0 0 25px rgba(6, 182, 212, 0.3)' }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <feature.icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                      <p className="text-white/50">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-transparent to-cyan-500/5" />
        <div className="container max-w-6xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="space-y-16"
          >
            <div className="text-center space-y-4">
              <motion.div variants={itemVariants}>
                <span className="text-purple-400 text-sm font-semibold uppercase tracking-widest">Testimonials</span>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-4xl sm:text-5xl font-display font-bold text-white">
                Trusted by Perth families
              </motion.h2>
            </div>

            <motion.div variants={containerVariants} className="grid md:grid-cols-3 gap-8" data-testid="testimonials-grid">
              {testimonials.map((testimonial, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  data-testid={`testimonial-${testimonial.location.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Card 
                    className="h-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.05), rgba(16, 185, 129, 0.02))',
                      border: '1px solid rgba(6, 182, 212, 0.1)',
                    }}
                  >
                    <CardContent className="p-8 space-y-6">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <Quote className="h-8 w-8 text-purple-500/30" />
                      <p className="text-white/70 leading-relaxed">{testimonial.text}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="text-white font-medium">{testimonial.name}</p>
                            <p className="text-white/40 text-sm">{testimonial.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-bold">{testimonial.savings}</p>
                          <p className="text-white/40 text-xs">saved</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-black">
        <div className="container max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-12 rounded-3xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.05))',
              border: '1px solid rgba(6, 182, 212, 0.2)',
            }}
          >
            <motion.div 
              className="absolute inset-0 opacity-30"
              style={{ background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.2), transparent 60%)' }}
            />
            <div className="relative z-10 space-y-6">
              <h2 className="text-4xl sm:text-5xl font-display font-bold text-white">
                Ready to start saving?
              </h2>
              <p className="text-xl text-white/60 max-w-2xl mx-auto">
                Join 10,000+ Perth families who are saving $15K-25K annually with Perth Saver AI.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center text-white font-bold px-10 py-5 text-lg rounded-2xl"
                    style={{ 
                      background: 'linear-gradient(135deg, #A855F7, #06B6D4)',
                      boxShadow: '0 0 50px rgba(6, 182, 212, 0.4)'
                    }}
                    data-testid="button-cta-final"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>
              </div>
              <p className="text-sm text-white/40">No credit card required. Cancel anytime.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
