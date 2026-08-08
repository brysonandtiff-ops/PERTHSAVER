import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Wrench, DollarSign } from "lucide-react";

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
    transition: { duration: 0.6 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },
};

export default function VehicleEVCharge() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Vehicle & EV Charging</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save on fuel, maintenance, car insurance & EV charging</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-fuel-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-fuel-label">Fuel Savings/yr</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-fuel-amount">$840</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-cheapest-fuel" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-cheapest-label">Cheapest Fuel Now</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-cheapest-price">157.9¢</p>
                <p className="text-xs text-white/60 mt-1" data-testid="text-cheapest-location">Cannington</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-ev-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-ev-label">Switch to EV?</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-ev-savings">Save 80%</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card data-testid="card-ev-charging" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  EV Charging Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-white/70">Cheapest EV charging across Perth</p>
                {[
                  { location: "Rottnest Island Fast Charger", price: "32¢/kWh", distance: "Near you" },
                  { location: "Perth Arena (Evie Networks)", price: "45¢/kWh", distance: "8km away" },
                  { location: "Home charging (off-peak)", price: "15¢/kWh", distance: "Best deal!" },
                ].map((charger, i) => (
                  <motion.div key={`charger-${i}`} variants={itemVariants} className="p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/10 transition-colors">
                    <p className="font-semibold text-white text-sm" data-testid={`text-charger-name-${i}`}>{charger.location}</p>
                    <p className="text-xs text-white/60 mt-1" data-testid={`text-charger-price-${i}`}>{charger.price}</p>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card data-testid="card-maintenance" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Wrench className="h-6 w-6 text-accent" />
                  Maintenance Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button data-testid="button-compare-mechanics" className="w-full bg-primary hover:bg-primary/90 text-white">Compare Mechanics</Button>
                <p className="text-xs text-white/60 mt-3 text-center">Independent mechanics save 30-50% vs dealers</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card data-testid="card-vehicle-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">🚗 Vehicle Savings</p>
              {[
                "Fuel rewards: Each 100L from Woolies/Coles save 4-6 cents/L",
                "Air filter DIY: Save $40-80 by doing it yourself",
                "Buy used parts: Wreckers in Perth 50-70% cheaper",
                "EV + solar: Get WA solar rebate + cut fuel costs to near zero",
                "Rideshare co-ops: Team up for commuting, split fuel 50%",
              ].map((tip, i) => (
                <p key={`tip-${i}`} className="text-xs text-white/70" data-testid={`text-vehicle-tip-${i}`}>• {tip}</p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
