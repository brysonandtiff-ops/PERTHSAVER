import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, MapPin, Users, TrendingUp, Medal, Crown,
  Star, Flame, Target, ChevronRight, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface SuburbData {
  rank: number;
  suburb: string;
  postcode: string;
  totalSavings: number;
  members: number;
  weeklyGrowth: number;
  badge?: string;
}

export default function SuburbLeagues() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");

  const suburbLeaderboard: SuburbData[] = [
    { rank: 1, suburb: "Joondalup", postcode: "6027", totalSavings: 127450, members: 342, weeklyGrowth: 12, badge: "Champion" },
    { rank: 2, suburb: "Fremantle", postcode: "6160", totalSavings: 118920, members: 289, weeklyGrowth: 8, badge: "Rising Star" },
    { rank: 3, suburb: "Subiaco", postcode: "6008", totalSavings: 112340, members: 267, weeklyGrowth: 15, badge: "Hot Streak" },
    { rank: 4, suburb: "Scarborough", postcode: "6019", totalSavings: 98760, members: 234, weeklyGrowth: 5 },
    { rank: 5, suburb: "Victoria Park", postcode: "6100", totalSavings: 94230, members: 198, weeklyGrowth: 9 },
    { rank: 6, suburb: "Morley", postcode: "6062", totalSavings: 89450, members: 176, weeklyGrowth: 11 },
    { rank: 7, suburb: "Cannington", postcode: "6107", totalSavings: 82340, members: 165, weeklyGrowth: 7 },
    { rank: 8, suburb: "Rockingham", postcode: "6168", totalSavings: 78920, members: 154, weeklyGrowth: 4 },
  ];

  const mySuburb = { suburb: "South Perth", postcode: "6151", rank: 12, totalSavings: 45670, members: 89, weeklyGrowth: 18 };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-cyan-600" />;
    return <span className="text-lg font-bold text-white/50">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="bg-gradient-to-b from-blue-950/20 to-transparent">
        <div className="px-6 pt-6 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500"
              animate={{ boxShadow: ["0 0 20px rgba(6,182,212,0.3)", "0 0 35px rgba(6,182,212,0.5)", "0 0 20px rgba(6,182,212,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Trophy className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="leagues-title">
                Suburb Leagues
              </h1>
              <p className="text-white/60 text-sm">Compete with Perth neighbourhoods</p>
            </div>
          </div>

          <motion.div 
            className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-2xl p-5 border border-purple-500/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            data-testid="stats-my-suburb"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-semibold">{mySuburb.suburb}</p>
                  <p className="text-white/40 text-sm">Your suburb</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-white">#{mySuburb.rank}</p>
                <p className="text-cyan-400 text-xs flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{mySuburb.weeklyGrowth}% this week
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-cyan-400">${mySuburb.totalSavings.toLocaleString()}</p>
                <p className="text-xs text-white/40">Total Saved</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-purple-400">{mySuburb.members}</p>
                <p className="text-xs text-white/40">Neighbours</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="flex gap-2">
          {[
            { id: "week", label: "This Week" },
            { id: "month", label: "This Month" },
            { id: "year", label: "This Year" },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={timeframe === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setTimeframe(tab.id as any)}
              className={`flex-1 rounded-xl ${
                timeframe === tab.id 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Perth Leaderboard
          </h3>
          
          {suburbLeaderboard.map((suburb, idx) => (
            <motion.div
              key={suburb.rank}
              className={`rounded-xl p-4 border ${
                suburb.rank <= 3 
                  ? "bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/30" 
                  : "bg-zinc-900/50 border-white/5"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              data-testid={`suburb-rank-${suburb.rank}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    {getRankIcon(suburb.rank)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold">{suburb.suburb}</p>
                      {suburb.badge && (
                        <Badge className={`text-xs ${
                          suburb.badge === "Champion" ? "bg-yellow-500/20 text-yellow-300" :
                          suburb.badge === "Rising Star" ? "bg-purple-500/20 text-purple-300" :
                          "bg-cyan-500/20 text-cyan-300"
                        }`}>
                          {suburb.badge === "Hot Streak" && <Flame className="w-3 h-3 mr-1" />}
                          {suburb.badge === "Champion" && <Crown className="w-3 h-3 mr-1" />}
                          {suburb.badge === "Rising Star" && <Star className="w-3 h-3 mr-1" />}
                          {suburb.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-white/40 text-sm">{suburb.postcode} • {suburb.members} savers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-cyan-400">
                    ${(suburb.totalSavings / 1000).toFixed(1)}K
                  </p>
                  <p className={`text-xs ${suburb.weeklyGrowth > 10 ? "text-cyan-400" : "text-white/40"}`}>
                    +{suburb.weeklyGrowth}%
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-purple-500/10 rounded-2xl p-5 border border-purple-500/20">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Weekly Challenge</span>
          </div>
          <p className="text-white/60 text-sm mb-3">
            Help {mySuburb.suburb} reach Top 10! Save $500 more as a community to unlock bonus rewards.
          </p>
          <Progress value={68} className="h-2 mb-2" />
          <p className="text-white/40 text-xs text-right">$340 of $500 goal</p>
        </div>
      </div>
    </div>
  );
}
