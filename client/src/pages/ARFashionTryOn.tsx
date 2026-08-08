import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, ShoppingBag, Heart, Share2 } from "lucide-react";

interface Outfit {
  id: number;
  name: string;
  store: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  category: string;
}

const OUTFITS: Outfit[] = [
  { id: 1, name: "Summer Casual", store: "Uniqlo", originalPrice: 89, salePrice: 59, discount: 34, image: "👕", category: "Casual" },
  { id: 2, name: "Business Formal", store: "David Jones", originalPrice: 199, salePrice: 129, discount: 35, image: "👔", category: "Formal" },
  { id: 3, name: "Weekend Vibes", store: "H&M", originalPrice: 75, salePrice: 42, discount: 44, image: "👖", category: "Casual" },
  { id: 4, name: "Sport Active", store: "Nike", originalPrice: 120, salePrice: 84, discount: 30, image: "⚽", category: "Sports" },
];

export default function ARFashionTryOn() {
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [arMode, setArMode] = useState(false);

  const toggleFavorite = (id: number) => {
    const newSet = new Set(favorites);
    newSet.has(id) ? newSet.delete(id) : newSet.add(id);
    setFavorites(newSet);
  };

  const totalSavings = OUTFITS.reduce((sum, o) => sum + (o.originalPrice - o.salePrice), 0);

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div className="bg-gradient-to-b from-blue-950/20 to-transparent px-6 pt-6 pb-6 space-y-4">
        <div className="flex items-center gap-3">
          <motion.div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500" animate={{ boxShadow: ["0 0 20px rgba(236,72,153,0.3)", "0 0 35px rgba(236,72,153,0.5)", "0 0 20px rgba(236,72,153,0.3)"] }} transition={{ duration: 2, repeat: Infinity }}>
            <ShoppingBag className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="title">AR Fashion Try-On</h1>
            <p className="text-white/60 text-sm">Virtual fitting room - see deals on you</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <motion.div className="bg-gradient-to-br from-pink-500/20 to-pink-500/10 rounded-xl p-3 border border-pink-500/30">
            <p className="text-white/60 text-xs uppercase">Total Savings</p>
            <p className="text-2xl font-bold text-pink-400">${totalSavings}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl p-3 border border-purple-500/30">
            <p className="text-white/60 text-xs uppercase">Outfits</p>
            <p className="text-2xl font-bold text-purple-400">{OUTFITS.length}</p>
          </motion.div>
          <motion.div className="bg-gradient-to-br from-rose-500/20 to-rose-500/10 rounded-xl p-3 border border-rose-500/30">
            <p className="text-white/60 text-xs uppercase">Favorites</p>
            <p className="text-2xl font-bold text-rose-400">{favorites.size}</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-6 space-y-6">
        {arMode && (
          <motion.div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-xl p-6 border border-pink-500/30 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="ar-view">
            <p className="text-4xl mb-3">👗</p>
            <p className="text-white font-semibold mb-3">Camera Active - See yourself in real-time</p>
            <Button onClick={() => setArMode(false)} className="bg-pink-500 hover:bg-pink-600 rounded-lg" data-testid="button-close-ar">
              Exit AR Mode
            </Button>
          </motion.div>
        )}

        <div className="space-y-3">
          <h3 className="text-white font-semibold">Trending Deals</h3>
          {OUTFITS.map((outfit, idx) => (
            <motion.div
              key={outfit.id}
              className={`rounded-xl p-4 border cursor-pointer transition-all ${selectedOutfit?.id === outfit.id ? "bg-gradient-to-r from-pink-500/15 to-rose-500/10 border-pink-500/40" : "bg-zinc-900/50 border-white/5 hover:border-pink-500/20"}`}
              onClick={() => setSelectedOutfit(selectedOutfit?.id === outfit.id ? null : outfit)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`outfit-${outfit.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{outfit.image}</span>
                  <div>
                    <p className="text-white font-semibold">{outfit.name}</p>
                    <p className="text-white/40 text-xs">{outfit.store}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-cyan-500/20 text-cyan-300 text-xs mb-1">-{outfit.discount}%</Badge>
                  <p className="text-pink-400 font-bold">${outfit.salePrice}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedOutfit && (
          <motion.div className="bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl p-5 border border-pink-500/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} data-testid="outfit-details">
            <div className="space-y-3">
              <p className="text-white font-semibold">{selectedOutfit.name}</p>
              <Button onClick={() => setArMode(true)} className="w-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg text-sm" data-testid="button-try-on">
                <Camera className="w-4 h-4 mr-2" />
                Try On with AR
              </Button>
              <Button variant="outline" onClick={() => toggleFavorite(selectedOutfit.id)} className="w-full rounded-lg" data-testid="button-favorite">
                <Heart className={`w-4 h-4 mr-2 ${favorites.has(selectedOutfit.id) ? "fill-current text-red-500" : ""}`} />
                {favorites.has(selectedOutfit.id) ? "Favorited" : "Add to Favorites"}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
