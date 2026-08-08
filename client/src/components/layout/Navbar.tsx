import { Link, useLocation } from "wouter";
import { Search, Bell, User, Sparkles, Maximize, Minimize, Cast } from "lucide-react";
import { motion } from "framer-motion";
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/api";
import { LiveDataIndicator } from "@/components/LiveDataIndicator";
import { useFullscreen } from "@/contexts/FullscreenContext";
import { useChromecast } from "@/contexts/ChromecastContext";

export function Navbar() {
  const [location] = useLocation();
  const { data: user } = useAuth();
  const { isFullscreen, toggleFullscreen, isSupported: fullscreenSupported } = useFullscreen();
  const { isAvailable: chromecastAvailable, isConnected, connect, disconnect } = useChromecast();

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/groceries": "Groceries",
      "/grocery-comparison": "Groceries",
      "/bill-tracker": "Bill Tracker",
      "/subscriptions": "Subscriptions",
      "/savings-goals": "Savings Goals",
      "/analytics": "Analytics",
      "/notifications": "Notifications",
      "/rewards": "Rewards",
      "/savings-tools": "Savings Tools",
      "/receipt-scanner": "Receipt Scanner",
      "/meal-planner": "Meal Planner",
      "/community-forum": "Community",
      "/community-sharing": "Share & Save",
      "/gamification": "Achievements",
      "/leaderboard": "Leaderboard",
      "/coach": "AI Coach",
      "/search": "Search",
      "/profile": "Profile",
      "/settings": "Settings",
      "/price-alerts": "Price Alerts",
      "/smart-alerts": "Smart Alerts",
      "/utilities": "Utilities",
      "/insurance": "Insurance",
      "/business": "Business Savings",
      "/cashback": "Cashback",
      "/financial": "Financial Planning",
      "/travel": "Travel Saver",
      "/entertainment": "Entertainment",
      "/mobile": "Mobile Plans",
      "/fashion": "Fashion",
      "/healthcare": "Healthcare",
      "/vehicle": "Vehicle & EV",
      "/realestate": "Real Estate",
      "/education": "Education",
      "/family": "Family Logins",
      "/family-savings": "Family Savings",
      "/sustainability": "Sustainability",
      "/wishlist": "Wishlist",
      "/reports": "Reports",
      "/tutorials": "Tutorials",
      "/news": "News Corner",
      "/challenges": "Challenges",
      "/design-system": "Design System",
      "/promo-finder": "Deal Finder",
      "/ai-coach": "Perth Smart Saver AI",
    };
    return titles[location] || "";
  };

  const pageTitle = getPageTitle();

  return (
    <header className="sticky top-0 z-40 w-full" data-testid="navbar">
      {/* Gradient fade into background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-transparent pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-xl" style={{ background: 'rgba(0,0,0,0.15)' }} />
      
      <div className="relative flex h-16 items-center gap-3 px-4 max-w-2xl mx-auto">
        {/* Sidebar Toggle */}
        <SidebarTrigger 
          className="text-white/60 hover:text-white hover:bg-white/8 transition-all rounded-xl" 
          data-testid="sidebar-toggle" 
        />

        {/* Brand Logo with Motion Effects */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group" data-testid="brand-logo">
          <motion.img 
            src={perthSaverLogo} 
            alt="Perth Saver" 
            className="w-10 h-10 rounded-xl shadow-xl"
            style={{ 
              filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.2)) drop-shadow(0 0 24px rgba(6, 182, 212, 0.1))'
            }}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.4 }}
          />
          <motion.span 
            className="font-display font-bold text-xl tracking-tight"
            initial={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.span 
              className="bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent inline-block"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(255,255,255,0.1)",
                  "0 0 20px rgba(255,255,255,0.3)",
                  "0 0 10px rgba(255,255,255,0.1)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Perth
            </motion.span>
            <motion.span 
              className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent inline-block"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                textShadow: [
                  "0 0 15px rgba(168, 85, 247, 0.3)",
                  "0 0 25px rgba(6, 182, 212, 0.5)",
                  "0 0 15px rgba(168, 85, 247, 0.3)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Saver
            </motion.span>
          </motion.span>
        </Link>

        {/* Page Title & Live Indicator - Center */}
        <div className="flex-1 flex items-center justify-center gap-3">
          {pageTitle && (
            <div className="flex items-center gap-2">
              <img 
                src="/app-icon.svg" 
                alt="" 
                className="w-5 h-5"
                style={{ filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))' }}
              />
              <span className="text-sm font-medium text-white/60" data-testid="page-title">
                {pageTitle}
              </span>
            </div>
          )}
          <LiveDataIndicator compact className="hidden sm:flex" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Toggle */}
          {fullscreenSupported && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="h-9 w-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
              data-testid="fullscreen-button"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          )}

          {/* Chromecast Toggle - Always visible */}
          <Button
            variant="ghost"
            size="icon"
            onClick={chromecastAvailable ? (isConnected ? disconnect : connect) : undefined}
            disabled={!chromecastAvailable}
            className={`h-9 w-9 rounded-xl transition-all ${
              isConnected 
                ? 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20' 
                : chromecastAvailable
                  ? 'text-white/60 hover:text-white hover:bg-white/10'
                  : 'text-white/30 cursor-not-allowed'
            }`}
            data-testid="chromecast-button"
            title={isConnected ? "Disconnect from Chromecast" : chromecastAvailable ? "Connect to Chromecast" : "Chromecast not available"}
          >
            <Cast className="h-4 w-4" />
          </Button>

          {/* Search Button */}
          <Link href="/search">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-9 w-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all"
              data-testid="search-button"
            >
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <NotificationCenter />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-xl hover:bg-white/10 p-0 overflow-hidden"
                data-testid="profile-button"
              >
                <Avatar className="h-9 w-9 ring-2 ring-purple-500/30 hover:ring-purple-500/50 transition-all">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-sm font-semibold">
                    {user?.username?.charAt(0).toUpperCase() || 'P'}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border-purple-500/20 rounded-xl">
              <DropdownMenuLabel className="text-white">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{user?.username || 'Perth User'}</p>
                  <p className="text-xs text-white/50">{user?.email || 'user@perthsaver.com'}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Link href="/profile">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer">
                <Link href="/pricing" className="flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                  <span className="text-gradient font-medium">Upgrade to Pro</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={async () => {
                  try {
                    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                    window.location.href = "/";
                  } catch {
                    window.location.href = "/";
                  }
                }}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg cursor-pointer"
                data-testid="button-navbar-logout"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
