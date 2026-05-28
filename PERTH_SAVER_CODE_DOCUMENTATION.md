# Perth Saver - Complete Code Documentation
## Version 7 PRO - November 2025

---

## EXECUTIVE SUMMARY

**Perth Saver** is an AI-powered Progressive Web App (PWA) designed to help Perth, Western Australia residents and businesses save **$50K-100K annually**. The platform leverages multi-model AI (Claude 4.5 Sonnet, Gemini 3 Pro, GPT-5.1) with intelligent failover for personalized financial coaching.

### Key Metrics
- **55+ Functional Pages**
- **49+ Savings Categories**
- **15+ Fuel Stations Tracked**
- **3 AI Models Integrated**
- **284 Products in Database**
- **85 Active Deals**

---

## TECHNOLOGY STACK

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Wouter | Routing |
| TailwindCSS v4 | Styling |
| Shadcn/UI (New York) | Component Library |
| Framer Motion | Animations |
| TanStack Query | Server State |
| Recharts | Data Visualization |

### Backend
| Technology | Purpose |
|------------|---------|
| Express.js | API Server |
| TypeScript | Type Safety |
| Drizzle ORM | Database Queries |
| PostgreSQL (Neon) | Database |
| bcrypt | Password Hashing |
| express-session | Authentication |
| Stripe | Payments |

### AI Integration
| Provider | Model | Role |
|----------|-------|------|
| Anthropic | Claude 4.5 Sonnet | Primary |
| Google | Gemini 3 Pro | Fallback #1 |
| OpenAI | GPT-5.1 | Fallback #2 |

---

## PROJECT STRUCTURE

```
perth-saver/
├── client/                    # Frontend Application
│   ├── src/
│   │   ├── pages/            # 55+ Page Components
│   │   ├── components/       # Reusable UI Components
│   │   │   ├── layout/       # Navbar, Footer, Sidebar
│   │   │   ├── ui/           # Shadcn/UI Primitives
│   │   │   ├── dashboard/    # Dashboard Widgets
│   │   │   ├── features/     # Feature Components
│   │   │   └── icons/        # Logo & Icon Components
│   │   ├── contexts/         # React Contexts
│   │   ├── hooks/            # Custom Hooks
│   │   └── lib/              # Utilities
│   ├── public/
│   │   ├── sw.js             # Service Worker (PWA)
│   │   └── manifest.json     # PWA Manifest
│   └── index.html
├── server/                    # Backend API
│   ├── routes.ts             # API Endpoints (2500+ lines)
│   ├── storage.ts            # Database Operations
│   ├── aiOrchestrator.ts     # Multi-Model AI
│   ├── aiModels.ts           # AI Provider Configs
│   ├── stripeService.ts      # Stripe Integration
│   └── webhookHandlers.ts    # Stripe Webhooks
├── shared/
│   └── schema.ts             # Database Schema (657 lines)
└── attached_assets/
    └── generated_images/     # App Assets
```

---

## THEME SYSTEM (V7 PRO)

### Color Palette
```css
/* Primary - Cyan */
--cyan-bright: rgb(6, 182, 212);    /* #06B6D4 */
--cyan-light: rgb(14, 165, 233);    /* #0EA5E9 */
--cyan-neon: rgb(34, 211, 238);     /* #22D3EE */

/* Secondary - Emerald */
--emerald-bright: rgb(16, 185, 129); /* #10B981 */
--emerald-light: rgb(52, 211, 153);  /* #34D399 */
--emerald-neon: rgb(74, 222, 128);   /* #4ADE80 */

/* Neutral - Silver/Chrome */
--chrome-light: rgb(232, 232, 232);  /* #E8E8E8 */
--chrome-mid: rgb(192, 192, 192);    /* #C0C0C0 */

/* Dark - Obsidian/Charcoal */
--obsidian: rgb(5, 5, 5);            /* #050505 */
--charcoal: rgb(12, 12, 12);         /* #0C0C0C */
--onyx: rgb(18, 18, 18);             /* #121212 */
```

### Glassmorphism Classes
```css
.glass { 
  background: rgba(15, 15, 15, 0.8);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(6, 182, 212, 0.1);
}

.glass-card { 
  background: rgba(12, 12, 12, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(6, 182, 212, 0.15);
  border-radius: 24px;
}
```

### Glow Effects
```css
.glow-cyan { 
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.5),
              0 0 40px rgba(6, 182, 212, 0.3);
}

.glow-primary { 
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.4),
              0 0 50px rgba(16, 185, 129, 0.3);
}
```

---

## PAGES OVERVIEW (55+)

### Public Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero, features, stats |
| Auth | `/auth` | Login/Signup with OAuth support |
| Pricing | `/pricing` | Subscription tiers (Starter, Premium, Family) |
| Investors | `/investors` | Investor pitch with download |

