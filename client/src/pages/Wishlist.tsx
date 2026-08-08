import { useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Bell, Trash2, TrendingDown, AlertCircle } from "lucide-react";

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },
};

const wishlistItems = [
  { id: 1, product: "Avocados (Hass)", store: "Woolworths", currentPrice: "$2.50", targetPrice: "$2.00", savings: "20%", lastPrice: "$4.50", priceHistory: "↓ 44%" },
  { id: 2, product: "Barramundi Fillet 400g", store: "Coles", currentPrice: "$18.00", targetPrice: "$12.00", savings: "33%", lastPrice: "$18.00", priceHistory: "→ stable" },
  { id: 3, product: "Tim Tams 200g", store: "Coles", currentPrice: "$4.50", targetPrice: "$2.50", savings: "44%", lastPrice: "$2.25", priceHistory: "↑ came back" },
];

export default function Wishlist() {
  const [items, setItems] = useState(wishlistItems);

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Price Alerts</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Track products and get notified when prices drop</p>
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 gap-3 mb-6 sm:mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-watching" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <p className="text-white/60 text-xs sm:text-sm" data-testid="text-watching-label">Watching</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary mt-1 sm:mt-2" data-testid="text-watching-count">{items.length}</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-drops" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-drops-label">Price Drops</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-drops-count">2</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-potential-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-savings-label">Potential Savings</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-savings-amount">$8.50</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Active Alerts */}
        <motion.div className="space-y-4" variants={containerVariants}>
          {items.map((item) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Card data-testid={`card-wishlist-${item.id}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:from-white/12 hover:to-white/6 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Heart className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <h3 className="font-display font-semibold text-white" data-testid={`text-product-${item.id}`}>{item.product}</h3>
                          <p className="text-sm text-white/60" data-testid={`text-store-${item.id}`}>{item.store}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 mt-4">
                        <div>
                          <p className="text-xs text-white/50 mb-1">Current</p>
                          <p className="text-sm font-display font-bold text-white" data-testid={`text-current-price-${item.id}`}>{item.currentPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1">Your Target</p>
                          <p className="text-sm font-display font-bold text-primary" data-testid={`text-target-price-${item.id}`}>{item.targetPrice}</p>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1">Potential</p>
                          <Badge data-testid={`badge-savings-${item.id}`} className="bg-accent/20 text-accent text-xs">{item.savings}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-white/50 mb-1">Status</p>
                          <div className="flex items-center gap-1 text-xs text-white/70">
                            {item.priceHistory.includes("↓") ? (
                              <>
                                <TrendingDown className="h-3 w-3 text-accent" />
                                <span className="text-accent font-semibold" data-testid={`text-history-${item.id}`}>{item.priceHistory}</span>
                              </>
                            ) : (
                              <span data-testid={`text-history-${item.id}`}>{item.priceHistory}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-col">
                      <Button data-testid={`button-alert-${item.id}`} className="flex-1 bg-primary hover:bg-primary/90 text-white gap-2 h-9 text-sm">
                        <Bell className="h-4 w-4" />
                        <span>Set Alert</span>
                      </Button>
                      <Button
                        data-testid={`button-remove-${item.id}`}
                        variant="outline"
                        className="flex-1 border-white/20 text-white hover:bg-white/10 gap-2 h-9 text-sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Tips */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-tip" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 flex gap-3">
              <AlertCircle className="h-6 w-6 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white/80 font-semibold mb-1">💡 Pro Tip</p>
                <p className="text-sm text-white/60">Set your target price 20-30% below the regular price to get notified of genuine deals. Most products drop to their lowest in November and December!</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
