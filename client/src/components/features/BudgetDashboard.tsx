import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Wallet, TrendingUp } from "lucide-react";

export function BudgetDashboard() {
  const budget = {
    weeklyLimit: 250,
    spent: 187,
    saved: 63,
  };

  const categories = [
    { name: "Vegetables", spent: 45, limit: 60, color: "bg-accent" },
    { name: "Proteins", spent: 62, limit: 85, color: "bg-primary" },
    { name: "Dairy", spent: 38, limit: 50, color: "bg-primary/70" },
    { name: "Pantry", spent: 42, limit: 55, color: "bg-accent/70" },
  ];

  const percentage = Math.round((budget.spent / budget.weeklyLimit) * 100);

  return (
    <Card className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-white">
          <Wallet className="h-5 w-5 text-primary" />
          Weekly Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Spent this week</span>
            <span className="text-sm font-bold text-primary font-display">${budget.spent}</span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="flex items-center justify-between text-xs text-white/60 font-light">
            <span>${budget.spent} of ${budget.weeklyLimit}</span>
            <span className="flex items-center gap-1 text-accent font-semibold">
              <TrendingUp className="h-3 w-3 rotate-180" /> Save ${budget.saved}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-white font-display">{cat.name}</span>
                <span className="text-white/50 font-light">${cat.spent} / ${cat.limit}</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color}`}
                  style={{ width: `${(cat.spent / cat.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}