import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap, Loader2 } from "lucide-react";

interface PricingTierProps {
  name: string;
  price: string;
  priceId?: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
  isLoading?: boolean;
  onSubscribe?: () => void;
  billingPeriod?: 'monthly' | 'yearly';
}

export function PricingTier({ 
  name, 
  price, 
  priceId,
  description, 
  features, 
  popular, 
  cta,
  isLoading,
  onSubscribe,
  billingPeriod = 'monthly'
}: PricingTierProps) {
  return (
    <Card 
      className={`relative overflow-hidden transition-smooth ${
        popular 
          ? "border-accent/50 ring-2 ring-accent/20 shadow-xl from-white/12 to-white/8" 
          : "bg-gradient-to-br from-white/8 to-white/4 border-white/8 hover:from-white/12 hover:to-white/6 hover:border-white/12"
      }`}
      data-testid={`pricing-card-${name.toLowerCase()}`}
    >
      {popular && (
        <div className="absolute top-0 right-0 -mr-12 -mt-12">
          <div className="relative h-32 w-32 bg-accent/10 rounded-full blur-2xl" />
          <Badge className="absolute top-4 right-4 bg-accent text-background hover:bg-accent/90 font-bold">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="font-display text-2xl text-white">{name}</CardTitle>
        <p className="text-sm text-white/50 mt-2 font-light">{description}</p>
        <div className="mt-6 flex items-baseline gap-1">
          <span className="text-4xl font-display font-bold text-white">${price}</span>
          <span className="text-white/50 font-light">/{billingPeriod === 'yearly' ? 'year' : 'month'}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Button 
          className={`w-full font-semibold h-12 ${
            popular 
              ? "bg-accent text-background hover:bg-accent/90 glow-accent" 
              : "bg-primary hover:bg-primary/90 text-white"
          }`}
          onClick={onSubscribe}
          disabled={isLoading}
          data-testid={`button-subscribe-${name.toLowerCase()}`}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : popular ? (
            <Zap className="h-4 w-4 mr-2" />
          ) : null}
          {isLoading ? 'Loading...' : cta}
        </Button>
        
        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={`feature-${i}`} className="flex items-start gap-3">
              <Check className={`h-5 w-5 shrink-0 mt-0.5 ${
                popular ? "text-accent" : "text-primary"
              }`} />
              <span className="text-sm text-white/70 font-light">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
