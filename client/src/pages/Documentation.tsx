import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  Palette, 
  Layout, 
  Code, 
  Sparkles, 
  Image, 
  FileCode,
  Layers,
  Zap,
  Box,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const THEME_COLORS = {
  primary: {
    'Cyan Bright': { value: 'rgb(6, 182, 212)', hex: '#3B82F6', usage: 'Primary accent, buttons, links' },
    'Cyan Light': { value: 'rgb(14, 165, 233)', hex: '#0EA5E9', usage: 'Hover states, secondary accents' },
    'Cyan Neon': { value: 'rgb(34, 211, 238)', hex: '#60A5FA', usage: 'Glow effects, highlights' },
    'Cyan Deep': { value: 'rgb(8, 145, 178)', hex: '#2563EB', usage: 'Active states, borders' },
  },
  secondary: {
    'Emerald Bright': { value: 'rgb(16, 185, 129)', hex: '#F59E0B', usage: 'Success states, secondary buttons' },
    'Emerald Light': { value: 'rgb(52, 211, 153)', hex: '#34D399', usage: 'Hover states' },
    'Emerald Neon': { value: 'rgb(74, 222, 128)', hex: '#4ADE80', usage: 'Highlights' },
    'Emerald Deep': { value: 'rgb(5, 150, 105)', hex: '#059669', usage: 'Active states' },
  },
  neutral: {
    'Chrome Light': { value: 'rgb(232, 232, 232)', hex: '#E8E8E8', usage: 'Text, borders' },
    'Chrome Mid': { value: 'rgb(192, 192, 192)', hex: '#C0C0C0', usage: 'Secondary text' },
    'Silver Shine': { value: 'rgb(248, 248, 248)', hex: '#F8F8F8', usage: 'Highlights' },
    'Obsidian': { value: 'rgb(5, 5, 5)', hex: '#050505', usage: 'Background' },
    'Charcoal': { value: 'rgb(12, 12, 12)', hex: '#0C0C0C', usage: 'Cards' },
    'Onyx': { value: 'rgb(18, 18, 18)', hex: '#121212', usage: 'Surfaces' },
  }
};

const CSS_CLASSES = {
  glassmorphism: [
    { name: '.glass', desc: 'Standard glass effect with blur and transparency' },
    { name: '.glass-card', desc: 'Glass card with hover effects and border glow' },
    { name: '.glass-strong', desc: 'Higher opacity glass for better readability' },
    { name: '.glass-input', desc: 'Glass input fields with cyan focus glow' },
    { name: '.header-glass', desc: 'Header with glass effect and bottom border' },
    { name: '.sidebar-glass', desc: 'Sidebar glass with right border accent' },
  ],
  glows: [
    { name: '.glow-cyan', desc: 'Cyan box shadow glow effect' },
    { name: '.glow-emerald', desc: 'Emerald box shadow glow effect' },
    { name: '.glow-primary', desc: 'Combined cyan/emerald gradient glow' },
    { name: '.glow-text', desc: 'Cyan text shadow glow' },
    { name: '.glow-text-amber', desc: 'Emerald text shadow glow' },
  ],
  gradients: [
    { name: '.text-gradient', desc: 'Cyan-emerald text gradient' },
    { name: '.text-gradient-cyan', desc: 'Pure cyan text gradient' },
    { name: '.text-gradient-emerald', desc: 'Pure emerald text gradient' },
    { name: '.bg-gradient-premium', desc: 'Premium background gradient' },
    { name: '.animate-gradient', desc: 'Animated shifting gradient' },
  ],
  buttons: [
    { name: '.btn-premium', desc: 'Primary gradient button with glow' },
    { name: '.btn-glass', desc: 'Glass button with hover effects' },
    { name: '.btn-cinematic', desc: 'Cinematic style gradient button' },
    { name: '.btn-cinematic-outline', desc: 'Outline variant of cinematic button' },
    { name: '.tab-glass', desc: 'Glass tab with active state' },
  ],
  cards: [
    { name: '.card-dark', desc: 'Dark themed card with glass effect' },
    { name: '.cinematic-bg', desc: 'Cinematic background with grid overlay' },
  ],
  animations: [
    { name: '.animate-float', desc: 'Floating up/down animation' },
    { name: '.animate-pulse-glow', desc: 'Pulsing glow animation' },
    { name: '.floating-orb', desc: 'Floating background orb' },
    { name: '.floating-orb-cyan', desc: 'Cyan colored floating orb' },
    { name: '.floating-orb-emerald', desc: 'Emerald colored floating orb' },
    { name: '.floating-orb-mixed', desc: 'Mixed color floating orb' },
  ],
  logo: [
    { name: '.perth-saver-logo', desc: 'Logo with glow and rounded corners' },
    { name: '.perth-saver-logo-sm', desc: 'Small logo (40x40px)' },
    { name: '.perth-saver-logo-md', desc: 'Medium logo (48x48px)' },
    { name: '.perth-saver-logo-lg', desc: 'Large logo (64x64px)' },
  ],
  utilities: [
    { name: '.will-animate', desc: 'GPU acceleration for animations' },
    { name: '.transition-smooth', desc: 'Smooth 300ms transition' },
  ],
};

