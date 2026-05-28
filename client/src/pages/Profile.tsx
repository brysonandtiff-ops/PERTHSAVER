import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  User, Bell, Heart, Save, Loader2, Settings, LogOut, 
  ChevronRight, Crown, Shield, CreditCard, Users, MapPin,
  Mail, Phone, Camera, Award, TrendingUp, Star, Sparkles,
  Gift, Target, Flame
} from "lucide-react";
import { useAuth } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const menuItems = [
  { icon: Settings, label: "Settings", href: "/settings", color: "text-white/70", desc: "App preferences" },
  { icon: Users, label: "Family", href: "/family", color: "text-purple-400", desc: "Manage members" },
  { icon: CreditCard, label: "Subscription", href: "/pricing", color: "text-cyan-400", desc: "View plan" },
  { icon: Shield, label: "Privacy", href: "/settings", color: "text-emerald-400", desc: "Security settings" },
  { icon: Bell, label: "Notifications", href: "/notifications", color: "text-pink-400", desc: "Alert preferences" },
  { icon: Gift, label: "Rewards", href: "/rewards", color: "text-orange-400", desc: "Your rewards" },
];

const achievements = [
  { icon: Flame, label: "45 Day Streak", color: "from-orange-500 to-red-500" },
  { icon: Star, label: "Top Saver", color: "from-purple-500 to-pink-500" },
  { icon: Target, label: "Goal Crusher", color: "from-cyan-500 to-blue-500" },
];

function AnimatedValue({ value, prefix = "", suffix = "" }: { value: string; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {prefix}{value}{suffix}
    </motion.span>
  );
}

