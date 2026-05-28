import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Play, CheckCircle, Clock, AlertCircle, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth, handleApiError } from "@/lib/api";
import { useLocation } from "wouter";

interface Tutorial {
  id: string;
  title: string;
  description?: string;
  category: string;
  steps?: any[];
  estimatedTime?: number;
  difficulty: string;
}

interface TutorialProgress {
  id: string;
  tutorialId: string;
  currentStep: number;
  isCompleted: boolean;
  tutorial?: Tutorial;
}

export default function Tutorials() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showingTutorial, setShowingTutorial] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  const { data: authData, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!authData?.user;

  const { data: tutorialsData, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/tutorials"],
    queryFn: async () => {
      const res = await fetch("/api/tutorials", { credentials: "include" });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to fetch tutorials`);
      }
      return res.json();
    },
    enabled: isAuthenticated,
    retry: 1,
  });

  const startMutation = useMutation({
    mutationFn: async (tutorialId: string) => {
      const res = await fetch(`/api/tutorials/${tutorialId}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to start tutorial");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Tutorial started!");
      refetch();
    },
    onError: (error: Error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.title, { description: apiError.message });
    },
  });

  const completeStepMutation = useMutation({
    mutationFn: async ({ progressId, stepNum }: { progressId: string; stepNum: number }) => {
      const res = await fetch(`/api/tutorials/${progressId}/step`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: stepNum }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to complete step");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Step completed!");
      refetch();
    },
    onError: (error: Error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.title, { description: apiError.message });
    },
  });

  const completeTutorialMutation = useMutation({
    mutationFn: async (progressId: string) => {
      const res = await fetch(`/api/tutorials/${progressId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to complete tutorial");
      }
      return res.json();
    },
    onSuccess: () => {
      toast.success("Tutorial completed!");
      setShowingTutorial(null);
      refetch();
    },
    onError: (error: Error) => {
      const apiError = handleApiError(error);
      toast.error(apiError.title, { description: apiError.message });
    },
  });

  const categories = ["all", "getting-started", "savings", "investments", "family"];
  const tutorials = tutorialsData?.tutorials || [];
  const userProgress = tutorialsData?.progress || [];

  const getProgress = (tutorialId: string) => {
    return userProgress.find((p: any) => p.tutorialId === tutorialId);
  };

  const filteredTutorials = tutorials.filter((t: Tutorial) => 
    selectedCategory === "all" || t.category === selectedCategory
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const selectedTutorial = tutorials.find((t: Tutorial) => t.id === showingTutorial);
  const selectedProgress = selectedTutorial ? getProgress(selectedTutorial.id) : null;

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
            <p className="text-white/60">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <LogIn className="h-8 w-8 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
                Authentication Required
              </h1>
              <p className="text-white/60 text-base sm:text-lg max-w-md mx-auto">
                Please log in to access interactive tutorials and track your progress.
              </p>
            </div>
            
            <Card className="bg-white/5 border-cyan-500/30 max-w-md mx-auto">
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-white font-semibold">What you'll get:</h3>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Step-by-step interactive tutorials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Track your learning progress</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Learn how to maximize your savings</span>
                    </li>
                  </ul>
                </div>
                
                <Button
                  onClick={() => setLocation("/auth")}
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white h-12 text-base font-semibold"
                  data-testid="button-login"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Log In to Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error fetching tutorials
  if (error) {
    const apiError = handleApiError(error);
    return (
      <div className="min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {apiError.title}
              </h1>
              <p className="text-white/60 text-base max-w-md mx-auto">
                {apiError.message}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => refetch()}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
                data-testid="button-retry"
              >
                Try Again
              </Button>
              <Button
                onClick={() => setLocation("/dashboard")}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                data-testid="button-dashboard"
              >
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {showingTutorial && selectedTutorial ? (
        // Tutorial View
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Button
              onClick={() => setShowingTutorial(null)}
              variant="ghost"
              className="text-white/70 hover:text-white"
              data-testid="button-back-tutorials"
            >
              ← Back to Tutorials
            </Button>

            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">{selectedTutorial.title}</h1>
              <p className="text-white/60">{selectedTutorial.description}</p>

              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                  {selectedTutorial.category}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/70">
                  {selectedTutorial.difficulty}
                </Badge>
                <Badge variant="outline" className="border-white/20 text-white/70">
                  <Clock className="h-3 w-3 mr-1" />
                  {selectedTutorial.estimatedTime || 5} min
                </Badge>
              </div>
            </div>

            {selectedProgress && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Progress</span>
                    <span className="text-white/70">Step {selectedProgress.currentStep} of {selectedTutorial.steps?.length || 3}</span>
                  </div>
                  <Progress 
                    value={(selectedProgress.currentStep / (selectedTutorial.steps?.length || 3)) * 100} 
                    className="h-2 bg-white/10"
                  />
                </div>

                {selectedTutorial.steps && selectedTutorial.steps[selectedProgress.currentStep] && (
                  <Card className="bg-white/5 border-cyan-500/30">
                    <CardHeader>
                      <CardTitle className="text-white">
                        {selectedTutorial.steps[selectedProgress.currentStep].title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-white/70">
                        {selectedTutorial.steps[selectedProgress.currentStep].content}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => completeStepMutation.mutate({
                            progressId: selectedProgress.id,
                            stepNum: selectedProgress.currentStep + 1
                          })}
                          className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white"
                          data-testid={`button-next-step-${selectedProgress.id}`}
                        >
                          Next Step
                        </Button>
                        {selectedProgress.currentStep === (selectedTutorial.steps?.length || 3) - 1 && (
                          <Button
                            onClick={() => completeTutorialMutation.mutate(selectedProgress.id)}
                            className="flex-1 bg-purple-600 hover:bg-blue-700 text-white"
                            data-testid={`button-complete-tutorial-${selectedProgress.id}`}
                          >
                            Complete Tutorial
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!selectedProgress && (
              <Button
                onClick={() => startMutation.mutate(selectedTutorial.id)}
                className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white text-base font-semibold"
                data-testid={`button-start-tutorial-${selectedTutorial.id}`}
              >
                <Play className="h-5 w-5 mr-2" />
                Start Tutorial
              </Button>
            )}
          </motion.div>
        </div>
      ) : (
        // Tutorials List
        <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
              Interactive Tutorials
            </h1>
            <p className="text-white/60 text-base sm:text-lg">
              Learn how to use Perth Saver features step by step
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex gap-2 mb-8 overflow-x-auto pb-2"
          >
            {categories.map((cat) => (
              <Button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                variant={selectedCategory === cat ? "default" : "outline"}
                className={selectedCategory === cat
                  ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                  : "border-white/20 text-white hover:bg-white/10"
                }
                data-testid={`button-category-${cat}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
              </Button>
            ))}
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
            </div>
          ) : filteredTutorials.length === 0 ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="text-center py-12"
            >
              <p className="text-white/60">No tutorials available for this category</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredTutorials.map((tutorial: Tutorial, idx: number) => {
                const progress = getProgress(tutorial.id);
                const isCompleted = progress?.isCompleted;

                return (
                  <motion.div
                    key={tutorial.id}
                    initial="hidden"
                    animate="visible"
                    variants={{ ...containerVariants, visible: { transition: { delay: idx * 0.1 } } }}
                  >
                    <Card className="bg-white/5 border-cyan-500/30 hover:border-cyan-500/60 transition-all cursor-pointer" 
                      onClick={() => setShowingTutorial(tutorial.id)}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-white">{tutorial.title}</CardTitle>
                          {isCompleted && <CheckCircle className="h-5 w-5 text-cyan-500" />}
                        </div>
                        <CardDescription className="text-white/60">{tutorial.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 text-xs">
                            {tutorial.category}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                            {tutorial.difficulty}
                          </Badge>
                          <Badge variant="outline" className="border-white/20 text-white/70 text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {tutorial.estimatedTime || 5} min
                          </Badge>
                        </div>

                        {progress && (
                          <Progress
                            value={(progress.currentStep / (tutorial.steps?.length || 3)) * 100}
                            className="h-2 bg-white/10"
                          />
                        )}

                        <Button
                          className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
                          data-testid={`button-open-tutorial-${tutorial.id}`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {progress ? "Continue" : "Start"} Tutorial
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
