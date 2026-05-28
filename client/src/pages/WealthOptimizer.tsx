import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, DollarSign, PiggyBank, Building2, LineChart, 
  Target, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight,
  Wallet, Landmark, BarChart3, Shield, Sparkles, RefreshCw
} from "lucide-react";

const superFunds = [
  { name: "Australian Super", fees: 0.65, returns5yr: 8.2, rating: 5, savings: 2400 },
  { name: "REST Super", fees: 0.72, returns5yr: 7.8, rating: 4, savings: 1800 },
  { name: "Hostplus", fees: 0.58, returns5yr: 8.5, rating: 5, savings: 3200 },
  { name: "HESTA", fees: 0.68, returns5yr: 7.9, rating: 4, savings: 2100 },
  { name: "UniSuper", fees: 0.45, returns5yr: 8.8, rating: 5, savings: 4500 },
];

const investmentOptions = [
  { type: "ETFs", name: "VAS (Vanguard Aust Shares)", fee: 0.10, return1yr: 12.4, risk: "Medium" },
  { type: "ETFs", name: "VGS (Vanguard Intl Shares)", fee: 0.18, return1yr: 18.2, risk: "Medium" },
  { type: "ETFs", name: "A200 (BetaShares ASX 200)", fee: 0.07, return1yr: 11.8, risk: "Medium" },
  { type: "Property", name: "Perth Metro REIT", fee: 0.85, return1yr: 8.5, risk: "Medium" },
  { type: "Bonds", name: "Aus Government Bonds", fee: 0.15, return1yr: 4.2, risk: "Low" },
];

const propertyData = [
  { suburb: "Joondalup", medianPrice: 620000, growth1yr: 8.2, rentalYield: 4.8 },
  { suburb: "Rockingham", medianPrice: 485000, growth1yr: 12.4, rentalYield: 5.2 },
  { suburb: "Mandurah", medianPrice: 445000, growth1yr: 15.1, rentalYield: 5.6 },
  { suburb: "Armadale", medianPrice: 395000, growth1yr: 18.3, rentalYield: 6.1 },
  { suburb: "Baldivis", medianPrice: 520000, growth1yr: 10.8, rentalYield: 5.0 },
];

