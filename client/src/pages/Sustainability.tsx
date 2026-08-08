import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Droplet, Zap, TrendingDown, Award, Globe } from "lucide-react";

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

const carbonData = [
  { activity: "Shopped at Spudshed (local)", savings: "2.5 kg CO2" },
  { activity: "Used reusable bags", savings: "1.2 kg CO2" },
  { activity: "Bought local WA produce", savings: "4.1 kg CO2" },
  { activity: "Avoided single-use plastic", savings: "0.8 kg CO2" },
];

export default function Sustainability() {
  return (
    <div className="min-h-screen">
      
      <motion.div
        className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Your Impact</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Shopping sustainably, saving the planet</p>
        </motion.div>

        {/* Impact Stats */}
        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-carbon" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm" data-testid="text-carbon-label">Carbon Avoided</p>
                    <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-carbon-value">24.8 kg</p>
                  </div>
                  <Leaf className="h-10 w-10 text-primary opacity-30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-points" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm" data-testid="text-points-label">Green Points</p>
                    <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-points-value">340</p>
                  </div>
                  <Award className="h-10 w-10 text-accent opacity-30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-water" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm" data-testid="text-water-label">Water Saved</p>
                    <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-water-value">156 L</p>
                  </div>
                  <Droplet className="h-10 w-10 text-purple-400 opacity-30" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Monthly Goal */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-november-goal" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <Award className="h-6 w-6 text-accent" />
                November Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-white/70" data-testid="text-goal">Reduce plastic waste to zero</p>
                  <span className="text-white font-display font-bold" data-testid="text-progress-value">75%</span>
                </div>
                <Progress value={75} className="h-3" />
                <p className="text-xs text-white/50 mt-2" data-testid="text-goal-hint">You need 25 kg CO2 saved more to unlock Carbon Warrior badge</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Impact Breakdown */}
        <motion.div className="grid grid-cols-1 gap-8" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Card data-testid="card-recent-impact" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-white">Recent Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {carbonData.map((item, i) => (
                    <motion.div key={`impact-${i}`} variants={itemVariants} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/10 transition-colors">
                      <Leaf className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm" data-testid={`text-activity-${i}`}>{item.activity}</p>
                        <p className="text-xs text-accent font-semibold mt-1" data-testid={`text-co2-savings-${i}`}>+{item.savings}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card data-testid="card-farmers" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-white">Local Farmers Supported</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Murphy's Organic Farm", produce: "Fresh Vegetables", location: "Margaret River" },
                    { name: "Swan Valley Honey", produce: "Organic Honey", location: "Swan Valley" },
                    { name: "WA Grain Growers", produce: "Wholemeal Products", location: "Northam" },
                  ].map((farmer, i) => (
                    <motion.div key={`farmer-${i}`} variants={itemVariants} className="p-4 bg-white/5 rounded-lg border border-white/8 hover:bg-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-display font-semibold text-white" data-testid={`text-farmer-${i}`}>{farmer.name}</p>
                        <Badge data-testid={`badge-verified-${i}`} className="bg-primary/20 text-primary text-xs">Verified</Badge>
                      </div>
                      <p className="text-sm text-white/60" data-testid={`text-produce-${i}`}>{farmer.produce}</p>
                      <p className="text-xs text-white/40 mt-1" data-testid={`text-location-${i}`}>{farmer.location}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Global Impact */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-global-impact" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-8 text-center">
              <Globe className="h-12 w-12 text-primary mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-display font-bold text-white mb-2">Your Global Impact</h3>
              <p className="text-white/60 max-w-2xl mx-auto mb-4">
                By shopping with Perth Saver, you've planted the equivalent of <span className="text-primary font-semibold">12 trees</span> and supported local farmers across Western Australia. Together, we're building a sustainable future for Perth! 🌱
              </p>
              <Badge className="bg-primary/30 text-primary">Keep up the amazing work!</Badge>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
