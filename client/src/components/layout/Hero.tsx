import { Search, ArrowRight, Leaf, Sparkles, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@assets/generated_images/hero_image_for_grocery_savings_app_showing_fresh_food_and_digital_savings_concepts.png";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export function Hero() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="Fresh groceries" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background to-background" />
        
        {/* Animated gradient orbs - Blue/Amber Theme */}
        <div className="absolute top-10 left-5 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-amber-400/10 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-silver/5 rounded-full blur-3xl opacity-15 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-3 py-12 max-w-2xl w-full"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="space-y-6">
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur w-fit hover:bg-blue-500/15 transition-all text-xs"
          >
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span className="text-blue-300 font-semibold uppercase tracking-wider">V4 • AI-Powered Savings</span>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h1 className="text-3xl font-display font-bold leading-tight text-white">
              <span className="block">Save $12-32K</span>
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                Every Year in Perth
              </span>
            </h1>

            <p className="text-sm text-white/70 max-w-2xl leading-relaxed font-light">
              AI-powered price tracking, smart alerts, and community deals across Woolies, Coles, ALDI, IGA & Spudshed. 10K+ Perth families already saving.
            </p>
          </motion.div>

          {/* CTA Buttons & Search */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3 pt-4">
            <Link href="/search" className="flex-1 max-w-md relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-amber-400/10 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all" />
              <Input
                placeholder="Search deals, stores, products..."
                className="relative w-full h-11 pl-10 pr-3 text-sm text-white placeholder:text-white/40 rounded-lg bg-white/5 border border-blue-500/30 focus:border-blue-500/60 focus:bg-white/8 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 pointer-events-none" />
            </Link>

            <Link href="/auth">
              <Button className="h-11 px-4 font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white glow-primary transition-all rounded-lg whitespace-nowrap text-sm">
                Get Started Free <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats Row */}
          <motion.div variants={itemVariants} className="flex flex-col gap-4 pt-6 border-t border-white/10">
            <div className="space-y-1 min-w-0">
              <div className="text-2xl font-bold text-amber-400 truncate">$2.1M+</div>
              <div className="text-xs text-white/60 truncate">Saved by Perth Families</div>
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-2xl font-bold text-amber-400 truncate">10K+</div>
              <div className="text-xs text-white/60 truncate">Active Users</div>
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-2xl font-bold text-amber-400 truncate">1,600+</div>
              <div className="text-xs text-white/60 truncate">Products Tracked</div>
            </div>
            <div className="space-y-1 min-w-0">
              <div className="text-2xl font-bold text-amber-400 truncate">85%</div>
              <div className="text-xs text-white/60 truncate">Prediction Accuracy</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
