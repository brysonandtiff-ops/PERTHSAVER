import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChefHat, ShoppingCart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MealPlanner() {
  const meals = [
    { day: "Monday", meal: "Pasta Primavera", savings: "$4.20", items: 6 },
    { day: "Tuesday", meal: "Grilled Barramundi", savings: "$6.50", items: 8 },
    { day: "Wednesday", meal: "Beef Stir Fry", savings: "$3.80", items: 7 },
  ];

  return (
    <Card className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-white">
          <ChefHat className="h-5 w-5 text-primary" />
          Smart Meal Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {meals.map((item, i) => (
            <div key={`meal-${i}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/8 hover:border-primary/30 transition-smooth">
              <div className="flex-1">
                <div className="font-semibold text-sm text-white font-display">{item.day}</div>
                <div className="text-xs text-white/50 flex items-center gap-1 mt-1 font-light">
                  <Leaf className="h-3 w-3" /> {item.meal}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-primary font-display">{item.savings}</div>
                <div className="text-xs text-white/50 font-light">{item.items} items</div>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" size="sm">
          <ShoppingCart className="h-4 w-4" /> Generate Shopping List
        </Button>
      </CardContent>
    </Card>
  );
}