const COMPONENTS = [
  { category: 'Layout', items: ['PublicNavbar', 'Navbar', 'Footer', 'Hero', 'Sidebar'] },
  { category: 'UI Primitives', items: ['Button', 'Card', 'Dialog', 'Sheet', 'Tabs', 'Accordion', 'Badge', 'Toggle', 'Slider', 'Checkbox', 'Radio Group', 'Select', 'Input', 'Textarea', 'Switch', 'Progress', 'Skeleton'] },
  { category: 'Navigation', items: ['Navigation Menu', 'Dropdown Menu', 'Context Menu', 'Menubar', 'Breadcrumb', 'Pagination'] },
  { category: 'Feedback', items: ['Alert', 'Alert Dialog', 'Toast', 'Toaster', 'Sonner', 'Spinner'] },
  { category: 'Data Display', items: ['Table', 'Chart', 'Avatar', 'Tooltip', 'Hover Card', 'Popover', 'Separator', 'Scroll Area', 'Carousel'] },
  { category: 'Forms', items: ['Form', 'Field', 'Label', 'Input OTP', 'Calendar'] },
  { category: 'Features', items: ['AIAssistant', 'AIAvatar', 'InAppBrowser', 'ShareableCard', 'AchievementBadge', 'LiveDataIndicator', 'ExportButton', 'OnboardingWizard', 'ErrorBoundary', 'EmptyState', 'PageLoader', 'ChromecastController', 'NotificationCenter'] },
  { category: 'Dashboard', items: ['DealCard', 'PriceTracker', 'CommunityFeed'] },
  { category: 'Business', items: ['PricingTier', 'MealPlanner', 'LoyaltyRewards', 'FuelTracker', 'BudgetDashboard', 'Testimonials', 'StatsShowcase'] },
];

const PAGES = [
  { category: 'Core', items: ['Home', 'Dashboard', 'Auth', 'AuthV3', 'Profile', 'Settings', 'Search', 'Notifications'] },
  { category: 'Savings', items: ['GroceryComparison', 'UtilityAdvisor', 'BillTracker', 'SavingsGoals', 'SavingsTools', 'FinancialReports', 'Analytics'] },
  { category: 'Pro Features', items: ['WealthOptimizer', 'TaxDeductions', 'FleetManager', 'SubscriptionAudit', 'BusinessSavings', 'RealEstateSavings'] },
  { category: 'Lifestyle', items: ['MealPlanner', 'TravelSaver', 'EntertainmentSaver', 'FashionShopping', 'HealthcarePharmacy', 'EducationCourses', 'Sustainability'] },
  { category: 'Community', items: ['CommunityForum', 'CommunitySharing', 'Leaderboard', 'Referrals', 'SavingChallenges', 'Gamification', 'Rewards'] },
  { category: 'Tools', items: ['ReceiptScanner', 'SpecialsRadar', 'SmartAlerts', 'PriceAlerts', 'PromoFinder', 'CashbackCenter', 'Wishlist', 'SubscriptionManager'] },
  { category: 'Business', items: ['Pricing', 'SubscriptionSuccess', 'InvestorPitch', 'Discover'] },
  { category: 'Family', items: ['FamilySavings', 'FamilyLogins'] },
  { category: 'Vehicle', items: ['VehicleEVCharge', 'MobileInternetPlans', 'InsuranceComparison'] },
  { category: 'Developer', items: ['DevAgent', 'ThemeAuditor', 'DesignSystem', 'Documentation'] },
];

