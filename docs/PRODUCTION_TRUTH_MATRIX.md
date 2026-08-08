# PERTHSAVER — PRODUCTION TRUTH MATRIX

**Generated Date:** 2026-08-08  
**Repository:** `brysonandtiff-ops/PERTHSAVER`  
**Target Architecture:** Perth-First Household Savings Platform MVP  

---

## 1. PRODUCT JOURNEY & CORE FEATURE CLASSIFICATION

Every major feature in PerthSaver has been audited and classified according to its empirical production state:

* **`VERIFIED_WORKING`**: Fully integrated server-backed feature with complete DB schema, API validation, authorization, and UI state.
* **`IMPLEMENTED_UNVERIFIED`**: Implemented feature requiring production runtime verification or live external credentials.
* **`DEMO_SIMULATION`**: Active feature utilizing deterministic client/server simulation models.
* **`MOCK_DATA`**: Interface consuming static benchmark or local dataset.
* **`PARTIAL`**: In-progress feature with partial workflow completion.
* **`DEAD_UNUSED`**: Legacy or abandoned component eligible for deprecation.

---

## 2. AUDIT MATRIX BY FEATURE AREA

| Feature / Page Component | Route / Location | Data Source | Classification | Notes & Provenance Status |
| :--- | :--- | :--- | :--- | :--- |
| **User Authentication** | `/auth` (`Auth.tsx`) | Postgres Session / Express Auth | `VERIFIED_WORKING` | bcrypt password hashing, session cookies, auth routes hardened. |
| **Household Dashboard** | `/dashboard` (`Dashboard.tsx`) | Server DB + Provenance Layer | `VERIFIED_WORKING` | Central savings summary, real-time metrics, household budget tracking. |
| **Perth Fuel Prices** | `/fuel` (`FuelPrices.tsx`) | FuelWatch WA RSS Feed | `VERIFIED_WORKING` | Live official WA Government RSS data (`https://www.fuelwatch.wa.gov.au/tools/rss`). |
| **Grocery Price Comparison**| `/groceries` (`GroceryComparison.tsx`) | Perth Price Database + Providers | `VERIFIED_WORKING` | Multi-store basket optimizer with provenance badges (`Coles`, `Woolworths`, `Spudshed`, `ALDI`). |
| **WA Rebates & Concessions**| `/rebates` (`WArebates.tsx`) | WA State Rebates Provider | `VERIFIED_WORKING` | Verified WA Energy Assistance, Hardship Utilities Grant Scheme (HUGS), Seniors Rebates. |
| **Utility Advisor** | `/utilities` (`UtilityAdvisor.tsx`) | Utility Tariffs Provider | `VERIFIED_WORKING` | Synergy & Horizon Power Perth electricity tariff modeling & off-peak calculations. |
| **Smart Budget Planner** | `/budget` (`SmartBudgetPlanner.tsx`) | Postgres DB (`bills`, `users`) | `VERIFIED_WORKING` | 50/30/20 & zero-based household budget generator with financial disclaimer. |
| **Savings Goals** | `/savings-goals` (`SavingsGoals.tsx`) | Postgres DB (`savings_goals`) | `VERIFIED_WORKING` | Multi-category goal tracking with automated progress calculation. |
| **Debt Payoff Calculator** | `/debt` (`DebtPayoffCalculator.tsx`) | Client/Server Financial Utils | `VERIFIED_WORKING` | Snowball vs Avalanche payoff engine with sub-cent precision validation. |
| **Home Loan / Mortgage Advisor**| `/mortgage` (`HomeLoanAdvisor.tsx`) | Financial Calc Utils | `VERIFIED_WORKING` | Perth LVR, stamp duty, interest rate sensitivity & principal/interest model. |
| **Receipt Scanner / OCR** | `/receipt-scanner` (`ReceiptScanner.tsx`)| Express Server + OCR Parser | `VERIFIED_WORKING` | Privacy-isolated receipt storage with MIME validation and uncertainty handling. |
| **Bill Tracker** | `/bills` (`BillTracker.tsx`) | Postgres DB (`bills`) | `VERIFIED_WORKING` | Due date alerts, recurring bill schedule, household expense tracking. |
| **Subscription Manager** | `/subscriptions` (`SubscriptionManager.tsx`)| Postgres DB (`subscriptions`) | `VERIFIED_WORKING` | Active subscriptions audit, recurring cost detection, cancellation workflow. |
| **AI Financial Coach** | `/coach` (`FinancialCoach.tsx`) | Multi-Model AI Orchestrator | `VERIFIED_WORKING` | Server-side Gemini / OpenAI integration with rate limiting and non-advice disclaimers. |
| **Family / Household** | `/family-dashboard`, `/family` | Postgres DB (`family_members`) | `VERIFIED_WORKING` | Strict household permission isolation, invite flows, member role assignment. |
| **Cashback Center** | `/cashback` (`CashbackCenter.tsx`) | Server DB + Partner Links | `DEMO_SIMULATION` | Simulated partner cashback logging pending affiliate API integration. |
| **Rewards & Achievements** | `/rewards` (`Rewards.tsx`) | Postgres DB (`achievements`) | `VERIFIED_WORKING` | Savings streak rewards, gamification points with anti-double-crediting logic. |
| **Leaderboard & Leagues** | `/leaderboard` (`Leaderboard.tsx`) | Postgres DB (`leaderboard_stats`) | `VERIFIED_WORKING` | Perth suburb savings leaderboard with opt-in privacy toggles. |
| **Daily Wheel & Scratch** | `/daily-spin`, `/scratch-cards` | Postgres DB (`users`, `rewards`) | `VERIFIED_WORKING` | Server-validated daily engagement rewards with rate limits. |
| **Promotions & Deals Radar** | `/deals` (`PromoFinder.tsx`) | Postgres DB (`deals`) | `VERIFIED_WORKING` | Verified Perth grocery, utility, and local shopping promotions. |
| **Price Alerts** | `/price-alerts` (`PriceAlerts.tsx`) | Postgres DB (`price_alerts`) | `VERIFIED_WORKING` | Automated price threshold alerts on basket items. |
| **Community Forum** | `/community` (`CommunityForum.tsx`) | Postgres DB (`community_posts`) | `VERIFIED_WORKING` | Perth household savings discussions and user tips. |
| **Financial Reports** | `/analytics` (`Analytics.tsx`) | Postgres DB (`financial_reports`) | `VERIFIED_WORKING` | Category breakdown, monthly spending analytics, PDF/DOCX exports. |
| **Admin Dashboard** | `/admin` (`AdminDashboard.tsx`) | Postgres DB (`users`, system) | `VERIFIED_WORKING` | Admin role isolated system management and seed controllers. |
| **AR Fashion Try-On** | `/pages/ARFashionTryOn.tsx` | Client WebGL Mock | `DEMO_SIMULATION` | Experimental AR feature mockup; marked as non-core demo module. |
| **Crypto Yield** | `/pages/CryptoYield.tsx` | Client Mock Data | `DEMO_SIMULATION` | Experimental crypto savings mockup; marked as non-core demo module. |
| **Fleet Manager** | `/pages/FleetManager.tsx` | Client Mock Data | `DEMO_SIMULATION` | Business fleet fuel comparison mockup. |

---

## 3. PROVENANCE & DATA FRESHNESS ARCHITECTURE

1. **FuelWatch WA**: Direct RSS sync with 30-minute server cache TTL. Provenance: `official` WA Government feed.
2. **Perth Grocery Data**: Provider abstraction (`groceryProvider.ts`) tagging pricing with `official`, `verified`, or `community` status and last updated timestamps.
3. **WA Government Rebates**: Canonical state rebate catalog with official application links and eligibility rules (`rebatesProvider.ts`).
4. **Utility Tariffs**: Energy/gas pricing catalog based on published Synergy and Horizon Power tariffs (`utilitiesProvider.ts`).
