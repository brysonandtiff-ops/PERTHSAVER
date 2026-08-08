import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DealCard } from "@/components/dashboard/DealCard";
import { Search as SearchIcon, Filter, X, Clock, ThumbsUp } from "lucide-react";

const deals = [
  { store: "Spudshed", product: "Local WA Potatoes 5kg", price: "$1.99", originalPrice: "$4.50", location: "Innaloo", timeAgo: "2h ago", votes: 124, imageColor: "bg-blue-200" },
  { store: "Coles", product: "Tim Tams 200g", price: "$2.25", originalPrice: "$4.50", location: "Subiaco", timeAgo: "45m ago", votes: 89, imageColor: "bg-sky-100" },
  { store: "Woolworths", product: "Barramundi Fillet 400g", price: "$12.50", originalPrice: "$18.00", location: "Perth City", timeAgo: "12m ago", votes: 32, imageColor: "bg-blue-200" },
  { store: "IGA", product: "Margaret River Honey 500g", price: "$8.00", originalPrice: "$12.00", location: "Leederville", timeAgo: "3h ago", votes: 56, imageColor: "bg-amber-200" },
  { store: "ALDI", product: "Free Range Eggs 12", price: "$4.50", originalPrice: "$6.99", location: "Mt Hawthorn", timeAgo: "1h ago", votes: 203, imageColor: "bg-teal-50" },
  { store: "Woolworths", product: "Organic Bananas 1kg", price: "$3.20", originalPrice: "$5.99", location: "Mosman Park", timeAgo: "30m ago", votes: 78, imageColor: "bg-amber-100" },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    stores: [] as string[],
    priceRange: "all",
    savingsMin: "all",
    sortBy: "trending",
  });

  const stores = ["Woolworths", "Coles", "ALDI", "IGA", "Spudshed"];

  const toggleStore = (store: string) => {
    setFilters(prev => ({
      ...prev,
      stores: prev.stores.includes(store)
        ? prev.stores.filter(s => s !== store)
        : [...prev.stores, store]
    }));
  };

  const filteredDeals = deals.filter(deal =>
    deal.product.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filters.stores.length === 0 || filters.stores.includes(deal.store))
  );

  return (
    <div className="min-h-screen">
      
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        {/* Search Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3 sm:mb-4">Discover Deals</h1>
          <div className="flex flex-col gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/30" />
              <Input
                placeholder="Search products (e.g., avocados, meat pies, coffee)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 bg-white/8 border-white/15 text-white placeholder:text-white/40 focus:border-primary/50 h-10 sm:h-12 text-sm"
              />
            </div>
            <Button
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 w-full sm:w-auto h-12 gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" /> Filters {filters.stores.length > 0 && `(${filters.stores.length})`}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="lg:w-64 space-y-6">
              <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {/* Stores */}
                  <div>
                    <h3 className="font-display font-semibold text-white mb-3">Stores</h3>
                    <div className="space-y-2">
                      {stores.map(store => (
                        <div key={store} className="flex items-center gap-2 min-h-[44px]">
                          <Checkbox
                            checked={filters.stores.includes(store)}
                            onCheckedChange={() => toggleStore(store)}
                            id={`store-${store}`}
                          />
                          <label htmlFor={`store-${store}`} className="text-sm text-white/70 cursor-pointer flex-1">
                            {store}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Savings */}
                  <div>
                    <h3 className="font-display font-semibold text-white mb-3">Min. Savings</h3>
                    <Select value={filters.savingsMin} onValueChange={(val) => setFilters(prev => ({ ...prev, savingsMin: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="20">20%+</SelectItem>
                        <SelectItem value="40">40%+</SelectItem>
                        <SelectItem value="50">50%+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort */}
                  <div>
                    <h3 className="font-display font-semibold text-white mb-3">Sort By</h3>
                    <Select value={filters.sortBy} onValueChange={(val) => setFilters(prev => ({ ...prev, sortBy: val }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trending">Trending</SelectItem>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="savings">Best Savings</SelectItem>
                        <SelectItem value="votes">Most Votes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-white/20 text-white hover:bg-white/10"
                    onClick={() => setFilters({ stores: [], priceRange: "all", savingsMin: "all", sortBy: "trending" })}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex flex-col sm:items-center sm:justify-between gap-4 mb-6">
              <p className="text-white/60">
                Found <span className="text-white font-semibold">{filteredDeals.length}</span> deals
              </p>
              <div className="flex gap-2 flex-wrap">
                {filters.stores.map(store => (
                  <Badge key={store} variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {store}
                    <button onClick={() => toggleStore(store)} className="ml-2 hover:text-primary/60">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {filteredDeals.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {filteredDeals.map((deal, i) => (
                  <DealCard key={`${deal.store}-${deal.product}`} {...deal} />
                ))}
              </div>
            ) : (
              <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
                <CardContent className="p-12 text-center">
                  <p className="text-white/60 mb-2">No deals found matching your criteria</p>
                  <p className="text-sm text-white/40">Try adjusting your search or filters</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
