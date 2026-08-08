import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, DollarSign, TrendingDown } from "lucide-react";

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

export default function RealEstateSavings() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Real Estate Savings</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save $8K-20K on rent, mortgages, home buying</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-rental-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-rental-label">Rental Savings/mo</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-rental-amount">$350</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-suburbs" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-suburbs-label">Best Suburbs</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-suburbs-count">24</p>
                <p className="text-xs text-white/60 mt-1">Value areas</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-mortgage-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-mortgage-label">Mortgage Savings/yr</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-mortgage-amount">$14K+</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-4" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Best Value Suburbs (2025)</p>
          {[
            { suburb: "Mirrabooka", rent: "$1,450/wk", buy: "$485K avg", growth: "8.3%/yr" },
            { suburb: "Nollamara", rent: "$1,380/wk", buy: "$450K avg", growth: "7.9%/yr" },
            { suburb: "Cannington", rent: "$1,320/wk", buy: "$420K avg", growth: "6.2%/yr" },
            { suburb: "Kelmscott", rent: "$1,280/wk", buy: "$395K avg", growth: "9.1%/yr" },
          ].map((suburb, i) => (
            <motion.div key={`suburb-${i}`} variants={itemVariants}>
              <Card data-testid={`card-suburb-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white" data-testid={`text-suburb-name-${i}`}>{suburb.suburb}</p>
                    <p className="text-xs text-white/60 mt-1" data-testid={`text-suburb-details-${i}`}>Rent {suburb.rent} • Buy {suburb.buy}</p>
                  </div>
                  <Badge data-testid={`badge-growth-${i}`} className="bg-accent/20 text-accent">{suburb.growth} growth</Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card data-testid="card-realestate-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">🏠 Perth Real Estate Hacks</p>
              {[
                "Roommates: Split 3-bed with 2 roommates saves $600-800/mo",
                "Refinance: Switching lenders saves $200-400/mo (Perth avg)",
                "First Home Scheme: WA gives $10K stamp duty concession",
                "Negotiation: Many landlords drop rent 5-10% if you negotiate",
                "Buyer agent: Free service helps negotiate property 3-5% lower",
              ].map((hack, i) => (
                <p key={`hack-${i}`} className="text-xs text-white/70" data-testid={`text-realestate-hack-${i}`}>• {hack}</p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
