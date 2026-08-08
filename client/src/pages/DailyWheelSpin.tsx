import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, Star, Zap, Trophy, Sparkles, Clock, 
  Flame, Crown, ChevronRight, PartyPopper
} from "lucide-react";
import confetti from "canvas-confetti";
import { haptics } from "@/lib/haptics";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const WHEEL_SEGMENTS = [
  { id: 1, label: "100 pts", value: 100, color: "#A855F7", rarity: "common", icon: Star },
  { id: 2, label: "$2 Credit", value: 200, color: "#06B6D4", rarity: "uncommon", icon: Gift },
  { id: 3, label: "50 pts", value: 50, color: "#8B5CF6", rarity: "common", icon: Star },
  { id: 4, label: "Streak Saver", value: 0, color: "#10B981", rarity: "rare", icon: Flame },
  { id: 5, label: "250 pts", value: 250, color: "#A855F7", rarity: "uncommon", icon: Star },
  { id: 6, label: "$5 Credit", value: 500, color: "#F59E0B", rarity: "rare", icon: Trophy },
  { id: 7, label: "75 pts", value: 75, color: "#8B5CF6", rarity: "common", icon: Star },
  { id: 8, label: "2x Booster", value: 0, color: "#06B6D4", rarity: "uncommon", icon: Zap },
  { id: 9, label: "150 pts", value: 150, color: "#A855F7", rarity: "common", icon: Star },
  { id: 10, label: "$10 Credit", value: 1000, color: "#EF4444", rarity: "legendary", icon: Crown },
  { id: 11, label: "100 pts", value: 100, color: "#8B5CF6", rarity: "common", icon: Star },
  { id: 12, label: "Mystery Box", value: 0, color: "#EC4899", rarity: "rare", icon: Gift },
];

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

