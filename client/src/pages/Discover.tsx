import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { 
  Globe, ExternalLink, ShoppingCart, Fuel, Zap, Ticket, 
  Star, TrendingUp, Search, Filter, ChevronRight, Sparkles 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InAppBrowser } from "@/components/InAppBrowser";

interface PartnerSite {
  id: string;
  name: string;
  domain: string;
  logoUrl?: string;
  category: string;
  description?: string;
  priority: number;
}

const DEFAULT_PARTNERS: PartnerSite[] = [
  { id: "1", name: "Woolworths", domain: "woolworths.com.au", category: "shopping", description: "Fresh groceries & everyday essentials", priority: 10 },
  { id: "2", name: "Coles", domain: "coles.com.au", category: "shopping", description: "Supermarket specials & deals", priority: 10 },
  { id: "3", name: "ALDI", domain: "aldi.com.au", category: "shopping", description: "Quality products at low prices", priority: 9 },
  { id: "4", name: "Spudshed", domain: "spudshed.com.au", category: "shopping", description: "WA-owned fresh produce & groceries", priority: 9 },
  { id: "5", name: "IGA", domain: "iga.com.au", category: "shopping", description: "Local independent grocers", priority: 8 },
  { id: "6", name: "Farmer Jack's", domain: "farmerjacks.com.au", category: "shopping", description: "Fresh WA produce & specials", priority: 8 },
  { id: "7", name: "BP Rewards", domain: "bp.com.au", category: "fuel", description: "BP fuel rewards and discounts", priority: 9 },
  { id: "8", name: "7-Eleven Fuel", domain: "7eleven.com.au", category: "fuel", description: "Fuel lock app savings", priority: 7 },
  { id: "9", name: "Ampol", domain: "ampol.com.au", category: "fuel", description: "Fuel rewards & discounts", priority: 7 },
  { id: "10", name: "Synergy", domain: "synergy.net.au", category: "utilities", description: "WA electricity provider", priority: 10 },
  { id: "11", name: "Kleenheat", domain: "kleenheat.com.au", category: "utilities", description: "WA gas supplier", priority: 9 },
  { id: "12", name: "Alinta Energy", domain: "alintaenergy.com.au", category: "utilities", description: "Electricity & gas plans", priority: 8 },
  { id: "13", name: "Water Corporation", domain: "watercorporation.com.au", category: "utilities", description: "WA water services", priority: 7 },
  { id: "14", name: "OzBargain", domain: "ozbargain.com.au", category: "deals", description: "Community-sourced deals & bargains", priority: 10 },
  { id: "15", name: "Lasoo", domain: "lasoo.com.au", category: "deals", description: "Digital catalogues & specials", priority: 8 },
  { id: "16", name: "ShopADocket", domain: "shopadocket.com.au", category: "deals", description: "Receipt-based rewards", priority: 7 },
  { id: "17", name: "Catch", domain: "catch.com.au", category: "shopping", description: "Daily deals & discounts", priority: 8 },
  { id: "18", name: "Amazon AU", domain: "amazon.com.au", category: "shopping", description: "Everything store with Prime deals", priority: 8 },
  { id: "19", name: "eBay AU", domain: "ebay.com.au", category: "shopping", description: "Auctions & Buy It Now deals", priority: 8 },
  { id: "20", name: "JB Hi-Fi", domain: "jbhifi.com.au", category: "electronics", description: "Electronics & entertainment", priority: 9 },
  { id: "21", name: "The Good Guys", domain: "thegoodguys.com.au", category: "electronics", description: "Appliances & electronics", priority: 8 },
  { id: "22", name: "Harvey Norman", domain: "harveynorman.com.au", category: "electronics", description: "Tech, furniture & appliances", priority: 8 },
  { id: "23", name: "Officeworks", domain: "officeworks.com.au", category: "electronics", description: "Office & tech supplies", priority: 7 },
  { id: "24", name: "Bunnings", domain: "bunnings.com.au", category: "home", description: "Hardware & home improvement", priority: 10 },
  { id: "25", name: "IKEA Perth", domain: "ikea.com.au", category: "home", description: "Furniture & homewares", priority: 9 },
  { id: "26", name: "Spotlight", domain: "spotlight.com.au", category: "home", description: "Fabrics & craft supplies", priority: 7 },
  { id: "27", name: "Kmart", domain: "kmart.com.au", category: "shopping", description: "Affordable everyday items", priority: 8 },
  { id: "28", name: "Big W", domain: "bigw.com.au", category: "shopping", description: "Great value for families", priority: 7 },
  { id: "29", name: "Target", domain: "target.com.au", category: "shopping", description: "Fashion & homewares", priority: 7 },
  { id: "30", name: "Costco Perth", domain: "costco.com.au", category: "shopping", description: "Bulk buys & wholesale prices", priority: 9 },
  { id: "31", name: "Chemist Warehouse", domain: "chemistwarehouse.com.au", category: "health", description: "Discounted pharmacy & health", priority: 9 },
  { id: "32", name: "Priceline", domain: "priceline.com.au", category: "health", description: "Beauty & pharmacy deals", priority: 8 },
  { id: "33", name: "BCF", domain: "bcf.com.au", category: "outdoors", description: "Camping & outdoor gear", priority: 7 },
  { id: "34", name: "Anaconda", domain: "anacondastores.com", category: "outdoors", description: "Adventure & outdoor equipment", priority: 7 },
  { id: "35", name: "Repco", domain: "repco.com.au", category: "automotive", description: "Auto parts & accessories", priority: 7 },
  { id: "36", name: "Supercheap Auto", domain: "supercheapauto.com.au", category: "automotive", description: "Car parts & DIY", priority: 7 },
];

