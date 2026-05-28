import { useState, useEffect } from "react";
import { useLeaderboard, useToggleLeaderboardVisibility, useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, ShoppingBag, Zap, Target, TrendingUp, Eye, EyeOff, Crown, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ErrorState } from "@/components/ErrorState";
import { PageLoader } from "@/components/PageLoader";
import { EmptyState } from "@/components/EmptyState";
import confetti from "canvas-confetti";

const BADGE_INFO = {
  grocery_guru: { label: "Grocery Guru", icon: ShoppingBag, color: "bg-cyan-500", description: "Saved $500 on groceries" },
  bill_buster: { label: "Bill Buster", icon: Zap, color: "bg-purple-500", description: "Optimized 5+ bills" },
  deal_hunter: { label: "Deal Hunter", icon: Target, color: "bg-teal-500", description: "Claimed 20+ deals" },
  savings_streak: { label: "Savings Streak", icon: TrendingUp, color: "bg-cyan-500", description: "7 consecutive days of savings" },
  perth_pioneer: { label: "Perth Pioneer", icon: Star, color: "bg-teal-500", description: "Early adopter" },
};

const getRankTier = (totalSavings: number) => {
  if (totalSavings >= 5000) return { tier: "Platinum", color: "from-purple-400 to-cyan-600", icon: Crown };
  if (totalSavings >= 2000) return { tier: "Gold", color: "from-cyan-400 to-cyan-600", icon: Trophy };
  if (totalSavings >= 500) return { tier: "Silver", color: "from-gray-300 to-gray-500", icon: Medal };
  return { tier: "Bronze", color: "from-slate-500 to-slate-700", icon: Award };
};

