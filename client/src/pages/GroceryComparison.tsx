import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCardSkeleton } from "@/components/Skeleton";
import { ErrorState } from "@/components/ErrorState";
import { handleApiError } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, TrendingDown, TrendingUp, ShoppingCart, Plus, Tag, Percent, 
  Sparkles, Store, Package, MapPin, Map as MapIcon, List, Clock,
  Apple, Beef, Milk, ShoppingBasket, Wheat, IceCream, Coffee, Cookie,
  Home, Droplets, Baby, PawPrint, ArrowDown, Navigation, ChevronRight
} from "lucide-react";
import { debounce } from "@/lib/performance";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface CatalogProduct {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  subcategory: string | null;
  unit: string | null;
  size: string | null;
  storeProductId: string;
  currentPrice: string;
  wasPrice: string | null;
  unitPrice: string | null;
  isOnSpecial: boolean;
  specialType: string | null;
  inStock: boolean;
  storeName: string;
  storeSlug: string;
}

interface StoreInfo {
  id: string;
  name: string;
  slug: string;
  type: string;
  priceRating: number | null;
  isLocal: boolean;
}

interface StoreLocation {
  id: string;
  name: string;
  brand: string;
  address: string;
  suburb: string;
  latitude: number;
  longitude: number;
  avgPrice: number;
  productCount: number;
}

const PERTH_STORES: StoreLocation[] = [
  { id: "1", name: "Woolworths Cannington", brand: "Woolworths", address: "Carousel Shopping Centre", suburb: "Cannington", latitude: -32.0171, longitude: 115.9373, avgPrice: 4.50, productCount: 230 },
  { id: "2", name: "Coles Morley", brand: "Coles", address: "Galleria Shopping Centre", suburb: "Morley", latitude: -31.8939, longitude: 115.9055, avgPrice: 4.35, productCount: 220 },
  { id: "3", name: "ALDI Fremantle", brand: "ALDI", address: "45 Adelaide St", suburb: "Fremantle", latitude: -32.0554, longitude: 115.7482, avgPrice: 3.80, productCount: 180 },
  { id: "4", name: "Woolworths Joondalup", brand: "Woolworths", address: "Lakeside Joondalup", suburb: "Joondalup", latitude: -31.7467, longitude: 115.7661, avgPrice: 4.55, productCount: 225 },
  { id: "5", name: "Coles Armadale", brand: "Coles", address: "Armadale Central", suburb: "Armadale", latitude: -32.1478, longitude: 116.0152, avgPrice: 4.40, productCount: 215 },
  { id: "6", name: "IGA Scarborough", brand: "IGA", address: "189 Scarborough Beach Rd", suburb: "Scarborough", latitude: -31.8936, longitude: 115.7596, avgPrice: 4.95, productCount: 150 },
  { id: "7", name: "ALDI Midland", brand: "ALDI", address: "Great Eastern Hwy", suburb: "Midland", latitude: -31.8884, longitude: 116.0094, avgPrice: 3.75, productCount: 175 },
  { id: "8", name: "Woolworths Rockingham", brand: "Woolworths", address: "Rockingham City", suburb: "Rockingham", latitude: -32.2773, longitude: 115.7299, avgPrice: 4.48, productCount: 228 },
  { id: "9", name: "Coles Innaloo", brand: "Coles", address: "Westfield Innaloo", suburb: "Innaloo", latitude: -31.8903, longitude: 115.7966, avgPrice: 4.32, productCount: 218 },
  { id: "10", name: "ALDI Victoria Park", brand: "ALDI", address: "Albany Hwy", suburb: "Victoria Park", latitude: -31.9763, longitude: 115.8984, avgPrice: 3.82, productCount: 172 },
];

const CATEGORIES = [
  { id: "all", name: "All", icon: ShoppingBasket },
  { id: "fruits", name: "Fruits", icon: Apple },
  { id: "vegetables", name: "Veggies", icon: Package },
  { id: "meat", name: "Meat", icon: Beef },
  { id: "dairy", name: "Dairy", icon: Milk },
  { id: "bakery", name: "Bakery", icon: Wheat },
  { id: "frozen", name: "Frozen", icon: IceCream },
  { id: "drinks", name: "Drinks", icon: Coffee },
];

