import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Tag,
  Percent,
  DollarSign,
  Truck,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  TrendingDown,
  ShoppingCart,
  Clock,
  Star,
  Zap,
  Gift,
  Loader2,
  Eye,
  EyeOff,
  Shield,
  Users,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";

interface PromoCode {
  id: string;
  storeName: string;
  storeUrl: string | null;
  storeCategory: string | null;
  code: string;
  description: string | null;
  discountType: string | null;
  discountValue: string | null;
  minPurchase: string | null;
  maxDiscount: string | null;
  expiryDate: string | null;
  isVerified: boolean;
  isHidden: boolean;
  isStackable: boolean;
  isNewUser: boolean;
  successRate: number;
  usageCount: number;
  lastVerified: string | null;
  source: string | null;
}

const CATEGORY_ICONS: Record<string, { icon: any; color: string; label: string }> = {
  online: { icon: ShoppingCart, color: "cyan", label: "Online Shopping" },
  electronics: { icon: Zap, color: "emerald", label: "Electronics" },
  fashion: { icon: Tag, color: "cyan", label: "Fashion" },
  home: { icon: Gift, color: "slate", label: "Home & Garden" },
  health: { icon: Shield, color: "emerald", label: "Health & Beauty" },
  food: { icon: ShoppingCart, color: "cyan", label: "Food Delivery" },
  travel: { icon: Truck, color: "slate", label: "Travel" },
  groceries: { icon: ShoppingCart, color: "emerald", label: "Groceries" },
  pet: { icon: Gift, color: "cyan", label: "Pet Supplies" },
  entertainment: { icon: Star, color: "emerald", label: "Entertainment" },
  retail: { icon: Tag, color: "slate", label: "Retail" },
};

