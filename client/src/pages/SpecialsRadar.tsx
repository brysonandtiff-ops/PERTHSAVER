import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Radar, Eye, MapPin, Store, Clock, TrendingDown, Percent,
  Filter, Bell, Star, ChevronRight, Sparkles, Target, Zap,
  Wifi, Radio, Signal, ScanLine, CircleDot, Heart, Share2,
  ShoppingBag, Laptop, Home, TreePine, Baby, Dumbbell,
  ArrowUpDown, ChevronDown, AlertTriangle, Flame, Timer,
  ExternalLink, Bookmark, BookmarkCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface HiddenSpecial {
  id: string;
  productName: string;
  storeName: string;
  storeType: string;
  originalPrice: number;
  discountPrice: number;
  discountPercent: number;
  category: string;
  suburb: string;
  validUntil: string;
  isHidden: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
  isSaved?: boolean;
  stockLevel?: "low" | "medium" | "high";
  image?: string;
}

const CATEGORIES = [
  { id: "all", name: "All", icon: ShoppingBag },
  { id: "electronics", name: "Electronics", icon: Laptop },
  { id: "home", name: "Home & Kitchen", icon: Home },
  { id: "outdoors", name: "Outdoors", icon: TreePine },
  { id: "baby", name: "Baby & Kids", icon: Baby },
  { id: "fitness", name: "Fitness", icon: Dumbbell },
];

const SUBURBS = [
  "All Suburbs", "Perth CBD", "Cannington", "Joondalup", "Karrinyup", 
  "Morley", "Osborne Park", "Belmont", "Midland", "Booragoon", "Fremantle",
  "Rockingham", "Armadale", "Mandurah"
];

const SORT_OPTIONS = [
  { id: "discount", name: "Highest Discount" },
  { id: "savings", name: "Most Savings ($)" },
  { id: "price", name: "Lowest Price" },
  { id: "expiring", name: "Expiring Soon" },
  { id: "rarity", name: "Rarity Level" },
];

