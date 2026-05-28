import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Fuel, TrendingDown } from "lucide-react";

export function FuelTracker() {
  return (
    <Card className="bg-gradient-to-br from-white/8 to-white/4 backdrop-blur hover:from-white/12 hover:to-white/6 transition-smooth border-white/8 hover:border-white/12">
      <CardHeader>
        <CardTitle className="font-display flex items-center gap-2 text-white">
          <Fuel className="h-5 w-5 text-primary" />
          Fuel & EV Prices
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/8 transition-smooth">
            <div className="space-y-1">
              <div className="font-semibold flex items-center gap-2 text-white font-display">
                <Fuel className="h-4 w-4 text-accent" />
                Unleaded 91
              </div>
              <p className="text-xs text-white/50 font-light">Shell Innaloo</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-white font-display">$2.15/L</div>
              <div className="text-xs text-accent flex items-center justify-end gap-1 font-semibold">
                <TrendingDown className="h-3 w-3" /> -12¢
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/8 hover:bg-white/8 transition-smooth">
            <div className="space-y-1">
              <div className="font-semibold flex items-center gap-2 text-white font-display">
                <Zap className="h-4 w-4 text-primary" />
                EV Charging 
              </div>
              <p className="text-xs text-white/50 font-light">BP Pulse Subiaco</p>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-white font-display">$0.68/kWh</div>
              <div className="text-xs text-accent flex items-center justify-end gap-1 font-semibold">
                <TrendingDown className="h-3 w-3" /> Best WA rate
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/60 bg-white/5 p-3 rounded-lg border border-white/8 font-light">
          Real-time prices at Shell, BP, Caltex, Puma & Tesla Superchargers across Perth
        </div>
      </CardContent>
    </Card>
  );
}