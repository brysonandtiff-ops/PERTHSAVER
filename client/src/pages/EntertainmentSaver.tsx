import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Film, Music, Gamepad2, DollarSign } from "lucide-react";

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

export default function EntertainmentSaver() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Entertainment Hub</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Share streaming, find free content, compare pricing</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-streaming" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-streaming-label">Streaming Services</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-streaming-count">18</p>
                <p className="text-xs text-white/60 mt-1">Compared</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-entertainment-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-ent-savings-label">Savings Found</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-ent-savings-amount">$82/mo</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-shared" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-shared-label">Shared Plans</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-shared-count">6</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-4" variants={containerVariants}>
          {[
            { name: "Netflix", cost: "$15.99/mo", share: "4 people = $4/person", popular: true },
            { name: "Spotify Family", cost: "$17.99/mo", share: "6 people = $3/person", popular: true },
            { name: "Disney+", cost: "$13.99/mo", share: "4 people = $3.50/person", popular: false },
            { name: "Prime Video", cost: "Free with Prime", share: "Included", popular: false },
          ].map((service, i) => (
            <motion.div key={`service-${i}`} variants={itemVariants}>
              <Card data-testid={`card-service-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white" data-testid={`text-service-${i}`}>{service.name}</p>
                    <p className="text-xs text-white/60" data-testid={`text-share-${i}`}>{service.share}</p>
                  </div>
                  <div className="text-right">
                    {service.popular && <Badge data-testid={`badge-popular-${i}`} className="bg-primary/20 text-primary mb-1 block">Popular</Badge>}
                    <p className="text-white font-bold" data-testid={`text-cost-${i}`}>{service.cost}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card data-testid="card-free-content" className="mt-8 bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="text-white font-display font-bold mb-3">🎬 Free Content</h3>
              <p className="text-sm text-white/70 mb-4">Completely legal, completely free streaming options</p>
              {[
                "ABC iview: Australian TV shows & documentaries",
                "SBS On Demand: Movies, series, docus",
                "Tubi: 10K+ free movies (ad-supported)",
                "Pluto TV: Free live TV channels",
                "Library Apps: Many Australian libraries offer free streaming",
              ].map((item, i) => (
                <p key={`free-${i}`} className="text-xs text-white/70 mb-2" data-testid={`text-free-${i}`}>• {item}</p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
