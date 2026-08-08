import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, TrendingDown, Users, DollarSign, AlertCircle } from "lucide-react";

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

export default function BusinessSavings() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Business Savings Hub</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save up to 30% on supplies, services & overheads for Perth businesses</p>
        </motion.div>

        {/* Business Stats */}
        <motion.div className="grid grid-cols-1 gap-3 mb-6 sm:mb-8" variants={containerVariants}>
          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <p className="text-white/60 text-xs sm:text-sm" data-testid="text-accounts-label">Business Accounts Active</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary mt-1 sm:mt-2" data-testid="text-accounts-count">2,400+</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <p className="text-white/60 text-xs sm:text-sm" data-testid="text-savings-label">Avg Savings Per Business</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-accent mt-1 sm:mt-2" data-testid="text-savings-amount">$8,500/yr</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} whileHover="hover">
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <p className="text-white/60 text-xs sm:text-sm" data-testid="text-network-label">B2B Suppliers Network</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-purple-400 mt-1 sm:mt-2" data-testid="text-network-count">350+</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Tabs defaultValue="supplies" className="space-y-6">
            <TabsList data-testid="tabs-business-categories" className="bg-white/8 border border-white/15 backdrop-blur">
              <TabsTrigger value="supplies" data-testid="tab-supplies">Supplies</TabsTrigger>
              <TabsTrigger value="utilities" data-testid="tab-utilities">Utilities</TabsTrigger>
              <TabsTrigger value="staff" data-testid="tab-staff">Staff Benefits</TabsTrigger>
            </TabsList>

            {/* Office Supplies */}
            <TabsContent value="supplies">
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                <p className="text-xs font-semibold text-white/60 uppercase">B2B Supplier Comparison</p>

                {[
                  { name: "Perth Office Supplies Direct", category: "Stationery", discount: "22% vs retail", min: "$500" },
                  { name: "Business Fuel Co-op", category: "Fuel for fleet", discount: "12c/L cheaper", min: "5+ vehicles" },
                  { name: "Catering Wholesale Perth", category: "Kitchen supplies", discount: "18% discount", min: "$200/month" },
                  { name: "Tech Hardware WA", category: "Computers & peripherals", discount: "15-25% off", min: "$1000" },
                ].map((supplier, i) => (
                  <motion.div key={`supplier-${i}`} variants={itemVariants}>
                    <Card data-testid={`card-supplier-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-display font-semibold text-white" data-testid={`text-supplier-name-${i}`}>{supplier.name}</p>
                          <p className="text-xs text-white/60 mt-1" data-testid={`text-supplier-category-${i}`}>{supplier.category}</p>
                        </div>
                        <div className="text-right">
                          <Badge data-testid={`badge-discount-${i}`} className="bg-accent/20 text-accent mb-2">{supplier.discount}</Badge>
                          <p className="text-xs text-white/60" data-testid={`text-min-order-${i}`}>Min order: {supplier.min}</p>
                          <Button data-testid={`button-connect-${i}`} size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-white">Connect</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Utilities */}
            <TabsContent value="utilities">
              <motion.div variants={itemVariants}>
                <Card data-testid="card-utilities" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="font-display text-white">Commercial Electricity & Gas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                      <p className="text-xs text-white/60 mb-2">YOUR CURRENT (Est.)</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white" data-testid="text-provider">Synergy Commercial</p>
                          <p className="text-sm text-white/60">Small retail space</p>
                        </div>
                        <p className="text-white font-bold" data-testid="text-current-cost">$285/month</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Button data-testid="button-quote" className="bg-primary hover:bg-primary/90 text-white">Get Business Quote</Button>
                      <Button data-testid="button-audit" variant="outline" className="border-white/20 text-white hover:bg-white/10">Energy Audit</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Staff Benefits */}
            <TabsContent value="staff">
              <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
                <Card data-testid="card-staff-benefits" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="font-display text-white flex items-center gap-2">
                      <Users className="h-6 w-6 text-primary" />
                      Employee Benefits Programs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: "Employee Lunch Program", desc: "Pre-negotiated meal discounts at Perth restaurants", saving: "15-20% per employee" },
                      { name: "Gym Membership Bulk", desc: "Corporate rates for team fitness", saving: "$5-8/person/month" },
                      { name: "Commute Assistance", desc: "Public transport subsidy programs", saving: "$50-80/month per emp." },
                      { name: "Health Insurance", desc: "Group health insurance rates", saving: "20-30% vs individual" },
                    ].map((benefit, i) => (
                      <motion.div key={`benefit-${i}`} variants={itemVariants}>
                        <Card data-testid={`card-benefit-${i}`} className="bg-white/5 border border-white/8 backdrop-blur">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <p className="font-display font-semibold text-white" data-testid={`text-benefit-name-${i}`}>{benefit.name}</p>
                                <p className="text-xs text-white/60 mt-1" data-testid={`text-benefit-desc-${i}`}>{benefit.desc}</p>
                              </div>
                              <Badge data-testid={`badge-saving-${i}`} className="bg-accent/20 text-accent">{benefit.saving}</Badge>
                            </div>
                            <Button data-testid={`button-learn-${i}`} size="sm" className="mt-3 bg-primary hover:bg-primary/90 text-white">Learn More</Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Business Tips */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-tips" className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 backdrop-blur">
            <CardContent className="p-6 space-y-3">
              <p className="text-sm font-semibold text-white mb-3">💼 Perth Business Savings Tips</p>
              {[
                "Join business co-ops: Get bulk discounts on supplies & services (15-25% savings)",
                "Energy efficiency audit: Free through Business WA - saves 20-30% on utilities",
                "Tax deductions: Track all business expenses for maximum deductions",
                "Supply chain optimization: Compare 3+ quotes for major contracts",
                "Government grants: WA businesses eligible for growth & innovation grants ($5K-$50K)",
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
