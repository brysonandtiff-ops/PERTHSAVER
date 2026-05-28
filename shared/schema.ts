import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (Enhanced for OAuth + Stripe)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatar: text("avatar"), // Avatar URL from OAuth or upload
  authProvider: text("auth_provider").default("email"), // "email", "google", "github", "apple", "facebook", etc.
  oauthId: text("oauth_id"), // Provider-specific ID
  location: text("location").default("Perth, WA"),
  household: text("household").default("single"),
  income: integer("income"),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  preferences: jsonb("preferences"),
  totalSaved: decimal("total_saved", { precision: 10, scale: 2 }).default("0"),
  monthlyTarget: decimal("monthly_target", { precision: 10, scale: 2 }).default("0"),
  verifiedEmail: boolean("verified_email").default(false),
  isAdmin: boolean("is_admin").default(false), // Admin access for dashboard
  isOwner: boolean("is_owner").default(false), // Owner has full access
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("free"), // free, trialing, active, past_due, canceled
  subscriptionPlan: text("subscription_plan").default("starter"), // starter, premium, family
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Savings goals
export const savingsGoals = pgTable("savings_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  targetSavings: decimal("target_savings", { precision: 10, scale: 2 }).notNull(),
  currentSavings: decimal("current_savings", { precision: 10, scale: 2 }).default("0"),
  deadline: timestamp("deadline"),
  notes: text("notes"),
  priority: text("priority").default("medium"), // low, medium, high
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Product prices
export const productPrices = pgTable("product_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  storeName: text("store_name").notNull(),
  productName: text("product_name").notNull(),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  unit: text("unit"),
  brand: text("brand"),
  imageUrl: text("image_url"),
  location: text("location").default("Perth, WA"),
  discount: decimal("discount", { precision: 5, scale: 2 }), // Percentage discount
  rating: decimal("rating", { precision: 3, scale: 1 }), // Product rating
  lastUpdated: timestamp("last_updated").default(sql`now()`),
});

// User subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  category: text("category").notNull(),
  cost: decimal("cost", { precision: 8, scale: 2 }).notNull(),
  frequency: text("frequency").notNull(),
  nextBilling: timestamp("next_billing").notNull(),
  autoRenew: boolean("auto_renew").default(true),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Meal plans
export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  weekStart: timestamp("week_start").notNull(),
  meals: jsonb("meals").notNull(),
  estimatedCost: decimal("estimated_cost", { precision: 8, scale: 2 }),
  budgetGoal: decimal("budget_goal", { precision: 8, scale: 2 }),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Receipts