export default function WealthOptimizer() {
  const [currentSuper, setCurrentSuper] = useState(250000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);

  const projectedSavings = {
    superFees: 4500,
    investmentFees: 2800,
    propertyOptimization: 8500,
    total: 15800
  };

  return (
    <div className="min-h-full">
      <motion.div
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 space-y-6 sm:space-y-8 lg:space-y-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] backdrop-blur-sm">
              <TrendingUp className="h-7 w-7 sm:h-8 sm:w-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white">Wealth Optimizer</h1>
              <p className="text-white/60 text-sm sm:text-base lg:text-lg mt-1">Superannuation, Investments & Property Savings</p>
            </div>
            <Badge className="pro-badge self-start sm:self-center">PRO FEATURE</Badge>
          </div>
          
          <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-white/60 text-xs sm:text-sm">Super Fees</p>
                  <p className="text-cyan-400 text-xl sm:text-2xl font-bold">${projectedSavings.superFees.toLocaleString()}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white/60 text-xs sm:text-sm">Investment Fees</p>
                  <p className="text-purple-400 text-xl sm:text-2xl font-bold">${projectedSavings.investmentFees.toLocaleString()}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-white/60 text-xs sm:text-sm">Property</p>
                  <p className="text-cyan-400 text-xl sm:text-2xl font-bold">${projectedSavings.propertyOptimization.toLocaleString()}</p>
                </div>
                <div className="text-center sm:text-left col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                  <p className="text-white/60 text-xs sm:text-sm">Total Annual Savings</p>
                  <p className="savings-display text-2xl sm:text-3xl lg:text-4xl font-bold">${projectedSavings.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="super" className="space-y-6">
          <TabsList className="grid grid-cols-3 bg-zinc-900/80 border border-purple-500/10">
            <TabsTrigger value="super" data-testid="tab-super">
              <PiggyBank className="h-4 w-4 mr-2" />
              Super
            </TabsTrigger>
            <TabsTrigger value="investments" data-testid="tab-investments">
              <LineChart className="h-4 w-4 mr-2" />
              Investments
            </TabsTrigger>
            <TabsTrigger value="property" data-testid="tab-property">
              <Building2 className="h-4 w-4 mr-2" />
              Property
            </TabsTrigger>
          </TabsList>

          <TabsContent value="super" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-zinc-900/80 border-purple-500/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-purple-400" />
                    Your Super Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="number"
                    value={currentSuper}
                    onChange={(e) => setCurrentSuper(Number(e.target.value))}
                    className="text-2xl font-bold"
                    data-testid="input-super-balance"
                  />
                  <div className="text-sm text-white/60">
                    Monthly Contribution: ${monthlyContribution}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900/80 border-cyan-500/10">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-cyan-400" />
                    Fee Savings Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-cyan-400">${projectedSavings.superFees.toLocaleString()}/yr</p>
                  <p className="text-sm text-white/60 mt-2">By switching to a lower-fee fund</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-400" />
                  Super Fund Comparison
                </CardTitle>
                <CardDescription>Compare fees and returns across top WA super funds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {superFunds.map((fund, i) => (
                    <motion.div
                      key={fund.name}
                      className="p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all card-lift"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      data-testid={`super-fund-${i}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">{fund.name}</h4>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-white/60">Fees: <span className="text-purple-400">{fund.fees}%</span></span>
                            <span className="text-white/60">5yr Return: <span className="text-green-400">{fund.returns5yr}%</span></span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="border-green-500/30 text-green-400">
                            Save ${fund.savings}/yr
                          </Badge>
                          <div className="flex mt-2 justify-end">
                            {[...Array(fund.rating)].map((_, j) => (
                              <Sparkles key={j} className="h-3 w-3 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investments" className="space-y-6">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-purple-400" />
                  Low-Cost Investment Options
                </CardTitle>
                <CardDescription>ETFs and funds with the lowest fees and best returns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {investmentOptions.map((inv, i) => (
                    <motion.div
                      key={inv.name}
                      className="p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      data-testid={`investment-${i}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2 text-xs">{inv.type}</Badge>
                          <h4 className="font-semibold text-white">{inv.name}</h4>
                          <div className="flex gap-4 mt-2 text-sm">
                            <span className="text-white/60">Fee: <span className="text-purple-400">{inv.fee}%</span></span>
                            <span className="text-white/60">1yr Return: <span className="text-green-400">+{inv.return1yr}%</span></span>
                            <span className="text-white/60">Risk: <span className={inv.risk === "Low" ? "text-green-400" : "text-yellow-400"}>{inv.risk}</span></span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="border-purple-500/30">
                          Compare
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Shield className="h-10 w-10 text-cyan-400" />
                  <div>
                    <h3 className="font-semibold text-white">Investment Fee Savings</h3>
                    <p className="text-cyan-400 text-2xl font-bold">${projectedSavings.investmentFees.toLocaleString()}/year</p>
                    <p className="text-sm text-white/60">By switching to low-cost index funds</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="property" className="space-y-6">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-400" />
                  Perth Property Market Analysis
                </CardTitle>
                <CardDescription>Top growth suburbs with best rental yields</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {propertyData.map((prop, i) => (
                    <motion.div
                      key={prop.suburb}
                      className="p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      data-testid={`property-${i}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white text-lg">{prop.suburb}</h4>
                          <p className="text-purple-400 font-bold">${prop.medianPrice.toLocaleString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-1 justify-end">
                            <ArrowUpRight className="h-4 w-4 text-green-400" />
                            <span className="text-green-400 font-semibold">+{prop.growth1yr}%</span>
                          </div>
                          <p className="text-sm text-white/60">Yield: {prop.rentalYield}%</p>
                        </div>
                      </div>
                      <Progress value={prop.growth1yr * 5} className="mt-3 h-2" />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Landmark className="h-10 w-10 text-purple-400" />
                  <div>
                    <h3 className="font-semibold text-white">Property Optimization Savings</h3>
                    <p className="text-purple-400 text-2xl font-bold">${projectedSavings.propertyOptimization.toLocaleString()}/year</p>
                    <p className="text-sm text-white/60">Through refinancing and expense optimization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 shadow-[0_4px_20px_rgba(59,130,246,0.4)]" data-testid="btn-optimize">
          <RefreshCw className="h-5 w-5 mr-2" />
          Run Full Wealth Optimization
        </Button>
      </motion.div>
    </div>
  );
}