export default function Profile() {
  const { data: authData, isLoading: authLoading, refetch } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    phone: "",
  });

  const [preferences, setPreferences] = useState({
    priceAlerts: true,
    weeklyReport: true,
    communityFeed: false,
    emailNotifications: true,
  });

  useEffect(() => {
    if (authData?.user) {
      setUserInfo({
        firstName: authData.user.firstName || "",
        lastName: authData.user.lastName || "",
        email: authData.user.email || "",
        location: authData.user.location || "Perth, WA",
        phone: "",
      });
      if (authData.user.preferences) {
        setPreferences(prev => ({
          ...prev,
          ...authData.user.preferences
        }));
      }
    }
  }, [authData]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          location: userInfo.location,
        }),
      });

      if (response.ok) {
        await refetch();
        setIsEditing(false);
        toast({
          title: "Profile Updated",
          description: "Your changes have been saved.",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = () => {
    const first = userInfo.firstName?.[0] || "";
    const last = userInfo.lastName?.[0] || "";
    return (first + last).toUpperCase() || "PS";
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      window.location.href = "/";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return <PageLoader />;
  }

  if (!authData?.user) {
    return <AuthRequired message="Please login to access your profile" />;
  }

  return (
    <div className="min-h-full pb-24">
      <motion.div 
        className="w-full max-w-xl mx-auto px-4 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header - Apple Style */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-8">
          <motion.div 
            className="relative mb-5"
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="h-28 w-28 rounded-full flex items-center justify-center text-3xl font-semibold text-white"
              style={{
                background: 'linear-gradient(145deg, #A855F7, #06B6D4)',
                boxShadow: '0 8px 32px rgba(168, 85, 247, 0.35), 0 0 0 4px rgba(255,255,255,0.05)'
              }}
            >
              {getInitials()}
            </motion.div>
            <motion.button 
              className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-zinc-800/90 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-zinc-700/90 transition-all shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="h-4 w-4" />
            </motion.button>
          </motion.div>
          
          <h1 className="text-2xl font-semibold text-white tracking-tight" data-testid="text-profile-title">
            {userInfo.firstName} {userInfo.lastName}
          </h1>
          <p className="text-white/50 text-sm mt-1">{userInfo.email}</p>
          
          <div className="flex items-center gap-2 mt-3">
            <Badge className="bg-gradient-to-r from-purple-500/25 to-cyan-500/25 text-purple-300 border-0 px-3 py-1">
              <Crown className="h-3.5 w-3.5 mr-1.5" />
              Free Plan
            </Badge>
            <Badge variant="outline" className="text-white/50 border-white/15 px-3 py-1">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              {userInfo.location}
            </Badge>
          </div>
        </motion.div>

        {/* Stats Row - Cleaner Apple Style */}
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 mb-6">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/50 border-white/5 hover:border-purple-500/20 transition-colors">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
                  <AnimatedValue value="$2.4K" />
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Total Saved</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/50 border-white/5 hover:border-cyan-500/20 transition-colors">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-300 bg-clip-text text-transparent">
                  <AnimatedValue value="127" />
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Deals Used</p>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Card className="bg-zinc-900/50 border-white/5 hover:border-orange-500/20 transition-colors">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                  <AnimatedValue value="45" />
                </p>
                <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">Day Streak</p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Achievements Row */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-white/60">Achievements</h2>
            <Link href="/gamification">
              <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 text-xs h-7 px-2">
                View All
              </Button>
            </Link>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {achievements.map((achievement, idx) => (
              <motion.div
                key={idx}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-full bg-zinc-900/60 border border-white/5"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className={`h-6 w-6 rounded-full bg-gradient-to-br ${achievement.color} flex items-center justify-center`}>
                  <achievement.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-xs text-white/70 font-medium whitespace-nowrap">{achievement.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Edit Profile Card - Cleaner */}
        <motion.div variants={itemVariants} className="mb-5">
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-400" />
                  Personal Info
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  disabled={isSaving}
                  className="text-purple-400 hover:text-purple-300 h-8 font-medium"
                  data-testid="button-edit-profile"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    <>
                      <Save className="h-4 w-4 mr-1.5" />
                      Save
                    </>
                  ) : (
                    "Edit"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2 block">First Name</label>
                  <Input
                    value={userInfo.firstName}
                    onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white/5 border-white/10 text-white h-11 rounded-xl disabled:opacity-50 focus:border-purple-500/50 focus:ring-purple-500/20"
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2 block">Last Name</label>
                  <Input
                    value={userInfo.lastName}
                    onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                    disabled={!isEditing}
                    className="bg-white/5 border-white/10 text-white h-11 rounded-xl disabled:opacity-50 focus:border-purple-500/50 focus:ring-purple-500/20"
                    data-testid="input-last-name"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2 block">Email</label>
                <div className="flex items-center gap-3 px-4 h-11 rounded-xl bg-white/5 border border-white/10">
                  <Mail className="h-4 w-4 text-white/30" />
                  <span className="text-white/50 text-sm">{userInfo.email}</span>
                </div>
              </div>
              <div>
                <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider mb-2 block">Location</label>
                <Input
                  value={userInfo.location}
                  onChange={(e) => setUserInfo({ ...userInfo, location: e.target.value })}
                  disabled={!isEditing}
                  className="bg-white/5 border-white/10 text-white h-11 rounded-xl disabled:opacity-50 focus:border-purple-500/50 focus:ring-purple-500/20"
                  data-testid="input-location"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Settings - Cleaner Toggle Style */}
        <motion.div variants={itemVariants} className="mb-5">
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5">
              <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-cyan-400" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-white/5">
              {[
                { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified about price drops' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Savings summary every Sunday' },
                { key: 'emailNotifications', label: 'Email Updates', desc: 'Important updates via email' },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-white">{pref.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{pref.desc}</p>
                  </div>
                  <Switch
                    checked={preferences[pref.key as keyof typeof preferences]}
                    onCheckedChange={(checked) => setPreferences({ ...preferences, [pref.key]: checked })}
                    className="data-[state=checked]:bg-purple-500"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items - Apple Style List */}
        <motion.div variants={itemVariants} className="mb-6">
          <Card className="bg-zinc-900/50 border-white/5 overflow-hidden">
            <CardContent className="p-0">
              {menuItems.map((item, idx) => (
                <Link key={idx} href={item.href}>
                  <motion.div 
                    className="flex items-center justify-between px-4 py-3.5 hover:bg-white/5 transition-colors cursor-pointer border-b border-white/5 last:border-0"
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.99 }}
                    data-testid={`menu-${item.label.toLowerCase()}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center">
                        <item.icon className={`h-4.5 w-4.5 ${item.color}`} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-white">{item.label}</span>
                        <p className="text-[11px] text-white/40">{item.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/25" />
                  </motion.div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout Button - Subtle */}
        <motion.div variants={itemVariants}>
          <Button 
            variant="ghost" 
            className="w-full justify-center text-red-400/80 hover:text-red-400 hover:bg-red-500/10 h-12 rounded-xl font-medium"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