### Core App Pages
| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Main user dashboard with KPIs |
| FuelWatch | `/fuel` | Perth fuel price tracker |
| Groceries | `/grocery-comparison` | Woolworths/Coles/ALDI comparison |
| AI Coach | `/coach` | Multi-model AI financial advisor |
| Savings Goals | `/savings-goals` | Goal tracking with progress |
| Analytics | `/analytics` | Spending insights & trends |
| Bill Tracker | `/bill-tracker` | Recurring bill management |

### Savings Categories
| Page | Route | Description |
|------|-------|-------------|
| Utilities | `/utilities` | Synergy/Kleenheat optimization |
| Insurance | `/insurance` | Policy comparison |
| Travel | `/travel` | Travel deal finder |
| Entertainment | `/entertainment` | Entertainment discounts |
| Fashion | `/fashion` | Clothing deals |
| Healthcare | `/healthcare` | Pharmacy savings |
| Real Estate | `/realestate` | Property insights |
| Education | `/education` | Course discounts |
| Vehicle/EV | `/vehicle` | Automotive savings |

### Pro Features ($50K-100K Savings)
| Page | Route | Description |
|------|-------|-------------|
| Wealth Optimizer | `/wealth` | Super/ETF fee analysis |
| Tax Deductions | `/tax-deductions` | Missed deduction finder |
| Fleet Manager | `/fleet` | Business fuel optimization |
| Subscription Audit | `/subscription-audit` | Unused subscription detection |
| Business Hub | `/business` | Small business expenses |

### Community Features
| Page | Route | Description |
|------|-------|-------------|
| Community Forum | `/community-forum` | User discussions |
| Leaderboard | `/leaderboard` | Savings rankings |
| Challenges | `/challenges` | Savings challenges |
| Referrals | `/referrals` | Invite & earn rewards |

---

## KEY COMPONENTS

### Layout Components
```typescript
// client/src/components/layout/

PublicNavbar.tsx    // Public pages navbar (logo + nav links)
Navbar.tsx          // App pages navbar (sidebar trigger + user)
Footer.tsx          // Site-wide footer
Sidebar.tsx         // App sidebar with navigation
```

### Logo System (UNIFIED)
All pages use the same PNG logo:
```typescript
import perthSaverLogo from "@assets/generated_images/metallic_piggy_bank_coin_logo.png";

// Usage in components:
<motion.img
  src={perthSaverLogo}
  alt="Perth Saver"
  className="w-12 h-12 rounded-xl"
  style={{
    boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
    filter: 'drop-shadow(0 0 12px rgba(6, 182, 212, 0.2))'
  }}
/>
```

### AI Components
```typescript
// client/src/components/

AIAssistant.tsx     // Floating chat bubble
AIAvatar.tsx        // Animated AI character
FinancialCoach.tsx  // Full-page AI coach
```

---

## DATABASE SCHEMA

### Core Tables
```typescript
// Users (with Stripe integration)
users: {
  id, email, password, firstName, lastName, avatar,
  authProvider, oauthId, location, household, income,
  stripeCustomerId, stripeSubscriptionId, subscriptionStatus,
  subscriptionPlan, totalSaved, monthlyTarget
}

// Savings Goals
savingsGoals: {
  id, userId, category, targetSavings, currentSavings,
  deadline, notes, priority, isActive
}

// Product Prices
productPrices: {
  id, category, storeName, productName, price,
  unit, brand, imageUrl, location, discount, rating
}

// Deals
deals: {
  id, category, providerName, dealTitle, description,
  price, priceDetails, features, location, expiryDate,
  link, discount, rating, isActive
}

// Fuel Stations
fuelStations: {
  id, stationName, address, suburb, brand, location,
  unleadedPrice, dieselPrice, lpgPrice, premiumPrice,
  lastUpdated
}
```

### Supporting Tables
- `savingsRecords` - Individual savings entries
- `communityPosts` - Forum posts
- `smartAlerts` - Price drop alerts
- `priceAlerts` - Custom price monitoring
- `bills` - Recurring bills
- `notifications` - User notifications
- `subscriptions` - User service subscriptions
- `mealPlans` - AI meal planning
- `receipts` - Scanned receipts
- `achievements` - Gamification badges
- `coachConversations` - AI chat history
- `familyMembers` - Family account access
- `referralCodes` - Referral program
- `referrals` - Referral tracking
- `sharedStories` - Shareable achievements
- `webviewSessions` - In-app browser analytics

---

## API ENDPOINTS

### Authentication
```
POST /api/auth/signup      - Create new account
POST /api/auth/login       - Email/password login
POST /api/auth/logout      - End session
GET  /api/auth/me          - Get current user
GET  /api/auth/oauth/:provider - OAuth flow
```

### AI Coach
```
GET  /api/ai/models        - List available AI models
POST /api/ai/assistant     - Send message to AI
GET  /api/coach/history    - Get conversation history
POST /api/coach/conversation - Save conversation
```

