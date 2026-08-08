import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['/api/stripe/subscription'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/subscription');
      if (!response.ok) return null;
      return response.json();
    },
    retry: 3,
    retryDelay: 1000,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    queryClient.invalidateQueries({ queryKey: ['/api/stripe/subscription'] });
  }, [queryClient]);

  const planName = subscriptionData?.plan || 'Premium';
  const status = subscriptionData?.status || 'active';
  const isTrialing = status === 'trialing';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            {isLoading ? (
              <div className="py-8">
                <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto mb-4" />
                <p className="text-white/60">Confirming your subscription...</p>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-accent/20 flex items-center justify-center"
                >
                  <CheckCircle className="w-12 h-12 text-accent" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <span className="text-accent text-sm font-semibold capitalize">
                      Welcome to {planName}
                    </span>
                    <Sparkles className="w-5 h-5 text-accent" />
                  </div>

                  <h1 className="text-3xl font-display font-bold text-white mb-4">
                    {isTrialing ? 'Trial Started!' : 'Subscription Activated!'}
                  </h1>

                  <p className="text-white/60 mb-8 leading-relaxed">
                    {isTrialing 
                      ? `Your 6-month free trial of ${planName} is now active. Enjoy all premium features!`
                      : `Thank you for subscribing to Perth Saver ${planName}! Your premium features are now active.`
                    }
                  </p>

                  <div className="space-y-3">
                    <Button 
                      className="w-full h-12 bg-accent text-background hover:bg-accent/90 font-semibold"
                      onClick={() => setLocation('/dashboard')}
                      data-testid="button-go-dashboard"
                    >
                      Go to Dashboard
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    <Button 
                      variant="outline"
                      className="w-full h-12 border-white/20 text-white hover:bg-white/10"
                      onClick={() => setLocation('/settings')}
                      data-testid="button-manage-subscription"
                    >
                      Manage Subscription
                    </Button>
                  </div>
                </motion.div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
