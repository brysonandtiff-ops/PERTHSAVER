import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Car, Home, Heart, DollarSign, TrendingDown } from "lucide-react";

export default function InsuranceComparison() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Insurance Comparison</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Save up to $2,400/year on Perth insurance</p>
        </div>

        {/* Savings Card */}
        <Card className="bg-gradient-to-br from-accent/20 to-accent/10 border-accent/30 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 font-display font-semibold mb-1">Potential Annual Savings</p>
                <p className="text-4xl font-display font-bold text-accent">$2,380</p>
                <p className="text-sm text-white/60 mt-2">If you switch to better-value policies</p>
              </div>
              <DollarSign className="h-16 w-16 text-accent opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="car" className="space-y-6">
          <TabsList className="bg-white/8 border border-white/15">
            <TabsTrigger value="car">Car</TabsTrigger>
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
          </TabsList>

          {/* Car Insurance */}
          <TabsContent value="car">
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                <p className="text-xs text-white/60 mb-2">YOUR CURRENT</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-semibold text-white mb-1">RACWA (Your Current)</p>
                    <p className="text-sm text-white/60">Comprehensive • Toyota Corolla</p>
                  </div>
                  <p className="text-white font-display font-bold text-xl">$1,250/yr</p>
                </div>
              </div>

              <p className="text-xs text-white/60 uppercase font-semibold">Better Options Found</p>

              {[
                { name: "AAMI", price: "$895", savings: "$355/yr", discount: "35% cheaper" },
                { name: "Shannons", price: "$920", savings: "$330/yr", discount: "26% cheaper" },
                { name: "QBE Insurance", price: "$1,120", savings: "$130/yr", discount: "10% cheaper" },
              ].map((option, i) => (
                <Card key={`option-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 hover:from-white/12 hover:to-white/6">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-white mb-1">{option.name}</p>
                      <div className="flex gap-2">
                        <Badge className="bg-accent/20 text-accent text-xs">{option.discount}</Badge>
                        <span className="text-xs text-white/60">{option.price}/year</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-accent font-bold">{option.savings}</p>
                      <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90 text-white">Get Quote</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Home Insurance */}
          <TabsContent value="home">
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
              <CardContent className="p-6 space-y-4">
                <div className="p-4 bg-white/5 rounded-lg border border-white/8">
                  <p className="text-xs text-white/60 mb-2">YOUR CURRENT</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-display font-semibold text-white">Westpac Home Insurance</p>
                      <p className="text-sm text-white/60">Comprehensive • $600k coverage • Innaloo</p>
                    </div>
                    <p className="text-white font-display font-bold text-xl">$780/yr</p>
                  </div>
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white">Compare Home Policies</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Health Insurance */}
          <TabsContent value="health">
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
              <CardContent className="p-6 space-y-4">
                <p className="text-white/70 mb-4">Get personalized health insurance quotes based on your age, location, and coverage needs.</p>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">Start Comparison</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tips */}
        <Card className="mt-8 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
          <CardContent className="p-6 space-y-3">
            <p className="text-sm font-semibold text-white mb-3">💡 Insurance Savings Tips</p>
            {[
              "Bundle car + home insurance: Save 15-25%",
              "Pay annually instead of monthly: Save 5-10%",
              "Increase excess: Lower premium by 10-20%",
              "Ask for no-claims discount: Most insurers offer 30-50% off",
              "Install security: Home alarm can save $100-200/year",
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