const CATEGORIES = [
  { id: "all", name: "All", icon: Globe },
  { id: "shopping", name: "Shopping", icon: ShoppingCart },
  { id: "fuel", name: "Fuel", icon: Fuel },
  { id: "utilities", name: "Utilities", icon: Zap },
  { id: "deals", name: "Deals", icon: Ticket },
  { id: "electronics", name: "Electronics", icon: Sparkles },
  { id: "home", name: "Home", icon: TrendingUp },
  { id: "health", name: "Health", icon: Star },
  { id: "outdoors", name: "Outdoors", icon: Globe },
  { id: "automotive", name: "Auto", icon: Fuel },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [browserOpen, setBrowserOpen] = useState(false);
  const [browserUrl, setBrowserUrl] = useState("");
  const [browserTitle, setBrowserTitle] = useState("");

  const partners = DEFAULT_PARTNERS;

  const filteredPartners = partners
    .filter(p => 
      (selectedCategory === "all" || p.category === selectedCategory) &&
      (searchQuery === "" || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => b.priority - a.priority);

  const openSite = (partner: PartnerSite) => {
    setBrowserUrl(`https://${partner.domain}`);
    setBrowserTitle(partner.name);
    setBrowserOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.id === category);
    return cat?.icon || Globe;
  };

  return (
    <div className="min-h-full pb-20">
      <InAppBrowser
        url={browserUrl}
        title={browserTitle}
        isOpen={browserOpen}
        onClose={() => setBrowserOpen(false)}
      />

      <motion.div
        className="w-full max-w-2xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-display font-bold text-white mb-2">Discover</h1>
          <p className="text-white/60">Browse partner sites & find the best deals</p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <Input
              placeholder="Search stores & deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-white/5 text-white placeholder:text-white/40 rounded-xl"
              data-testid="input-search-discover"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                  data-testid={`button-category-${category.id}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Partner Sites</h2>
            <span className="text-sm text-white/40">{filteredPartners.length} sites</span>
          </div>

          <div className="grid gap-3">
            <AnimatePresence mode="popLayout">
              {filteredPartners.map((partner) => {
                const CategoryIcon = getCategoryIcon(partner.category);
                return (
                  <motion.button
                    key={partner.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => openSite(partner)}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-left group"
                    data-testid={`button-partner-${partner.id}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <CategoryIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-white/50 truncate">{partner.description}</p>
                      <p className="text-xs text-white/30 mt-1">{partner.domain}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-1">Suggest a Partner</h3>
              <p className="text-sm text-white/60 mb-3">
                Know a Perth store that should be here? Let us know and earn bonus points!
              </p>
              <Button
                variant="outline"
                size="sm"
                className="text-purple-400 hover:text-purple-300"
                data-testid="button-suggest-partner"
              >
                Suggest Store
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
