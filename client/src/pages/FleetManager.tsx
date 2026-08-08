import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, Fuel, MapPin, TrendingDown, DollarSign, AlertCircle,
  Truck, Route, Clock, BarChart3, Settings2, Zap, RefreshCw,
  Plus, ChevronRight, Target
} from "lucide-react";

const fleetVehicles = [
  { id: 1, name: "Ute 1 - Toyota Hilux", rego: "1ABC 123", fuelType: "Diesel", avgConsumption: 9.2, monthlyKm: 3500, monthlyFuel: 485 },
  { id: 2, name: "Ute 2 - Ford Ranger", rego: "1DEF 456", fuelType: "Diesel", avgConsumption: 10.1, monthlyKm: 2800, monthlyFuel: 425 },
  { id: 3, name: "Van - Toyota Hiace", rego: "1GHI 789", fuelType: "Petrol", avgConsumption: 11.5, monthlyKm: 4200, monthlyFuel: 725 },
  { id: 4, name: "Sedan - Camry", rego: "1JKL 012", fuelType: "Petrol", avgConsumption: 7.8, monthlyKm: 2100, monthlyFuel: 245 },
];

const fuelStations = [
  { name: "Costco Perth Airport", price: 157.6, distance: 12, savings: 28.4 },
  { name: "United Jandakot", price: 159.9, distance: 8, savings: 26.1 },
  { name: "Puma Welshpool", price: 162.5, distance: 5, savings: 23.5 },
  { name: "7-Eleven Cannington", price: 164.9, distance: 3, savings: 21.1 },
  { name: "BP Carousel", price: 169.9, distance: 2, savings: 16.1 },
];

const bulkDeals = [
  { provider: "Shell Card", discount: "4c/L off", requirement: "10+ vehicles", annualSavings: 2800 },
  { provider: "Ampol Card", discount: "3.5c/L off", requirement: "5+ vehicles", annualSavings: 2450 },
  { provider: "BP Plus", discount: "3c/L off + GST", requirement: "Any ABN", annualSavings: 3200 },
  { provider: "Caltex StarCard", discount: "2.5c/L + rewards", requirement: "Business only", annualSavings: 1850 },
];