const MOCK_SPECIALS: HiddenSpecial[] = [
  { id: "1", productName: "Philips Air Fryer XL Premium", storeName: "Harvey Norman", storeType: "Harvey Norman", originalPrice: 399, discountPrice: 149, discountPercent: 63, category: "home", suburb: "Cannington", validUntil: "2025-12-26", isHidden: true, rarity: "legendary", stockLevel: "low" },
  { id: "2", productName: "Dyson V15 Detect Absolute", storeName: "The Good Guys", storeType: "The Good Guys", originalPrice: 1199, discountPrice: 649, discountPercent: 46, category: "home", suburb: "Joondalup", validUntil: "2025-12-25", isHidden: true, rarity: "epic", stockLevel: "medium" },
  { id: "3", productName: "Le Creuset Signature Cast Iron", storeName: "Myer", storeType: "Myer", originalPrice: 599, discountPrice: 299, discountPercent: 50, category: "home", suburb: "Perth CBD", validUntil: "2025-12-24", isHidden: false, rarity: "rare", stockLevel: "high" },
  { id: "4", productName: "Weber Q2200 Premium BBQ", storeName: "Bunnings", storeType: "Bunnings", originalPrice: 549, discountPrice: 349, discountPercent: 36, category: "outdoors", suburb: "Belmont", validUntil: "2025-12-28", isHidden: true, rarity: "rare", stockLevel: "medium" },
  { id: "5", productName: "Samsung 65\" Neo QLED 4K TV", storeName: "JB Hi-Fi", storeType: "JB Hi-Fi", originalPrice: 2999, discountPrice: 1799, discountPercent: 40, category: "electronics", suburb: "Cannington", validUntil: "2025-12-25", isHidden: true, rarity: "legendary", stockLevel: "low" },
  { id: "6", productName: "Nespresso Vertuo Plus Bundle", storeName: "Myer", storeType: "Myer", originalPrice: 299, discountPrice: 149, discountPercent: 50, category: "home", suburb: "Karrinyup", validUntil: "2025-12-27", isHidden: false, rarity: "common", stockLevel: "high" },
  { id: "7", productName: "Bose QuietComfort Ultra", storeName: "JB Hi-Fi", storeType: "JB Hi-Fi", originalPrice: 649, discountPrice: 379, discountPercent: 42, category: "electronics", suburb: "Perth CBD", validUntil: "2025-12-26", isHidden: true, rarity: "epic", stockLevel: "medium" },
  { id: "8", productName: "KitchenAid Artisan Mixer", storeName: "Harvey Norman", storeType: "Harvey Norman", originalPrice: 899, discountPrice: 449, discountPercent: 50, category: "home", suburb: "Osborne Park", validUntil: "2025-12-30", isHidden: true, rarity: "epic", stockLevel: "low" },
  { id: "9", productName: "Shark AI Robot Vacuum", storeName: "The Good Guys", storeType: "The Good Guys", originalPrice: 799, discountPrice: 399, discountPercent: 50, category: "home", suburb: "Midland", validUntil: "2025-12-24", isHidden: false, rarity: "rare", stockLevel: "medium" },
  { id: "10", productName: "Sony WH-1000XM5 Black", storeName: "Officeworks", storeType: "Officeworks", originalPrice: 549, discountPrice: 349, discountPercent: 36, category: "electronics", suburb: "Morley", validUntil: "2025-12-27", isHidden: true, rarity: "rare", stockLevel: "high" },
  { id: "11", productName: "Apple AirPods Pro 2 USB-C", storeName: "JB Hi-Fi", storeType: "JB Hi-Fi", originalPrice: 399, discountPrice: 299, discountPercent: 25, category: "electronics", suburb: "Booragoon", validUntil: "2025-12-29", isHidden: true, rarity: "epic", stockLevel: "low" },
  { id: "12", productName: "Nintendo Switch OLED Bundle", storeName: "EB Games", storeType: "EB Games", originalPrice: 549, discountPrice: 429, discountPercent: 22, category: "electronics", suburb: "Joondalup", validUntil: "2025-12-31", isHidden: false, rarity: "common", stockLevel: "high" },
  { id: "13", productName: "Breville Barista Express", storeName: "David Jones", storeType: "David Jones", originalPrice: 799, discountPrice: 499, discountPercent: 38, category: "home", suburb: "Perth CBD", validUntil: "2025-12-26", isHidden: true, rarity: "epic", stockLevel: "medium" },
  { id: "14", productName: "Coleman Instant Up Tent 6P", storeName: "BCF", storeType: "BCF", originalPrice: 599, discountPrice: 299, discountPercent: 50, category: "outdoors", suburb: "Cannington", validUntil: "2025-12-25", isHidden: true, rarity: "rare", stockLevel: "low" },
  { id: "15", productName: "Theragun Pro Plus", storeName: "Rebel Sport", storeType: "Rebel Sport", originalPrice: 899, discountPrice: 599, discountPercent: 33, category: "fitness", suburb: "Karrinyup", validUntil: "2025-12-28", isHidden: false, rarity: "rare", stockLevel: "medium" },
  { id: "16", productName: "Bugaboo Fox 5 Complete", storeName: "Baby Bunting", storeType: "Baby Bunting", originalPrice: 1899, discountPrice: 1199, discountPercent: 37, category: "baby", suburb: "Osborne Park", validUntil: "2025-12-27", isHidden: true, rarity: "legendary", stockLevel: "low" },
  { id: "17", productName: "Yeti Hopper M20 Cooler", storeName: "Anaconda", storeType: "Anaconda", originalPrice: 550, discountPrice: 349, discountPercent: 37, category: "outdoors", suburb: "Joondalup", validUntil: "2025-12-24", isHidden: true, rarity: "rare", stockLevel: "medium" },
  { id: "18", productName: "LG C3 55\" OLED evo TV", storeName: "The Good Guys", storeType: "The Good Guys", originalPrice: 2499, discountPrice: 1499, discountPercent: 40, category: "electronics", suburb: "Rockingham", validUntil: "2025-12-26", isHidden: true, rarity: "legendary", stockLevel: "low" },
];

const RARITY_COLORS = {
  common: "from-slate-400 to-slate-500",
  rare: "from-purple-400 to-purple-600",
  epic: "from-cyan-400 to-cyan-600",
  legendary: "from-purple-400 via-pink-500 to-cyan-400",
};

