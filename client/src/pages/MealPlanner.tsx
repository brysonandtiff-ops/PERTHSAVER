import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChefHat, DollarSign, ShoppingCart, TrendingDown, Calendar,
  Utensils, Clock, Plus, Sparkles, ArrowDown, Check, Wallet
} from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";

const brandColors: Record<string, string> = {
  "Woolworths": "bg-green-500/20 text-green-400 border-green-500/30",
  "Coles": "bg-red-500/20 text-red-400 border-red-500/30",
  "ALDI": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "IGA": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Spudshed": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const WEEKLY_MEALS = [
  { day: "Mon", fullDay: "Monday", meals: ["Spaghetti Bolognese", "Side Salad"], cost: 8.50, saved: 3.20 },
  { day: "Tue", fullDay: "Tuesday", meals: ["Chicken Stir-fry", "Jasmine Rice"], cost: 9.20, saved: 2.80 },
  { day: "Wed", fullDay: "Wednesday", meals: ["Lentil Soup", "Crusty Bread"], cost: 6.80, saved: 4.50 },
  { day: "Thu", fullDay: "Thursday", meals: ["Grilled Fish", "Roast Veggies"], cost: 11.40, saved: 3.60 },
  { day: "Fri", fullDay: "Friday", meals: ["Beef Tacos", "Guacamole"], cost: 10.50, saved: 2.90 },
  { day: "Sat", fullDay: "Saturday", meals: ["BBQ Chicken", "Coleslaw"], cost: 12.30, saved: 4.10 },
  { day: "Sun", fullDay: "Sunday", meals: ["Roast Lamb", "Mashed Potato"], cost: 14.80, saved: 5.20 },
];

const SHOPPING_LIST = [
  { item: "Spaghetti (500g)", store: "Spudshed", price: 1.20, best: true },
  { item: "Tomato Passata (700ml)", store: "ALDI", price: 0.89, best: true },
  { item: "Lean Beef Mince (500g)", store: "Coles", price: 5.50, best: false },
  { item: "Chicken Breast (700g)", store: "Woolworths", price: 7.20, best: true },
  { item: "Jasmine Rice (2kg)", store: "ALDI", price: 2.80, best: true },
  { item: "Mixed Vegetables (1kg)", store: "Spudshed", price: 3.40, best: false },
  { item: "Crusty Bread Loaf", store: "Coles", price: 2.50, best: false },
];

export default function MealPlanner() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [budget] = useState(250);
  const [spent] = useState(73.50);
  const [selectedDay, setSelectedDay] = useState("Mon");

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  const totalSaved = WEEKLY_MEALS.reduce((sum, m) => sum + m.saved, 0);
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const remaining = budget - spent;
  const percentSpent = (spent / budget) * 100;

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="meal-planner-title">
                Meal Planner
              </h1>
              <p className="text-sm text-white/60">AI-optimized meals for Perth prices</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Budget</span>
            </div>
            <div className="text-2xl font-bold text-purple-400" data-testid="stat-budget">
              ${budget}
            </div>
            <div className="text-xs text-white/50">weekly limit</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-white/60" />
              <span className="text-xs text-white/60">Spent</span>
            </div>
            <div className="text-2xl font-bold text-white" data-testid="stat-spent">
              ${spent.toFixed(2)}
            </div>
            <div className="text-xs text-white/50">this week</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60">Remaining</span>
            </div>
            <div className="text-2xl font-bold text-green-400" data-testid="stat-remaining">
              ${remaining.toFixed(2)}
            </div>
            <div className="text-xs text-white/50">available</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/60">Saved</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400" data-testid="stat-saved">
              ${totalSaved.toFixed(2)}
            </div>
            <div className="text-xs text-white/50">with AI optimization</div>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card className="bg-zinc-900/60 border-white/5 p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Weekly Budget Progress</span>
            <span className="text-sm font-medium text-white">{percentSpent.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(percentSpent, 100)}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/50">
            <span>Week of {format(weekStart, "MMM d")}</span>
            <span>{(7 - new Date().getDay()) || 7} days left</span>
          </div>
        </Card>

        {/* Day Tabs */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Weekly Meal Plan</h2>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-1"
              data-testid="button-generate-plan"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate New
            </Button>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 pb-2 min-w-max">
              {WEEKLY_MEALS.map((meal, index) => {
                const isActive = selectedDay === meal.day;
                const dayDate = addDays(weekStart, index);
                return (
                  <Button
                    key={meal.day}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedDay(meal.day)}
                    className={`h-14 px-4 flex-col gap-0.5 ${
                      isActive 
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" 
                        : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                    }`}
                    data-testid={`day-${meal.day.toLowerCase()}`}
                  >
                    <span className="text-xs font-medium">{meal.day}</span>
                    <span className="text-[10px] opacity-70">{format(dayDate, "d")}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Meal Card */}
        {WEEKLY_MEALS.filter(m => m.day === selectedDay).map((meal, index) => (
          <motion.div
            key={meal.day}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-zinc-900/60 border-white/5 p-4 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{meal.fullDay}'s Meals</h3>
                  <p className="text-xs text-white/50 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    Prep time: ~45 mins total
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${meal.cost.toFixed(2)}</div>
                  <div className="text-xs text-green-400 flex items-center justify-end gap-1">
                    <ArrowDown className="w-3 h-3" />
                    Save ${meal.saved.toFixed(2)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                {meal.meals.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center">
                      <Utensils className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{m}</p>
                      <p className="text-xs text-white/50">{i === 0 ? "Main Course" : "Side Dish"}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-white/60">
                      View Recipe
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Shopping List */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Smart Shopping List</h2>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {SHOPPING_LIST.filter(i => i.best).length} Best Deals
            </Badge>
          </div>
          <p className="text-sm text-white/50 mb-4">Optimized for best prices across Perth stores</p>
        </div>

        <div className="space-y-2 mb-6">
          {SHOPPING_LIST.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-zinc-900/60 border-white/5 p-3 hover:scale-[1.01] transition-all cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white/30" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white truncate">{item.item}</p>
                      {item.best && (
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-[10px] px-1.5 py-0">
                          Best
                        </Badge>
                      )}
                    </div>
                    <Badge className={`text-[10px] mt-1 ${brandColors[item.store] || 'bg-slate-500/20 text-slate-400'}`}>
                      {item.store}
                    </Badge>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-bold ${item.best ? 'text-green-400' : 'text-white'}`}>
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Total and Action */}
        <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-purple-500/30 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/70">Shopping List Total</p>
              <p className="text-2xl font-bold text-white">
                ${SHOPPING_LIST.reduce((sum, i) => sum + i.price, 0).toFixed(2)}
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-2"
              data-testid="button-add-to-cart"
            >
              <ShoppingCart className="w-4 h-4" />
              Add All to Cart
            </Button>
          </div>
          <div className="text-xs text-white/50 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Prices optimized across 5 Perth stores
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 p-4 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-2">
            <Calendar className="w-4 h-4" />
            <span>Week of {format(weekStart, "MMMM d, yyyy")}</span>
          </div>
          <p className="text-xs text-white/40">
            Meal plans generated using AI based on your preferences and Perth store prices
          </p>
        </div>
      </div>
    </div>
  );
}
