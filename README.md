# PerthSaver

**PerthSaver** is a Perth-first household savings, price intelligence, budgeting, and local-deals platform.

It is much broader than a simple specials list. The current codebase combines local retail comparison, household financial planning, rewards, family features, and multiple monetisation foundations in one full-stack application.

> **Current status:** broad full-stack product candidate. Many routes and domain models are implemented, but live data provenance, production authentication, payment verification, compliance, and complete automated release evidence are still required.

## Product surfaces

The application currently exposes routes for:

- Household dashboard
- AI financial coach
- Family accounts and family dashboard
- Grocery and store comparison
- Savings goals
- Product price alerts
- Bill tracking
- Spending and savings analytics
- Rewards and leaderboard
- Promotions and deals
- Referral programme
- Subscription management
- Cashback centre
- Meal planning
- Receipt scanning
- Smart budgeting
- Debt payoff planning
- Home-loan planning
- Utility advice
- Perth fuel prices
- Western Australian rebates
- Notifications and settings
- Administrative operations
- Daily wheel and scratch-card engagement systems

## Data foundations

The Drizzle/Postgres schema includes structures for:

- user profiles, authentication metadata, household settings, and subscription state
- savings goals and savings records
- grocery products, stores, store-specific prices, and price history
- FuelWatch-style station and fuel-price records
- promotions, hidden-code flags, verification state, success rates, and terms
- receipts, item/OCR data, totals, payment method, and processing status
- bills and personal subscriptions
- budgets, budget categories, debts, and mortgages
- meal plans and financial reports
- family memberships and invitations
- community posts, alerts, notifications, tutorials, and challenges
- referrals, shared savings stories, partner sites, and conversion sessions
- rewards, achievements, wheel spins, streaks, and game balances
- AI financial-coach conversation records

A schema proves that the product has serious domain design. It does **not** prove that every external data feed, payment path, AI response, or reward is live and production-safe.

## Technology

- React 19 + TypeScript + Vite
- Express server
- Drizzle ORM + PostgreSQL
- TanStack Query
- Wouter routing
- Tailwind CSS + Radix/shadcn-style UI
- Mapping support through Leaflet
- WebSocket support
- PWA/offline UI foundations
- Stripe and PayPal integration dependencies
- OpenAI, Anthropic, and Google AI provider dependencies
- Document/report generation support

## Local setup

```bash
npm install
npm run dev
```

## Production build

```bash
npm run check
npm run build
npm run start
```

Database schema push:

```bash
npm run db:push
```

## Honest production boundary

Before PerthSaver is described as production ready, complete these gates:

1. Inventory every route and integration as **working**, **demo**, **planned**, or **unused**.
2. Replace seeded or mock prices with approved, source-attributed data adapters.
3. Display freshness timestamps and stale-data warnings.
4. Verify account security, family isolation, receipt privacy, export, and deletion.
5. Validate all financial calculations and add general-information disclaimers.
6. Verify Stripe/PayPal, subscriptions, cashback, rewards, and referral accounting.
7. Add unit, API, E2E, accessibility, security, performance, deployment, and rollback evidence.
8. Publish one named-SHA production truth report.

Track the closeout in **issue #2: Agent 09/20 — Convert PerthSaver into a verified Perth household-savings platform**.
