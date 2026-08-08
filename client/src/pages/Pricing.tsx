import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { Footer } from "@/components/layout/Footer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Check, Sparkles, Shield, Zap, Users, Star, ArrowRight } from "lucide-react";
import { PaymentOptions } from "@/components/PaymentOptions";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: { interval: string } | null;
  active: boolean;
  metadata: Record<string, string>;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: Record<string, string>;
  prices: StripePrice[];
}

export default function Pricing() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['/api/stripe/products'],
    queryFn: async () => {
      const response = await fetch('/api/stripe/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const { data: authData } = useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me');
      if (!response.ok) return null;
      return response.json();
    },
    retry: false,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (priceId: string) => {
      const response = await apiRequest('POST', '/api/stripe/checkout', { priceId });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Checkout failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Checkout Error",
          description: "Unable to redirect to checkout. Please try again.",
          variant: "destructive",
        });
        setLoadingPriceId(null);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
      setLoadingPriceId(null);
    },
  });

  const handleSubscribe = (priceId: string | undefined, planName: string) => {
    if (!authData?.user) {
      setLocation('/auth');
      return;
    }
    
    if (planName.toLowerCase() === 'starter' || !priceId) {
      setLocation('/dashboard');
      return;
    }

    setLoadingPriceId(priceId);
    checkoutMutation.mutate(priceId);
  };

  const getProductPrice = (product: StripeProduct, period: 'monthly' | 'yearly'): StripePrice | undefined => {
    const interval = period === 'monthly' ? 'month' : 'year';
    return product.prices.find(p => p.recurring?.interval === interval);
  };

  const formatPrice = (amount: number): string => {
    return (amount / 100).toFixed(2);
  };

  const getFeatures = (product: StripeProduct): string[] => {
    try {
      if (product.metadata?.features) {
        return JSON.parse(product.metadata.features);
      }
    } catch (e) {
      console.error('Failed to parse features:', e);
    }
    
    const planName = product.name.toLowerCase();
    if (planName === 'free') {
      return [
        'Access to 1,600+ local deals',
        'Basic price tracking',
        'Community feed access',
        'Save up to 5 items',
        'Perth Saver Points',
        'Weekly deal notifications'
      ];
    } else if (planName === 'pro') {
      return [
        'Everything in Free',
        'AI-powered price predictions',
        'Unlimited saved items',
        'Real-time price drop alerts',
        'Weekly savings reports',
        'Smart budget tracking',
        'Priority email support',
        'Advanced grocery basket optimizer'
      ];
    } else if (planName === 'super') {
      return [
        'Everything in Pro',
        'Personal finance coach AI',
        'Investment optimization',
        'Tax deduction finder',
        'Business savings features',
        'Priority 24/7 support',
        'Custom financial reports',
        'Exclusive partner discounts'
      ];
    }
    return [];
  };

  const getPlanIcon = (name: string) => {
    const planName = name.toLowerCase();
    if (planName === 'free') return <Zap className="w-6 h-6" />;
    if (planName === 'pro') return <Star className="w-6 h-6" />;
    if (planName === 'super') return <Users className="w-6 h-6" />;
    return <Sparkles className="w-6 h-6" />;
  };

  const products = productsData?.products || [];
  
  const tiers = products.length > 0 
    ? products.map((product: StripeProduct) => {
        const monthlyPrice = getProductPrice(product, 'monthly');
        const yearlyPrice = getProductPrice(product, 'yearly');
        const currentPrice = billingPeriod === 'monthly' ? monthlyPrice : yearlyPrice;
        const features = getFeatures(product);
        const planNameLower = product.name.toLowerCase();
        
        return {
          name: product.name,
          price: currentPrice ? formatPrice(currentPrice.unit_amount) : '0',
          monthlyEquivalent: yearlyPrice ? formatPrice(yearlyPrice.unit_amount / 12) : null,
          priceId: currentPrice?.id,
          description: product.description || '',
          features,
          popular: product.metadata?.popular === 'true' || planNameLower === 'pro',
          isFree: planNameLower === 'free',
        };
      })
    : [];

  const sortedTiers = [...tiers].sort((a, b) => {
    const order = ['free', 'pro', 'super'];
    return order.indexOf(a.name.toLowerCase()) - order.indexOf(b.name.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col relative">
      <PublicNavbar />
      
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 lg:mb-20"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 mb-6">
                <Shield className="w-4 h-4 text-purple-400" />
                <span className="text-sm text-white/70">6-month free trial on all paid plans</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
                <span className="text-white">Choose Your</span>{" "}
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Savings Plan
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
                Join thousands of Perth families saving $15K+ annually with AI-powered insights
              </p>

              <div className="inline-flex items-center gap-3 p-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    billingPeriod === 'monthly' 
                      ? 'bg-white/10 text-white shadow-lg' 
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    billingPeriod === 'yearly' 
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white shadow-lg border border-purple-500/30' 
                      : 'text-white/50 hover:text-white/70'
                  }`}
                >
                  Yearly
                  <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-lg">
                    -20%
                  </span>
                </button>
              </div>
            </motion.div>

            {productsLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full animate-pulse" />
                  <Loader2 className="h-12 w-12 text-purple-400 animate-spin relative" />
                </div>
                <p className="text-white/50 text-base">Loading plans...</p>
              </div>
            ) : productsError ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-16 h-16 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Unable to Load Plans</h3>
                <p className="text-white/50 text-base max-w-md">
                  Please refresh the page or try again later.
                </p>
              </div>
            ) : sortedTiers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-16 h-16 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Plans Coming Soon</h3>
                <p className="text-white/50 text-base max-w-md">
                  Our subscription plans are being set up. Please check back shortly.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 mb-20">
                {sortedTiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative group ${tier.popular ? 'lg:-mt-4 lg:mb-4' : ''}`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <div className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-xs font-bold text-white shadow-lg shadow-purple-500/25">
                          Most Popular
                        </div>
                      </div>
                    )}
                    
                    <div className={`relative h-full rounded-xl overflow-hidden transition-all duration-500 ${
                      tier.popular 
                        ? 'bg-gradient-to-b from-white/[0.08] to-white/[0.02] border-2 border-purple-500/30 shadow-[0_0_40px_rgba(30,136,229,0.15)]' 
                        : 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="relative p-8">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                          tier.popular 
                            ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-400' 
                            : 'bg-white/5 text-white/60'
                        }`}>
                          {getPlanIcon(tier.name)}
                        </div>
                        
                        <h3 className="text-xl font-display font-bold text-white mb-2">
                          {tier.name}
                        </h3>
                        
                        <p className="text-white/40 text-sm mb-6 h-10">
                          {tier.description || (tier.isFree ? 'Get started for free' : 'Unlock premium features')}
                        </p>
                        
                        <div className="mb-8">
                          {tier.isFree ? (
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-display font-bold text-white">Free</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm text-white/40">$</span>
                                <span className="text-4xl font-display font-bold text-white">{tier.price}</span>
                                <span className="text-white/40 text-sm">/{billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                              </div>
                              {billingPeriod === 'yearly' && tier.monthlyEquivalent && (
                                <p className="text-sm text-white/40 mt-1">
                                  ${tier.monthlyEquivalent}/month billed annually
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        
                        <Button
                          onClick={() => handleSubscribe(tier.priceId, tier.name)}
                          disabled={loadingPriceId === tier.priceId}
                          className={`w-full py-6 rounded-lg font-semibold text-base transition-all duration-300 ${
                            tier.popular
                              ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/20'
                              : tier.isFree
                                ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                                : 'bg-white/10 hover:bg-white/15 text-white'
                          }`}
                          data-testid={`button-subscribe-${tier.name.toLowerCase()}`}
                        >
                          {loadingPriceId === tier.priceId ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              {tier.isFree ? 'Get Started Free' : 'Start Free Trial'}
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          )}
                        </Button>
                        
                        <div className="mt-8 space-y-3">
                          {tier.features.map((feature: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                tier.popular ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/40'
                              }`}>
                                <Check className="w-3 h-3" />
                              </div>
                              <span className="text-sm text-white/60">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <PaymentOptions />

              <div className="mt-16 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden">
                <div className="p-8 lg:p-12">
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-10 text-center">
                    Frequently Asked Questions
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {[
                      { 
                        q: "Can I cancel anytime?", 
                        a: "Absolutely. Cancel your subscription at any time with no hidden fees or penalties." 
                      },
                      { 
                        q: "What payment methods do you accept?", 
                        a: "We accept all major cards, PayPal, Apple Pay, and Google Pay through Stripe." 
                      },
                      { 
                        q: "Is there really a free trial?", 
                        a: "Yes! All paid plans include a 6-month free trial. You won't be charged during this period." 
                      },
                      { 
                        q: "Can I switch plans later?", 
                        a: "Yes, upgrade or downgrade anytime from your account settings. Changes take effect immediately." 
                      },
                      { 
                        q: "Is my payment information secure?", 
                        a: "All payments are processed securely through Stripe with bank-level encryption." 
                      },
                      { 
                        q: "How does the Family plan work?", 
                        a: "Add up to 5 family members with individual logins and shared shopping lists." 
                      },
                    ].map((item, i) => (
                      <div key={`faq-${i}`} className="group">
                        <h3 className="font-display font-semibold text-white text-base mb-2 group-hover:text-purple-400 transition-colors">
                          {item.q}
                        </h3>
                        <p className="text-white/50 text-sm leading-relaxed">{item.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
