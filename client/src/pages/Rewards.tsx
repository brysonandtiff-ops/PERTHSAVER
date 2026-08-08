import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gift, TrendingUp, Clock, DollarSign, ExternalLink, Calendar, Award } from "lucide-react";

const LOYALTY_PROGRAMS = [
  {
    id: "flybuys",
    name: "Flybuys",
    logo: "🛒",
    points: 8450,
    value: 42.25,
    expiryDate: "2026-03-15",
    linked: true,
    color: "text-red-400 border-red-500/30 bg-red-500/10",
  },
  {
    id: "everyday-rewards",
    name: "Everyday Rewards",
    logo: "🏪",
    points: 3200,
    value: 16.00,
    expiryDate: "2025-12-31",
    linked: true,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  },
  {
    id: "velocity",
    name: "Velocity Frequent Flyer",
    logo: "✈️",
    points: 12500,
    value: 125.00,
    expiryDate: "2026-06-30",
    linked: false,
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    id: "qantas",
    name: "Qantas Points",
    logo: "🦘",
    points: 0,
    value: 0,
    expiryDate: null,
    linked: false,
    color: "text-red-400 border-red-500/30 bg-red-500/10",
  },
  {
    id: "perkopolis",
    name: "Perkopolis",
    logo: "🎁",
    points: 550,
    value: 5.50,
    expiryDate: "2025-09-01",
    linked: true,
    color: "text-purple-400 border-purple-500/30 bg-purple-500/10",
  },
  {
    id: "amex",
    name: "Amex Rewards",
    logo: "💳",
    points: 0,
    value: 0,
    expiryDate: null,
    linked: false,
    color: "text-green-400 border-green-500/30 bg-green-500/10",
  },
];

const REWARDS_HISTORY = [
  {
    id: 1,
    date: "2025-11-20",
    program: "Flybuys",
    points: 250,
    description: "Woolworths shopping - $125 spent",
    type: "earned",
  },
  {
    id: 2,
    date: "2025-11-18",
    program: "Everyday Rewards",
    points: 100,
    description: "Coles fuel - 40L at 159.9c/L",
    type: "earned",
  },
  {
    id: 3,
    date: "2025-11-15",
    program: "Flybuys",
    points: -2000,
    description: "Redeemed for $10 Woolworths eGift Card",
    type: "redeemed",
  },
  {
    id: 4,
    date: "2025-11-12",
    program: "Perkopolis",
    points: 150,
    description: "Restaurant booking bonus",
    type: "earned",
  },
  {
    id: 5,
    date: "2025-11-08",
    program: "Everyday Rewards",
    points: 300,
    description: "Bonus points from shopping challenge",
    type: "earned",
  },
];

