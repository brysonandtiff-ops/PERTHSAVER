import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Smartphone, Wifi } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6,  },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6,  },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },
};

export default function MobileInternetPlans() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Mobile & Internet Plans</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save up to $600/year on phone & internet</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-paying" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-paying-label">You're Paying</p>
                <p className="text-3xl font-display font-bold text-white mt-2" data-testid="text-paying-amount">$89/mo</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-best-deal" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-deal-label">Best Deal</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-deal-price">$39/mo</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-can-save" className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 backdrop-blur hover:border-accent/50 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/80 text-sm font-semibold" data-testid="text-save-label">Can Save</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-save-amount">$600/yr</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card data-testid="card-mobile-plans" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Smartphone className="h-6 w-6 text-primary" />
                  Mobile Plans Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Telstra (Current)", data: "30GB", cost: "$89", speed: "Standard" },
                  { name: "Vodafone", data: "80GB", cost: "$65", speed: "Same coverage" },
                  { name: "Optus", data: "50GB", cost: "$55", speed: "99% same" },
                  { name: "ALDI Mobile", data: "40GB", cost: "$39", speed: "Uses Telstra" },
                ].map((plan, i) => (
                  <motion.div key={`plan-${i}`} variants={itemVariants} className="p-4 bg-white/5 rounded-lg border border-white/8 hover:bg-white/10 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-white" data-testid={`text-plan-name-${i}`}>{plan.name}</p>
                        <p className="text-xs text-white/60 mt-1" data-testid={`text-plan-specs-${i}`}>{plan.data} • {plan.speed}</p>
                      </div>
                      <p className="text-white font-bold" data-testid={`text-plan-cost-${i}`}>{plan.cost}/mo</p>
                    </div>
                    <Button data-testid={`button-compare-${i}`} size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">Compare</Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card data-testid="card-internet" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Wifi className="h-6 w-6 text-accent" />
                  Home Internet Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button data-testid="button-compare-nbn" className="w-full bg-primary hover:bg-primary/90 text-white">Compare NBN Providers</Button>
                <p className="text-xs text-white/60 mt-3 text-center">Aussie Broadband • Superloop • iiNet • Activ8</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