const CATEGORY_DISPLAY: Record<string, string> = {
  fruits: "Fruits",
  vegetables: "Vegetables",
  dairy: "Dairy & Eggs",
  meat: "Meat & Poultry",
  pantry: "Pantry",
  bakery: "Bread & Bakery",
  frozen: "Frozen Foods",
  drinks: "Drinks",
  snacks: "Snacks & Confectionery",
  household: "Household",
  personal_care: "Personal Care",
  baby: "Baby",
  pet: "Pet Supplies",
};

const brandColors: Record<string, string> = {
  "Woolworths": "bg-green-500/20 text-green-400 border-green-500/30",
  "Coles": "bg-red-500/20 text-red-400 border-red-500/30",
  "ALDI": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "IGA": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "Spudshed": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const StoreMap = ({ stores, selectedStore, onSelect }: { stores: StoreLocation[], selectedStore: string | null, onSelect: (id: string) => void }) => {
  const cheapestStore = stores.reduce((min, s) => s.avgPrice < min.avgPrice ? s : min, stores[0]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-xl overflow-hidden bg-zinc-900/80 border border-white/10 mb-6">
      <svg viewBox="115.6 -32.35 0.55 0.65" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <rect width="100%" height="100%" fill="#18181b" />
        
        <g stroke="rgba(168,85,247,0.1)" strokeWidth="0.001">
          {[...Array(10)].map((_, i) => (
            <line key={`h${i}`} x1="115.6" y1={-32.35 + i * 0.065} x2="116.15" y2={-32.35 + i * 0.065} />
          ))}
          {[...Array(10)].map((_, i) => (
            <line key={`v${i}`} x1={115.6 + i * 0.055} y1="-32.35" x2={115.6 + i * 0.055} y2="-31.7" />
          ))}
        </g>

        {stores.map((store) => {
          const isSelected = selectedStore === store.id;
          const isCheapest = store.id === cheapestStore.id;
          
          return (
            <g key={store.id} onClick={() => onSelect(store.id)} style={{ cursor: "pointer" }}>
              {isCheapest && (
                <circle 
                  cx={store.longitude} 
                  cy={store.latitude} 
                  r="0.012" 
                  fill="none" 
                  stroke="rgba(34, 197, 94, 0.4)" 
                  strokeWidth="0.003"
                />
              )}
              
              <circle 
                cx={store.longitude} 
                cy={store.latitude} 
                r={isSelected ? "0.014" : "0.01"} 
                fill={isSelected ? "#A855F7" : isCheapest ? "#22C55E" : "#06B6D4"}
                opacity={isSelected ? 1 : 0.85}
                className="transition-all"
              />
              
              <text 
                x={store.longitude} 
                y={store.latitude - 0.018} 
                textAnchor="middle" 
                fontSize="0.007" 
                fill="white"
                fontWeight="bold"
              >
                ${store.avgPrice.toFixed(2)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
        <div className="text-xs text-white/60 mb-1">Perth Grocery Stores Map</div>
        <div className="text-sm text-white">Tap stores for details • Green = Cheapest Average</div>
      </div>

      <div className="absolute top-3 right-3 flex flex-col gap-1">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-[10px] text-white/80">Cheapest</span>
        </div>
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-[10px] text-white/80">Store</span>
        </div>
      </div>
    </div>
  );
};

export default function GroceryComparison() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [onSpecialOnly, setOnSpecialOnly] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [selectedMapStore, setSelectedMapStore] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"savings" | "price" | "name">("savings");

  const { data: storesData = [] } = useQuery<StoreInfo[]>({
    queryKey: ["/api/stores", "grocery"],
    queryFn: async () => {
      const res = await fetch("/api/stores?type=grocery");
      if (!res.ok) throw new Error("Failed to fetch stores");
      const data = await res.json();
      return data.stores || [];
    },
  });

  const { data: products = [], isLoading, isError, error, refetch } = useQuery<CatalogProduct[]>({
    queryKey: ["/api/catalog/all-prices", selectedStore, selectedCategory, onSpecialOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedStore !== "All") {
        const store = storesData.find(s => s.name === selectedStore);
        if (store) params.set("store", store.slug);
      }
      if (selectedCategory !== "all") params.set("category", selectedCategory);
      if (onSpecialOnly) params.set("onSpecial", "true");
      
      const res = await fetch(`/api/catalog/all-prices?${params}`);
      if (!res.ok) throw new Error("Failed to fetch prices");
      const data = await res.json();
      return data.products || [];
    },
    enabled: storesData.length > 0 || selectedStore === "All",
  });

  useEffect(() => {
    const debouncedFn = debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300);
    debouncedFn(searchQuery);
  }, [searchQuery]);

  const filteredProducts = useMemo(() => {
    if (!debouncedSearch) return products;
    const lower = debouncedSearch.toLowerCase();
    return products.filter((product) => 
      product.name.toLowerCase().includes(lower) ||
      product.brand?.toLowerCase().includes(lower) ||
      product.category.toLowerCase().includes(lower)
    );
  }, [products, debouncedSearch]);

  const productComparisons = useMemo(() => {
    const grouped = filteredProducts.reduce((acc, product) => {
      const key = product.id;
      if (!acc[key]) {
        acc[key] = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          category: product.category,
          subcategory: product.subcategory,
          unit: product.unit,
          size: product.size,
          stores: [] as CatalogProduct[],
        };
      }
      acc[key].stores.push(product);
      return acc;
    }, {} as Record<string, { id: string; name: string; brand: string | null; category: string; subcategory: string | null; unit: string | null; size: string | null; stores: CatalogProduct[] }>);

    let result = Object.values(grouped).map((item) => {
      const prices = item.stores.map(s => parseFloat(s.currentPrice));
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
      const cheapestStore = item.stores.find(s => parseFloat(s.currentPrice) === minPrice);
      const hasSpecial = item.stores.some(s => s.isOnSpecial);
      
      return {
        ...item,
        minPrice,
        maxPrice,
        avgPrice,
        cheapestStore,
        hasSpecial,
        potentialSavings: maxPrice - minPrice,
        savingsPercent: maxPrice > 0 ? ((maxPrice - minPrice) / maxPrice * 100) : 0,
      };
    });

    result.sort((a, b) => {
      if (sortBy === "savings") return b.savingsPercent - a.savingsPercent;
      if (sortBy === "price") return a.minPrice - b.minPrice;
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [filteredProducts, sortBy]);

  const cheapestProduct = productComparisons[0];
  const avgSavings = productComparisons.length > 0 
    ? productComparisons.reduce((sum, p) => sum + p.savingsPercent, 0) / productComparisons.length
    : 0;

  const handleAddToMealPlan = async (product: { name: string; storeName: string; price: string; brand: string | null; unit: string | null }) => {
    try {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      const weekStart = new Date(now.setDate(diff));
      weekStart.setHours(0, 0, 0, 0);

      const res = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          weekStart: weekStart.toISOString(),
          meals: {
            groceryItems: [{
              productName: product.name,
              storeName: product.storeName,
              price: product.price,
              brand: product.brand,
              unit: product.unit,
              addedAt: new Date().toISOString()
            }]
          },
          estimatedCost: product.price
        })
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please log in to add items to your meal plan');
        }
        throw new Error('Failed to add to meal plan');
      }

      toast({
        title: "Added to Meal Plan",
        description: `${product.name} from ${product.storeName} added successfully!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add to meal plan',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="grocery-title">
                  Grocery Compare
                </h1>
                <p className="text-sm text-white/60">Real-time prices across Perth stores</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs gap-1">
              <Clock className="w-3 h-3" />
              Updated today
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60">Best Savings</span>
            </div>
            <div className="text-2xl font-bold text-green-400" data-testid="best-savings">
              {cheapestProduct ? `${cheapestProduct.savingsPercent.toFixed(0)}%` : '-'}
            </div>
            <div className="text-xs text-white/50 truncate">{cheapestProduct?.name}</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-white/60">Avg Savings</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {avgSavings.toFixed(0)}%
            </div>
            <div className="text-xs text-white/50">across all products</div>
          </Card>

          <Card className="bg-zinc-900/60 border-white/5 p-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-white/60">Products</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              {productComparisons.length}
            </div>
            <div className="text-xs text-white/50">with price data</div>
          </Card>
        </div>

        {/* Category Tabs */}
        <div className="mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-2 min-w-max">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Button
                  key={cat.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-9 px-3 gap-1.5 whitespace-nowrap ${
                    isActive 
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" 
                      : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10"
                  }`}
                  data-testid={`category-${cat.id}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              placeholder="Search products or brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 h-10"
              data-testid="input-search"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-28 bg-white/5 border-white/10 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10">
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={onSpecialOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setOnSpecialOnly(!onSpecialOnly)}
            className={`h-10 gap-1.5 ${onSpecialOnly ? "bg-cyan-500 text-white" : "border-white/10 text-white/70"}`}
            data-testid="button-specials"
          >
            <Tag className="w-3.5 h-3.5" />
            Specials
          </Button>
          <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === "map" ? "default" : "ghost"}
              onClick={() => setViewMode("map")}
              className="h-8 px-3"
              data-testid="button-map-view"
            >
              <MapIcon className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className="h-8 px-3"
              data-testid="button-list-view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Map View */}
        {viewMode === "map" && (
          <StoreMap 
            stores={PERTH_STORES} 
            selectedStore={selectedMapStore}
            onSelect={setSelectedMapStore}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col gap-3" data-testid="skeleton-loader">
            {[...Array(6)].map((_, i) => (
              <ProductCardSkeleton key={`skeleton-${i}`} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <ErrorState
            {...handleApiError(error)}
            onRetry={() => refetch()}
            showHomeButton
          />
        )}

        {/* Product List */}
        {!isLoading && !isError && (
          <div className="space-y-3">
            {productComparisons.length === 0 ? (
              <Card className="bg-zinc-900/60 border-white/5 p-8 text-center">
                <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No products found</h3>
                <p className="text-white/50 text-sm">Try adjusting your filters or search terms</p>
              </Card>
            ) : (
              productComparisons.slice(0, 20).map((product, index) => {
                const isBestDeal = index === 0 && product.savingsPercent > 10;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card 
                      className={`bg-zinc-900/60 border-white/5 p-4 transition-all hover:scale-[1.01] cursor-pointer ${
                        isBestDeal ? 'ring-1 ring-green-500/50 bg-green-500/5' : ''
                      }`}
                      data-testid={`card-product-${product.id}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            {product.cheapestStore && (
                              <Badge className={`text-xs ${brandColors[product.cheapestStore.storeName] || 'bg-slate-500/20 text-slate-400'}`}>
                                {product.cheapestStore.storeName}
                              </Badge>
                            )}
                            {product.hasSpecial && (
                              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Special
                              </Badge>
                            )}
                            {isBestDeal && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                Best Deal
                              </Badge>
                            )}
                          </div>
                          <h3 className="font-semibold text-white text-sm sm:text-base truncate" data-testid={`text-product-name-${product.id}`}>
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-white/50 mt-1">
                            {product.brand && <span>{product.brand}</span>}
                            {product.size && <span>• {product.size}</span>}
                            <span>• {product.stores.length} store{product.stores.length > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className={`text-xl sm:text-2xl font-bold ${isBestDeal ? 'text-green-400' : 'text-white'}`}>
                            ${product.minPrice.toFixed(2)}
                          </div>
                          {product.savingsPercent > 5 && (
                            <div className="text-xs text-green-400 flex items-center justify-end gap-1 mt-0.5">
                              <ArrowDown className="w-3 h-3" />
                              Save {product.savingsPercent.toFixed(0)}%
                            </div>
                          )}
                          {product.maxPrice > product.minPrice && (
                            <div className="text-xs text-white/40 mt-0.5">
                              was ${product.maxPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>

                      {viewMode === "list" && product.stores.length > 1 && (
                        <div className="mt-3 pt-3 border-t border-white/5">
                          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            {product.stores.slice(0, 4).map((store, i) => (
                              <div 
                                key={i}
                                className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2 flex-shrink-0"
                              >
                                <span className="text-xs text-white/70">{store.storeName}</span>
                                <span className={`text-sm font-semibold ${parseFloat(store.currentPrice) === product.minPrice ? 'text-green-400' : 'text-white'}`}>
                                  ${parseFloat(store.currentPrice).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <Badge variant="outline" className="bg-white/5 border-white/10 text-white/60 text-xs">
                          {CATEGORY_DISPLAY[product.category] || product.category}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs text-purple-400 hover:text-purple-300 gap-1"
                          onClick={() => product.cheapestStore && handleAddToMealPlan({
                            name: product.name,
                            storeName: product.cheapestStore.storeName,
                            price: product.cheapestStore.currentPrice,
                            brand: product.brand,
                            unit: product.unit,
                          })}
                        >
                          <Plus className="w-3 h-3" />
                          Add to List
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 p-4 bg-zinc-900/60 border border-white/5 rounded-xl text-center">
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm mb-2">
            <Clock className="w-4 h-4" />
            <span>Prices updated: {format(new Date(), "h:mm a, MMM d")}</span>
          </div>
          <p className="text-xs text-white/40">
            Prices sourced from Woolworths, Coles & ALDI Perth stores. Prices may vary by location.
          </p>
        </div>
      </div>
    </div>
  );
}
