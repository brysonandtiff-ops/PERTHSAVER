import { memo, lazy, Suspense, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";
import { AIAssistant } from "@/components/AIAssistant";
import { PushNotificationPrompt } from "@/components/PushNotificationPrompt";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { AppPreferencesProvider } from "@/context/AppPreferencesContext";
import { AppleCinematicBackground } from "@/components/AppleCinematicBackground";
import { FullscreenProvider } from "@/contexts/FullscreenContext";
import { ChromecastProvider } from "@/contexts/ChromecastContext";
import { ThemeHealthCheck } from "@/components/ThemeHealthCheck";
import { SWUpdateNotifier } from "@/components/SWUpdateNotifier";
import { NetworkStatus } from "@/components/NetworkStatus";
import { SkipLinks } from "@/components/SkipLinks";

import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import FinancialCoach from "@/pages/FinancialCoach";
import FamilyLogins from "@/pages/FamilyLogins";
import NotFound from "@/pages/not-found";

const Profile = lazy(() => import("@/pages/Profile"));
const Pricing = lazy(() => import("@/pages/Pricing"));
const InvestorPitch = lazy(() => import("@/pages/InvestorPitch"));
const SubscriptionManager = lazy(() => import("@/pages/SubscriptionManager"));
const CashbackCenter = lazy(() => import("@/pages/CashbackCenter"));
const MealPlanner = lazy(() => import("@/pages/MealPlanner"));
const ReceiptScanner = lazy(() => import("@/pages/ReceiptScanner"));
const CommunityForum = lazy(() => import("@/pages/CommunityForum"));
const GroceryComparison = lazy(() => import("@/pages/GroceryComparison"));
const SavingsGoals = lazy(() => import("@/pages/SavingsGoals"));
const PriceAlerts = lazy(() => import("@/pages/PriceAlerts"));
const BillTracker = lazy(() => import("@/pages/BillTracker"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Rewards = lazy(() => import("@/pages/Rewards"));
const Settings = lazy(() => import("@/pages/Settings"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const Leaderboard = lazy(() => import("@/pages/Leaderboard"));
const PromoFinder = lazy(() => import("@/pages/PromoFinder"));
const SubscriptionSuccess = lazy(() => import("@/pages/SubscriptionSuccess"));
const Referrals = lazy(() => import("@/pages/Referrals"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const UtilityAdvisor = lazy(() => import("@/pages/UtilityAdvisor"));
const FamilyDashboard = lazy(() => import("@/pages/FamilyDashboard"));
const SmartBudgetPlanner = lazy(() => import("@/pages/SmartBudgetPlanner"));
const DebtPayoffCalculator = lazy(() => import("@/pages/DebtPayoffCalculator"));
const HomeLoanAdvisor = lazy(() => import("@/pages/HomeLoanAdvisor"));
const DailyWheelSpin = lazy(() => import("@/pages/DailyWheelSpin"));
const ScratchCards = lazy(() => import("@/pages/ScratchCards"));
const FuelPrices = lazy(() => import("@/pages/FuelPrices"));
const WArebates = lazy(() => import("@/pages/WArebates"));

const publicPages = ["/", "/auth", "/pricing", "/investors", "/subscription/success"];

const AppLayout = memo(() => {
  const [location] = useLocation();
  const isPublicPage = publicPages.includes(location);
  
  const [defaultOpen, setDefaultOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar:state");
      return saved === "true";
    }
    return true;
  });
  
  const handleOpenChange = (open: boolean) => {
    setDefaultOpen(open);
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar:state", String(open));
    }
  };

  if (isPublicPage) {
    return (
      <>
        <SkipLinks />
        <NetworkStatus />
        <AppleCinematicBackground />
        <main id="main-content">
          <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/" component={Home}/>
              <Route path="/auth" component={Auth}/>
              <Route path="/pricing" component={Pricing}/>
              <Route path="/subscription/success" component={SubscriptionSuccess}/>
              <Route path="/investors" component={InvestorPitch}/>
            </Switch>
          </Suspense>
        </main>
      </>
    );
  }

  return (
    <SidebarProvider defaultOpen={false} onOpenChange={handleOpenChange}>
      <SkipLinks />
      <NetworkStatus />
      <AppleCinematicBackground />
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen relative">
        <Navbar />
        <main id="main-content" className="flex-1 overflow-auto relative z-10 pb-20 md:pb-0">
          <div className="w-full mx-auto px-0">
            <Suspense fallback={<PageLoader />}>
            <Switch>
              <Route path="/dashboard" component={Dashboard}/>
              <Route path="/coach" component={FinancialCoach}/>
              <Route path="/family" component={FamilyLogins}/>
              <Route path="/profile" component={Profile}/>
              <Route path="/groceries" component={GroceryComparison}/>
              <Route path="/savings-goals" component={SavingsGoals}/>
              <Route path="/price-alerts" component={PriceAlerts}/>
              <Route path="/bills" component={BillTracker}/>
              <Route path="/analytics" component={Analytics}/>
              <Route path="/rewards" component={Rewards}/>
              <Route path="/settings" component={Settings}/>
              <Route path="/notifications" component={Notifications}/>
              <Route path="/leaderboard" component={Leaderboard}/>
              <Route path="/deals" component={PromoFinder}/>
              <Route path="/referrals" component={Referrals}/>
              <Route path="/admin" component={AdminDashboard}/>
              <Route path="/utilities" component={UtilityAdvisor}/>
              <Route path="/family-dashboard" component={FamilyDashboard}/>
              <Route path="/subscriptions" component={SubscriptionManager}/>
              <Route path="/cashback" component={CashbackCenter}/>
              <Route path="/meal-planner" component={MealPlanner}/>
              <Route path="/receipt-scanner" component={ReceiptScanner}/>
              <Route path="/community" component={CommunityForum}/>
              <Route path="/budget" component={SmartBudgetPlanner}/>
              <Route path="/debt" component={DebtPayoffCalculator}/>
              <Route path="/mortgage" component={HomeLoanAdvisor}/>
              <Route path="/daily-spin" component={DailyWheelSpin}/>
              <Route path="/scratch-cards" component={ScratchCards}/>
              <Route path="/fuel" component={FuelPrices}/>
              <Route path="/rebates" component={WArebates}/>
              <Route component={NotFound} />
            </Switch>
            </Suspense>
          </div>
        </main>
        <MobileBottomNav />
      </SidebarInset>
    </SidebarProvider>
  );
});

AppLayout.displayName = "AppLayout";

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <FullscreenProvider>
          <ChromecastProvider>
            <AppPreferencesProvider>
              <TooltipProvider>
                <Toaster />
                <SWUpdateNotifier />
                <AppLayout />
                <AIAssistant />
                <PushNotificationPrompt />
                <ThemeHealthCheck />
              </TooltipProvider>
            </AppPreferencesProvider>
          </ChromecastProvider>
        </FullscreenProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
