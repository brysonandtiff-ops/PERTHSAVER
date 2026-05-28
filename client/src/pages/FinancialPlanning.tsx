import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Home, DollarSign, Target } from "lucide-react";

export default function FinancialPlanning() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Financial Planning</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Refinancing, mortgage optimization & financial goals for Perth</p>
        </div>

        {/* Quick Wins */}
        <div className="space-y-4 mb-8">
          <p className="text-xs font-semibold text-white/60 uppercase">Quick Savings Opportunities</p>

          <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-white text-sm sm:text-base md:text-lg">Refinance Your Mortgage</h3>
                  <p className="text-xs sm:text-sm text-white/70 mt-0.5 sm:mt-1 truncate">Current rate: 5.45% | Best available: 4.89%</p>
                </div>
                <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-accent opacity-40 shrink-0" />
              </div>
              <div className="bg-white/10 p-2 sm:p-3 md:p-4 rounded-lg mb-3 sm:mb-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs text-white/60">Savings/month</p>
                    <p className="text-xl font-bold text-accent">$285</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">Annual savings</p>
                    <p className="text-xl font-bold text-accent">$3,420</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60">10-year total</p>
                    <p className="text-xl font-bold text-accent">$34,200+</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-accent hover:bg-accent/90 text-background font-bold">Get Refinance Quote</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-bold text-white">Salary Sacrifice (Superannuation)</h3>
                  <p className="text-sm text-white/70 mt-1">Tax-effective retirement savings: 37% tax vs 15% in super</p>
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-lg mb-4">
                <p className="text-sm text-white/80">Salary sacrifice $5,000/year</p>
                <p className="text-xs text-white/60 mt-1">Tax saving: $1,100/year</p>
              </div>
              <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">Calculate Savings</Button>
            </CardContent>
          </Card>
        </div>

        {/* Financial Goals */}
        <div className="space-y-4 mb-8">
          <p className="text-xs font-semibold text-white/60 uppercase">Your Financial Goals</p>

          {[
            { goal: "Emergency Fund", target: 15000, current: 8500, deadline: "Mar 2025", priority: "high" },
            { goal: "Holiday to Bali", target: 5000, current: 2100, deadline: "Jul 2025", priority: "medium" },
            { goal: "Home Deposit", target: 100000, current: 45000, deadline: "Dec 2026", priority: "high" },
          ].map((goal, i) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <Card key={`goal-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-semibold text-white">{goal.goal}</h3>
                        <Badge className={goal.priority === 'high' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'} >
                          {goal.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-white/60">Due: {goal.deadline}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">${goal.current.toLocaleString()}</p>
                      <p className="text-xs text-white/60">of ${goal.target.toLocaleString()}</p>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-xs text-white/60">{progress.toFixed(0)}% complete</p>
                </CardContent>
              </Card>
            );
          })}

          <Button className="w-full bg-primary hover:bg-primary/90 text-white">Add New Goal</Button>
        </div>

        {/* Financial Tips */}
        <Card className="bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <CardContent className="p-6 space-y-3">
            <p className="text-sm font-semibold text-white mb-3">📊 Perth Financial Optimization</p>
            {[
              "Refinance quarterly: Check rates every 3 months for best deals",
              "First Home Scheme: WA first buyers get up to $10K stamp duty concession",
              "Energy rebates: WA government rebates for solar, efficiency upgrades",
              "Investment property: Perth offers 6-8% rental yields in growing suburbs",
              "Offset account: Redraw on offset to reduce interest paid on mortgages",
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