export default function PromoFinder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showHiddenOnly, setShowHiddenOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: promoCodes = [], isLoading, refetch } = useQuery<PromoCode[]>({
    queryKey: ["/api/promo-codes", selectedCategory, showHiddenOnly, showVerifiedOnly],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.set("storeCategory", selectedCategory);
      if (showHiddenOnly) params.set("hidden", "true");
      if (showVerifiedOnly) params.set("verified", "true");
      
      const res = await fetch(`/api/promo-codes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch promo codes");
      const data = await res.json();
      return data.promoCodes || [];
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async ({ id, success }: { id: string; success: boolean }) => {
      const res = await fetch(`/api/promo-codes/${id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success }),
      });
      if (!res.ok) throw new Error("Failed to verify");
      return res.json();
    },
    onSuccess: () => {
      refetch();
      toast.success("Thanks for your feedback!");
    },
  });

  const filteredCodes = promoCodes.filter((code) => {
    if (!searchQuery) return true;
    const lower = searchQuery.toLowerCase();
    return (
      code.storeName.toLowerCase().includes(lower) ||
      code.code.toLowerCase().includes(lower) ||
      code.description?.toLowerCase().includes(lower)
    );
  });

  const hiddenCount = promoCodes.filter((c) => c.isHidden).length;
  const verifiedCount = promoCodes.filter((c) => c.isVerified).length;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getDiscountDisplay = (code: PromoCode) => {
    if (!code.discountType) return "DISCOUNT";
    switch (code.discountType) {
      case "percentage":
        return `${code.discountValue}% OFF`;
      case "fixed":
        return `$${code.discountValue} OFF`;
      case "freeShipping":
        return "FREE SHIPPING";
      case "buyOneGetOne":
        return "BOGO";
      default:
        return "DISCOUNT";
    }
  };

  const getDiscountIcon = (type: string | null) => {
    switch (type) {
      case "percentage":
        return <Percent className="w-4 h-4" />;
      case "fixed":
        return <DollarSign className="w-4 h-4" />;
      case "freeShipping":
        return <Truck className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const categories = Object.keys(CATEGORY_ICONS);

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
              <Tag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-white" data-testid="promo-finder-title">
                Hidden Promo Finder
              </h1>
              <p className="text-sm text-white/60">
                Discover {promoCodes.length} codes including {hiddenCount} hidden gems
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{promoCodes.length}</div>
                <div className="text-xs text-white/60">Total Codes</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 flex items-center justify-center gap-1">
                  <EyeOff className="h-5 w-5" /> {hiddenCount}
                </div>
                <div className="text-xs text-white/60">Hidden Codes</div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                  <Shield className="h-5 w-5" /> {verifiedCount}
                </div>
                <div className="text-xs text-white/60">Verified</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="glass mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <Input
                placeholder="Search stores, codes, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 h-12"
                data-testid="input-search-promo"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={showHiddenOnly ? "default" : "outline"}
                className={showHiddenOnly 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-2"
                  : "border-white/20 text-white/70 hover:bg-white/10 gap-2"
                }
                onClick={() => setShowHiddenOnly(!showHiddenOnly)}
                data-testid="button-hidden-only"
              >
                <EyeOff className="h-4 w-4" />
                Hidden Only
              </Button>
              <Button
                size="sm"
                variant={showVerifiedOnly ? "default" : "outline"}
                className={showVerifiedOnly 
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-2"
                  : "border-white/20 text-white/70 hover:bg-white/10 gap-2"
                }
                onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
                data-testid="button-verified-only"
              >
                <Shield className="h-4 w-4" />
                Verified Only
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={selectedCategory === null ? "default" : "outline"}
                className={selectedCategory === null 
                  ? "bg-white/20 text-white"
                  : "border-white/20 text-white/70 hover:bg-white/10"
                }
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((cat) => {
                const info = CATEGORY_ICONS[cat];
                return (
                  <Button
                    key={cat}
                    size="sm"
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={selectedCategory === cat 
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white gap-1"
                      : "border-white/20 text-white/70 hover:bg-white/10 gap-1"
                    }
                    onClick={() => setSelectedCategory(cat)}
                    data-testid={`button-category-${cat}`}
                  >
                    <info.icon className="h-3 w-3" />
                    {info.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-400 animate-spin mb-4" />
            <p className="text-white/60">Discovering promo codes...</p>
          </div>
        ) : filteredCodes.length === 0 ? (
          <Card className="glass">
            <CardContent className="p-12 text-center">
              <Tag className="h-16 w-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-2">No promo codes found</p>
              <p className="text-sm text-white/40">Try adjusting your filters or search</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4" data-testid="promo-codes-list">
            {filteredCodes.map((code) => (
              <Card 
                key={code.id} 
                className={`glass overflow-hidden transition-all ${
                  code.isHidden 
                    ? "ring-1 ring-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-transparent" 
                    : ""
                }`}
                data-testid={`card-promo-${code.id}`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant="outline" 
                        className="bg-white/10 border-white/20 text-white font-semibold"
                      >
                        {code.storeName}
                      </Badge>
                      {code.isHidden && (
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 gap-1">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </Badge>
                      )}
                      {code.isVerified && (
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 gap-1">
                          <Shield className="h-3 w-3" /> Verified
                        </Badge>
                      )}
                      {code.isNewUser && (
                        <Badge className="bg-slate-500/20 text-white/70 border-slate-500/30 gap-1">
                          <Star className="h-3 w-3" /> New Users
                        </Badge>
                      )}
                      {code.isStackable && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 gap-1">
                          <Sparkles className="h-3 w-3" /> Stackable
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`gap-1 ${
                          code.successRate >= 80 
                            ? "bg-cyan-500/20 text-cyan-400" 
                            : code.successRate >= 60 
                            ? "bg-purple-500/20 text-purple-400" 
                            : "bg-slate-500/20 text-white/60"
                        }`}
                      >
                        {code.successRate}% success
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getDiscountIcon(code.discountType)}
                      <span className="font-display font-bold text-lg text-white">
                        {getDiscountDisplay(code)}
                      </span>
                    </div>
                    <p className="text-sm text-white/60">{code.description}</p>
                    {code.minPurchase && (
                      <p className="text-xs text-white/40 mt-1">
                        Min. purchase: ${parseFloat(code.minPurchase).toFixed(2)}
                      </p>
                    )}
                    {code.maxDiscount && (
                      <p className="text-xs text-white/40">
                        Max. discount: ${parseFloat(code.maxDiscount).toFixed(2)}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-white/5 rounded-lg p-3 font-mono text-lg text-purple-400 font-bold text-center border border-white/10">
                      {code.code}
                    </div>
                    <Button
                      onClick={() => copyCode(code.code)}
                      className={`h-12 px-4 ${
                        copiedCode === code.code 
                          ? "bg-cyan-500 text-white" 
                          : "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                      }`}
                      data-testid={`button-copy-${code.id}`}
                    >
                      {copiedCode === code.code ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </Button>
                    {code.storeUrl && (
                      <Button
                        variant="outline"
                        className="h-12 px-4 border-white/20 text-white hover:bg-white/10"
                        onClick={() => window.open(`https://${code.storeUrl}`, "_blank")}
                        data-testid={`button-visit-${code.id}`}
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      {code.expiryDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Expires {format(new Date(code.expiryDate), "MMM d, yyyy")}
                        </span>
                      )}
                      {code.usageCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {code.usageCount} uses
                        </span>
                      )}
                      {code.source && (
                        <span className="capitalize">{code.source}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/40">Did it work?</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-cyan-400 hover:bg-cyan-500/20"
                        onClick={() => verifyMutation.mutate({ id: code.id, success: true })}
                        data-testid={`button-works-${code.id}`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-400 hover:bg-red-500/20"
                        onClick={() => verifyMutation.mutate({ id: code.id, success: false })}
                        data-testid={`button-no-work-${code.id}`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 glass rounded-xl p-6">
          <h3 className="font-display font-bold text-white mb-3 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            How Hidden Codes Work
          </h3>
          <div className="space-y-3 text-sm text-white/60">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <EyeOff className="h-3 w-3 text-cyan-400" />
              </div>
              <p>
                <strong className="text-white">Hidden codes</strong> are discovered through our AI scanning system and community submissions. They're not publicly advertised.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Shield className="h-3 w-3 text-purple-400" />
              </div>
              <p>
                <strong className="text-white">Verified codes</strong> have been tested by our community. Higher success rates mean more reliable codes.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <ThumbsUp className="h-3 w-3 text-white/60" />
              </div>
              <p>
                <strong className="text-white">Help improve accuracy</strong> by clicking the thumbs up/down after trying a code.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-white/40">
          <p>Codes updated daily. Success rates based on community feedback.</p>
        </div>
      </div>
    </div>
  );
}
