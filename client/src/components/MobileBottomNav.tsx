import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Radar,
  Target,
  User,
  ScanLine,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { CameraReceiptScanner } from "./CameraReceiptScanner";
import { useToast } from "@/hooks/use-toast";

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: "home", label: "Home", icon: LayoutDashboard, href: "/dashboard" },
  { id: "save", label: "Goals", icon: Target, href: "/savings-goals" },
  { id: "scan", label: "Scan", icon: ScanLine, href: "" },
  { id: "deals", label: "Deals", icon: Radar, href: "/deals" },
  { id: "profile", label: "Profile", icon: User, href: "/profile" },
];

export function MobileBottomNav() {
  const [location] = useLocation();
  const [showScanner, setShowScanner] = useState(false);
  const { toast } = useToast();

  const isActive = (href: string) => {
    if (!href) return false;
    if (href === "/dashboard" && location === "/dashboard") return true;
    if (href !== "/dashboard" && location.startsWith(href)) return true;
    return location === href;
  };

  return (
    <>
      <CameraReceiptScanner 
        open={showScanner} 
        onOpenChange={setShowScanner} 
        onScanComplete={(result) => {
          toast({
            title: "Receipt Scanned!",
            description: `Found ${result.items?.length || 0} items totaling $${result.total?.toFixed(2) || '0.00'}`,
          });
        }}
      />
      
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: 'rgba(10, 10, 10, 0.85)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          borderTop: '0.5px solid rgba(255, 255, 255, 0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        data-testid="mobile-bottom-nav"
      >
        <div className="flex items-center justify-around h-[68px] px-4 max-w-md mx-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const isScan = item.id === "scan";
            const Icon = item.icon;

            if (isScan) {
              return (
                <button
                  key={item.id}
                  onClick={() => setShowScanner(true)}
                  className="relative flex flex-col items-center justify-center -mt-5"
                  data-testid="nav-scan-button"
                  aria-label="Scan receipt"
                  role="button"
                >
                  <motion.div
                    className="w-[52px] h-[52px] rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: 'linear-gradient(145deg, #A855F7, #06B6D4)',
                      boxShadow: '0 4px 24px rgba(168, 85, 247, 0.4), 0 0 0 3px rgba(10,10,10,0.9)',
                    }}
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <ScanLine className="w-5.5 h-5.5 text-white" />
                  </motion.div>
                  <span className="text-[10px] text-white/50 mt-1.5 font-medium tracking-wide">Scan</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={item.href}
                className="relative flex flex-col items-center justify-center py-2 px-3"
                data-testid={`nav-${item.id}`}
                aria-label={`Navigate to ${item.label}`}
                aria-current={active ? "page" : undefined}
              >
                <motion.div
                  className="relative flex items-center justify-center w-10 h-10"
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Icon 
                    className={cn(
                      "w-[22px] h-[22px] transition-colors duration-200",
                      active ? "text-purple-400" : "text-white/40"
                    )} 
                    strokeWidth={active ? 2.2 : 1.8}
                  />
                  {active && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-purple-400"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.div>
                <span className={cn(
                  "text-[10px] mt-0.5 font-medium tracking-wide transition-colors duration-200",
                  active ? "text-purple-400" : "text-white/40"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
