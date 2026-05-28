import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Trophy, Zap, Target, Users, Star, Award, Flame, Crown } from "lucide-react";

const achievements = [
  { icon: "🎯", name: "Deal Hunter", description: "Found 10 deals", unlocked: true },
  { icon: "💰", name: "Budget Master", description: "Stayed under budget 5 weeks", unlocked: true },
  { icon: "🌿", name: "Green Champion", description: "Shopped sustainable 10 times", unlocked: true },
  { icon: "🚀", name: "Speed Shopper", description: "Added 50 items to cart", unlocked: false },
  { icon: "⭐", name: "Community Star", description: "Got 100 upvotes", unlocked: false },
  { icon: "🏆", name: "Perth Legend", description: "Saved $1000+", unlocked: false },
];

const leaderboard = [
  { rank: 1, name: "Sarah M.", savings: "$2,450", avatar: "SM", streak: 42 },
  { rank: 2, name: "Mike T.", savings: "$1,890", avatar: "MT", streak: 28 },
  { rank: 3, name: "You", savings: "$892", avatar: "YO", streak: 12 },
  { rank: 4, name: "Jessica L.", savings: "$756", avatar: "JL", streak: 19 },
  { rank: 5, name: "David C.", savings: "$645", avatar: "DC", streak: 8 },
];

const challenges = [
  { name: "Budget Buster", description: "Stay 30% under budget", progress: 75, reward: "50 pts", difficulty: "Easy" },
  { name: "Deal Collector", description: "Find 15 deals in 1 week", progress: 60, reward: "100 pts", difficulty: "Medium" },
  { name: "Sustainability Star", description: "Shop at local stores only", progress: 40, reward: "150 pts", difficulty: "Hard" },
];

export default function Gamification() {
  return (
    <div className="min-h-screen">
      
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Your Journey</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Earn badges, climb the leaderboard, and unlock rewards</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-3 mb-6 sm:mb-8">
          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-white/60 text-xs sm:text-sm">Current Streak</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-accent mt-1 sm:mt-2">12 days</p>
                </div>
                <Flame className="h-10 w-10 text-accent opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Level</p>
                  <p className="text-3xl font-display font-bold text-primary mt-2">8</p>
                </div>
                <Star className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Perth Saver Points</p>
                  <p className="text-3xl font-display font-bold text-accent mt-2">2,450</p>
                </div>
                <Award className="h-10 w-10 text-accent opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="bg-white/8 border border-white/15">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          {/* Achievements */}
          <TabsContent value="achievements">
            <div className="flex flex-col gap-4">
              {achievements.map((achievement, i) => (
                <Card key={`achievement-${achievement.name}`} className={`bg-gradient-to-br ${achievement.unlocked ? 'from-white/8 to-white/4' : 'from-white/4 to-white/2 opacity-60'} border-white/8`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-5xl mb-3">{achievement.icon}</div>
                    <h3 className="font-display font-semibold text-white mb-1">{achievement.name}</h3>
                    <p className="text-xs text-white/60 mb-3">{achievement.description}</p>
                    {achievement.unlocked ? (
                      <Badge className="bg-accent/20 text-accent border-accent/30">Unlocked</Badge>
                    ) : (
                      <Badge variant="outline" className="border-white/20 text-white/60">Locked</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
              <CardHeader>
                <CardTitle className="font-display text-white flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-accent" />
                  Perth Saver Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/8 hover:bg-white/8 transition-smooth">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                        {user.rank === 1 ? (
                          <Crown className="h-5 w-5 text-accent" />
                        ) : user.rank === 2 ? (
                          <Trophy className="h-5 w-5 text-white/60" />
                        ) : (
                          <span className="font-display font-bold text-white">{user.rank}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-white/60">🔥 {user.streak} day streak</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{user.savings}</p>
                        <p className="text-xs text-white/60">total saved</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges">
            <div className="space-y-4">
              {challenges.map((challenge, i) => (
                <Card key={`challenge-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-display font-semibold text-white mb-1">{challenge.name}</h3>
                        <p className="text-sm text-white/60">{challenge.description}</p>
                      </div>
                      <Badge variant="outline" className={`border-white/20 text-xs font-semibold ${
                        challenge.difficulty === 'Easy' ? 'text-accent' :
                        challenge.difficulty === 'Medium' ? 'text-white/60' :
                        'text-white/60'
                      }`}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <Progress value={challenge.progress} className="mb-3" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">{challenge.progress}% complete</span>
                      <span className="font-semibold text-accent">+{challenge.reward}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
