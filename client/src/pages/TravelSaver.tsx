import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Hotel, MapPin, DollarSign, TrendingDown } from "lucide-react";

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

export default function TravelSaver() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Travel Saver</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save 40-60% on flights, hotels & holidays</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-3 mb-6 sm:mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-flights-saved" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <p className="text-white/60 text-xs sm:text-sm" data-testid="text-flights-label">Flights Saved This Year</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-accent mt-1 sm:mt-2" data-testid="text-flights-amount">$1,240</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-hotel-deals" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-hotels-label">Hotel Deals Found</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-hotels-count">84</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-best-deal" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-best-label">Best Deal Achieved</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-best-discount">48% off</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-6" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card data-testid="card-flight-deals" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Plane className="h-6 w-6 text-accent" />
                  Flight Deals (This Week)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { route: "Perth → Melbourne", dates: "Dec 15-22", normal: "$320", deal: "$165", savings: "48%" },
                  { route: "Perth → Sydney", dates: "Jan 8-15", normal: "$380", deal: "$210", savings: "45%" },
                  { route: "Perth → Bali", dates: "Dec 20-27", normal: "$420", deal: "$189", savings: "55%" },
                ].map((flight, i) => (
                  <motion.div key={`flight-${i}`} variants={itemVariants} className="p-4 bg-white/5 rounded-lg border border-white/8 flex justify-between items-center hover:bg-white/10 transition-colors">
                    <div>
                      <p className="font-semibold text-white" data-testid={`text-flight-route-${i}`}>{flight.route}</p>
                      <p className="text-xs text-white/60 mt-1" data-testid={`text-flight-dates-${i}`}>{flight.dates}</p>
                    </div>
                    <div className="text-right">
                      <Badge data-testid={`badge-flight-savings-${i}`} className="bg-accent/20 text-accent mb-2">{flight.savings}</Badge>
                      <p className="text-white"><span className="line-through text-white/50">${flight.normal}</span> <span className="font-bold text-accent" data-testid={`text-flight-price-${i}`}>${flight.deal}</span></p>
                      <Button data-testid={`button-book-${i}`} size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-white">Book</Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card data-testid="card-hotels" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Hotel className="h-6 w-6 text-primary" />
                  Hotels & Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button data-testid="button-compare-hotels" className="w-full bg-primary hover:bg-primary/90 text-white">Compare Hotel Prices</Button>
                <p className="text-xs text-white/70 text-center">Search across Booking.com, Agoda, Hotels.com in one place</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card data-testid="card-travel-hacks" className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
              <CardContent className="p-6 space-y-3">
                <p className="text-sm font-semibold text-white mb-3">✈️ Travel Hacks</p>
                {[
                  "Book Tuesday-Thursday: Cheapest flight days in Australia",
                  "Use flight alerts: Get notified 6 weeks before price drops",
                  "Incognito mode: Prevents price increase from repeat visits",
                  "Off-peak seasons: Jan-Mar, Sep-Nov offer 30-40% discounts",
                  "Package deals: Hotel + flight combos save extra 15-20%",
                ].map((hack, i) => (
                  <p key={`hack-${i}`} className="text-xs text-white/70" data-testid={`text-hack-${i}`}>• {hack}</p>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
