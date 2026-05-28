import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Share2, Download, Copy, Check, Trophy, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ShareableCardProps {
  type: "milestone" | "deal" | "streak" | "challenge";
  title: string;
  amount?: number;
  description?: string;
  date?: string;
  userName?: string;
}

const CARD_CONFIGS = {
  milestone: {
    icon: Trophy,
    gradient: "from-purple-500 via-purple-400 to-cyan-500",
    label: "Savings Milestone",
  },
  deal: {
    icon: Sparkles,
    gradient: "from-purple-500 via-cyan-500 to-purple-400",
    label: "Deal Found",
  },
  streak: {
    icon: TrendingUp,
    gradient: "from-cyan-500 via-cyan-400 to-purple-500",
    label: "Savings Streak",
  },
  challenge: {
    icon: Trophy,
    gradient: "from-cyan-500 via-purple-500 to-cyan-400",
    label: "Challenge Won",
  },
};

export function ShareableCard({ type, title, amount, description, date, userName }: ShareableCardProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const config = CARD_CONFIGS[type];
  const Icon = config.icon;

  const shareUrl = `${window.location.origin}/share/${type}/${Date.now()}`;
  const shareMessage = `I just ${title.toLowerCase()} with Perth Saver! ${amount ? `Saved $${amount}!` : ""} Join me: ${shareUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      toast({ title: "Copied!", description: "Share message copied to clipboard" });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perth Saver - ${config.label}`,
          text: shareMessage,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden rounded-3xl"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-90`} />
      
      <div className="absolute inset-0">
        <motion.div
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/10"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="relative p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-xs font-medium text-white">{config.label}</span>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon className="h-8 w-8 text-white" />
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        
        {amount !== undefined && (
          <motion.p
            className="text-5xl font-display font-bold text-white mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            ${amount.toLocaleString()}
          </motion.p>
        )}

        {description && (
          <p className="text-white/80 mb-4">{description}</p>
        )}

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/20">
          <div>
            <p className="text-sm text-white/60">{userName || "Perth Saver User"}</p>
            {date && <p className="text-xs text-white/40">{date}</p>}
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white">Perth Saver</p>
            <p className="text-xs text-white/60">Save $50K-100K/year</p>
          </div>
        </div>
      </div>

      <div className="relative px-8 pb-8">
        <div className="flex gap-3">
          <Button
            onClick={handleNativeShare}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
            data-testid="button-share-card"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={handleCopy}
            variant="outline"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            data-testid="button-copy-card"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export function ShareMilestoneCard({ amount, title }: { amount: number; title: string }) {
  return (
    <ShareableCard
      type="milestone"
      title={title}
      amount={amount}
      description="Monthly savings milestone achieved!"
      date={new Date().toLocaleDateString()}
    />
  );
}