export default function Rewards() {
  const [isLoading] = useState(false);

  const linkedPrograms = LOYALTY_PROGRAMS.filter(p => p.linked);
  const unlinkedPrograms = LOYALTY_PROGRAMS.filter(p => !p.linked);
  const totalPoints = linkedPrograms.reduce((sum, p) => sum + p.points, 0);
  const totalValue = linkedPrograms.reduce((sum, p) => sum + p.value, 0);

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="flex flex-col sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white" data-testid="text-page-title">
              Rewards & Loyalty
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/60 mt-1 sm:mt-2" data-testid="text-page-subtitle">
              Track and maximize your loyalty program benefits
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <Card className="glass border-white/8" data-testid="card-total-value">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Total Value</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary mt-1" data-testid="text-total-value">
                    ${totalValue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-total-points">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Total Points</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-accent mt-1" data-testid="text-total-points">
                    {totalPoints.toLocaleString()}
                  </p>
                </div>
                <Award className="h-10 w-10 text-accent opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-linked-programs">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">Linked Programs</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-white mt-1" data-testid="text-linked-programs">
                    {linkedPrograms.length}
                  </p>
                </div>
                <Gift className="h-10 w-10 text-purple-400 opacity-30" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-white/8" data-testid="card-monthly-earned">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm font-light">This Month</p>
                  <p className="text-2xl sm:text-3xl font-display font-bold text-primary mt-1" data-testid="text-monthly-earned">
                    +800
                  </p>
                </div>
                <TrendingUp className="h-10 w-10 text-primary opacity-30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Linked Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4" data-testid="text-linked-title">
            Your Linked Programs
          </h2>
          {isLoading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={`skeleton-${i}`} className="glass border-white/8">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 bg-white/10" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-20 w-full bg-white/10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : linkedPrograms.length === 0 ? (
            <Card className="glass border-white/8" data-testid="card-empty-linked">
              <CardContent className="p-12 text-center">
                <Gift className="h-16 w-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-xl font-display font-bold text-white mb-2">No Linked Programs</h3>
                <p className="text-white/60">Link your loyalty accounts to start tracking rewards</p>
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {linkedPrograms.map((program) => (
                <Card 
                  key={program.id} 
                  className="glass border-white/8 hover:border-primary/30 transition-all"
                  data-testid={`card-program-${program.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{program.logo}</div>
                        <div>
                          <CardTitle className="text-white text-lg" data-testid={`text-program-name-${program.id}`}>
                            {program.name}
                          </CardTitle>
                          <Badge className={`mt-1 ${program.color}`} data-testid={`badge-linked-${program.id}`}>
                            Linked
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Points Balance</span>
                        <span className="text-white font-semibold" data-testid={`text-points-${program.id}`}>
                          {program.points.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60 text-sm">Estimated Value</span>
                        <span className="text-primary font-semibold" data-testid={`text-value-${program.id}`}>
                          ${program.value.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {program.expiryDate && (
                      <div className="flex items-center gap-2 text-sm text-white/60 pt-2 border-t border-white/5">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`text-expiry-${program.id}`}>
                          Expires: {new Date(program.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <Button 
                      variant="outline" 
                      className="w-full border-white/10 text-white hover:bg-white/5"
                      data-testid={`button-view-${program.id}`}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Available Programs */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-4" data-testid="text-available-title">
            Available Programs
          </h2>
          <div className="flex flex-col gap-6">
            {unlinkedPrograms.map((program) => (
              <Card 
                key={program.id} 
                className="glass border-white/8 hover:border-accent/30 transition-all opacity-70"
                data-testid={`card-available-${program.id}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-4xl opacity-50">{program.logo}</div>
                    <div>
                      <CardTitle className="text-white text-lg" data-testid={`text-available-name-${program.id}`}>
                        {program.name}
                      </CardTitle>
                      <CardDescription className="text-white/40">Not linked</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-accent hover:bg-accent/90 text-background"
                    data-testid={`button-link-${program.id}`}
                  >
                    Link Account
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Rewards History */}
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-4" data-testid="text-history-title">
            Recent Activity
          </h2>
          <Card className="glass border-white/8">
            <CardContent className="p-6">
              <div className="space-y-4">
                {REWARDS_HISTORY.map((item, index) => (
                  <div 
                    key={item.id}
                    className={`flex items-start gap-4 pb-4 ${index !== REWARDS_HISTORY.length - 1 ? 'border-b border-white/5' : ''}`}
                    data-testid={`history-item-${item.id}`}
                  >
                    <div className={`p-2 rounded-lg ${item.type === 'earned' ? 'bg-primary/10' : 'bg-purple-500/10'}`}>
                      {item.type === 'earned' ? (
                        <TrendingUp className="h-5 w-5 text-primary" />
                      ) : (
                        <Gift className="h-5 w-5 text-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-white font-medium" data-testid={`history-description-${item.id}`}>
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/60 text-sm">{item.program}</span>
                            <span className="text-white/40">•</span>
                            <span className="text-white/60 text-sm flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span 
                          className={`font-semibold ${item.type === 'earned' ? 'text-primary' : 'text-accent'}`}
                          data-testid={`history-points-${item.id}`}
                        >
                          {item.points > 0 ? '+' : ''}{item.points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
