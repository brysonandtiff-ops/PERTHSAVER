import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Zap, Target, Trophy } from "lucide-react";
import { toast } from "sonner";

interface Challenge {
  id: string;
  title: string;
  description?: string;
  category: string;
  goalAmount?: string;
  goalDays?: number;
  difficulty: string;
  rewardPoints: number;
  tips?: string[];
}

interface UserChallenge {
  id: string;
  challengeId: string;
  status: string;
  amountSaved: string;
  progress: number;
  streak: number;
  challenge?: Challenge;
}

export default function SavingChallenges() {
  const [activeTab, setActiveTab] = useState<"available" | "active" | "completed">("available");

  const { data: challengesData, isLoading, refetch } = useQuery({
    queryKey: ["/api/challenges"],
    queryFn: async () => {
      const res = await fetch("/api/challenges");
      if (!res.ok) throw new Error("Failed to fetch challenges");
      return res.json();
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const res = await fetch(`/api/challenges/${challengeId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to join challenge");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Challenge joined! Start saving!");
      refetch();
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ userChallengeId, amountSaved }: { userChallengeId: string; amountSaved: number }) => {
      const res = await fetch(`/api/challenges/${userChallengeId}/progress`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountSaved }),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Progress updated!");
      refetch();
    },
  });

  const availableChallenges = challengesData?.available || [];
  const activeChallenges = challengesData?.active || [];
  const completedChallenges = challengesData?.completed || [];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const getChallengeList = () => {
    switch (activeTab) {
      case "active":
        return activeChallenges;
      case "completed":
        return completedChallenges;
      default:
        return availableChallenges;
    }
  };

  const currentList = getChallengeList();

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-cyan-500" />
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">Saving Challenges</h1>
          </div>
          <p className="text-white/60 text-base sm:text-lg">
            Gamified saving goals with rewards and streaks
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex gap-2 mb-8 border-b border-white/10"
        >
          {["available", "active", "completed"].map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              variant={activeTab === tab ? "default" : "ghost"}
              className={activeTab === tab
                ? "bg-cyan-500 hover:bg-cyan-600 text-white border-b-2 border-cyan-500"
                : "text-white/60 hover:text-white border-b-2 border-transparent"
              }
              data-testid={`button-tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </motion.div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
          </div>
        ) : currentList.length === 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center py-12"
          >
            <p className="text-white/60">
              {activeTab === "available" && "No available challenges at the moment"}
              {activeTab === "active" && "You're not active in any challenges"}
              {activeTab === "completed" && "You haven't completed any challenges yet"}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {currentList.map((item: any, idx: number) => {
              const challenge = item.challenge || item;
              const isUserChallenge = item.status !== undefined;

              return (
                <motion.div
                  key={item.id}
                  initial="hidden"
                  animate="visible"
                  variants={{ ...containerVariants, visible: { transition: { delay: idx * 0.1 } } }}
                >
                  <Card className="bg-white/5 border-cyan-500/30 hover:border-cyan-500/60 transition-all">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-white text-lg">{challenge.title}</CardTitle>
                        {isUserChallenge && item.status === "completed" && (
                          <Trophy className="h-5 w-5 text-cyan-400" />
                        )}
                      </div>
                      <CardDescription className="text-white/60">{challenge.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                          {challenge.category}
                        </Badge>
                        <Badge variant="outline" className="border-white/20 text-white/70">
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                          <Zap className="h-3 w-3 mr-1" />
                          {challenge.rewardPoints} pts
                        </Badge>
                      </div>

                      {isUserChallenge && (
                        <>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-white/70">Progress</span>
                              <span className="text-white/70">${item.amountSaved} / ${challenge.goalAmount || "$0"}</span>
                            </div>
                            <Progress value={item.progress} className="h-2 bg-white/10" />
                          </div>

                          {item.streak > 0 && (
                            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20">
                              <p className="text-cyan-400 text-sm font-semibold flex items-center gap-1">
                                <Zap className="h-4 w-4" />
                                {item.streak} day streak!
                              </p>
                            </div>
                          )}

                          {item.status === "active" && (
                            <Button
                              onClick={() => updateProgressMutation.mutate({ userChallengeId: item.id, amountSaved: parseFloat(item.amountSaved) + 10 })}
                              disabled={updateProgressMutation.isPending}
                              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                              data-testid={`button-update-progress-${item.id}`}
                            >
                              Log Progress
                            </Button>
                          )}
                        </>
                      )}

                      {!isUserChallenge && activeTab === "available" && (
                        <Button
                          onClick={() => joinMutation.mutate(challenge.id)}
                          disabled={joinMutation.isPending}
                          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                          data-testid={`button-join-challenge-${challenge.id}`}
                        >
                          <Target className="h-4 w-4 mr-2" />
                          Join Challenge
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
