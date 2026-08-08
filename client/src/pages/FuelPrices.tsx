import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fuel, MapPin, TrendingDown, Clock, ExternalLink, Search, Droplets, Zap } from "lucide-react";
import { DataProvenanceBadge } from "@/components/DataProvenanceBadge";

interface FuelPriceRaw {
  id: string;
  stationName: string;
  brand: string;
  suburb: string;
  address: string;
  unleadedPrice: string | null;
  dieselPrice: string | null;
  premiumPrice: string | null;
  lpgPrice: string | null;
  lastUpdated: string | null;
}

interface FuelPrice {
  id: string;
  stationName: string;
  brand: string;
  suburb: string;
  address: string;
  unleadedPrice: number | null;
  dieselPrice: number | null;
  premiumPrice: number | null;
  lpgPrice: number | null;
}

function parsePrice(val: string | null): number | null {
  if (!val) return null;
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
}

function mapFuelPrice(raw: FuelPriceRaw): FuelPrice {
  return {
    id: raw.id,
    stationName: raw.stationName,
    brand: raw.brand,
    suburb: raw.suburb,
    address: raw.address,
    unleadedPrice: parsePrice(raw.unleadedPrice),
    dieselPrice: parsePrice(raw.dieselPrice),
    premiumPrice: parsePrice(raw.premiumPrice),
    lpgPrice: parsePrice(raw.lpgPrice),
  };
}

const brandColors: Record<string, string> = {
  "BP": "bg-green-500/20 text-green-400 border-green-500/30",
  "Shell": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  "Caltex": "bg-red-500/20 text-red-400 border-red-500/30",
  "Ampol": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "7-Eleven": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  "United": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Puma": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
};

export default function FuelPrices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fuelType, setFuelType] = useState<"unleaded" | "diesel" | "premium">("unleaded");

  const { data, isLoading, refetch } = useQuery<{ 
    prices: FuelPriceRaw[]; 
    lastUpdated: string;
    fuelType?: string;
    source?: string;
  }>({
    queryKey: ["/api/fuel/prices", fuelType],
    queryFn: async () => {
      const res = await fetch(`/api/fuel/prices?fuelType=${fuelType}`);
      if (!res.ok) throw new Error("Failed to fetch fuel prices");
      return res.json();
    },
  });
  
  const isLiveData = data?.source === 'FuelWatch WA Government';

  const prices: FuelPrice[] = (data?.prices || []).map(mapFuelPrice);
  
  const filteredPrices = prices
    .filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.stationName.toLowerCase().includes(q) || 
             p.suburb.toLowerCase().includes(q) ||
             p.brand.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const priceA = fuelType === "unleaded" ? a.unleadedPrice : 
                     fuelType === "diesel" ? a.dieselPrice : a.premiumPrice;
      const priceB = fuelType === "unleaded" ? b.unleadedPrice : 
                     fuelType === "diesel" ? b.dieselPrice : b.premiumPrice;
      return (priceA || 999) - (priceB || 999);
    });

  const getPrice = (p: FuelPrice): number | null => {
    if (fuelType === "unleaded") return p.unleadedPrice;
    if (fuelType === "diesel") return p.dieselPrice;
    return p.premiumPrice;
  };

  const cheapestPrice = filteredPrices.find(p => getPrice(p) !== null);
  
  const pricesWithValue = filteredPrices.filter(p => getPrice(p) !== null);
  const avgPrice = pricesWithValue.length > 0 
    ? pricesWithValue.reduce((sum, p) => sum + (getPrice(p) || 0), 0) / pricesWithValue.length
    : 0;

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) return '-';
    return `${price.toFixed(1)}c`;
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <Fuel className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="fuel-title">
                  Perth Fuel Prices
                </h1>
                <p className="text-sm text-white/60">Compare prices across WA stations</p>
              </div>
            </div>
            <DataProvenanceBadge
              sourceName="FuelWatch WA"
              confidence="official"
              fetchedAt={data?.lastUpdated}
              isStale={!isLiveData}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60">Cheapest</span>
            </div>
            <div className="text-2xl font-bold text-green-400" data-testid="cheapest-price">
              {cheapestPrice ? formatPrice(getPrice(cheapestPrice)) : '-'}
            </div>
            <div className="text-xs text-white/50 truncate">{cheapestPrice?.suburb}</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/60">Average</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {avgPrice > 0 ? `${avgPrice.toFixed(1)}c` : '-'}
            </div>
            <div className="text-xs text-white/50">per litre</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-white/60">Best Day</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">Tuesday</div>
            <div className="text-xs text-white/50">lowest prices</div>
          </Card>
        </div>

        <Card className={`${isLiveData ? 'bg-gradient-to-r from-green-500/10 to-cyan-500/10 border-green-500/20' : 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/20'} p-4 mb-6`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg ${isLiveData ? 'bg-green-500/20' : 'bg-orange-500/20'} flex items-center justify-center flex-shrink-0`}>
              <ExternalLink className={`w-4 h-4 ${isLiveData ? 'text-green-400' : 'text-orange-400'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-white">FuelWatch WA</p>
                {isLiveData && (
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">LIVE API</span>
                )}
              </div>
              <p className="text-xs text-white/60 mb-2">
                Prices updated daily at 2:30pm. Fill up Tuesday for best savings!
              </p>
              <a 
                href="https://www.fuelwatch.wa.gov.au" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-orange-400 hover:text-orange-300"
              >
                Visit FuelWatch.wa.gov.au →
              </a>
            </div>
          </div>
        </Card>

        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search suburb or station..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 h-10"
              data-testid="input-search"
            />
          </div>
          <Select value={fuelType} onValueChange={(v) => setFuelType(v as typeof fuelType)}>
            <SelectTrigger className="w-32 bg-white/5 border-white/10 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              <SelectItem value="unleaded">ULP 91</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
              <SelectItem value="premium">Premium 98</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="bg-zinc-900/60 border-white/5 p-4 animate-pulse">
                <div className="h-16 bg-white/5 rounded" />
              </Card>
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <Card className="bg-zinc-900/60 border-white/5 p-8 text-center">
            <Fuel className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/60">No fuel prices found</p>
            <p className="text-xs text-white/40 mt-1">Try a different search or check back later</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredPrices.map((station, idx) => {
              const price = getPrice(station);
              const isCheapest = idx === 0;
              const savings = cheapestPrice && price ? ((avgPrice - price) / 100 * 50).toFixed(2) : null;
              
              return (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className={`bg-zinc-900/60 border-white/5 p-4 ${isCheapest ? 'ring-1 ring-green-500/30' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${brandColors[station.brand] || 'bg-white/10 text-white/70'}`}>
                          {station.brand.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{station.stationName}</p>
                            {isCheapest && (
                              <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">
                                Cheapest
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-white/50">
                            <MapPin className="w-3 h-3" />
                            {station.suburb}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${isCheapest ? 'text-green-400' : 'text-white'}`}>
                          {formatPrice(price)}
                        </p>
                        {savings && parseFloat(savings) > 0 && (
                          <p className="text-xs text-green-400">Save ${savings}/50L</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