const getInitials = (displayName: string) => {
  return displayName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatCurrency = (amount: string | number) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export default function Leaderboard() {
  const [timeframe, setTimeframe] = useState<"all" | "month" | "week">("all");
  const { data: authData, isLoading: authLoading } = useAuth();
  const { data, isLoading, error } = useLeaderboard(timeframe);
  const toggleVisibility = useToggleLeaderboardVisibility();

  if (authLoading) return <PageLoader />;
  if (!authData?.user) return <AuthRequired />;

  const currentUserId = authData?.user?.id;
  const leaderboard = data?.leaderboard || [];
  const userStats = data?.userStats;

  const getSavingsForTimeframe = (entry: any) => {
    if (timeframe === "month") return parseFloat(entry.savingsThisMonth || "0");
    if (timeframe === "week") return parseFloat(entry.savingsThisWeek || "0");
    return parseFloat(entry.totalSavings || "0");
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => 
    getSavingsForTimeframe(b) - getSavingsForTimeframe(a)
  );

  const topThree = sortedLeaderboard.slice(0, 3);
  const restOfList = sortedLeaderboard.slice(3);

  const userRank = sortedLeaderboard.findIndex(entry => entry.userId === currentUserId) + 1;
  const isUserInTopThree = userRank > 0 && userRank <= 3;

  useEffect(() => {
    if (userRank === 1 && sortedLeaderboard.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#14b8a6', '#0ea5e9', '#8b5cf6'],
      });
    }
  }, [userRank, sortedLeaderboard.length]);

  const handleToggleVisibility = async () => {
    try {
      await toggleVisibility.mutateAsync(!userStats?.isPublic);
      toast({
        title: userStats?.isPublic ? "Hidden from leaderboard" : "Now visible on leaderboard",
        description: userStats?.isPublic 
          ? "You won't appear on the public leaderboard" 
          : "Other users can now see your progress",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update visibility settings",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <PageLoader />;
  if (error) return <ErrorState type="server" />;

  const timeframeLabel = timeframe === "all" ? "All Time" : timeframe === "month" ? "This Month" : "This Week";

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-primary" data-testid="icon-trophy" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white" data-testid="text-page-title">
              Community Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/60" data-testid="text-page-subtitle">
            See how you stack up against Perth's savviest savers! Every dollar saved brings you closer to the top.
          </p>
          
          {userStats && userRank > 0 && (
            <Card className="glass border-white/8 mt-6" data-testid="card-user-rank">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankTier(getSavingsForTimeframe(userStats)).color} flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg" data-testid="text-user-rank">#{userRank}</span>
                    </div>
                    <div>
                      <p className="text-white/60 text-sm">Your Rank</p>
                      <p className="text-white font-semibold text-lg" data-testid="text-user-tier">{getRankTier(getSavingsForTimeframe(userStats)).tier} Tier</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white/60 text-sm">{timeframeLabel} Savings</p>
                    <p className="text-primary font-bold text-2xl" data-testid="text-user-savings">
                      {formatCurrency(getSavingsForTimeframe(userStats))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="mb-8" data-testid="tabs-timeframe">
          <TabsList className="glass border-white/8 w-full sm:w-auto">
            <TabsTrigger value="all" data-testid="tab-all">All Time</TabsTrigger>
            <TabsTrigger value="month" data-testid="tab-month">This Month</TabsTrigger>
            <TabsTrigger value="week" data-testid="tab-week">This Week</TabsTrigger>
          </TabsList>

          <TabsContent value={timeframe} className="mt-8">
            {sortedLeaderboard.length === 0 ? (
              <EmptyState
                icon={Trophy}
                title="No leaderboard data yet"
                description="Start saving to see the community leaderboard come to life!"
                data-testid="empty-leaderboard"
              />
            ) : (
              <>
                {topThree.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 mb-8" data-testid="section-podium">
                    {topThree.map((entry, index) => {
                      const position = index + 1;
                      const isCurrentUser = entry.userId === currentUserId;
                      const tierInfo = getRankTier(getSavingsForTimeframe(entry));
                      const TierIcon = tierInfo.icon;

                      const gradients = [
                        "from-purple-400 via-cyan-500 to-purple-600",
                        "from-slate-300 via-slate-400 to-slate-500",
                        "from-slate-500 via-slate-600 to-slate-700",
                      ];

                      const medals = ["🥇", "🥈", "🥉"];

                      return (
                        <Card
                          key={entry.id}
                          className={`glass border-white/8 relative overflow-hidden ${isCurrentUser ? "ring-2 ring-primary" : ""}`}
                          data-testid={`card-podium-${position}`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-10`} />
                          <CardContent className="pt-8 relative z-10">
                            <div className="text-center">
                              <div className="text-5xl mb-3" data-testid={`medal-${position}`}>{medals[index]}</div>
                              <Avatar className="w-20 h-20 mx-auto mb-4 border-2 border-white/20" data-testid={`avatar-${position}`}>
                                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-600 text-white text-xl font-bold">
                                  {getInitials(entry.displayName)}
                                </AvatarFallback>
                              </Avatar>
                              <h3 className="text-white font-bold text-lg mb-1" data-testid={`name-${position}`}>
                                {isCurrentUser && <Crown className="inline h-4 w-4 text-primary mr-1" />}
                                {entry.displayName}
                                {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                              </h3>
                              <div className="flex items-center justify-center gap-1 mb-3">
                                <TierIcon className="h-4 w-4 text-white/60" />
                                <span className="text-white/60 text-sm">{tierInfo.tier}</span>
                              </div>
                              <p className="text-primary font-bold text-2xl mb-4" data-testid={`savings-${position}`}>
                                {formatCurrency(getSavingsForTimeframe(entry))}
                              </p>
                              {entry.badges && entry.badges.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2">
                                  {entry.badges.slice(0, 3).map((badge: string) => {
                                    const badgeInfo = BADGE_INFO[badge as keyof typeof BADGE_INFO];
                                    if (!badgeInfo) return null;
                                    const BadgeIcon = badgeInfo.icon;
                                    return (
                                      <Badge
                                        key={badge}
                                        variant="secondary"
                                        className={`${badgeInfo.color} text-white border-0`}
                                        data-testid={`badge-${badge}-${position}`}
                                      >
                                        <BadgeIcon className="h-3 w-3 mr-1" />
                                        {badgeInfo.label}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {restOfList.length > 0 && (
                  <Card className="glass border-white/8" data-testid="card-leaderboard-list">
                    <CardHeader>
                      <CardTitle className="text-white">Full Rankings</CardTitle>
                      <CardDescription className="text-white/60">
                        Keep climbing to reach the podium!
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {restOfList.map((entry, index) => {
                          const position = index + 4;
                          const isCurrentUser = entry.userId === currentUserId;
                          const tierInfo = getRankTier(getSavingsForTimeframe(entry));
                          const TierIcon = tierInfo.icon;

                          return (
                            <div
                              key={entry.id}
                              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                                isCurrentUser 
                                  ? "bg-primary/10 border-2 border-primary" 
                                  : "bg-white/5 hover:bg-white/10"
                              }`}
                              data-testid={`leaderboard-entry-${position}`}
                            >
                              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 flex-shrink-0">
                                <span className="text-white font-bold text-lg" data-testid={`rank-${position}`}>#{position}</span>
                              </div>
                              
                              <Avatar className="w-12 h-12 flex-shrink-0" data-testid={`avatar-${position}`}>
                                <AvatarFallback className="bg-gradient-to-br from-purple-500/50 to-cyan-600/50 text-white font-semibold">
                                  {getInitials(entry.displayName)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-white font-semibold truncate" data-testid={`name-${position}`}>
                                    {entry.displayName}
                                    {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                                  </p>
                                  <div className="flex items-center gap-1">
                                    <TierIcon className="h-3 w-3 text-white/40" />
                                    <span className="text-white/40 text-xs">{tierInfo.tier}</span>
                                  </div>
                                </div>
                                
                                {entry.badges && entry.badges.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {entry.badges.slice(0, 4).map((badge: string) => {
                                      const badgeInfo = BADGE_INFO[badge as keyof typeof BADGE_INFO];
                                      if (!badgeInfo) return null;
                                      const BadgeIcon = badgeInfo.icon;
                                      return (
                                        <Badge
                                          key={badge}
                                          variant="outline"
                                          className="text-xs border-white/20"
                                          data-testid={`badge-${badge}-${position}`}
                                        >
                                          <BadgeIcon className="h-2.5 w-2.5 mr-1" />
                                          {badgeInfo.label}
                                        </Badge>
                                      );
                                    })}
                                    {entry.badges.length > 4 && (
                                      <Badge variant="outline" className="text-xs border-white/20">
                                        +{entry.badges.length - 4}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="text-right flex-shrink-0">
                                <p className="text-primary font-bold text-lg" data-testid={`savings-${position}`}>
                                  {formatCurrency(getSavingsForTimeframe(entry))}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        {userStats && (
          <Card className="glass border-white/8 mt-8" data-testid="card-privacy-controls">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                {userStats.isPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                Privacy Settings
              </CardTitle>
              <CardDescription className="text-white/60">
                Control your visibility on the leaderboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="leaderboard-visibility" className="text-white font-medium">
                    Show on Leaderboard
                  </Label>
                  <p className="text-sm text-white/60">
                    {userStats.isPublic 
                      ? "You're currently visible on the public leaderboard" 
                      : "You're hidden from the public leaderboard"}
                  </p>
                </div>
                <Switch
                  id="leaderboard-visibility"
                  checked={userStats.isPublic}
                  onCheckedChange={handleToggleVisibility}
                  disabled={toggleVisibility.isPending}
                  data-testid="switch-leaderboard-visibility"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="glass border-white/8 mt-8" data-testid="card-badges-info">
          <CardHeader>
            <CardTitle className="text-white">Badge Collection</CardTitle>
            <CardDescription className="text-white/60">
              Earn badges by reaching savings milestones
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(BADGE_INFO).map(([key, info]) => {
                const Icon = info.icon;
                const hasEarned = userStats?.badges?.includes(key);
                return (
                  <div
                    key={key}
                    className={`p-4 rounded-lg border ${
                      hasEarned 
                        ? "bg-white/5 border-primary/50" 
                        : "bg-white/2 border-white/5"
                    }`}
                    data-testid={`badge-info-${key}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-full ${info.color} flex items-center justify-center ${!hasEarned && "opacity-30"}`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`font-semibold ${hasEarned ? "text-white" : "text-white/40"}`}>
                          {info.label}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm ${hasEarned ? "text-white/60" : "text-white/30"}`}>
                      {info.description}
                    </p>
                    {hasEarned && (
                      <Badge variant="outline" className="mt-2 border-primary text-primary">
                        Earned ✓
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
