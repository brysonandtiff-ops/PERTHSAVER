import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Target, Store, Rocket, CheckCircle2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { z } from "zod";

const perthSuburbs = [
  "Perth CBD", "Fremantle", "Subiaco", "Nedlands", "Cottesloe", "Claremont",
  "Scarborough", "Joondalup", "Rockingham", "Mandurah", "Innaloo", "Morley",
  "Cannington", "Midland", "Armadale", "Ellenbrook", "Butler", "Baldivis"
];

const stores = ["Woolworths", "Coles", "ALDI", "IGA", "Spudshed"];
const savingsGoals = [
  "Save on groceries",
  "Reduce utility bills",
  "Lower insurance costs",
  "Track subscriptions",
  "Cut mobile/internet costs",
  "Family budget management"
];

const onboardingSchema = z.object({
  householdSize: z.number().min(1).max(10),
  location: z.string().min(1),
  income: z.number().optional(),
  selectedGoals: z.array(z.string()).min(1, "Select at least one goal"),
  targetSavings: z.number().min(50).max(2000),
  preferredStores: z.array(z.string()).min(1, "Select at least one store"),
  notificationPreferences: z.array(z.string()),
  shoppingFrequency: z.string().min(1),
  dietaryPreferences: z.string().optional(),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

interface OnboardingWizardProps {
  open: boolean;
  onComplete: () => void;
}

export default function OnboardingWizard({ open, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    householdSize: 2,
    location: "Perth CBD",
    selectedGoals: [],
    targetSavings: 200,
    preferredStores: [],
    notificationPreferences: ["email"],
    shoppingFrequency: "weekly",
    dietaryPreferences: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      triggerConfetti();
      setTimeout(() => {
        onComplete();
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive",
      });
    },
  });

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ["hsl(271 91% 65%)", "hsl(188 94% 43%)"];  // purple and cyan

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleSkip = () => {
    updateProfileMutation.mutate({
      onboardingCompleted: true,
      preferences: {
        skipped: true,
        householdSize: 1,
        location: "Perth, WA",
        selectedGoals: ["Save on groceries"],
        targetSavings: 100,
        preferredStores: ["Woolworths", "Coles"],
        notificationPreferences: ["email"],
        shoppingFrequency: "weekly",
      },
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.householdSize || formData.householdSize < 1 || formData.householdSize > 10) {
        newErrors.householdSize = "Please select a valid household size";
      }
      if (!formData.location) {
        newErrors.location = "Please select your location";
      }
    } else if (currentStep === 2) {
      if (!formData.selectedGoals || formData.selectedGoals.length === 0) {
        newErrors.selectedGoals = "Please select at least one savings goal";
      }
      if (!formData.targetSavings || formData.targetSavings < 50) {
        newErrors.targetSavings = "Please set a target savings amount";
      }
    } else if (currentStep === 3) {
      if (!formData.preferredStores || formData.preferredStores.length === 0) {
        newErrors.preferredStores = "Please select at least one store";
      }
      if (!formData.shoppingFrequency) {
        newErrors.shoppingFrequency = "Please select your shopping frequency";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    updateProfileMutation.mutate({
      household: `${formData.householdSize} ${formData.householdSize === 1 ? 'person' : 'people'}`,
      location: formData.location,
      income: formData.income,
      onboardingCompleted: true,
      preferences: {
        selectedGoals: formData.selectedGoals,
        targetSavings: formData.targetSavings,
        preferredStores: formData.preferredStores,
        notificationPreferences: formData.notificationPreferences,
        shoppingFrequency: formData.shoppingFrequency,
        dietaryPreferences: formData.dietaryPreferences,
      },
    });
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    const currentArray = (formData[field] as string[]) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFormData(field, newArray);
  };

  const progress = (step / 4) * 100;

  return (
    <Dialog open={open} modal>
      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background/95 to-background border-white/10 backdrop-blur-xl p-0 [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        data-testid="onboarding-dialog"
      >
        <div className="sticky top-0 z-10 bg-gradient-to-br from-background/95 to-background border-b border-white/10 backdrop-blur-xl">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <DialogTitle className="text-2xl font-display font-bold text-white flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Welcome to Perth Saver!
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-white/60 hover:text-white"
                data-testid="button-skip"
              >
                Skip Tour
              </Button>
            </div>
            <Progress value={progress} className="h-2" data-testid="progress-onboarding" />
            <p className="text-white/60 text-sm mt-2">
              Step {step} of 4
            </p>
          </div>
        </div>

        <div className="p-6 pt-4">
          {/* Step 1: Welcome & Setup */}
          {step === 1 && (
            <div className="space-y-6" data-testid="step-welcome">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Let's Get You Started!
                </h3>
                <p className="text-white/60">
                  Perth Saver helps you save money on everyday expenses. Let's personalize your experience.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="household-size" className="text-white mb-2 block">
                    Household Size
                  </Label>
                  <Select
                    value={formData.householdSize?.toString()}
                    onValueChange={(value) => updateFormData("householdSize", parseInt(value))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-household-size">
                      <SelectValue placeholder="Select household size" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(size => (
                        <SelectItem key={size} value={size.toString()}>
                          {size} {size === 1 ? 'person' : 'people'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.householdSize && (
                    <p className="text-red-400 text-sm mt-1">{errors.householdSize}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location" className="text-white mb-2 block">
                    Location (Perth Suburb)
                  </Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => updateFormData("location", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-location">
                      <SelectValue placeholder="Select your suburb" />
                    </SelectTrigger>
                    <SelectContent>
                      {perthSuburbs.map(suburb => (
                        <SelectItem key={suburb} value={suburb}>
                          {suburb}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-red-400 text-sm mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="income" className="text-white mb-2 block">
                    Monthly Income (Optional)
                  </Label>
                  <Select
                    value={formData.income?.toString() || "skip"}
                    onValueChange={(value) => updateFormData("income", value === "skip" ? undefined : parseInt(value))}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-income">
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skip">Prefer not to say</SelectItem>
                      <SelectItem value="30000">Under $30,000</SelectItem>
                      <SelectItem value="50000">$30,000 - $50,000</SelectItem>
                      <SelectItem value="70000">$50,000 - $70,000</SelectItem>
                      <SelectItem value="90000">$70,000 - $90,000</SelectItem>
                      <SelectItem value="110000">$90,000 - $110,000</SelectItem>
                      <SelectItem value="130000">Over $110,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Savings Goals */}
          {step === 2 && (
            <div className="space-y-6" data-testid="step-goals">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  What Are Your Savings Goals?
                </h3>
                <p className="text-white/60">
                  Select all that apply. We'll help you achieve them!
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-3 block">Primary Savings Goals</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {savingsGoals.map(goal => (
                      <Card
                        key={goal}
                        className={`cursor-pointer transition-all ${
                          formData.selectedGoals?.includes(goal)
                            ? 'bg-primary/20 border-primary'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => toggleArrayValue("selectedGoals", goal)}
                        data-testid={`checkbox-goal-${goal.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Checkbox
                            checked={formData.selectedGoals?.includes(goal)}
                            onCheckedChange={() => toggleArrayValue("selectedGoals", goal)}
                          />
                          <span className="text-white text-sm">{goal}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {errors.selectedGoals && (
                    <p className="text-red-400 text-sm mt-2">{errors.selectedGoals}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white mb-3 block">
                    Target Monthly Savings: ${formData.targetSavings}
                  </Label>
                  <Slider
                    value={[formData.targetSavings || 200]}
                    onValueChange={(value) => updateFormData("targetSavings", value[0])}
                    min={50}
                    max={2000}
                    step={50}
                    className="py-4"
                    data-testid="slider-target-savings"
                  />
                  <div className="flex justify-between text-white/40 text-xs mt-2">
                    <span>$50</span>
                    <span>$2000</span>
                  </div>
                  {errors.targetSavings && (
                    <p className="text-red-400 text-sm mt-1">{errors.targetSavings}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preferences */}
          {step === 3 && (
            <div className="space-y-6" data-testid="step-preferences">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  Your Shopping Preferences
                </h3>
                <p className="text-white/60">
                  Tell us where you shop and how often
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-3 block">Preferred Stores</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {stores.map(store => (
                      <Card
                        key={store}
                        className={`cursor-pointer transition-all ${
                          formData.preferredStores?.includes(store)
                            ? 'bg-primary/20 border-primary'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => toggleArrayValue("preferredStores", store)}
                        data-testid={`checkbox-store-${store.toLowerCase()}`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Checkbox
                            checked={formData.preferredStores?.includes(store)}
                            onCheckedChange={() => toggleArrayValue("preferredStores", store)}
                          />
                          <span className="text-white text-sm">{store}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {errors.preferredStores && (
                    <p className="text-red-400 text-sm mt-2">{errors.preferredStores}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white mb-3 block">Notification Preferences</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {["Email", "Push", "SMS"].map(type => (
                      <Card
                        key={type}
                        className={`cursor-pointer transition-all ${
                          formData.notificationPreferences?.includes(type.toLowerCase())
                            ? 'bg-primary/20 border-primary'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                        onClick={() => toggleArrayValue("notificationPreferences", type.toLowerCase())}
                        data-testid={`checkbox-notification-${type.toLowerCase()}`}
                      >
                        <CardContent className="p-4 flex items-center gap-3">
                          <Checkbox
                            checked={formData.notificationPreferences?.includes(type.toLowerCase())}
                            onCheckedChange={() => toggleArrayValue("notificationPreferences", type.toLowerCase())}
                          />
                          <span className="text-white text-sm">{type}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="shopping-frequency" className="text-white mb-2 block">
                    Shopping Frequency
                  </Label>
                  <Select
                    value={formData.shoppingFrequency}
                    onValueChange={(value) => updateFormData("shoppingFrequency", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-shopping-frequency">
                      <SelectValue placeholder="How often do you shop?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.shoppingFrequency && (
                    <p className="text-red-400 text-sm mt-1">{errors.shoppingFrequency}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dietary" className="text-white mb-2 block">
                    Dietary Preferences (Optional)
                  </Label>
                  <Select
                    value={formData.dietaryPreferences || "none"}
                    onValueChange={(value) => updateFormData("dietaryPreferences", value === "none" ? "" : value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10" data-testid="select-dietary">
                      <SelectValue placeholder="Select dietary preferences" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No restrictions</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="gluten-free">Gluten-free</SelectItem>
                      <SelectItem value="halal">Halal</SelectItem>
                      <SelectItem value="kosher">Kosher</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Feature Tour */}
          {step === 4 && (
            <div className="space-y-6" data-testid="step-tour">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Rocket className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">
                  You're All Set!
                </h3>
                <p className="text-white/60">
                  Here's what you can do with Perth Saver
                </p>
              </div>

              <div className="space-y-4">
                <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white mb-1">AI Assistant</h4>
                      <p className="text-white/60 text-sm">
                        Ask our AI assistant for personalized savings tips, deal recommendations, and shopping advice.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                      <Target className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white mb-1">Price Tracking</h4>
                      <p className="text-white/60 text-sm">
                        Compare prices across {formData.preferredStores?.join(', ') || 'your favorite stores'} and get alerts when prices drop.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-white/8 to-white/4 border-white/8">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold text-white mb-1">Dashboard Overview</h4>
                      <p className="text-white/60 text-sm">
                        Track your savings progress, view deals, and manage your budget all in one place.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30">
                  <CardContent className="p-4">
                    <h4 className="font-display font-semibold text-white mb-2">Your Savings Goal</h4>
                    <p className="text-white/80 text-sm">
                      You're aiming to save <span className="text-primary font-bold">${formData.targetSavings}/month</span>.
                      We'll help you get there with personalized recommendations!
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-white/10"
              data-testid="button-back"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={updateProfileMutation.isPending}
              className="bg-primary hover:bg-primary/90 text-white min-w-[120px]"
              data-testid="button-next"
            >
              {updateProfileMutation.isPending ? (
                "Saving..."
              ) : step === 4 ? (
                "Get Started!"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