const RARITY_GLOW = {
  common: "hover:shadow-slate-400/20",
  rare: "hover:shadow-purple-500/30",
  epic: "hover:shadow-cyan-500/40",
  legendary: "hover:shadow-purple-500/50",
};

const RARITY_ORDER = { legendary: 0, epic: 1, rare: 2, common: 3 };

const STORE_COLORS: Record<string, string> = {
  "Harvey Norman": "#E31837",
  "The Good Guys": "#FF6600",
  "JB Hi-Fi": "#FFD200",
  "Myer": "#000000",
  "Bunnings": "#00833E",
  "Officeworks": "#00529B",
  "EB Games": "#FF0000",
  "David Jones": "#231F20",
  "BCF": "#00385C",
  "Rebel Sport": "#E4002B",
  "Baby Bunting": "#E91E8C",
  "Anaconda": "#004B32",
};

function UltraRadarAnimation({ isScanning }: { isScanning: boolean }) {
  const [detectedCount, setDetectedCount] = useState(0);
  const [scanPhase, setScanPhase] = useState<"scanning" | "analyzing" | "complete">("scanning");
  
  useEffect(() => {
    if (!isScanning) return;
    
    const interval = setInterval(() => {
      setDetectedCount(prev => Math.min(prev + Math.floor(Math.random() * 3) + 1, 18));
    }, 400);
    
    const phaseTimer1 = setTimeout(() => setScanPhase("analyzing"), 1500);
    const phaseTimer2 = setTimeout(() => setScanPhase("complete"), 2500);
    
    return () => {
      clearInterval(interval);
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
    };
  }, [isScanning]);

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-transparent to-transparent" />
      
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full bg-purple-400/60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -20, -40],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border"
          style={{
            width: 80 + i * 55,
            height: 80 + i * 55,
            borderColor: `rgba(168, 85, 247, ${0.4 - i * 0.06})`,
            borderWidth: i === 0 ? 2 : 1,
          }}
          animate={{
            scale: [1, 1.02, 1],
            opacity: [0.6 - i * 0.1, 0.8 - i * 0.1, 0.6 - i * 0.1],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`pulse-${i}`}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)`,
          }}
          initial={{ width: 80, height: 80, opacity: 0.8 }}
          animate={{
            width: [80, 450, 500],
            height: [80, 450, 500],
            opacity: [0.6, 0.15, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.6,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}

      <motion.div
        className="absolute"
        style={{
          width: 320,
          height: 320,
          background: `conic-gradient(from 0deg, transparent 0deg, rgba(168, 85, 247, 0.5) 30deg, transparent 60deg)`,
          borderRadius: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      
      <motion.div
        className="absolute"
        style={{
          width: 250,
          height: 250,
          background: `conic-gradient(from 180deg, transparent 0deg, rgba(6, 182, 212, 0.4) 40deg, transparent 80deg)`,
          borderRadius: "50%",
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute w-[2px] h-[160px] origin-bottom"
        style={{
          background: "linear-gradient(to top, rgba(168, 85, 247, 1), rgba(6, 182, 212, 0.8), transparent)",
          boxShadow: "0 0 20px rgba(168, 85, 247, 0.8), 0 0 40px rgba(168, 85, 247, 0.4)",
          bottom: "50%",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      {[...Array(10)].map((_, i) => {
        const angle = (i * 36) * (Math.PI / 180);
        const radius = 100 + Math.random() * 50;
        return (
          <motion.div
            key={`blip-${i}`}
            className="absolute"
            style={{
              left: `calc(50% + ${Math.cos(angle) * radius}px)`,
              top: `calc(50% + ${Math.sin(angle) * radius}px)`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 1],
              opacity: [0, 1, 0.7],
            }}
            transition={{
              duration: 0.5,
              delay: 0.4 + i * 0.15,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/60" />
          </motion.div>
        );
      })}

      <motion.div
        className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, rgba(168, 85, 247, 0.95), rgba(6, 182, 212, 0.95))",
          boxShadow: "0 0 50px rgba(168, 85, 247, 0.6), 0 0 100px rgba(168, 85, 247, 0.3), inset 0 2px 20px rgba(255,255,255,0.2)",
        }}
        animate={{
          scale: [1, 1.06, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotate: isScanning ? 360 : 0 }}
          transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
        >
          <Radar className="w-14 h-14 text-white drop-shadow-lg" />
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-6 left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-purple-500/30"
          style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Signal className="w-4 h-4 text-purple-400" />
          </motion.div>
          
          <div className="flex flex-col items-start">
            <motion.span 
              className="text-sm font-semibold text-white"
              key={scanPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {scanPhase === "scanning" && "Scanning Perth Metro..."}
              {scanPhase === "analyzing" && "Analyzing 50+ Retailers..."}
              {scanPhase === "complete" && "Deals Discovered!"}
            </motion.span>
            <span className="text-xs text-purple-400">
              {detectedCount} specials detected
            </span>
          </div>
          
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 h-3.5 rounded-full bg-purple-400"
                animate={{
                  scaleY: [0.3, 1, 0.3],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function SpecialCard({ special, index, onToggleSave }: { special: HiddenSpecial; index: number; onToggleSave: (id: string) => void }) {
  const savings = special.originalPrice - special.discountPrice;
  const daysLeft = Math.ceil((new Date(special.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpiringSoon = daysLeft <= 2;
  const storeColor = STORE_COLORS[special.storeType] || "#A855F7";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.06, duration: 0.4, type: "spring", stiffness: 120 }}
      whileHover={{ scale: 1.015, y: -3 }}
      className={`relative overflow-hidden rounded-2xl bg-zinc-900/90 backdrop-blur-xl transition-all duration-300 cursor-pointer shadow-xl ${RARITY_GLOW[special.rarity]} group border border-white/5`}
      data-testid={`special-card-${special.id}`}
    >
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 0%, rgba(168, 85, 247, 0.08), transparent 60%)`,
        }}
      />
      
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className="relative">
            <motion.div 
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${RARITY_COLORS[special.rarity]} flex items-center justify-center shadow-lg`}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.4 }}
            >
              <Store className="w-7 h-7 text-white" />
            </motion.div>
            <div 
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-zinc-900"
              style={{ backgroundColor: storeColor }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-white font-semibold text-base leading-tight line-clamp-2" data-testid={`special-name-${special.id}`}>
                {special.productName}
              </h3>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {special.isHidden && (
                  <motion.div 
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    animate={{ opacity: [1, 0.7, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Eye className="w-3 h-3" />
                    <span className="text-[10px] font-semibold">Hidden</span>
                  </motion.div>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); onToggleSave(special.id); }}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  data-testid={`save-btn-${special.id}`}
                >
                  {special.isSaved ? (
                    <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Bookmark className="w-4 h-4 text-white/40 hover:text-white/70" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-1.5 mt-1.5">
              <span className="font-medium" style={{ color: storeColor }}>{special.storeName}</span>
              <span className="text-white/30">•</span>
              <MapPin className="w-3 h-3" />
              {special.suburb}
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">${special.discountPrice}</span>
              <span className="text-sm text-white/40 line-through">${special.originalPrice}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`bg-gradient-to-r ${RARITY_COLORS[special.rarity]} text-white text-[10px] capitalize px-2 py-0.5`}>
                {special.rarity === "legendary" && <Sparkles className="w-2.5 h-2.5 mr-1" />}
                {special.rarity}
              </Badge>
              <span className="text-green-400 text-xs font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                Save ${savings}
              </span>
              {special.stockLevel === "low" && (
                <span className="text-orange-400 text-[10px] font-medium flex items-center gap-1 bg-orange-500/10 px-1.5 py-0.5 rounded">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  Low Stock
                </span>
              )}
            </div>
          </div>
          
          <motion.div 
            className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/15 to-cyan-500/15 border border-purple-500/20"
            whileHover={{ scale: 1.08 }}
          >
            <div className="text-center">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {special.discountPercent}%
              </span>
              <div className="text-[9px] text-white/40 -mt-0.5">OFF</div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
          <span className={`text-xs flex items-center gap-1.5 ${isExpiringSoon ? 'text-orange-400' : 'text-white/40'}`}>
            {isExpiringSoon ? <Flame className="w-3 h-3" /> : <Timer className="w-3 h-3" />}
            {isExpiringSoon ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left!` : `Expires ${new Date(special.validUntil).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}`}
          </span>
          <button className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
            View Deal <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function SpecialsRadar() {
  const [isScanning, setIsScanning] = useState(true);
  const [minDiscount, setMinDiscount] = useState([15]);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [selectedRarities, setSelectedRarities] = useState<string[]>(["common", "rare", "epic", "legendary"]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSuburb, setSelectedSuburb] = useState("All Suburbs");
  const [sortBy, setSortBy] = useState("discount");
  const [specials, setSpecials] = useState<HiddenSpecial[]>([]);
  const [savedDeals, setSavedDeals] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsScanning(false);
      setSpecials(MOCK_SPECIALS);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleRescan = () => {
    setIsScanning(true);
    setSpecials([]);
    setTimeout(() => {
      setIsScanning(false);
      setSpecials(MOCK_SPECIALS);
    }, 3000);
  };
  
  const toggleSave = (id: string) => {
    setSavedDeals(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
        toast({ title: "Removed from saved", description: "Deal removed from your saved list" });
      } else {
        newSet.add(id);
        toast({ title: "Deal saved!", description: "You'll be notified of price changes" });
      }
      return newSet;
    });
  };
  
  const filteredSpecials = useMemo(() => {
    let result = specials
      .map(s => ({ ...s, isSaved: savedDeals.has(s.id) }))
      .filter(special => {
        if (special.discountPercent < minDiscount[0]) return false;
        if (showHiddenOnly && !special.isHidden) return false;
        if (!selectedRarities.includes(special.rarity)) return false;
        if (selectedCategory !== "all" && special.category !== selectedCategory) return false;
        if (selectedSuburb !== "All Suburbs" && special.suburb !== selectedSuburb) return false;
        return true;
      });
    
    result.sort((a, b) => {
      switch (sortBy) {
        case "discount": return b.discountPercent - a.discountPercent;
        case "savings": return (b.originalPrice - b.discountPrice) - (a.originalPrice - a.discountPrice);
        case "price": return a.discountPrice - b.discountPrice;
        case "expiring": return new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime();
        case "rarity": return RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
        default: return 0;
      }
    });
    
    return result;
  }, [specials, minDiscount, showHiddenOnly, selectedRarities, selectedCategory, selectedSuburb, sortBy, savedDeals]);
  
  const toggleRarity = (rarity: string) => {
    if (selectedRarities.includes(rarity)) {
      setSelectedRarities(selectedRarities.filter(r => r !== rarity));
    } else {
      setSelectedRarities([...selectedRarities, rarity]);
    }
  };
  
  const totalSavings = filteredSpecials.reduce((sum, s) => sum + (s.originalPrice - s.discountPrice), 0);
  const legendaryCount = filteredSpecials.filter(s => s.rarity === "legendary").length;
  const expiringSoonCount = filteredSpecials.filter(s => {
    const daysLeft = Math.ceil((new Date(s.validUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 2;
  }).length;
  
  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/30 via-zinc-950 to-zinc-950" />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative px-4 sm:px-6 pt-6"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(168, 85, 247, 0.4)",
                    "0 0 35px rgba(168, 85, 247, 0.6)",
                    "0 0 20px rgba(168, 85, 247, 0.4)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: isScanning ? 360 : 0 }}
                  transition={{ duration: 2, repeat: isScanning ? Infinity : 0, ease: "linear" }}
                  className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500"
                >
                  <Radar className="w-7 h-7 text-white" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white" data-testid="page-title">
                  WA Specials Radar
                </h1>
                <p className="text-white/50 text-xs mt-0.5">
                  AI-powered deal scanner for Perth
                </p>
              </div>
            </div>
            
            {!isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button
                  onClick={handleRescan}
                  size="sm"
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl text-xs"
                  data-testid="rescan-btn"
                >
                  <Radio className="w-3.5 h-3.5 mr-1.5" />
                  Rescan
                </Button>
              </motion.div>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <UltraRadarAnimation isScanning={isScanning} />
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-5">
                  {[
                    { label: "Deals Found", value: filteredSpecials.length, icon: Target, gradient: "from-purple-500 to-purple-600" },
                    { label: "Total Savings", value: `$${totalSavings.toLocaleString()}`, icon: TrendingDown, gradient: "from-green-500 to-emerald-600" },
                    { label: "Expiring Soon", value: expiringSoonCount, icon: Flame, gradient: "from-orange-500 to-red-500" },
                    { label: "Legendary", value: legendaryCount, icon: Sparkles, gradient: "from-purple-400 to-cyan-400" },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-zinc-900/80 backdrop-blur-xl rounded-xl p-3 sm:p-4 text-center border border-white/5"
                    >
                      <div className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                        <stat.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-white">
                        {stat.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/50 mt-0.5">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {!isScanning && (
        <div className="px-4 sm:px-6">
          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg"
                    : "bg-zinc-800/80 text-white/60 hover:text-white hover:bg-zinc-700/80"
                }`}
                data-testid={`category-${cat.id}`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            ))}
          </motion.div>
          
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-zinc-900/80 backdrop-blur-xl rounded-xl p-4 mb-5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-white">Filters</span>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white h-7 px-2" data-testid="suburb-dropdown">
                      <MapPin className="w-3 h-3 mr-1" />
                      {selectedSuburb}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-900 border-white/10">
                    {SUBURBS.map(suburb => (
                      <DropdownMenuItem 
                        key={suburb} 
                        onClick={() => setSelectedSuburb(suburb)}
                        className="text-white/80 hover:text-white text-xs"
                      >
                        {suburb}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-xs text-white/60 hover:text-white h-7 px-2" data-testid="sort-dropdown">
                      <ArrowUpDown className="w-3 h-3 mr-1" />
                      Sort
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-900 border-white/10">
                    {SORT_OPTIONS.map(opt => (
                      <DropdownMenuItem 
                        key={opt.id} 
                        onClick={() => setSortBy(opt.id)}
                        className={`text-xs ${sortBy === opt.id ? 'text-purple-400' : 'text-white/80 hover:text-white'}`}
                      >
                        {opt.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/60 block mb-2 flex items-center justify-between">
                  <span>Minimum Discount</span>
                  <span className="text-purple-400 font-semibold">{minDiscount[0]}%+</span>
                </label>
                <Slider
                  value={minDiscount}
                  onValueChange={setMinDiscount}
                  max={70}
                  min={10}
                  step={5}
                  className="cursor-pointer"
                  data-testid="discount-slider"
                />
              </div>
              
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5">
                <label className="text-xs text-white/80 flex items-center gap-2">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  Hidden specials only
                </label>
                <Checkbox
                  checked={showHiddenOnly}
                  onCheckedChange={(checked) => setShowHiddenOnly(checked === true)}
                  data-testid="hidden-only-checkbox"
                />
              </div>
              
              <div>
                <label className="text-xs text-white/60 block mb-2">Rarity</label>
                <div className="flex gap-2 flex-wrap">
                  {(["common", "rare", "epic", "legendary"] as const).map((rarity) => (
                    <Button
                      key={rarity}
                      variant={selectedRarities.includes(rarity) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleRarity(rarity)}
                      className={`capitalize text-[10px] h-7 rounded-lg transition-all ${
                        selectedRarities.includes(rarity) 
                          ? `bg-gradient-to-r ${RARITY_COLORS[rarity]} border-0 shadow-lg` 
                          : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                      data-testid={`rarity-${rarity}`}
                    >
                      {rarity === "legendary" && <Sparkles className="w-2.5 h-2.5 mr-1" />}
                      {rarity}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Results Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              {filteredSpecials.length} Specials
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg text-xs h-8"
              data-testid="set-alerts-btn"
            >
              <Bell className="w-3.5 h-3.5 mr-1.5" />
              Alerts
            </Button>
          </div>
          
          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AnimatePresence>
              {filteredSpecials.map((special, index) => (
                <SpecialCard 
                  key={special.id} 
                  special={special} 
                  index={index} 
                  onToggleSave={toggleSave}
                />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredSpecials.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="w-14 h-14 text-white/20 mx-auto mb-4" />
              </motion.div>
              <p className="text-white/50 text-base font-medium">No specials match your filters</p>
              <p className="text-white/30 text-sm mt-2">Try adjusting the filters above</p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
