import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, TrendingUp, Zap } from "lucide-react";

export default function CashbackCenter() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Cashback Center</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Earn cashback at Perth retailers, get paid weekly</p>
        </div>

        {/* Earning Stats */}
        <div className="grid grid-cols-1 gap-3 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-white/60 text-xs sm:text-sm">Cashback This Month</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-accent mt-1 sm:mt-2">$47.50</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-white/60 text-xs sm:text-sm">Total Earned</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-primary mt-1 sm:mt-2">$285</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <p className="text-white/60 text-xs sm:text-sm">Next Payout</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-purple-400 mt-1 sm:mt-2">Friday</p>
              <p className="text-xs text-white/50 mt-0.5 sm:mt-1">$47.50</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Cashback Programs */}
        <div className="space-y-4 mb-8">
          <p className="text-xs font-semibold text-white/60 uppercase">Your Active Programs</p>

          {[
            { name: "Woolworths Rewards", rate: "1 point per $1", value: "1% cashback", status: "active", earned: "$18.50" },
            { name: "Coles More Rewards", rate: "1 point per $1", value: "1% cashback", status: "active", earned: "$12.30" },
            { name: "ALDI App Offers", rate: "Varies", value: "2-5% cashback", status: "active", earned: "$9.80" },
            { name: "IGA Extra Rewards", rate: "1 point per $1", value: "0.5% cashback", status: "active", earned: "$6.90" },
          ].map((program, i) => (
            <Card key={`program-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-display font-semibold text-white">{program.name}</p>
                    <p className="text-xs text-white/60 mt-1">{program.rate}</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary">{program.value}</Badge>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  <p className="text-xs text-white/70">Earned: <span className="text-accent font-bold">{program.earned}</span></p>
                  <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">Link Account</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Programs */}
        <div className="space-y-4 mb-8">
          <p className="text-xs font-semibold text-white/60 uppercase">Recommended to Add</p>

          {[
            { name: "Spudshed Loyalty", rate: "Up to 10% off", available: true },
            { name: "Shell Fuel Rewards", rate: "2c per litre", available: true },
            { name: "Commonwealth Bank Cashback", rate: "Up to 2% cashback", available: false },
          ].map((program, i) => (
            <Card key={`recommended-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{program.name}</p>
                  <p className="text-xs text-white/60 mt-1">{program.rate}</p>
                </div>
                <Button 
                  size="sm" 
                  className={program.available ? "bg-primary hover:bg-primary/90 text-white" : "border-white/20 text-white/50 opacity-50 cursor-not-allowed"}
                  disabled={!program.available}
                >
                  {program.available ? "Add" : "Coming Soon"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Optimization Tips */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <CardContent className="p-6 space-y-3">
            <p className="text-sm font-semibold text-white mb-3">💰 Maximize Your Cashback</p>
            {[
              "Use correct loyalty cards: Match card to store for best rates",
              "Stack programs: Combine loyalty points + cashback apps",
              "Time your shopping: Bonus cashback periods (Fridays, holiday seasons)",
              "Link payment methods: Auto-claim cashback from credit/debit cards",
              "Refer friends: Earn bonus for each friend who joins a program",
            ].map((tip, i) => (
              <p key={`tip-${i}`} className="text-xs text-white/70">• {tip}</p>
            ))}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
