import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown, ArrowDown, BadgeCheck, Bell, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const data = [
  { date: "Nov 1", price: 4.50 },
  { date: "Nov 5", price: 4.50 },
  { date: "Nov 10", price: 3.80 },
  { date: "Nov 15", price: 3.00 },
  { date: "Nov 20", price: 2.50 },
  { date: "Today", price: 2.50 },
];

export function PriceTracker() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/8 to-accent/8">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 border-primary/30 text-primary bg-primary/10 hover:bg-primary/20 font-medium">Smart Price Drop</Badge>
            <CardTitle className="font-display text-xl text-white">Avocados (Hass)</CardTitle>
            <CardDescription className="text-white/50 font-light">Woolworths Innaloo • Per unit</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary flex items-center justify-end gap-2">
              $2.50
              <ArrowDown className="h-6 w-6 text-accent animate-bounce" />
            </div>
            <span className="text-sm text-white/50 line-through">$4.50</span>
            <div className="text-xs font-bold text-accent mt-1">Save 44%</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5 pt-5">
        <div className="h-[160px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(168 78% 40%)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(168 78% 40%)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.5)' }} dy={10} />
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(20, 20, 35, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} itemStyle={{ color: 'hsl(168 78% 40%)' }} />
              <Area type="monotone" dataKey="price" stroke="hsl(168 78% 40%)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/8 transition-smooth">
            <div className="flex items-center gap-2 font-medium text-white"><div className="h-2 w-2 rounded-full bg-accent" />Coles</div>
            <span className="font-bold text-white/80">$3.80</span>
          </div>
          <div className="flex items-center justify-between text-sm p-3 bg-primary/15 rounded-lg border border-primary/30">
            <div className="flex items-center gap-2 font-medium text-primary"><div className="h-2 w-2 rounded-full bg-primary" />Woolies</div>
            <span className="font-bold text-primary">$2.50</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold transition-smooth" data-testid="button-set-alert">
            <Bell className="h-3.5 w-3.5 mr-1.5" /> Alert Me
          </Button>
          <Button size="sm" variant="outline" className="flex-1 border-white/15 text-white hover:bg-white/10 transition-smooth" data-testid="button-share">
            <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
          </Button>
        </div>

        <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-3 rounded-lg border border-white/8 font-light">
          <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
          Verified by 12 community members
        </div>
      </CardContent>
    </Card>
  );
}