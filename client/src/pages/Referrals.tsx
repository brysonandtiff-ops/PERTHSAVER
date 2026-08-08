import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Gift, Copy, Share2, Users, Trophy, Check, 
  Sparkles, ArrowRight, QrCode, MessageCircle, Mail,
  Twitter, Facebook, Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const SHARE_CHANNELS = [
  { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "from-cyan-500 to-cyan-600" },
  { id: "sms", name: "SMS", icon: Smartphone, color: "from-purple-500 to-purple-600" },
  { id: "email", name: "Email", icon: Mail, color: "from-slate-500 to-slate-600" },
  { id: "twitter", name: "Twitter", icon: Twitter, color: "from-purple-400 to-purple-500" },
  { id: "facebook", name: "Facebook", icon: Facebook, color: "from-slate-600 to-slate-700" },
];

function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "PERTH";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export default function Referrals() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: authData } = useAuth();
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const referralCode = `PERTH${authData?.user?.id?.slice(0, 4).toUpperCase() || "SAVE"}`;
  const referralLink = `${window.location.origin}/auth?ref=${referralCode}`;
  const shareMessage = `Join Perth Saver and save $15K-25K annually! Use my code ${referralCode} to get started: ${referralLink}`;

  const stats = {
    totalReferrals: 0,
    pendingRewards: 0,
    earnedCredits: 0,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const shareViaChannel = (channel: string) => {
    const encodedMessage = encodeURIComponent(shareMessage);
    const encodedUrl = encodeURIComponent(referralLink);

    switch (channel) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
        break;
      case "sms":
        window.open(`sms:?body=${encodedMessage}`, "_blank");
        break;
      case "email":
        window.open(`mailto:?subject=Join Perth Saver&body=${encodedMessage}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodedMessage}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, "_blank");
        break;
    }
  };

  const nativeShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Join Perth Saver",
          text: `Save $15K-25K annually with Perth Saver! Use my code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          toast({
            title: "Share failed",
            description: "Please try another sharing method",
            variant: "destructive",
          });
        }
      }
    }
  };

  return (
    <div className="min-h-full pb-20">
      <motion.div
        className="w-full max-w-2xl mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Gift className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Invite Friends</h1>
          <p className="text-white/60">
            Earn rewards when your friends join Perth Saver
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
            <p className="text-xs text-white/50">Friends Joined</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 text-center">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <p className="text-2xl font-bold text-white">{stats.pendingRewards}</p>
            <p className="text-xs text-white/50">Pending</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 text-center">
            <Trophy className="h-6 w-6 mx-auto mb-2 text-cyan-400" />
            <p className="text-2xl font-bold text-white">${stats.earnedCredits}</p>
            <p className="text-xs text-white/50">Earned</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-cyan-500/10">
            <h2 className="text-lg font-semibold text-white mb-4">Your Referral Code</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 p-4 rounded-xl bg-black/30 font-mono text-2xl text-center text-white tracking-widest">
                {referralCode}
              </div>
              <Button
                onClick={() => copyToClipboard(referralCode)}
                className="h-14 w-14 rounded-xl bg-white/10 hover:bg-white/20"
                data-testid="button-copy-code"
              >
                {copied ? (
                  <Check className="h-6 w-6 text-cyan-400" />
                ) : (
                  <Copy className="h-6 w-6 text-white" />
                )}
              </Button>
            </div>
            <div className="relative">
              <Input
                value={referralLink}
                readOnly
                className="pr-24 bg-black/30 text-white/70 text-sm"
                data-testid="input-referral-link"
              />
              <Button
                onClick={() => copyToClipboard(referralLink)}
                size="sm"
                className="absolute right-1 top-1 bg-purple-500 hover:bg-purple-400 text-white"
                data-testid="button-copy-link"
              >
                Copy Link
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Share Via</h2>
          
          {typeof navigator.share === "function" && (
            <Button
              onClick={nativeShare}
              className="w-full mb-4 h-14 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white font-semibold rounded-xl"
              data-testid="button-native-share"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share with Friends
            </Button>
          )}

          <div className="grid grid-cols-5 gap-3">
            {SHARE_CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <motion.button
                  key={channel.id}
                  onClick={() => shareViaChannel(channel.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl bg-gradient-to-br ${channel.color} hover:opacity-90 transition-opacity`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid={`button-share-${channel.id}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                  <span className="text-xs text-white/80">{channel.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-semibold text-white mb-4">How It Works</h2>
          <div className="space-y-4">
            {[
              { step: 1, title: "Share your code", desc: "Send your unique code to friends" },
              { step: 2, title: "They sign up", desc: "Friend creates account with your code" },
              { step: 3, title: "Both earn rewards", desc: "You both get $10 in savings credits!" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4 p-4 rounded-xl bg-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-medium text-white">{item.title}</h3>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 p-6 rounded-2xl bg-cyan-500/10">
          <div className="flex items-center gap-3 mb-3">
            <Trophy className="h-6 w-6 text-cyan-400" />
            <h3 className="font-semibold text-white">Referral Rewards</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400" />
              <span>$10 credit for each friend who joins</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400" />
              <span>Friend gets 6-month Premium trial</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400" />
              <span>Bonus $50 for 5 successful referrals</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-cyan-400" />
              <span>Unlock exclusive badges & achievements</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}
