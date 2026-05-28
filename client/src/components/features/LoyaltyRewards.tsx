import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Leaf, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoyaltyRewards() {
  const rewards = [
    { program: "Woolworths Rewards", points: 2450, icon: "🎁", tier: "Gold" },
    { program: "Coles Fly Buys", points: 1890, icon: "✈️", tier: "Silver" },
    { program: "Perth Saver Points", points: 580, icon: "🌿", tier: "Active" },
  ];

  return (
    <Card className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-white">
          <Gift className="h-5 w-5 text-primary" />
          Loyalty & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {rewards.map((reward, i) => (
            <div key={`reward-${i}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/8 transition-smooth">
              <div className="text-2xl">{reward.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-white font-display">{reward.program}</div>
                <Badge variant="outline" className="text-xs mt-1 border-white/20 text-white/80 bg-white/5 font-light">{reward.tier}</Badge>
              </div>
              <div className="text-right">
                <div className="font-bold text-primary font-display">{reward.points.toLocaleString()}</div>
                <div className="text-xs text-white/50 font-light">pts</div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" size="sm">
          <Star className="h-4 w-4" /> Redeem Rewards
        </Button>

        <div className="text-xs text-white/70 bg-primary/10 p-3 rounded-lg border border-primary/20 flex items-start gap-2 font-light">
          <Leaf className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>Earn carbon credits by shopping sustainable brands</span>
        </div>
      </CardContent>
    </Card>
  );
}