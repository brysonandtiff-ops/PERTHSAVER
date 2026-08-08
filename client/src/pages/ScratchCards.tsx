import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Sparkles, Lock, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import { haptics } from "@/lib/haptics";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ScratchTile {
  id: number;
  symbol: string;
  value: number;
  label: string;
  revealed: boolean;
  scratched: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function ScratchTileComponent({ 
  tile, 
  onScratch, 
  onReveal 
}: { 
  tile: ScratchTile; 
  onScratch: (id: number, amount: number) => void;
  onReveal: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isScratching = useRef(false);
  const scratchedPixels = useRef(0);
  const totalPixels = useRef(0);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || tile.revealed) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#A855F7");
    gradient.addColorStop(0.5, "#06B6D4");
    gradient.addColorStop(1, "#A855F7");
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255,255,255,0.1)";
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 20 + 5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.font = "bold 14px system-ui";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.textAlign = "center";
    ctx.fillText("SCRATCH", canvas.width / 2, canvas.height / 2 + 5);

    totalPixels.current = canvas.width * canvas.height;
  };

  const handleStart = () => {
    isScratching.current = true;
    haptics.light();
  };

  const handleEnd = () => {
    isScratching.current = false;
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isScratching.current || tile.revealed) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    scratchedPixels.current += 400;
    const scratchedPercent = (scratchedPixels.current / totalPixels.current) * 100;
    
    onScratch(tile.id, scratchedPercent);

    if (scratchedPercent > 50 && !tile.revealed) {
      onReveal(tile.id);
      haptics.success();
    }
  };

  return (
    <div className="relative w-24 h-24 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
        <AnimatePresence>
          {tile.revealed && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="text-center"
            >
              <span className="text-4xl">{tile.symbol}</span>
              <p className="text-xs text-white/70 mt-1">{tile.label}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {!tile.revealed && (
        <canvas
          ref={canvasRef}
          width={96}
          height={96}
          className="absolute inset-0 cursor-pointer touch-none"
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            handleStart();
            initCanvas();
          }}
          onTouchEnd={handleEnd}
          onTouchMove={(e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
          }}
          onLoad={initCanvas}
          style={{ touchAction: "none" }}
        />
      )}
    </div>
  );
}

export default function ScratchCards() {
  const [currentCard, setCurrentCard] = useState<ScratchTile[] | null>(null);
  const [allRevealed, setAllRevealed] = useState(false);
  const [totalWon, setTotalWon] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: gameData } = useQuery({
    queryKey: ["/api/game/balance"],
    queryFn: async () => {
      const res = await fetch("/api/game/balance", { credentials: "include" });
      if (!res.ok) return { scratchCardsAvailable: 1, points: 0 };
      return res.json();
    },
  });

  const startNewCard = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/game/scratch-card", {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to get scratch card");
      }
      
      const data = await res.json();
      
      const tiles: ScratchTile[] = data.tiles.map((tile: any) => ({
        ...tile,
        revealed: false,
        scratched: 0,
      }));
      
      setCurrentCard(tiles);
      setAllRevealed(false);
      setTotalWon(0);
      queryClient.invalidateQueries({ queryKey: ["/api/game/balance"] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get scratch card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleScratch = (id: number, amount: number) => {
    if (!currentCard) return;
    setCurrentCard(prev => 
      prev?.map(t => t.id === id ? { ...t, scratched: amount } : t) || null
    );
  };

  const handleReveal = async (id: number) => {
    if (!currentCard) return;
    
    const updated = currentCard.map(t => t.id === id ? { ...t, revealed: true } : t);
    setCurrentCard(updated);
    
    if (updated.every(t => t.revealed)) {
      setAllRevealed(true);
      const total = updated.reduce((sum, t) => sum + t.value, 0);
      setTotalWon(total);
      
      if (total > 0) {
        confetti({ particleCount: 50, spread: 60 });
        
        try {
          await fetch("/api/game/claim-scratch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ totalPoints: total }),
          });
          queryClient.invalidateQueries({ queryKey: ["/api/game/balance"] });
        } catch (error) {
          console.error("Failed to claim rewards:", error);
        }
      }
    }
  };

  const cardsAvailable = gameData?.scratchCardsAvailable || 1;

  return (
    <div className="min-h-screen bg-black pb-24">
      <motion.div
        className="w-full max-w-lg mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="h-8 w-8 text-pink-400" />
            <h1 className="text-3xl font-bold text-white">Scratch Cards</h1>
          </div>
          <p className="text-white/60 text-sm">Scratch to reveal your rewards!</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
          <Card className="bg-gradient-to-br from-pink-500/20 to-pink-500/10 border-pink-500/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Gift className="h-4 w-4 text-pink-400" />
                <span className="text-xs text-white/60">Cards Available</span>
              </div>
              <p className="text-2xl font-bold text-white">{cardsAvailable}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-white/60">Your Points</span>
              </div>
              <p className="text-2xl font-bold text-white">{gameData?.points?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
        </motion.div>

        {!currentCard ? (
          <motion.div variants={itemVariants} className="text-center">
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-white/10 mb-6">
              <CardContent className="p-8">
                <motion.div
                  className="h-32 w-32 mx-auto rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center mb-6"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Gift className="h-16 w-16 text-pink-400" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">Ready to Scratch?</h2>
                <p className="text-white/60 text-sm mb-6">
                  Reveal 3 tiles to win points and rewards!
                </p>
                <Button
                  onClick={startNewCard}
                  disabled={cardsAvailable <= 0}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  data-testid="button-start-scratch"
                >
                  {cardsAvailable > 0 ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Start Scratching
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
                      No Cards Available
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-white/10 mb-6">
              <CardContent className="p-6">
                <div className="flex justify-center gap-4 mb-6">
                  {currentCard.map((tile) => (
                    <ScratchTileComponent
                      key={tile.id}
                      tile={tile}
                      onScratch={handleScratch}
                      onReveal={handleReveal}
                    />
                  ))}
                </div>

                {!allRevealed && (
                  <p className="text-center text-white/50 text-sm">
                    Scratch all 3 tiles to reveal your rewards!
                  </p>
                )}

                <AnimatePresence>
                  {allRevealed && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center mt-4"
                    >
                      <div className="flex items-center justify-center gap-2 mb-4">
                        <PartyPopper className="h-6 w-6 text-yellow-400" />
                        <span className="text-lg font-bold text-white">
                          {totalWon > 0 ? `You won ${totalWon} points!` : "Better luck next time!"}
                        </span>
                      </div>
                      <Button
                        onClick={() => setCurrentCard(null)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Done
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <Link href="/daily-spin">
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 flex items-center justify-between cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">Daily Wheel Spin</p>
                  <p className="text-xs text-white/50">Spin for bigger rewards!</p>
                </div>
              </div>
              <Badge className="bg-purple-500/20 text-purple-400 border-0">Free</Badge>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