### Savings & Goals
```
GET  /api/savings-goals    - List user goals
POST /api/savings-goals    - Create goal
PUT  /api/savings-goals/:id - Update goal
DELETE /api/savings-goals/:id - Delete goal
GET  /api/savings/records  - Get savings history
POST /api/savings/records  - Log savings
```

### Products & Deals
```
GET  /api/products         - Search products
GET  /api/products/:id     - Get product details
GET  /api/deals            - List active deals
GET  /api/deals/:id        - Get deal details
GET  /api/fuel-stations    - Get fuel prices
```

### Stripe Payments
```
POST /api/stripe/create-checkout    - Start checkout
POST /api/stripe/customer-portal    - Manage subscription
GET  /api/stripe/subscription       - Get current plan
POST /api/stripe/webhook/:id        - Stripe webhooks
```

---

## SERVICE WORKER (PWA)

### Cache Strategy
```javascript
// client/public/sw.js

const CACHE_VERSION = 21;
const CACHE_NAME = `perth-saver-v${CACHE_VERSION}`;

// Development: Network-first for everything
// Production: 
//   - JS/CSS: Network-first with cache fallback
//   - Images: Cache-first with network update
//   - API: Network-only
```

### Key Features
- **Offline Support**: Basic offline functionality
- **Cache Refresh**: Automatic reload on new version
- **SKIP_WAITING**: Instant activation of updates
- **Client Notification**: CACHE_UPDATED message to clients

---

## STRIPE SUBSCRIPTION TIERS

| Plan | Price | Features |
|------|-------|----------|
| Starter | Free | Basic price tracking, 3 goals, community access |
| Premium | $9.99/mo | Unlimited goals, AI coach, analytics, alerts |
| Family | $19.99/mo | 5 family members, advanced reports, priority support |

**7-day free trial** on all paid plans
**20% discount** for yearly billing

---

## AI ORCHESTRATOR

### Multi-Model Failover
```typescript
// server/aiOrchestrator.ts

Primary:   Claude 4.5 Sonnet (Anthropic)
Fallback:  Gemini 3 Pro (Google)
Final:     GPT-5.1 (OpenAI)

Features:
- Automatic rate limit handling
- Exponential backoff (p-retry)
- 2 concurrent request limit (p-limit)
- Perth-specific context injection
```

### System Prompt
The AI is configured with Perth-specific knowledge:
- Perth fuel stations and price cycles
- Woolworths/Coles/ALDI pricing
- Synergy electricity plans
- WA-specific tax deductions
- Local business resources

---

## CONTEXTS & PROVIDERS

### App Wiring (client/src/App.tsx)
```typescript
<QueryClientProvider>
  <FullscreenProvider>
    <ChromecastProvider>
      <AppPreferencesProvider>
        <TooltipProvider>
          <ErrorBoundary>
            <AppLayout />
            <AIAssistant />
            <Toaster />
          </ErrorBoundary>
        </TooltipProvider>
      </AppPreferencesProvider>
    </ChromecastProvider>
  </FullscreenProvider>
</QueryClientProvider>
```

### Available Contexts
| Context | Purpose |
|---------|---------|
| `AppPreferencesProvider` | Theme, animations, settings |
| `FullscreenProvider` | Fullscreen mode toggle |
| `ChromecastProvider` | Chromecast integration |
| `SidebarProvider` | Sidebar state (shadcn/ui) |

---

## RECENT FIXES (Nov 28, 2025)

### Theme Standardization
- Unified logo across all pages (PNG metallic piggy bank)
- Removed all blue/sky colors (replaced with cyan/emerald)
- Fixed: Home, Investors, Referrals, ShareableCard, BillTracker, FinancialCoach, FuelWatch

### Components Updated
```
PublicNavbar.tsx  - Now uses PNG logo instead of SVG
Footer.tsx        - Now uses PNG logo instead of SVG
Home.tsx          - Complete theme redesign
InvestorPitch.tsx - Professional layout overhaul
```

### Service Worker
- Bumped CACHE_VERSION to 21
- Ensures fresh assets on all clients

---

## DEVELOPMENT COMMANDS

```bash
# Start development server
npm run dev

# Database operations
npm run db:push       # Sync schema to database
npm run db:push --force  # Force sync (use carefully)

# Build for production
npm run build
```

---

## FILE COUNT SUMMARY

| Directory | Files | Lines (approx) |
|-----------|-------|----------------|
| client/src/pages | 55 | ~25,000 |
| client/src/components | 40+ | ~8,000 |
| client/src/components/ui | 45 | ~5,000 |
| server | 10 | ~4,000 |
| shared | 1 | ~700 |
| **Total** | **150+** | **~43,000** |

---

## CONTACT & SUPPORT

- **Location**: Perth, Western Australia
- **Email**: hello@perthsaver.com.au
- **Platform**: Replit

---

*Document generated: November 28, 2025*
*Perth Saver Version 7 PRO*
