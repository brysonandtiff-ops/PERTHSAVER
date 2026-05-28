import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  CreditCard,
  Target,
  BarChart3,
  Bell,
  Gift,
  Calculator,
  ScanLine,
  Utensils,
  Users,
  Trophy,
  Bot,
  Settings,
  User,
  Menu,
  Tag,
  Share2,
  Wallet,
  Building2,
  Shield,
  PiggyBank,
  Home,
  Sparkles,
  Fuel,
  BadgePercent,
} from "lucide-react";
import {
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  badge?: number | null;
}

const mainItems: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "AI Coach", icon: Bot, href: "/coach" },
];

const savingsItems: NavItem[] = [
  { title: "Groceries", icon: ShoppingCart, href: "/groceries" },
  { title: "Fuel", icon: Fuel, href: "/fuel" },
  { title: "Rebates", icon: BadgePercent, href: "/rebates" },
  { title: "Deals", icon: Tag, href: "/deals" },
  { title: "Bills", icon: FileText, href: "/bills" },
];

const trackItems: NavItem[] = [
  { title: "Goals", icon: Target, href: "/savings-goals" },
  { title: "Analytics", icon: BarChart3, href: "/analytics" },
  { title: "Price Alerts", icon: Bell, href: "/price-alerts" },
  { title: "Scanner", icon: ScanLine, href: "/receipt-scanner" },
];

const toolsItems: NavItem[] = [
  { title: "Budget", icon: PiggyBank, href: "/budget" },
  { title: "Debt Payoff", icon: Calculator, href: "/debt" },
  { title: "Mortgage", icon: Building2, href: "/mortgage" },
  { title: "Meal Planner", icon: Utensils, href: "/meal-planner" },
];

const communityItems: NavItem[] = [
  { title: "Community", icon: Users, href: "/community" },
  { title: "Leaderboard", icon: Trophy, href: "/leaderboard" },
  { title: "Referrals", icon: Share2, href: "/referrals" },
  { title: "Rewards", icon: Gift, href: "/rewards" },
];

const adminItems: NavItem[] = [
  { title: "Admin", icon: Shield, href: "/admin" },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { data: adminCheck } = useQuery({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const isAdmin = adminCheck?.isAdmin || adminCheck?.isOwner;

  const NavItem = ({ item }: { item: NavItem }) => {
    const isActive = location === item.href;
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={isCollapsed ? item.title : undefined}
          className={cn(
            "relative transition-all duration-200 rounded-lg h-10",
            isActive
              ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/10 text-white"
              : "text-white/60 hover:text-white hover:bg-white/5"
          )}
          data-testid={`sidebar-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <Link href={item.href} className="flex items-center gap-3">
            <item.icon className={cn("h-4 w-4", isActive ? "text-purple-400" : "text-white/50")} />
            <span className="text-sm">{item.title}</span>
            {item.badge && (
              <SidebarMenuBadge className="ml-auto bg-purple-500 text-white text-[10px] px-1.5 min-w-[18px] h-4">
                {item.badge}
              </SidebarMenuBadge>
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  const NavGroup = ({ title, items, icon: Icon }: { title: string; items: NavItem[]; icon?: React.ElementType }) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-widest font-semibold flex items-center gap-2 px-3 mb-1">
        {Icon && <Icon className="h-3 w-3" />}
        {title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-0.5 px-2">
          {items.map((item) => (
            <NavItem key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <SidebarRoot
      collapsible="icon"
      className="border-r border-white/5 bg-zinc-950"
      data-testid="app-sidebar"
    >
      <SidebarHeader className="border-b border-white/5 p-4">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <img
            src={perthSaverLogo}
            alt="Perth Saver"
            className="h-9 w-9 rounded-xl group-hover:scale-105 transition-transform"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight">
                <span className="text-white">Perth</span>
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Saver</span>
              </span>
              <span className="text-[10px] text-white/40">AI Savings Platform</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <NavGroup title="Main" items={mainItems} icon={Home} />
        
        <Separator className="mx-4 my-3 bg-white/5" />
        
        <NavGroup title="Save Money" items={savingsItems} icon={Tag} />
        
        <Separator className="mx-4 my-3 bg-white/5" />
        
        <NavGroup title="Track" items={trackItems} icon={BarChart3} />
        
        <Separator className="mx-4 my-3 bg-white/5" />
        
        <NavGroup title="Tools" items={toolsItems} icon={Sparkles} />
        
        <Separator className="mx-4 my-3 bg-white/5" />
        
        <NavGroup title="Community" items={communityItems} icon={Users} />
        
        {isAdmin && (
          <>
            <Separator className="mx-4 my-3 bg-white/5" />
            <NavGroup title="Admin" items={adminItems} icon={Shield} />
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-3">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={isCollapsed ? "Settings" : undefined}
              className="text-white/50 hover:text-white hover:bg-white/5 rounded-lg h-9"
              data-testid="sidebar-settings"
            >
              <Link href="/settings" className="flex items-center gap-3">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <Separator className="my-2 bg-white/5" />
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip={isCollapsed ? "Profile" : undefined}
              className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg h-11"
              data-testid="sidebar-profile"
            >
              <Link href="/profile" className="flex items-center gap-3">
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xs font-semibold">
                    PS
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-white truncate">Account</span>
                    <span className="text-[10px] text-white/40 truncate">Free Plan</span>
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarRoot>
  );
}

export function MobileSidebarTrigger() {
  const { setOpenMobile, isMobile } = useSidebar();

  if (!isMobile) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setOpenMobile(true)}
      className="hover:bg-white/10 text-white/70"
      data-testid="mobile-sidebar-trigger"
    >
      <Menu className="h-5 w-5" />
    </Button>
  );
}