export default function FleetManager() {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

  const totalMonthlyFuel = fleetVehicles.reduce((sum, v) => sum + v.monthlyFuel, 0);
  const totalMonthlyKm = fleetVehicles.reduce((sum, v) => sum + v.monthlyKm, 0);
  const annualFuelCost = totalMonthlyFuel * 12;
  const potentialSavings = Math.round(annualFuelCost * 0.18);

  return (
    <div className="min-h-full">
      <motion.div
        className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Truck className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">Fleet Fuel Manager</h1>
              <p className="text-white/60 text-sm">Bulk fuel savings for business vehicles</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardContent className="p-4 text-center">
                <Car className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{fleetVehicles.length}</p>
                <p className="text-xs text-white/60">Vehicles</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardContent className="p-4 text-center">
                <Route className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{(totalMonthlyKm / 1000).toFixed(1)}k</p>
                <p className="text-xs text-white/60">km/month</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/80 border-yellow-500/10">
              <CardContent className="p-4 text-center">
                <Fuel className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-400">${totalMonthlyFuel}</p>
                <p className="text-xs text-white/60">Fuel/month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/10 border-cyan-500/20">
              <CardContent className="p-4 text-center">
                <TrendingDown className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-cyan-400">${potentialSavings}</p>
                <p className="text-xs text-white/60">Savings/year</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="vehicles" className="space-y-6">
          <TabsList className="grid grid-cols-3 bg-zinc-900/80 border border-purple-500/10">
            <TabsTrigger value="vehicles" data-testid="tab-vehicles">
              <Car className="h-4 w-4 mr-2" />
              Fleet
            </TabsTrigger>
            <TabsTrigger value="stations" data-testid="tab-stations">
              <MapPin className="h-4 w-4 mr-2" />
              Cheap Fuel
            </TabsTrigger>
            <TabsTrigger value="deals" data-testid="tab-deals">
              <DollarSign className="h-4 w-4 mr-2" />
              Bulk Deals
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Your Fleet</h3>
              <Button variant="outline" size="sm" className="border-purple-500/30" data-testid="btn-add-vehicle">
                <Plus className="h-4 w-4 mr-2" />
                Add Vehicle
              </Button>
            </div>

            <div className="space-y-4">
              {fleetVehicles.map((vehicle, i) => (
                <motion.div
                  key={vehicle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card 
                    className={`bg-zinc-900/80 border-purple-500/10 cursor-pointer transition-all hover:border-purple-500/30 ${
                      selectedVehicle === vehicle.id ? "ring-2 ring-purple-500/50" : ""
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    data-testid={`vehicle-${vehicle.id}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                            {vehicle.name.includes("Van") ? (
                              <Truck className="h-6 w-6 text-purple-400" />
                            ) : (
                              <Car className="h-6 w-6 text-purple-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{vehicle.name}</h4>
                            <div className="flex gap-3 text-sm text-white/60">
                              <span>{vehicle.rego}</span>
                              <Badge variant="outline" className="text-xs">{vehicle.fuelType}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-yellow-400">${vehicle.monthlyFuel}/mo</p>
                          <p className="text-xs text-white/60">{vehicle.avgConsumption}L/100km</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                        <div className="p-2 rounded-lg bg-zinc-800/50">
                          <p className="text-white/60">Monthly km</p>
                          <p className="font-semibold text-white">{vehicle.monthlyKm.toLocaleString()}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-zinc-800/50">
                          <p className="text-white/60">Consumption</p>
                          <p className="font-semibold text-white">{vehicle.avgConsumption}L/100km</p>
                        </div>
                        <div className="p-2 rounded-lg bg-cyan-500/10">
                          <p className="text-white/60">Potential Save</p>
                          <p className="font-semibold text-cyan-400">${Math.round(vehicle.monthlyFuel * 0.15)}/mo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stations" className="space-y-4">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  Cheapest Fuel Near You
                </CardTitle>
                <CardDescription>Prices updated regularly from local stations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {fuelStations.map((station, i) => (
                  <motion.div
                    key={station.name}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    data-testid={`station-${i}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        i === 0 ? "bg-cyan-500/20" : "bg-zinc-700/50"
                      }`}>
                        <Fuel className={`h-5 w-5 ${i === 0 ? "text-cyan-400" : "text-white/60"}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{station.name}</h4>
                        <p className="text-sm text-white/60">{station.distance}km away</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${i === 0 ? "text-cyan-400" : "text-white"}`}>
                        {station.price}¢
                      </p>
                      {i === 0 && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">CHEAPEST</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Target className="h-10 w-10 text-purple-400" />
                    <div>
                      <h3 className="font-semibold text-white">Fill at Cheapest Station</h3>
                      <p className="text-sm text-white/60">Save ${fuelStations[0].savings} per fill across fleet</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-500 to-cyan-500" data-testid="btn-navigate">
                    <MapPin className="h-4 w-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deals" className="space-y-4">
            <Card className="bg-zinc-900/80 border-purple-500/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-purple-400" />
                  Business Fuel Card Deals
                </CardTitle>
                <CardDescription>Exclusive discounts for WA businesses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bulkDeals.map((deal, i) => (
                  <motion.div
                    key={deal.provider}
                    className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/50 border border-white/5 hover:border-purple-500/30 transition-all"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    data-testid={`deal-${i}`}
                  >
                    <div>
                      <h4 className="font-semibold text-white">{deal.provider}</h4>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                          {deal.discount}
                        </Badge>
                        <span className="text-sm text-white/60">{deal.requirement}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-cyan-400">${deal.annualSavings.toLocaleString()}</p>
                      <p className="text-xs text-white/60">per year</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Zap className="h-10 w-10 text-cyan-400" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">Total Fleet Fuel Savings</h3>
                    <p className="text-cyan-400 text-3xl font-bold">${potentialSavings.toLocaleString()}/year</p>
                    <p className="text-sm text-white/60">With optimized routes + bulk discounts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Button className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 shadow-[0_4px_20px_rgba(6,182,212,0.4)]" data-testid="btn-optimize-fleet">
          <RefreshCw className="h-5 w-5 mr-2" />
          Optimize Fleet Fuel Costs
        </Button>
      </motion.div>
    </div>
  );
}
