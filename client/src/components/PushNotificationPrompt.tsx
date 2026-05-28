import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellRing, X, Fuel, ShoppingBag, Receipt, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface NotificationPreferences {
  fuelPrices: boolean;
  deals: boolean;
  billReminders: boolean;
  weeklySummary: boolean;
}

const NOTIFICATION_STORAGE_KEY = "perth-saver-notification-prefs";
const PROMPT_DISMISSED_KEY = "perth-saver-notification-prompt-dismissed";

interface PushNotificationPromptProps {
  forceShow?: boolean;
  onClose?: () => void;
}

export function PushNotificationPrompt({ forceShow = false, onClose }: PushNotificationPromptProps = {}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    fuelPrices: true,
    deals: true,
    billReminders: true,
    weeklySummary: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!("Notification" in window)) return;
    
    setPermission(Notification.permission);
    
    const savedPrefs = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
    
    // Force show when explicitly requested (e.g., from settings)
    if (forceShow) {
      setShowPrompt(true);
      return;
    }
    
    const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY);
    
    if (Notification.permission === "default" && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [forceShow]);

  const requestPermission = async () => {
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(preferences));
        
        new Notification("Perth Saver", {
          body: "Notifications enabled! We'll alert you to fuel price drops and deals.",
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-72.png",
        });
        
        toast({
          title: "Notifications Enabled",
          description: "You'll receive alerts for fuel prices, deals, and more!",
        });
        
        setShowPrompt(false);
      } else if (result === "denied") {
        toast({
          title: "Notifications Blocked",
          description: "You can enable them later in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Notification permission error:", error);
    }
  };

  const dismissPrompt = () => {
    if (!forceShow) {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "true");
    }
    setShowPrompt(false);
    onClose?.();
  };

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(newPrefs));
  };

  if (!("Notification" in window)) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-40 max-w-sm"
          data-testid="notification-prompt"
        >
          <Card className="bg-gradient-to-br from-slate-900/95 to-slate-950/95 border-purple-500/20 shadow-2xl shadow-purple-500/10 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />
            
            <CardContent className="relative p-5">
              <button
                onClick={dismissPrompt}
                className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
                data-testid="button-dismiss-notification"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex items-start gap-4 mb-4">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <BellRing className="h-6 w-6 text-purple-400" />
                </motion.div>
                <div>
                  <h3 className="font-display font-semibold text-white text-lg mb-1">
                    Stay Updated
                  </h3>
                  <p className="text-white/60 text-sm">
                    Get instant alerts for fuel price drops, deals, and bill reminders.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-cyan-400" />
                    <Label className="text-white/80 text-sm">Fuel Price Drops</Label>
                  </div>
                  <Switch
                    checked={preferences.fuelPrices}
                    onCheckedChange={(v) => updatePreference("fuelPrices", v)}
                    data-testid="switch-fuel-notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-purple-400" />
                    <Label className="text-white/80 text-sm">Deal Alerts</Label>
                  </div>
                  <Switch
                    checked={preferences.deals}
                    onCheckedChange={(v) => updatePreference("deals", v)}
                    data-testid="switch-deal-notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-emerald-400" />
                    <Label className="text-white/80 text-sm">Bill Reminders</Label>
                  </div>
                  <Switch
                    checked={preferences.billReminders}
                    onCheckedChange={(v) => updatePreference("billReminders", v)}
                    data-testid="switch-bill-notifications"
                  />
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-amber-400" />
                    <Label className="text-white/80 text-sm">Weekly Summary</Label>
                  </div>
                  <Switch
                    checked={preferences.weeklySummary}
                    onCheckedChange={(v) => updatePreference("weeklySummary", v)}
                    data-testid="switch-weekly-notifications"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissPrompt}
                  className="flex-1 text-white/60 hover:text-white hover:bg-white/10"
                  data-testid="button-maybe-later"
                >
                  Maybe Later
                </Button>
                <Button
                  size="sm"
                  onClick={requestPermission}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white shadow-lg shadow-purple-500/20"
                  data-testid="button-enable-notifications"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Enable
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function sendNotification(title: string, options?: NotificationOptions) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  
  const prefs = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  if (!prefs) return;
  
  new Notification(title, {
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-72.png",
    ...options,
  });
}
