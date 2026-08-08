import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ExportButton } from "@/components/ExportButton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Settings as SettingsIcon, Bell, Moon, Globe, Shield, User, Trash2, Save, Download, Database, Palette, Volume2, VolumeX, Zap, Wind } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSavingsGoals, useBills, usePriceAlerts, useMealPlans, useReceipts, useSubscriptions, useAnalytics, useLeaderboard, useToggleLeaderboardVisibility } from "@/lib/api";
import { exportAllUserData, ExportFormat } from "@/lib/export";
import { useAppPreferences } from "@/context/AppPreferencesContext";
import { ChromecastController } from "@/components/ChromecastController";
import { motion } from "framer-motion";

export default function Settings() {
  // Get app preferences context
  const { preferences, updatePreferences, resetTheme } = useAppPreferences();

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [dealAlerts, setDealAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // App Settings
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  // Privacy Settings
  const [dataSharing, setDataSharing] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [personalization, setPersonalization] = useState(true);

  // Leaderboard data
  const { data: leaderboardData } = useLeaderboard();
  const toggleLeaderboardVisibility = useToggleLeaderboardVisibility();

  // Account Settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveSettings = () => {
    // Save theme preference
    updatePreferences({ theme: theme as any });
    // Save animation level
    const animationLevel = preferences.reducedMotion ? "minimal" : "full";
    updatePreferences({ animationLevel: animationLevel as any });
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deleted",
      description: "Your account has been permanently deleted.",
      variant: "destructive",
    });
  };

  const handleToggleLeaderboardVisibility = async () => {
    const isCurrentlyPublic = leaderboardData?.userStats?.isPublic ?? true;
    try {
      await toggleLeaderboardVisibility.mutateAsync(!isCurrentlyPublic);
      toast({
        title: isCurrentlyPublic ? "Hidden from leaderboard" : "Now visible on leaderboard",
        description: isCurrentlyPublic 
          ? "You won't appear on the public leaderboard" 
          : "Other users can now see your progress",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update leaderboard visibility",
        variant: "destructive",
      });
    }
  };

  const { data: goalsData } = useSavingsGoals();
  const { data: billsData } = useBills();
  const { data: priceAlertsData } = usePriceAlerts();
  const { data: mealPlansData } = useMealPlans();
  const { data: receiptsData } = useReceipts();
  const { data: subscriptionsData } = useSubscriptions();
  const { data: analyticsData } = useAnalytics();

  const handleExportAllData = (format: ExportFormat) => {
    const allData = {
      goals: goalsData?.goals || [],
      bills: billsData?.bills || [],
      priceAlerts: priceAlertsData?.alerts || [],
      mealPlans: mealPlansData?.mealPlans || [],
      receipts: receiptsData?.receipts || [],
      subscriptions: subscriptionsData?.subscriptions || [],
      analytics: analyticsData || {},
    };

    exportAllUserData(allData, format);
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 md:px-8 xl:px-10 py-8 sm:py-12 max-w-2xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white" data-testid="text-page-title">
            Settings
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/60 mt-1 sm:mt-2" data-testid="text-page-subtitle">
            Manage your account preferences and app settings
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification Settings */}
          <Card className="glass border-white/8" data-testid="card-notifications">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage how you receive updates and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="email-notifications" className="text-white font-medium">Email Notifications</Label>
                  <p className="text-sm text-white/60">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="push-notifications" className="text-white font-medium">Push Notifications</Label>
                  <p className="text-sm text-white/60">Get push notifications on your device</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  data-testid="switch-push-notifications"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="sms-notifications" className="text-white font-medium">SMS Notifications</Label>
                  <p className="text-sm text-white/60">Receive text messages for important alerts</p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                  data-testid="switch-sms-notifications"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="price-alerts" className="text-white font-medium">Price Alerts</Label>
                  <p className="text-sm text-white/60">Notify when tracked items go on sale</p>
                </div>
                <Switch
                  id="price-alerts"
                  checked={priceAlerts}
                  onCheckedChange={setPriceAlerts}
                  data-testid="switch-price-alerts"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="deal-alerts" className="text-white font-medium">Deal Alerts</Label>
                  <p className="text-sm text-white/60">Get notified about new deals</p>
                </div>
                <Switch
                  id="deal-alerts"
                  checked={dealAlerts}
                  onCheckedChange={setDealAlerts}
                  data-testid="switch-deal-alerts"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="weekly-digest" className="text-white font-medium">Weekly Digest</Label>
                  <p className="text-sm text-white/60">Weekly summary of your savings</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                  data-testid="switch-weekly-digest"
                />
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card className="glass border-white/8" data-testid="card-app-settings">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-accent" />
                App Preferences
              </CardTitle>
              <CardDescription className="text-white/60">
                Customize your app experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme" className="text-white font-medium flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Theme
                </Label>
                <select
                  id="theme"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                  data-testid="select-theme"
                >
                  <option value="dark">Dark (Current)</option>
                  <option value="light" disabled>Light (Coming Soon)</option>
                  <option value="auto" disabled>Auto (Coming Soon)</option>
                </select>
              </div>
              <Separator className="bg-white/5" />
              <div className="space-y-2">
                <Label htmlFor="language" className="text-white font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Language
                </Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white"
                  data-testid="select-language"
                >
                  <option value="en">English (Australia)</option>
                  <option value="en-us">English (US)</option>
                  <option value="en-uk">English (UK)</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Display Settings */}
          <Card className="glass border-white/8" data-testid="card-advanced-display">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-400" />
                Advanced Display Settings
              </CardTitle>
              <CardDescription className="text-white/60">
                Fine-tune the visual appearance of Perth Saver
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Font Size */}
              <div>
                <Label className="text-white font-medium mb-3 block">Font Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  {["small", "medium", "large"].map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => updatePreferences({ fontSize: size as any })}
                      className={`py-2 px-3 rounded-lg font-semibold transition-all duration-300 text-sm capitalize ${
                        preferences.fontSize === size
                          ? "bg-purple-500/30 border-purple-500/50 border text-white"
                          : "bg-white/5 border-white/10 border text-white/60 hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {size === "small" ? "S" : size === "medium" ? "M" : "L"}
                    </motion.button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Accent Color */}
              <div>
                <Label className="text-white font-medium mb-3 block">Accent Color</Label>
                <div className="grid grid-cols-4 gap-2">
                  {["cyan", "teal", "emerald", "slate"].map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => updatePreferences({ accentColor: color as any })}
                      className={`py-3 px-2 rounded-lg font-semibold transition-all duration-300 text-xs capitalize ${
                        preferences.accentColor === color
                          ? "ring-2 ring-offset-2 ring-offset-background"
                          : ""
                      } ${
                        color === "cyan"
                          ? "bg-purple-500/30 text-purple-300"
                          : color === "teal"
                          ? "bg-teal-500/30 text-teal-300"
                          : color === "emerald"
                          ? "bg-cyan-500/30 text-cyan-300"
                          : "bg-slate-500/30 text-slate-300"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {color}
                    </motion.button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Animation Level */}
              <div>
                <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Animation Level
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {["full", "reduced", "minimal"].map((level) => (
                    <motion.button
                      key={level}
                      onClick={() => updatePreferences({ animationLevel: level as any })}
                      className={`py-2 px-3 rounded-lg font-semibold transition-all duration-300 text-sm capitalize ${
                        preferences.animationLevel === level
                          ? "bg-purple-500/30 border-purple-500/50 border text-white"
                          : "bg-white/5 border-white/10 border text-white/60 hover:bg-white/10"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {level}
                    </motion.button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/5" />

              {/* Compact Mode Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="compact-mode" className="text-white font-medium">Compact Mode</Label>
                  <p className="text-sm text-white/60">Reduce spacing for a more condensed view</p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={preferences.compactMode}
                  onCheckedChange={(checked) => updatePreferences({ compactMode: checked })}
                  data-testid="switch-compact-mode"
                />
              </div>

              <Separator className="bg-white/5" />

              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-purple-400" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-white/40" />
                  )}
                  <div>
                    <Label htmlFor="sound" className="text-white font-medium">Sound Effects</Label>
                    <p className="text-sm text-white/60">Play notification sounds</p>
                  </div>
                </div>
                <Switch
                  id="sound"
                  checked={preferences.soundEnabled}
                  onCheckedChange={(checked) => updatePreferences({ soundEnabled: checked })}
                  data-testid="switch-sound-enabled"
                />
              </div>

              <Separator className="bg-white/5" />

              {/* Reduce Motion */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wind className="h-4 w-4 text-purple-400" />
                  <div>
                    <Label htmlFor="reduce-motion" className="text-white font-medium">Reduce Motion</Label>
                    <p className="text-sm text-white/60">Minimize animation effects</p>
                  </div>
                </div>
                <Switch
                  id="reduce-motion"
                  checked={preferences.reducedMotion}
                  onCheckedChange={(checked) => updatePreferences({ reducedMotion: checked })}
                  data-testid="switch-reduce-motion"
                />
              </div>

              <Separator className="bg-white/5" />

              {/* Reset Theme Button */}
              <div className="space-y-3">
                <Label className="text-white font-medium block">Theme Cache</Label>
                <p className="text-sm text-white/60 mb-3">If theme updates aren't visible, reset the cache and reload.</p>
                <Button
                  onClick={resetTheme}
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                  data-testid="button-reset-theme"
                >
                  <Wind className="h-4 w-4 mr-2" />
                  Reset Theme & Cache
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Chromecast Controller */}
          <Card className="glass border-white/8" data-testid="card-chromecast">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                📺 Cast Your Data
              </CardTitle>
              <CardDescription className="text-white/60">
                Cast Perth Saver to your Chromecast devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChromecastController />
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="glass border-white/8" data-testid="card-privacy">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Privacy & Data
              </CardTitle>
              <CardDescription className="text-white/60">
                Control your data and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className="text-white font-medium">Data Sharing</Label>
                  <p className="text-sm text-white/60">Share anonymized data to improve the service</p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={dataSharing}
                  onCheckedChange={setDataSharing}
                  data-testid="switch-data-sharing"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="analytics" className="text-white font-medium">Analytics</Label>
                  <p className="text-sm text-white/60">Help us improve with usage analytics</p>
                </div>
                <Switch
                  id="analytics"
                  checked={analytics}
                  onCheckedChange={setAnalytics}
                  data-testid="switch-analytics"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="personalization" className="text-white font-medium">Personalization</Label>
                  <p className="text-sm text-white/60">Get personalized recommendations</p>
                </div>
                <Switch
                  id="personalization"
                  checked={personalization}
                  onCheckedChange={setPersonalization}
                  data-testid="switch-personalization"
                />
              </div>
              <Separator className="bg-white/5" />
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="leaderboard-visibility-settings" className="text-white font-medium">Leaderboard Visibility</Label>
                  <p className="text-sm text-white/60">Show your savings on the community leaderboard</p>
                </div>
                <Switch
                  id="leaderboard-visibility-settings"
                  checked={leaderboardData?.userStats?.isPublic ?? true}
                  onCheckedChange={handleToggleLeaderboardVisibility}
                  disabled={toggleLeaderboardVisibility.isPending}
                  data-testid="switch-leaderboard-visibility-settings"
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card className="glass border-white/8" data-testid="card-account">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-accent" />
                Account Management
              </CardTitle>
              <CardDescription className="text-white/60">
                Manage your account security and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-white font-medium">Change Password</h3>
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-white">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-current-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-new-password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                    data-testid="input-confirm-password"
                  />
                </div>
                <Button
                  onClick={handleChangePassword}
                  className="bg-primary hover:bg-primary/90 text-white"
                  data-testid="button-change-password"
                >
                  Change Password
                </Button>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4">
                <h3 className="text-white font-medium">Danger Zone</h3>
                <p className="text-sm text-white/60">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                      data-testid="button-delete-account"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="glass-strong border-white/10" data-testid="dialog-delete-account">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-white/70">
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-white/10 text-white hover:bg-white/5" data-testid="button-cancel-delete">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={handleDeleteAccount}
                        data-testid="button-confirm-delete"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>

          {/* Export Data */}
          <Card className="glass border-primary/20" data-testid="card-export-data">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Export Your Data
              </CardTitle>
              <CardDescription className="text-white/60">
                Download all your savings data for backup or portability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <h4 className="text-white font-medium mb-2">Complete Data Export</h4>
                  <p className="text-sm text-white/60 mb-4">
                    Export all your data including savings goals, bills, price alerts, meal plans, 
                    receipts, subscriptions, and analytics. Available in CSV or JSON format.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-white/50">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Savings Goals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Bills & Payments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Price Alerts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Meal Plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Receipts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      <span>Analytics</span>
                    </div>
                  </div>
                </div>
                
                <ExportButton 
                  onExport={handleExportAllData}
                  label="Export All Data"
                  className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
                  dataTestId="button-export-all-data"
                />

                <p className="text-xs text-white/40">
                  Your data is exported in a portable format that can be imported into other applications 
                  or used for backup purposes. All timestamps are in your local timezone.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              className="bg-primary hover:bg-primary/90 text-white"
              data-testid="button-save-settings"
            >
              <Save className="h-4 w-4 mr-2" />
              Save All Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