export const receipts = pgTable("receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  storeName: text("store_name").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  purchaseDate: timestamp("purchase_date").notNull(),
  items: jsonb("items"),
  category: text("category"),
  imageUrl: text("image_url"),
  imageData: text("image_data"),
  ocrData: jsonb("ocr_data"),
  status: text("status").default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
  tax: decimal("tax", { precision: 10, scale: 2 }),
  paymentMethod: text("payment_method"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User achievements
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementType: text("achievement_type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  points: integer("points").default(0),
  rarity: text("rarity").default("common"), // common, rare, legendary
  earnedAt: timestamp("earned_at").default(sql`now()`),
});

// Deals
export const deals = pgTable("deals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  providerName: text("provider_name").notNull(),
  dealTitle: text("deal_title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }),
  priceDetails: text("price_details"),
  features: jsonb("features"),
  location: text("location").default("Perth, WA"),
  expiryDate: timestamp("expiry_date"),
  link: text("link"),
  discount: decimal("discount", { precision: 5, scale: 2 }), // Percentage
  rating: decimal("rating", { precision: 3, scale: 1 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Savings records
export const savingsRecords = pgTable("savings_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  source: text("source"),
  date: timestamp("date").default(sql`now()`),
});

// Community posts
export const communityPosts = pgTable("community_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Smart alerts
export const smartAlerts = pgTable("smart_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  alertType: text("alert_type").notNull(),
  isEnabled: boolean("is_enabled").default(true),
  threshold: text("threshold"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Price alerts
export const priceAlerts = pgTable("price_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  productName: text("product_name").notNull(),
  storeName: text("store_name"),
  targetPrice: decimal("target_price", { precision: 8, scale: 2 }).notNull(),
  currentPrice: decimal("current_price", { precision: 8, scale: 2 }),
  priceHistory: jsonb("price_history"), // Track price changes over time
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Bills
export const bills = pgTable("bills", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: timestamp("due_date").notNull(),
  frequency: text("frequency").notNull(),
  isPaid: boolean("is_paid").default(false),
  category: text("category"),
  reminderDays: integer("reminder_days").default(7),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Leaderboard stats
export const leaderboardStats = pgTable("leaderboard_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name").notNull(),
  totalSavings: decimal("total_savings", { precision: 10, scale: 2 }).default("0").notNull(),
  savingsThisMonth: decimal("savings_this_month", { precision: 10, scale: 2 }).default("0").notNull(),
  savingsThisWeek: decimal("savings_this_week", { precision: 10, scale: 2 }).default("0").notNull(),
  rank: integer("rank").default(0),
  badges: jsonb("badges").default([]),
  isPublic: boolean("is_public").default(true),
  lastUpdated: timestamp("last_updated").default(sql`now()`),
});

// AI Financial Coach conversations
export const coachConversations = pgTable("coach_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userMessage: text("user_message").notNull(),
  coachResponse: text("coach_response").notNull(),
  category: text("category"), // e.g., "spending_habits", "budgeting", "savings", "investments"
  insight: text("insight"), // Key financial insight provided
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Express session storage (managed by connect-pg-simple)
export const session = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Family members - Link users to family groups
export const familyMembers = pgTable("family_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  familyOwnerId: varchar("family_owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  memberId: varchar("member_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  relationship: text("relationship"), // "spouse", "child", "parent", "sibling", "other"
  status: text("status").default("active"), // "active", "pending", "declined"
  premiumAccess: boolean("premium_access").default(true), // Free premium access via family
  accessLevel: text("access_level").default("full"), // "full", "limited", "view-only"
  inviteEmail: text("invite_email"), // For pending invites
  inviteSentAt: timestamp("invite_sent_at"),
  acceptedAt: timestamp("accepted_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Financial Reports
export const financialReports = pgTable("financial_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  reportType: text("report_type").notNull(), // "spending", "savings", "budget", "comprehensive"
  dateRange: jsonb("date_range").notNull(), // { startDate, endDate }
  sections: jsonb("sections").notNull(), // { spending: true, savings: true, goals: true, etc }
  includedCategories: jsonb("included_categories"), // Categories to include
  summary: text("summary"), // Generated summary
  data: jsonb("data"), // Report data/metrics
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Tutorials - Interactive feature guides
export const tutorials = pgTable("tutorials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "getting-started", "savings", "investments", "family"
  steps: jsonb("steps").notNull(), // Array of { title, content, action }
  estimatedTime: integer("estimated_time"), // Minutes
  difficulty: text("difficulty").default("beginner"), // "beginner", "intermediate", "advanced"
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Tutorial Progress
export const tutorialProgress = pgTable("tutorial_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  tutorialId: varchar("tutorial_id").notNull().references(() => tutorials.id, { onDelete: "cascade" }),
  currentStep: integer("current_step").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// News Feed - Personalized financial news
export const newsFeed = pgTable("news_feed", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content"),
  summary: text("summary"),
  source: text("source"), // "perth-deals", "financial-news", "market-updates"
  category: text("category").notNull(), // "grocery", "utilities", "crypto", "investing"
  imageUrl: text("image_url"),
  externalUrl: text("external_url"),
  priority: text("priority").default("normal"), // "low", "normal", "high"
  publishedAt: timestamp("published_at").default(sql`now()`),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Saving Challenges - Gamified challenges
export const savingChallenges = pgTable("saving_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // "grocery", "utilities", "subscriptions", "general"
  goalAmount: decimal("goal_amount", { precision: 10, scale: 2 }),
  goalDays: integer("goal_days"), // Duration in days
  difficulty: text("difficulty").default("medium"), // "easy", "medium", "hard"
  rewardPoints: integer("reward_points").default(100),
  tips: jsonb("tips"), // Array of saving tips
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Challenge Progress
export const userChallenges = pgTable("user_challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  challengeId: varchar("challenge_id").notNull().references(() => savingChallenges.id, { onDelete: "cascade" }),
  status: text("status").default("active"), // "active", "completed", "abandoned"
  amountSaved: decimal("amount_saved", { precision: 10, scale: 2 }).default("0"),
  progress: integer("progress").default(0), // Percentage
  streak: integer("streak").default(0), // Consecutive days
  startedAt: timestamp("started_at").default(sql`now()`),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLoginAt: true });
export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({ id: true, createdAt: true, inviteSentAt: true, acceptedAt: true });
export const insertFinancialReportSchema = createInsertSchema(financialReports).omit({ id: true, createdAt: true });
export const insertTutorialSchema = createInsertSchema(tutorials).omit({ id: true, createdAt: true });
export const insertTutorialProgressSchema = createInsertSchema(tutorialProgress).omit({ id: true, createdAt: true, completedAt: true });
export const insertNewsFeedSchema = createInsertSchema(newsFeed).omit({ id: true, createdAt: true, publishedAt: true });
export const insertSavingChallengeSchema = createInsertSchema(savingChallenges).omit({ id: true, createdAt: true });
export const insertUserChallengeSchema = createInsertSchema(userChallenges).omit({ id: true, createdAt: true, completedAt: true });
export const insertSavingsGoalSchema = createInsertSchema(savingsGoals).omit({ id: true, createdAt: true });
export const insertProductPriceSchema = createInsertSchema(productPrices).omit({ id: true, lastUpdated: true });
export const insertSavingsRecordSchema = createInsertSchema(savingsRecords).omit({ id: true, date: true });
export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({ id: true, createdAt: true, likes: true, comments: true });
export const insertSmartAlertSchema = createInsertSchema(smartAlerts).omit({ id: true, createdAt: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });
export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({ id: true, createdAt: true });
export const insertReceiptSchema = createInsertSchema(receipts).omit({ id: true, createdAt: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, earnedAt: true });
export const insertDealSchema = createInsertSchema(deals).omit({ id: true, createdAt: true });
export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({ id: true, createdAt: true });
export const insertBillSchema = createInsertSchema(bills).omit({ id: true, createdAt: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true, createdAt: true });
export const insertLeaderboardStatsSchema = createInsertSchema(leaderboardStats).omit({ id: true, lastUpdated: true });
export const insertCoachConversationSchema = createInsertSchema(coachConversations).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SavingsGoal = typeof savingsGoals.$inferSelect;
export type InsertSavingsGoal = z.infer<typeof insertSavingsGoalSchema>;
export type ProductPrice = typeof productPrices.$inferSelect;
export type InsertProductPrice = z.infer<typeof insertProductPriceSchema>;
export type SavingsRecord = typeof savingsRecords.$inferSelect;
export type InsertSavingsRecord = z.infer<typeof insertSavingsRecordSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type SmartAlert = typeof smartAlerts.$inferSelect;
export type InsertSmartAlert = z.infer<typeof insertSmartAlertSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type Receipt = typeof receipts.$inferSelect;
export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;
export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type Bill = typeof bills.$inferSelect;
export type InsertBill = z.infer<typeof insertBillSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type LeaderboardStats = typeof leaderboardStats.$inferSelect;
export type InsertLeaderboardStats = z.infer<typeof insertLeaderboardStatsSchema>;

export type CoachConversation = typeof coachConversations.$inferSelect;
export type InsertCoachConversation = z.infer<typeof insertCoachConversationSchema>;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type FinancialReport = typeof financialReports.$inferSelect;
export type InsertFinancialReport = z.infer<typeof insertFinancialReportSchema>;

export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = z.infer<typeof insertTutorialSchema>;
export type TutorialProgress = typeof tutorialProgress.$inferSelect;
export type InsertTutorialProgress = z.infer<typeof insertTutorialProgressSchema>;

export type NewsFeed = typeof newsFeed.$inferSelect;
export type InsertNewsFeed = z.infer<typeof insertNewsFeedSchema>;

export type SavingChallenge = typeof savingChallenges.$inferSelect;
export type InsertSavingChallenge = z.infer<typeof insertSavingChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;

// User budgets for Smart Budget Planner
export const userBudgets = pgTable("user_budgets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  totalAllocated: decimal("total_allocated", { precision: 10, scale: 2 }).notNull(),
  period: text("period").default("monthly"), // monthly, weekly, yearly
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Budget categories
export const budgetCategories = pgTable("budget_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  budgetId: varchar("budget_id").notNull().references(() => userBudgets.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  allocated: decimal("allocated", { precision: 10, scale: 2 }).notNull(),
  spent: decimal("spent", { precision: 10, scale: 2 }).default("0"),
  color: text("color").default("#00D4FF"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User debts for Debt Payoff Calculator
export const userDebts = pgTable("user_debts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  minimumPayment: decimal("minimum_payment", { precision: 10, scale: 2 }).notNull(),
  dueDay: integer("due_day").default(1),
  debtType: text("debt_type").default("credit_card"), // credit_card, personal_loan, car_loan, student_loan, other
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User mortgages for Home Loan Advisor
export const userMortgages = pgTable("user_mortgages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  principal: decimal("principal", { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  termYears: integer("term_years").notNull(),
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }),
  propertyValue: decimal("property_value", { precision: 12, scale: 2 }),
  loanType: text("loan_type").default("primary"), // primary, investment, refinance
  lender: text("lender"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Insert schemas for budget/debt/mortgage
export const insertUserBudgetSchema = createInsertSchema(userBudgets).omit({ id: true, createdAt: true });
export const insertBudgetCategorySchema = createInsertSchema(budgetCategories).omit({ id: true, createdAt: true });
export const insertUserDebtSchema = createInsertSchema(userDebts).omit({ id: true, createdAt: true });
export const insertUserMortgageSchema = createInsertSchema(userMortgages).omit({ id: true, createdAt: true });

// Types for budget/debt/mortgage
export type UserBudget = typeof userBudgets.$inferSelect;
export type InsertUserBudget = z.infer<typeof insertUserBudgetSchema>;
export type BudgetCategory = typeof budgetCategories.$inferSelect;
export type InsertBudgetCategory = z.infer<typeof insertBudgetCategorySchema>;
export type UserDebt = typeof userDebts.$inferSelect;
export type InsertUserDebt = z.infer<typeof insertUserDebtSchema>;
export type UserMortgage = typeof userMortgages.$inferSelect;
export type InsertUserMortgage = z.infer<typeof insertUserMortgageSchema>;

// Fuel prices for Perth FuelWatch
export const fuelPrices = pgTable("fuel_prices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stationName: text("station_name").notNull(),
  brand: text("brand").notNull(),
  address: text("address").notNull(),
  suburb: text("suburb").notNull(),
  postcode: text("postcode"),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  unleadedPrice: decimal("unleaded_price", { precision: 5, scale: 1 }),
  dieselPrice: decimal("diesel_price", { precision: 5, scale: 1 }),
  lpgPrice: decimal("lpg_price", { precision: 5, scale: 1 }),
  premiumPrice: decimal("premium_price", { precision: 5, scale: 1 }),
  priceDate: timestamp("price_date").default(sql`now()`),
  lastUpdated: timestamp("last_updated").default(sql`now()`),
});

// Promo codes and deals finder
export const promoCodes = pgTable("promo_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeName: text("store_name").notNull(),
  storeUrl: text("store_url"),
  storeCategory: text("store_category"), // groceries, electronics, fashion, home, health, etc.
  code: text("code").notNull(),
  description: text("description"),
  discountType: text("discount_type"), // percentage, fixed, freeShipping, buyOneGetOne
  discountValue: decimal("discount_value", { precision: 8, scale: 2 }),
  minPurchase: decimal("min_purchase", { precision: 8, scale: 2 }),
  maxDiscount: decimal("max_discount", { precision: 8, scale: 2 }),
  category: text("category"),
  expiryDate: timestamp("expiry_date"),
  isVerified: boolean("is_verified").default(false),
  isHidden: boolean("is_hidden").default(false), // Hidden promo codes discovered by our system
  isStackable: boolean("is_stackable").default(false), // Can be combined with other codes
  isNewUser: boolean("is_new_user").default(false), // Only for new users
  successRate: integer("success_rate").default(0),
  usageCount: integer("usage_count").default(0),
  lastVerified: timestamp("last_verified"),
  source: text("source"), // community, affiliate, scraped, manual
  termsConditions: text("terms_conditions"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Stores master table for Perth stores
export const stores = pgTable("stores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  type: text("type").notNull(), // grocery, retail, electronics, home, pharmacy, fuel, online
  website: text("website"),
  logoUrl: text("logo_url"),
  isLocal: boolean("is_local").default(false), // WA-owned business
  hasOnlineStore: boolean("has_online_store").default(true),
  hasPhysicalStore: boolean("has_physical_store").default(true),
  deliveryAvailable: boolean("delivery_available").default(false),
  clickAndCollect: boolean("click_and_collect").default(false),
  priceRating: integer("price_rating"), // 1-5 (1=cheapest)
  qualityRating: integer("quality_rating"), // 1-5
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Comprehensive product catalog
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  brand: text("brand"),
  barcode: text("barcode"),
  category: text("category").notNull(), // fruits, vegetables, dairy, meat, pantry, frozen, drinks, snacks, household, personal_care
  subcategory: text("subcategory"),
  unit: text("unit"), // kg, g, L, mL, each, pack
  size: text("size"), // e.g., "500g", "1L", "6 pack"
  imageUrl: text("image_url"),
  description: text("description"),
  isOrganic: boolean("is_organic").default(false),
  isGlutenFree: boolean("is_gluten_free").default(false),
  isVegan: boolean("is_vegan").default(false),
  nutritionInfo: jsonb("nutrition_info"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Store-specific product pricing
export const storeProducts = pgTable("store_products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  storeId: varchar("store_id").notNull().references(() => stores.id, { onDelete: "cascade" }),
  currentPrice: decimal("current_price", { precision: 8, scale: 2 }).notNull(),
  wasPrice: decimal("was_price", { precision: 8, scale: 2 }),
  unitPrice: decimal("unit_price", { precision: 8, scale: 2 }), // Price per kg/L
  isOnSpecial: boolean("is_on_special").default(false),
  specialType: text("special_type"), // half_price, multiSave, member_price, clearance
  specialEndDate: timestamp("special_end_date"),
  inStock: boolean("in_stock").default(true),
  productUrl: text("product_url"),
  lastUpdated: timestamp("last_updated").default(sql`now()`),
});

// Product price history for tracking
export const productPriceHistory = pgTable("product_price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storeProductId: varchar("store_product_id").notNull().references(() => storeProducts.id, { onDelete: "cascade" }),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  wasOnSpecial: boolean("was_on_special").default(false),
  recordedAt: timestamp("recorded_at").default(sql`now()`),
});

// Smart price searches
export const priceSearches = pgTable("price_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  searchQuery: text("search_query").notNull(),
  category: text("category"),
  results: jsonb("results"),
  bestPrice: decimal("best_price", { precision: 10, scale: 2 }),
  bestStore: text("best_store"),
  bestPromoCode: text("best_promo_code"),
  searchedAt: timestamp("searched_at").default(sql`now()`),
});

export const insertFuelPriceSchema = createInsertSchema(fuelPrices).omit({ id: true, lastUpdated: true });
export const insertPromoCodeSchema = createInsertSchema(promoCodes).omit({ id: true, createdAt: true });
export const insertPriceSearchSchema = createInsertSchema(priceSearches).omit({ id: true, searchedAt: true });
export const insertStoreSchema = createInsertSchema(stores).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertStoreProductSchema = createInsertSchema(storeProducts).omit({ id: true, lastUpdated: true });
export const insertProductPriceHistorySchema = createInsertSchema(productPriceHistory).omit({ id: true, recordedAt: true });

export type FuelPrice = typeof fuelPrices.$inferSelect;
export type InsertFuelPrice = z.infer<typeof insertFuelPriceSchema>;
export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = z.infer<typeof insertPromoCodeSchema>;
export type PriceSearch = typeof priceSearches.$inferSelect;
export type InsertPriceSearch = z.infer<typeof insertPriceSearchSchema>;
export type Store = typeof stores.$inferSelect;
export type InsertStore = z.infer<typeof insertStoreSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type StoreProduct = typeof storeProducts.$inferSelect;
export type InsertStoreProduct = z.infer<typeof insertStoreProductSchema>;
export type ProductPriceHistory = typeof productPriceHistory.$inferSelect;
export type InsertProductPriceHistory = z.infer<typeof insertProductPriceHistorySchema>;

// =====================================================
// VIRAL GROWTH & IN-APP BROWSER FEATURES
// =====================================================

// Referral codes for viral growth
export const referralCodes = pgTable("referral_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  usageCount: integer("usage_count").default(0),
  maxUses: integer("max_uses"),
  rewardType: text("reward_type").default("credits"), // credits, subscription_days, points
  rewardAmount: integer("reward_amount").default(100),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Track referral conversions
export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerId: varchar("referrer_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referredId: varchar("referred_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  referralCodeId: varchar("referral_code_id").references(() => referralCodes.id),
  status: text("status").default("pending"), // pending, completed, rewarded
  rewardGiven: boolean("reward_given").default(false),
  rewardAmount: integer("reward_amount"),
  convertedAt: timestamp("converted_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Shareable savings stories/achievements
export const sharedStories = pgTable("shared_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  storyType: text("story_type").notNull(), // savings_milestone, deal_found, challenge_won, streak
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  imageUrl: text("image_url"),
  shareUrl: text("share_url"),
  platform: text("platform"), // whatsapp, facebook, twitter, email, copy
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// In-app browser sessions for analytics
export const webviewSessions = pgTable("webview_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  domain: text("domain"),
  dealId: varchar("deal_id").references(() => deals.id),
  duration: integer("duration"), // seconds
  didConvert: boolean("did_convert").default(false),
  conversionValue: decimal("conversion_value", { precision: 10, scale: 2 }),
  deviceType: text("device_type"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Curated partner sites for in-app browser
export const partnerSites = pgTable("partner_sites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  domain: text("domain").notNull().unique(),
  logoUrl: text("logo_url"),
  category: text("category").notNull(), // shopping, fuel, utilities, entertainment
  description: text("description"),
  affiliateTag: text("affiliate_tag"),
  isAllowlisted: boolean("is_allowlisted").default(true),
  priority: integer("priority").default(0),
  clickCount: integer("click_count").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Daily Wheel Spin Rewards Catalog
export const wheelRewards = pgTable("wheel_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rewardType: text("reward_type").notNull(), // points, cashback, deal, booster, mystery
  label: text("label").notNull(),
  description: text("description"),
  valueNumeric: integer("value_numeric").default(0), // e.g., 100 points, $5 credit
  valueMeta: jsonb("value_meta"), // extra data like partner codes
  probabilityWeight: integer("probability_weight").default(1), // higher = more likely
  rarity: text("rarity").default("common"), // common, uncommon, rare, legendary
  color: text("color").default("#A855F7"), // wheel segment color
  icon: text("icon").default("gift"), // lucide icon name
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Daily Spins
export const dailySpins = pgTable("daily_spins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  spinDate: timestamp("spin_date").notNull(), // date of the spin
  rewardId: varchar("reward_id").references(() => wheelRewards.id),
  rewardLabel: text("reward_label"),
  rewardValue: integer("reward_value"),
  streakDay: integer("streak_day").default(1),
  multiplier: decimal("multiplier", { precision: 3, scale: 2 }).default("1.00"),
  spinSource: text("spin_source").default("daily"), // daily, bonus, streak
  createdAt: timestamp("created_at").default(sql`now()`),
});

// User Gamification Balances
export const userGameBalances = pgTable("user_game_balances", {
  userId: varchar("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  points: integer("points").default(0),
  totalPointsEarned: integer("total_points_earned").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  bonusSpins: integer("bonus_spins").default(0),
  lastSpinAt: timestamp("last_spin_at"),
  scratchCardsAvailable: integer("scratch_cards_available").default(0),
  lastScratchAt: timestamp("last_scratch_at"),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

// Scratch Card Results
export const scratchCards = pgTable("scratch_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  cardType: text("card_type").default("standard"), // standard, premium, legendary
  revealed: boolean("revealed").default(false),
  rewardType: text("reward_type"), // points, cashback, nothing
  rewardValue: integer("reward_value"),
  tiles: jsonb("tiles"), // 3 tiles with their values
  createdAt: timestamp("created_at").default(sql`now()`),
  revealedAt: timestamp("revealed_at"),
});

// Insert schemas
export const insertWheelRewardSchema = createInsertSchema(wheelRewards).omit({ id: true, createdAt: true });
export const insertDailySpinSchema = createInsertSchema(dailySpins).omit({ id: true, createdAt: true });
export const insertUserGameBalanceSchema = createInsertSchema(userGameBalances).omit({ updatedAt: true });
export const insertScratchCardSchema = createInsertSchema(scratchCards).omit({ id: true, createdAt: true });

// Types
export type WheelReward = typeof wheelRewards.$inferSelect;
export type InsertWheelReward = z.infer<typeof insertWheelRewardSchema>;
export type DailySpin = typeof dailySpins.$inferSelect;
export type InsertDailySpin = z.infer<typeof insertDailySpinSchema>;
export type UserGameBalance = typeof userGameBalances.$inferSelect;
export type InsertUserGameBalance = z.infer<typeof insertUserGameBalanceSchema>;
export type ScratchCard = typeof scratchCards.$inferSelect;
export type InsertScratchCard = z.infer<typeof insertScratchCardSchema>;

// Insert schemas
export const insertReferralCodeSchema = createInsertSchema(referralCodes).omit({ id: true, createdAt: true, usageCount: true });
export const insertReferralSchema = createInsertSchema(referrals).omit({ id: true, createdAt: true });
export const insertSharedStorySchema = createInsertSchema(sharedStories).omit({ id: true, createdAt: true, viewCount: true, shareCount: true });
export const insertWebviewSessionSchema = createInsertSchema(webviewSessions).omit({ id: true, createdAt: true });
export const insertPartnerSiteSchema = createInsertSchema(partnerSites).omit({ id: true, createdAt: true, clickCount: true });

// Types
export type ReferralCode = typeof referralCodes.$inferSelect;
export type InsertReferralCode = z.infer<typeof insertReferralCodeSchema>;
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type SharedStory = typeof sharedStories.$inferSelect;
export type InsertSharedStory = z.infer<typeof insertSharedStorySchema>;
export type WebviewSession = typeof webviewSessions.$inferSelect;
export type InsertWebviewSession = z.infer<typeof insertWebviewSessionSchema>;
export type PartnerSite = typeof partnerSites.$inferSelect;
export type InsertPartnerSite = z.infer<typeof insertPartnerSiteSchema>;
