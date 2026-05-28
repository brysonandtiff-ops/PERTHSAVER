import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Share2, Download, Twitter, Facebook, Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";

interface ShareCardProps {
  type: "achievement" | "savings" | "streak";
  title: string;
  value: string;
  subtitle?: string;
  onShare?: () => void;
}

export function ShareCard({ type, title, value, subtitle, onShare }: ShareCardProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const getGradient = () => {
    switch (type) {
      case "achievement":
        return "from-purple-600 via-purple-500 to-cyan-500";
      case "savings":
        return "from-emerald-600 via-emerald-500 to-cyan-500";
      case "streak":
        return "from-amber-600 via-orange-500 to-red-500";
      default:
        return "from-purple-600 to-cyan-500";
    }
  };

  const shareText = `${title}: ${value}${subtitle ? ` - ${subtitle}` : ""} - Perth Saver`;
  const shareUrl = typeof window !== "undefined" ? window.location.origin : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Perth Saver Achievement",
          text: shareText,
          url: shareUrl,
        });
        onShare?.();
        toast({ title: "Shared successfully!" });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied to clipboard!" });
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, "_blank", "width=550,height=420");
    onShare?.();
  };

  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "width=550,height=420");
    onShare?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/60 hover:text-white hover:bg-white/10"
          data-testid="button-share-card"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900/95 to-slate-950/95 border-purple-500/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" />
            Share Your Achievement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div 
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGradient()} p-6 shadow-2xl`}
            data-testid="share-card-preview"
          >
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex items-center gap-3 mb-4">
              <img src={perthSaverLogo} alt="Perth Saver" className="w-10 h-10 rounded-lg" />
              <span className="font-display font-bold text-white/90">Perth Saver</span>
            </div>
            
            <div className="relative">
              <p className="text-white/70 text-sm mb-1">{title}</p>
              <motion.p 
                className="text-4xl font-display font-bold text-white mb-1"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {value}
              </motion.p>
              {subtitle && (
                <p className="text-white/60 text-sm">{subtitle}</p>
              )}
            </div>
            
            <div className="absolute bottom-4 right-4 text-white/40 text-xs">
              perthsaver.com.au
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {typeof navigator !== "undefined" && "share" in navigator && (
              <Button
                onClick={handleNativeShare}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white"
                data-testid="button-native-share"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
            
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-copy-link"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
            
            <Button
              variant="outline"
              onClick={handleTwitterShare}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-twitter-share"
            >
              <Twitter className="h-4 w-4 mr-2 text-sky-400" />
              Twitter
            </Button>
            
            <Button
              variant="outline"
              onClick={handleFacebookShare}
              className="border-white/20 text-white hover:bg-white/10"
              data-testid="button-facebook-share"
            >
              <Facebook className="h-4 w-4 mr-2 text-blue-500" />
              Facebook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
