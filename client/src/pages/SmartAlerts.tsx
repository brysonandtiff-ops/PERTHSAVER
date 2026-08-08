import { motion } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Mail, Smartphone, Volume2, Clock } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6,  },
  },
};

export default function SmartAlerts() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <motion.div
        className="flex-1 w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-1 sm:mb-2">Smart Alerts</h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60">Get notified about deals, price drops & savings opportunities</p>
        </motion.div>

        {/* Alert Channels */}
        <motion.div className="space-y-4 mb-8" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Notification Channels</p>

          {[
            { name: "Push Notifications", desc: "Instant alerts on your phone", icon: Smartphone, enabled: true },
            { name: "Email Digests", desc: "Daily or weekly email summaries", icon: Mail, enabled: true },
            { name: "SMS Alerts", desc: "Critical deals via text message", icon: Bell, enabled: false },
            { name: "In-App Notifications", desc: "Alerts when you open the app", icon: Volume2, enabled: true },
          ].map((channel, i) => {
            const Icon = channel.icon;
            return (
              <motion.div key={`channel-${i}`} variants={itemVariants}>
                <Card data-testid={`card-channel-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-semibold text-white" data-testid={`text-channel-name-${i}`}>{channel.name}</p>
                        <p className="text-xs text-white/60" data-testid={`text-channel-desc-${i}`}>{channel.desc}</p>
                      </div>
                    </div>
                    <Switch data-testid={`switch-channel-${i}`} checked={channel.enabled} />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Alert Types */}
        <motion.div className="space-y-4 mb-8" variants={containerVariants}>
          <p className="text-xs font-semibold text-white/60 uppercase">Alert Preferences</p>

          {[
            { type: "Price Drops", desc: "When items you're watching drop below your target", active: true },
            { type: "Flash Sales", desc: "Limited-time deals (< 24 hours)", active: true },
            { type: "Stock Alerts", desc: "When out-of-stock items are back", active: false },
            { type: "Weekly Digest", desc: "Best deals from the week", active: true },
            { type: "Competitor Price Match", desc: "When competitors have better prices", active: true },
            { type: "Budget Warnings", desc: "When spending exceeds your weekly budget", active: false },
          ].map((alert, i) => (
            <motion.div key={`alert-${i}`} variants={itemVariants}>
              <Card data-testid={`card-alert-type-${i}`} className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur hover:border-white/15 transition-all duration-300">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-white" data-testid={`text-alert-type-${i}`}>{alert.type}</p>
                    <p className="text-xs text-white/60 mt-1" data-testid={`text-alert-desc-${i}`}>{alert.desc}</p>
                  </div>
                  <Switch data-testid={`switch-alert-${i}`} checked={alert.active} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Alert Timing */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-timing" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="font-display text-white flex items-center gap-2">
                <Clock className="h-6 w-6 text-primary" />
                Alert Timing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-white mb-3">Best times to send alerts</p>
                {[
                  { time: "Early Morning (6-8am)", checked: true },
                  { time: "Midday (12-1pm)", checked: true },
                  { time: "After Work (5-6pm)", checked: true },
                  { time: "Evening (7-9pm)", checked: false },
                  { time: "Anytime (urgent deals)", checked: true },
                ].map((timing, i) => (
                  <div key={`timing-${i}`} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/8 mb-2 hover:bg-white/10 transition-colors">
                    <p className="text-sm text-white" data-testid={`text-timing-${i}`}>{timing.time}</p>
                    <Switch data-testid={`switch-timing-${i}`} checked={timing.checked} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Alerts */}
        <motion.div variants={itemVariants}>
          <Card data-testid="card-recent-alerts" className="bg-gradient-to-br from-white/8 to-white/4 border-white/8 backdrop-blur mb-8">
            <CardHeader>
              <CardTitle className="font-display text-white">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { text: "🔥 ALDI avocados down to $1.99 (was $2.49)", time: "5m ago", action: true },
                { text: "💰 Save $15 on Barramundi - Coles has it at $14.99", time: "30m ago", action: true },
                { text: "📦 Your Woolies wishlist is on sale today", time: "2h ago", action: true },
                { text: "👍 Weekly digest: You saved $87 this week!", time: "Yesterday", action: false },
              ].map((alert, i) => (
                <motion.div key={`recent-${i}`} variants={itemVariants} className="p-4 bg-white/5 rounded-lg border border-white/8 flex items-center justify-between hover:bg-white/10 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm text-white" data-testid={`text-recent-alert-${i}`}>{alert.text}</p>
                    <p className="text-xs text-white/50 mt-1" data-testid={`text-alert-time-${i}`}>{alert.time}</p>
                  </div>
                  {alert.action && (
                    <Button data-testid={`button-view-${i}`} size="sm" className="bg-primary hover:bg-primary/90 text-white">View</Button>
                  )}
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Settings */}
        <motion.div variants={itemVariants} className="flex gap-3">
          <Button data-testid="button-save" className="flex-1 bg-primary hover:bg-primary/90 text-white">Save Settings</Button>
          <Button data-testid="button-reset" variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">Reset to Defaults</Button>
        </motion.div>
      </motion.div>

      <Footer />
    </div>
  );
}
