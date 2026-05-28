import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Tag, TrendingDown } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

export default function FashionShopping() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Fashion & Shopping</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save 30-70% with coupons, cashback, secondhand & sales</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-coupons" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-coupons-label">Coupons Active</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-coupons-count">142</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-savings-month" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-savings-label">Savings This Month</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-savings-amount">$287</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-brands" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-brands-label">Brands Tracked</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-brands-count">500+</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-4" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Live Deals</p>
          {[
            { store: "Kmart", discount: "50% off Winter Range", ends: "Today" },
            { store: "Target", discount: "Extra 20% on Clearance", ends: "Tonight" },
            { store: "Cotton On", discount: "Free shipping + 30% off", ends: "Tomorrow" },
            { store: "Big W", discount: "Clothing bonus points x2", ends: "This weekend" },
          ].map((deal, i) => (
            <motion.div key={`deal-${i}`} variants={itemVariants}>
              <Card data-testid={`card-deal-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white" data-testid={`text-store-${i}`}>{deal.store}</p>
                    <p className="text-sm text-white/70 mt-1" data-testid={`text-discount-${i}`}>{deal.discount}</p>
                  </div>
                  <div className="text-right">
                    <Badge data-testid={`badge-ends-${i}`} className="bg-accent/20 text-accent mb-2">Ends {deal.ends}</Badge>
                    <Button data-testid={`button-shop-${i}`} size="sm" className="bg-primary hover:bg-primary/90 text-white">Shop</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card data-testid="card-fashion-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">👔 Shopping Smart</p>
              {[
                "Secondhand: Vinted, Depop, Facebook Marketplace save 50-80%",
                "Sale calendars: Max sales Dec-Jan, Jun-Jul (plan ahead!)",
                "Cashback: Earn 2-5% on Hype, Finder, Shopback apps",
                "Price tracking: Set alerts for items you want",
                "Rent instead: Designer rentals vs buying full price",
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
