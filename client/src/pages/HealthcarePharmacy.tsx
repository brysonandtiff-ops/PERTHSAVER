import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Pill, DollarSign } from "lucide-react";

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

export default function HealthcarePharmacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Healthcare & Pharmacy</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save 40-70% on prescriptions, doctors, dentists & health</p>
        </motion.div>

        <motion.div className="grid grid-cols-1 gap-4 mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-pharmacy-savings" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-pharmacy-label">Pharmacy Savings</p>
                <p className="text-3xl font-display font-bold text-primary mt-2" data-testid="text-pharmacy-amount">$156/yr</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-doctors" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-doctors-label">Better Doctors</p>
                <p className="text-3xl font-display font-bold text-accent mt-2" data-testid="text-doctors-count">18</p>
                <p className="text-xs text-white/60 mt-1">Bulk billing</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card data-testid="card-dental" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-6">
                <p className="text-white/60 text-sm" data-testid="text-dental-label">Dental Savings</p>
                <p className="text-3xl font-display font-bold text-purple-400 mt-2" data-testid="text-dental-amount">45%</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div className="space-y-4" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Pharmacy Deals</p>
          {[
            { med: "Paracetamol 500mg (100 tabs)", woolies: "$3.50", chemist: "$8.99", discount: "61% cheaper" },
            { med: "Ibuprofen 400mg (24 tabs)", woolies: "$4.20", chemist: "$12.50", discount: "66% cheaper" },
            { med: "Multivitamins (60 caps)", woolies: "$6.99", chemist: "$18.99", discount: "63% cheaper" },
          ].map((item, i) => (
            <motion.div key={`med-${i}`} variants={itemVariants}>
              <Card data-testid={`card-med-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-white" data-testid={`text-med-${i}`}>{item.med}</p>
                      <p className="text-sm text-white/70 mt-1" data-testid={`text-chemist-price-${i}`}>Chemist: ${item.chemist}</p>
                    </div>
                    <Badge data-testid={`badge-discount-${i}`} className="bg-accent/20 text-accent">{item.discount}</Badge>
                  </div>
                  <p className="text-sm text-primary font-bold" data-testid={`text-woolies-price-${i}`}>Buy at Woolies: {item.woolies}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card data-testid="card-health-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">⚕️ Health Money Hacks</p>
              {[
                "PBS pricing: Prescription meds cheaper with Medicare",
                "Bulk billing GPs: Save $50-80 per visit in Perth",
                "Preventative care: Free health checks = avoid expensive treatments",
                "Dental schools: UWA dental students 50% cheaper + supervised",
                "Telehealth: $35-50 vs $80 in-clinic for many conditions",
              ].map((hack, i) => (
                <p key={`hack-${i}`} className="text-xs text-white/70" data-testid={`text-hack-${i}`}>• {hack}</p>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      <Footer />
    </div>
  );
}