const KEYFRAME_ANIMATIONS = [
  { name: 'gradient-shift', desc: 'Shifts gradient background position', duration: '3s', timing: 'ease infinite' },
  { name: 'float', desc: 'Floating up/down movement', duration: '3s', timing: 'ease-in-out infinite' },
  { name: 'pulse-glow', desc: 'Pulsing glow box-shadow', duration: '2s', timing: 'cubic-bezier infinite' },
  { name: 'orb-float', desc: 'Complex floating with scale', duration: '20s', timing: 'ease-in-out infinite' },
  { name: 'savings-pulse', desc: 'Savings indicator pulse', duration: '2s', timing: 'ease-in-out infinite' },
];

const FRAMER_MOTION_VARIANTS = {
  fadeInUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
  fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 } },
  scaleIn: { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  slideInLeft: { initial: { x: -20, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  slideInRight: { initial: { x: 20, opacity: 0 }, animate: { x: 0, opacity: 1 } },
  staggerChildren: { transition: { staggerChildren: 0.1 } },
  hoverScale: { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } },
  hoverGlow: { whileHover: { boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)' } },
};

const IMAGES = [
  { path: '/logo.png', desc: 'Main app logo' },
  { path: '/favicon.png', desc: 'Browser favicon' },
  { path: 'attached_assets/generated_images/metallic_piggy_bank_coin_logo.png', desc: 'Primary metallic piggy bank logo' },
  { path: 'attached_assets/generated_images/premium_piggy_coin_logo.png', desc: 'Premium variant logo' },
  { path: 'attached_assets/generated_images/chrome_piggy_gold_coin.png', desc: 'Chrome gold coin logo' },
  { path: 'attached_assets/generated_images/geometric_piggy_finance_logo.png', desc: 'Geometric finance logo' },
  { path: 'attached_assets/generated_images/perth_saver_fintech_logo_design.png', desc: 'Fintech logo design' },
  { path: 'attached_assets/generated_images/modern_coin_piggy_bank_shopping_logo.png', desc: 'Modern shopping logo' },
  { path: 'attached_assets/generated_images/growing_leaf_shopping_basket_logo.png', desc: 'Growth leaf logo' },
  { path: 'attached_assets/generated_images/trending_arrow_dollar_sign_logo.png', desc: 'Trending arrow logo' },
];

const UTILITY_FUNCTIONS = [
  { name: 'cn(...inputs)', file: 'lib/utils.ts', desc: 'Merges Tailwind classes with clsx and tailwind-merge' },
  { name: 'formatDate(date)', file: 'lib/timeUtils.ts', desc: 'Formats date with date-fns' },
  { name: 'formatTime(date)', file: 'lib/timeUtils.ts', desc: 'Formats time as HH:mm AM/PM string' },
  { name: 'formatRelativeTime(date)', file: 'lib/timeUtils.ts', desc: 'Returns relative time (e.g., "2 hours ago")' },
  { name: 'getPerthTime()', file: 'lib/timeUtils.ts', desc: 'Returns current time in Perth timezone' },
  { name: 'getGreeting()', file: 'lib/timeUtils.ts', desc: 'Returns time-based greeting (morning/afternoon/evening)' },
  { name: 'isWithinBusinessHours()', file: 'lib/timeUtils.ts', desc: 'Checks if current Perth time is 9am-5pm weekdays' },
  { name: 'getCurrentYear()', file: 'lib/timeUtils.ts', desc: 'Returns current year as number' },
  { name: 'getLastUpdatedText(date)', file: 'lib/timeUtils.ts', desc: 'Returns "Last updated X time ago" text' },
  { name: 'apiRequest(method, url, data)', file: 'lib/queryClient.ts', desc: 'Makes authenticated API requests' },
  { name: 'initCacheManager()', file: 'lib/cacheManager.ts', desc: 'Initializes service worker cache management' },
  { name: 'forceRefreshCache()', file: 'lib/cacheManager.ts', desc: 'Forces cache refresh and reload' },
  { name: 'getLastRefreshTime()', file: 'lib/cacheManager.ts', desc: 'Returns timestamp of last cache refresh' },
  { name: 'debounce(func, wait)', file: 'lib/performance.ts', desc: 'Debounces function calls for search inputs' },
  { name: 'throttle(func, limit)', file: 'lib/performance.ts', desc: 'Throttles function calls for scroll events' },
  { name: 'lazyLoadImage(img)', file: 'lib/performance.ts', desc: 'Lazy loads images with intersection observer' },
  { name: 'prefersReducedMotion()', file: 'lib/performance.ts', desc: 'Checks if user prefers reduced motion' },
  { name: 'initializeAnimationOptimizations()', file: 'lib/performance.ts', desc: 'Reduces animations if user prefers reduced motion' },
  { name: 'preloadCriticalAssets(urls)', file: 'lib/performance.ts', desc: 'Preloads CSS and JS assets via link tags' },
  { name: 'getConnectionSpeed()', file: 'lib/performance.ts', desc: 'Returns "slow" or "fast" based on network connection' },
  { name: 'generateFilename(type, format)', file: 'lib/export.ts', desc: 'Generates timestamped filename for exports' },
  { name: 'exportToCSV(data, options)', file: 'lib/export.ts', desc: 'Exports data array to CSV file download' },
  { name: 'exportToJSON(data, options)', file: 'lib/export.ts', desc: 'Exports data to JSON file download' },
  { name: 'exportSavingsGoals(goals, format)', file: 'lib/export.ts', desc: 'Exports savings goals to CSV or JSON' },
  { name: 'exportBills(bills, format)', file: 'lib/export.ts', desc: 'Exports bills to CSV or JSON' },
  { name: 'exportPriceAlerts(alerts, format)', file: 'lib/export.ts', desc: 'Exports price alerts to CSV or JSON' },
  { name: 'exportAnalytics(data, format)', file: 'lib/export.ts', desc: 'Exports analytics data to CSV or JSON' },
  { name: 'exportMealPlans(plans, format)', file: 'lib/export.ts', desc: 'Exports meal plans to CSV or JSON' },
  { name: 'exportReceipts(receipts, format)', file: 'lib/export.ts', desc: 'Exports receipts to CSV or JSON' },
  { name: 'exportAllUserData(userData, format)', file: 'lib/export.ts', desc: 'Exports complete user data to CSV or JSON' },
];

const HOOKS = [
  { name: 'useToast()', desc: 'Shows toast notifications', returns: '{ toast, dismiss }', file: 'hooks/use-toast.ts' },
  { name: 'useMobile()', desc: 'Detects mobile viewport for responsive design', returns: 'boolean', file: 'hooks/use-mobile.tsx' },
  { name: 'useFullscreen()', desc: 'Manages fullscreen mode', returns: '{ isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen }', file: 'contexts/FullscreenContext.tsx' },
  { name: 'useChromecast()', desc: 'Manages Chromecast connection', returns: '{ isConnected, connect, disconnect, cast }', file: 'contexts/ChromecastContext.tsx' },
  { name: 'useAppPreferences()', desc: 'User preferences (theme, animations, Chromecast)', returns: '{ preferences, updatePreferences, addCastDevice, removeCastDevice, connectCastDevice, disconnectCastDevice }', file: 'context/AppPreferencesContext.tsx' },
  { name: 'useQuery()', desc: 'TanStack Query for data fetching', returns: '{ data, isLoading, error }', file: '@tanstack/react-query' },
  { name: 'useMutation()', desc: 'TanStack Query for mutations', returns: '{ mutate, isLoading }', file: '@tanstack/react-query' },
];

const CONTEXTS = [
  { name: 'FullscreenContext', file: 'contexts/FullscreenContext.tsx', desc: 'Provides fullscreen toggle for immersive experience' },
  { name: 'ChromecastContext', file: 'contexts/ChromecastContext.tsx', desc: 'Manages Chromecast device connection and casting' },
  { name: 'AppPreferencesProvider', file: 'context/AppPreferencesContext.tsx', desc: 'User customization settings via useAppPreferences() hook' },
  { name: 'QueryClientProvider', file: 'lib/queryClient.ts', desc: 'TanStack Query client for server state management' },
];

const APP_PREFERENCES_FIELDS = [
  { name: 'theme', type: '"dark" | "light" | "auto"', desc: 'App color theme mode' },
  { name: 'accentColor', type: '"cyan" | "teal" | "purple" | "orange"', desc: 'Primary accent color' },
  { name: 'fontSize', type: '"small" | "medium" | "large"', desc: 'Base font size setting' },
  { name: 'compactMode', type: 'boolean', desc: 'Enable compact UI layout' },
  { name: 'reducedMotion', type: 'boolean', desc: 'Reduce animations for accessibility' },
  { name: 'soundEnabled', type: 'boolean', desc: 'Enable sound effects' },
  { name: 'chromecastEnabled', type: 'boolean', desc: 'Enable Chromecast feature' },
  { name: 'chromecastDevices', type: 'CastDevice[]', desc: 'List of available Chromecast devices' },
  { name: 'selectedCastDevice', type: 'CastDevice | null', desc: 'Currently connected Chromecast device' },
  { name: 'animationLevel', type: '"full" | "reduced" | "minimal"', desc: 'Animation intensity level' },
  { name: 'notifications.email', type: 'boolean', desc: 'Email notifications enabled' },
  { name: 'notifications.push', type: 'boolean', desc: 'Push notifications enabled' },
  { name: 'notifications.sms', type: 'boolean', desc: 'SMS notifications enabled' },
  { name: 'notifications.sound', type: 'boolean', desc: 'Sound for notifications' },
];

export default function Documentation() {
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
    toast({ title: 'Copied!', description: `${label} copied to clipboard` });
  };

  const downloadDocumentation = async () => {
    try {
      const response = await fetch('/api/documentation/download');
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'PerthSaver-Documentation.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: 'Downloaded!', description: 'Documentation saved as Word document' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to download documentation', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen cinematic-bg py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">Perth Saver Documentation</h1>
            <p className="text-zinc-400">Complete theme, UI, layout, functions, animations & images reference</p>
          </div>
          <Button 
            onClick={downloadDocumentation}
            className="btn-premium flex items-center gap-2"
            data-testid="button-download-docs"
          >
            <Download className="w-5 h-5" />
            Download as Word Doc
          </Button>
        </motion.div>

        <Tabs defaultValue="theme" className="space-y-6" data-testid="docs-tabs">
          <TabsList className="glass-card p-1 flex flex-wrap gap-2">
            <TabsTrigger value="theme" className="flex items-center gap-2" data-testid="tab-theme">
              <Palette className="w-4 h-4" /> Theme
            </TabsTrigger>
            <TabsTrigger value="css" className="flex items-center gap-2" data-testid="tab-css">
              <FileCode className="w-4 h-4" /> CSS Classes
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2" data-testid="tab-components">
              <Box className="w-4 h-4" /> Components
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2" data-testid="tab-pages">
              <Layout className="w-4 h-4" /> Pages
            </TabsTrigger>
            <TabsTrigger value="animations" className="flex items-center gap-2" data-testid="tab-animations">
              <Sparkles className="w-4 h-4" /> Animations
            </TabsTrigger>
            <TabsTrigger value="functions" className="flex items-center gap-2" data-testid="tab-functions">
              <Code className="w-4 h-4" /> Functions
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2" data-testid="tab-images">
              <Image className="w-4 h-4" /> Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="theme">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-cyan mb-4 flex items-center gap-2">
                  <Palette className="w-6 h-6 text-purple-400" /> Color Palette
                </h2>
                
                {Object.entries(THEME_COLORS).map(([category, colors]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-3 capitalize">{category} Colors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(colors).map(([name, data]) => (
                        <div key={name} className="glass p-4 rounded-xl flex items-center gap-4">
                          <div 
                            className="w-12 h-12 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: data.value }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white">{name}</p>
                            <button
                              onClick={() => copyToClipboard(data.hex, name)}
                              className="text-sm text-zinc-400 hover:text-purple-400 flex items-center gap-1"
                            >
                              {data.hex}
                              {copied === name ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
                            <p className="text-xs text-zinc-500 truncate">{data.usage}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-emerald mb-4">CSS Variables</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                  <div className="glass p-4 rounded-lg">
                    <p className="text-purple-400">--primary: 187 85% 43%</p>
                    <p className="text-cyan-400">--secondary: 160 84% 39%</p>
                    <p className="text-zinc-400">--background: 0 0% 2%</p>
                    <p className="text-zinc-400">--foreground: 0 0% 98%</p>
                  </div>
                  <div className="glass p-4 rounded-lg">
                    <p className="text-zinc-400">--radius: 1rem</p>
                    <p className="text-zinc-400">--glass-blur: 14px</p>
                    <p className="text-zinc-400">--glass-alpha: 0.6</p>
                    <p className="text-zinc-400">--glow-intensity: 1</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="css">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {Object.entries(CSS_CLASSES).map(([category, classes]) => (
                <Card key={category} className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-gradient-cyan mb-4 capitalize flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-400" /> {category.replace(/([A-Z])/g, ' $1').trim()}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {classes.map((cls) => (
                      <div key={cls.name} className="glass p-3 rounded-lg flex items-start gap-3">
                        <button
                          onClick={() => copyToClipboard(cls.name, cls.name)}
                          className="text-purple-400 font-mono text-sm hover:text-purple-300 flex items-center gap-1 flex-shrink-0"
                        >
                          {cls.name}
                          {copied === cls.name ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                        <p className="text-zinc-400 text-sm">{cls.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="components">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {COMPONENTS.map((group) => (
                <Card key={group.category} className="glass-card p-6">
                  <h2 className="text-xl font-semibold text-gradient-cyan mb-4 flex items-center gap-2">
                    <Box className="w-5 h-5 text-purple-400" /> {group.category}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span key={item} className="px-3 py-1.5 glass rounded-lg text-sm text-zinc-300 font-mono">
                        {item}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="pages">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-cyan mb-6 flex items-center gap-2">
                  <Layout className="w-6 h-6 text-purple-400" /> All Pages ({PAGES.reduce((acc, g) => acc + g.items.length, 0)} total)
                </h2>
                <div className="space-y-6">
                  {PAGES.map((group) => (
                    <div key={group.category}>
                      <h3 className="text-lg font-medium text-white mb-3">{group.category}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((page) => (
                          <span key={page} className="px-3 py-1.5 glass rounded-lg text-sm text-cyan-400 font-mono">
                            {page}.tsx
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="animations">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-cyan mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-purple-400" /> CSS Keyframe Animations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {KEYFRAME_ANIMATIONS.map((anim) => (
                    <div key={anim.name} className="glass p-4 rounded-xl">
                      <p className="font-mono text-purple-400 mb-1">@keyframes {anim.name}</p>
                      <p className="text-sm text-zinc-400">{anim.desc}</p>
                      <p className="text-xs text-zinc-500 mt-1">{anim.duration} {anim.timing}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-emerald mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" /> Framer Motion Variants
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(FRAMER_MOTION_VARIANTS).map(([name, variant]) => (
                    <div key={name} className="glass p-4 rounded-xl">
                      <p className="font-medium text-cyan-400 mb-2">{name}</p>
                      <pre className="text-xs text-zinc-400 overflow-x-auto">
                        {JSON.stringify(variant, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="functions">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-cyan mb-4 flex items-center gap-2">
                  <Code className="w-6 h-6 text-purple-400" /> Utility Functions
                </h2>
                <div className="space-y-3">
                  {UTILITY_FUNCTIONS.map((fn) => (
                    <div key={fn.name} className="glass p-4 rounded-xl flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <code className="text-purple-400 font-mono">{fn.name}</code>
                      <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">{fn.file}</span>
                      <p className="text-sm text-zinc-400 flex-1">{fn.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6" data-testid="card-hooks">
                <h2 className="text-2xl font-semibold text-gradient-emerald mb-4">Custom Hooks ({HOOKS.length})</h2>
                <div className="space-y-3">
                  {HOOKS.map((hook) => (
                    <div key={hook.name} className="glass p-4 rounded-xl" data-testid={`hook-${hook.name.replace(/[()]/g, '')}`}>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <code className="text-cyan-400 font-mono">{hook.name}</code>
                        <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">{hook.file}</span>
                        <span className="text-zinc-400 text-sm">→ {hook.returns}</span>
                      </div>
                      <p className="text-sm text-zinc-500">{hook.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient mb-4">React Contexts ({CONTEXTS.length})</h2>
                <div className="space-y-3">
                  {CONTEXTS.map((ctx) => (
                    <div key={ctx.name} className="glass p-4 rounded-xl">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                        <code className="text-purple-400 font-mono">{ctx.name}</code>
                        <span className="text-xs text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">{ctx.file}</span>
                      </div>
                      <p className="text-sm text-zinc-400">{ctx.desc}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-emerald mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-cyan-400" /> AppPreferences Interface
                </h2>
                <p className="text-zinc-400 text-sm mb-4">Properties available on the preferences object from useAppPreferences() hook</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800">
                        <th className="text-left py-2 px-3 text-zinc-400">Property</th>
                        <th className="text-left py-2 px-3 text-zinc-400">Type</th>
                        <th className="text-left py-2 px-3 text-zinc-400">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {APP_PREFERENCES_FIELDS.map((field) => (
                        <tr key={field.name} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                          <td className="py-2 px-3 font-mono text-cyan-400">{field.name}</td>
                          <td className="py-2 px-3 font-mono text-purple-400 text-xs">{field.type}</td>
                          <td className="py-2 px-3 text-zinc-400">{field.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-zinc-500 text-xs mt-4 italic">Note: Internal helper functions (escapeCSVValue, flattenObject, downloadBlob) from lib/export.ts are intentionally omitted as they are not part of the public API.</p>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="images">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="glass-card p-6">
                <h2 className="text-2xl font-semibold text-gradient-cyan mb-6 flex items-center gap-2">
                  <Image className="w-6 h-6 text-purple-400" /> Image Assets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {IMAGES.map((img) => (
                    <div key={img.path} className="glass p-4 rounded-xl">
                      <div className="aspect-square mb-3 bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={img.path.startsWith('attached_assets') ? `/${img.path}` : img.path}
                          alt={img.desc}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.png';
                          }}
                        />
                      </div>
                      <p className="text-sm text-white font-medium mb-1">{img.desc}</p>
                      <button
                        onClick={() => copyToClipboard(img.path, img.desc)}
                        className="text-xs text-zinc-500 hover:text-purple-400 font-mono flex items-center gap-1"
                      >
                        {img.path.split('/').pop()}
                        {copied === img.desc ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