export default function DailyWheelSpin() {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonPrize, setWonPrize] = useState<typeof WHEEL_SEGMENTS[0] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: gameData, isLoading } = useQuery({
    queryKey: ["/api/game/balance"],
    queryFn: async () => {
      const res = await fetch("/api/game/balance", { credentials: "include" });
      if (!res.ok) {
        return { 
          points: 0, 
          currentStreak: 0, 
          longestStreak: 0, 
          canSpinToday: true,
          lastSpinAt: null,
          bonusSpins: 0
        };
      }
      return res.json();
    },
  });

  const handleSpin = async () => {
    if (isSpinning || (!gameData?.canSpinToday && !gameData?.bonusSpins)) return;

    setIsSpinning(true);
    setShowResult(false);
    setWonPrize(null);
    haptics.medium();

    try {
      const res = await fetch("/api/game/spin", {
        method: "POST",
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to spin");
      const data = await res.json();
      
      const winningIndex = data.segmentIndex;
      const segmentAngle = 360 / WHEEL_SEGMENTS.length;
      const targetAngle = 360 - (winningIndex * segmentAngle) - (segmentAngle / 2);
      const spins = 5 + Math.random() * 3;
      const finalRotation = rotation + (spins * 360) + targetAngle;

      setRotation(finalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setWonPrize({
          ...WHEEL_SEGMENTS[winningIndex],
          label: data.reward.label,
          value: data.reward.value,
        });
        setShowResult(true);
        haptics.success();
        
        if (data.reward.rarity === "legendary") {
          triggerConfetti();
        } else if (data.reward.rarity === "rare") {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        }
        
        queryClient.invalidateQueries({ queryKey: ["/api/game/balance"] });
      }, 5000);
    } catch (error) {
      setIsSpinning(false);
      toast({
        title: "Spin failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#A855F7", "#06B6D4", "#F59E0B"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  const canSpin = gameData?.canSpinToday || (gameData?.bonusSpins || 0) > 0;

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
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-8 w-8 text-purple-400" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Daily Spin</h1>
          </div>
          <p className="text-white/60 text-sm">Spin the wheel to win rewards!</p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border-purple-500/30 flex-1">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-xs text-white/60">Points</span>
              </div>
              <p className="text-2xl font-bold text-white">{gameData?.points?.toLocaleString() || 0}</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/10 border-orange-500/30 flex-1">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-xs text-white/60">Streak</span>
              </div>
              <p className="text-2xl font-bold text-white">{gameData?.currentStreak || 0} days</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-purple-500/20 rounded-full blur-3xl opacity-50" />
          
          <div className="relative flex items-center justify-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
              <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-purple-500 drop-shadow-lg" />
            </div>

            <motion.div
              ref={wheelRef}
              className="relative w-72 h-72 rounded-full border-4 border-purple-500/50 shadow-2xl overflow-hidden"
              style={{ rotate: `${rotation}deg` }}
              animate={{ rotate: `${rotation}deg` }}
              transition={{ 
                duration: isSpinning ? 5 : 0, 
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {WHEEL_SEGMENTS.map((segment, index) => {
                  const angle = 360 / WHEEL_SEGMENTS.length;
                  const startAngle = index * angle - 90;
                  const endAngle = startAngle + angle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;
                  const x1 = 50 + 50 * Math.cos(startRad);
                  const y1 = 50 + 50 * Math.sin(startRad);
                  const x2 = 50 + 50 * Math.cos(endRad);
                  const y2 = 50 + 50 * Math.sin(endRad);
                  const largeArc = angle > 180 ? 1 : 0;
                  const midAngle = (startAngle + endAngle) / 2;
                  const midRad = (midAngle * Math.PI) / 180;
                  const textX = 50 + 32 * Math.cos(midRad);
                  const textY = 50 + 32 * Math.sin(midRad);

                  return (
                    <g key={segment.id}>
                      <path
                        d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={segment.color}
                        stroke="rgba(0,0,0,0.3)"
                        strokeWidth="0.5"
                      />
                      <text
                        x={textX}
                        y={textY}
                        fill="white"
                        fontSize="4"
                        fontWeight="bold"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}
                      >
                        {segment.label}
                      </text>
                    </g>
                  );
                })}
                <circle cx="50" cy="50" r="12" fill="#1a1a2e" stroke="#A855F7" strokeWidth="2" />
                <circle cx="50" cy="50" r="8" fill="#A855F7" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mb-6">
          <Button
            onClick={handleSpin}
            disabled={isSpinning || !canSpin}
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-spin"
          >
            {isSpinning ? (
              <motion.span
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                Spinning...
              </motion.span>
            ) : canSpin ? (
              <span className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Spin the Wheel!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Come back tomorrow!
              </span>
            )}
          </Button>

          {gameData?.bonusSpins > 0 && (
            <p className="text-sm text-cyan-400 mt-2">
              +{gameData.bonusSpins} bonus spin{gameData.bonusSpins > 1 ? "s" : ""} available!
            </p>
          )}
        </motion.div>

        <AnimatePresence>
          {showResult && wonPrize && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              onClick={() => setShowResult(false)}
            >
              <motion.div
                className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-3xl p-8 max-w-sm w-full border border-purple-500/30 text-center"
                onClick={(e) => e.stopPropagation()}
                initial={{ rotate: -5 }}
                animate={{ rotate: 0 }}
              >
                <motion.div
                  className="mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                    <PartyPopper className="h-10 w-10 text-white" />
                  </div>
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">Congratulations!</h2>
                <p className="text-white/60 mb-4">You won:</p>

                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                  <Badge 
                    className={`mb-2 ${
                      wonPrize.rarity === "legendary" ? "bg-yellow-500/20 text-yellow-400" :
                      wonPrize.rarity === "rare" ? "bg-purple-500/20 text-purple-400" :
                      wonPrize.rarity === "uncommon" ? "bg-cyan-500/20 text-cyan-400" :
                      "bg-white/10 text-white/60"
                    }`}
                  >
                    {wonPrize.rarity.toUpperCase()}
                  </Badge>
                  <p className="text-3xl font-bold text-white">{wonPrize.label}</p>
                </div>

                <Button
                  onClick={() => setShowResult(false)}
                  className="w-full bg-gradient-to-r from-purple-500 to-cyan-500"
                >
                  Awesome!
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-3">More Fun</h3>
          <div className="space-y-3">
            <Link href="/scratch-cards">
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-between cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                    <Gift className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Scratch Cards</p>
                    <p className="text-xs text-white/50">Reveal hidden rewards</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40" />
              </motion.div>
            </Link>

            <Link href="/challenges">
              <motion.div
                className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 flex items-center justify-between cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Daily Challenges</p>
                    <p className="text-xs text-white/50">Complete tasks for bonus spins</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-white/40" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
