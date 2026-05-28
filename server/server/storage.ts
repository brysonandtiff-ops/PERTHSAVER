import { db } from "./db";
import {
  users,
  savingsGoals,
  productPrices,
  savingsRecords,
  communityPosts,
  smartAlerts,
  subscriptions,
  mealPlans,
  receipts,
  achievements,
  deals,
  priceAlerts,
  bills,
  notifications,
  leaderboardStats,
  coachConversations,
  familyMembers,
  fuelPrices,
  stores,
  products,
  storeProducts,
  promoCodes,
  userBudgets,
  budgetCategories,
  userDebts,
  userMortgages,
  userGameBalances,
  dailySpins,
} from "@shared/schema";
import {
  type User,
  type InsertUser,
  type SavingsGoal,
  type InsertSavingsGoal,
  type ProductPrice,
  type InsertProductPrice,
  type SavingsRecord,
  type InsertSavingsRecord,
  type CommunityPost,
  type InsertCommunityPost,
  type SmartAlert,
  type InsertSmartAlert,
  type Subscription,
  type InsertSubscription,
  type MealPlan,
  type InsertMealPlan,
  type Receipt,
  type InsertReceipt,
  type Achievement,
  type InsertAchievement,
  type Deal,
  type InsertDeal,
  type PriceAlert,
  type InsertPriceAlert,
  type Bill,
  type InsertBill,
  type Notification,
  type InsertNotification,
  type LeaderboardStats,
  type InsertLeaderboardStats,
  type CoachConversation,
  type InsertCoachConversation,
  type FamilyMember,
  type InsertFamilyMember,
  type FinancialReport,
  type InsertFinancialReport,
  financialReports,
  type Tutorial,
  type InsertTutorial,
  type TutorialProgress,
  type InsertTutorialProgress,
  tutorials,
  tutorialProgress,
  type NewsFeed,
  type InsertNewsFeed,
  newsFeed,
  type SavingChallenge,
  type InsertSavingChallenge,
  type UserChallenge,
  type InsertUserChallenge,
  savingChallenges,
  userChallenges,
  type FuelPrice,
  type InsertFuelPrice,
  type Store,
  type Product,
  type StoreProduct,
  type PromoCode,
  type UserBudget,
  type InsertUserBudget,
  type BudgetCategory,
  type InsertBudgetCategory,
  type UserDebt,
  type InsertUserDebt,
  type UserMortgage,
  type InsertUserMortgage,
} from "@shared/schema";
import { eq, desc, and, gte, lte, sql as drizzleSql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Savings goals
  getSavingsGoal(id: string): Promise<SavingsGoal | undefined>;
  getUserSavingsGoals(userId: string): Promise<SavingsGoal[]>;
  createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal>;
  updateSavingsGoal(id: string, updates: Partial<InsertSavingsGoal>): Promise<SavingsGoal | undefined>;
  deleteSavingsGoal(id: string): Promise<boolean>;

  // Product prices
  getProductPrices(category: string, location?: string): Promise<ProductPrice[]>;
  createProductPrice(price: InsertProductPrice): Promise<ProductPrice>;
  updateProductPrice(id: string, price: number): Promise<ProductPrice | undefined>;

  // Savings records
  getUserSavingsRecords(userId: string): Promise<SavingsRecord[]>;
  createSavingsRecord(record: InsertSavingsRecord): Promise<SavingsRecord>;

  // Community posts
  getCommunityPosts(category?: string): Promise<CommunityPost[]>;
  createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost>;
  likeCommunityPost(postId: string): Promise<void>;

  // Smart alerts
  getUserSmartAlerts(userId: string): Promise<SmartAlert[]>;
  createSmartAlert(alert: InsertSmartAlert): Promise<SmartAlert>;
  updateSmartAlert(id: string, updates: Partial<InsertSmartAlert>): Promise<SmartAlert | undefined>;

  // Subscriptions
  getUserSubscriptions(userId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  deleteSubscription(id: string): Promise<boolean>;

  // Meal plans
  getUserMealPlans(userId: string): Promise<MealPlan[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  updateMealPlan(id: string, updates: Partial<InsertMealPlan>): Promise<MealPlan | undefined>;

  // Receipts
  getUserReceipts(userId: string): Promise<Receipt[]>;
  getReceipt(id: string): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  updateReceipt(id: string, updates: Partial<InsertReceipt>): Promise<Receipt | undefined>;

  // Achievements
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserPoints(userId: string): Promise<number>;

  // Deals
  getDeals(category?: string): Promise<Deal[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  getDeal(id: string): Promise<Deal | undefined>;

  // Fuel Prices
  getFuelPrices(suburb?: string): Promise<FuelPrice[]>;
  getCheapestFuel(fuelType: 'unleaded' | 'diesel' | 'lpg' | 'premium'): Promise<FuelPrice[]>;
  createFuelPrice(price: InsertFuelPrice): Promise<FuelPrice>;

  // Price Alerts
  getUserPriceAlerts(userId: string): Promise<PriceAlert[]>;
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  updatePriceAlert(id: string, updates: Partial<InsertPriceAlert>): Promise<PriceAlert | undefined>;
  deletePriceAlert(id: string): Promise<boolean>;

  // Bills
  getUserBills(userId: string): Promise<Bill[]>;
  createBill(bill: InsertBill): Promise<Bill>;
  updateBill(id: string, updates: Partial<InsertBill>): Promise<Bill | undefined>;
  deleteBill(id: string): Promise<boolean>;

  // Notifications
  getUserNotifications(userId: string, limit?: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<boolean>;

  // Leaderboard
  getLeaderboard(timeframe: "all" | "month" | "week", limit?: number): Promise<LeaderboardStats[]>;
  getUserLeaderboardStats(userId: string): Promise<LeaderboardStats | undefined>;
  updateLeaderboardStats(userId: string): Promise<LeaderboardStats>;
  toggleLeaderboardVisibility(userId: string, isPublic: boolean): Promise<LeaderboardStats | undefined>;
  recalculateRankings(): Promise<void>;

  // Coach conversations
  getCoachConversationHistory(userId: string, limit?: number): Promise<CoachConversation[]>;
  createCoachConversation(conversation: InsertCoachConversation): Promise<CoachConversation>;

  // Savings records query
  getSavingsRecords(userId: string, limit?: number): Promise<SavingsRecord[]>;

  // Family members
  getFamilyMembers(ownerId: string): Promise<FamilyMember[]>;
  getPendingFamilyInvites(ownerId: string): Promise<FamilyMember[]>;
  addFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: string, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined>;
  removeFamilyMember(id: string): Promise<boolean>;
  getFamilyAccessByUserId(userId: string): Promise<FamilyMember | undefined>;

  // Financial Reports
  getUserFinancialReports(userId: string): Promise<FinancialReport[]>;
  createFinancialReport(report: InsertFinancialReport): Promise<FinancialReport>;
  getFinancialReport(id: string): Promise<FinancialReport | undefined>;

  // Tutorials
  getTutorials(): Promise<Tutorial[]>;
  getUserTutorialProgress(userId: string): Promise<TutorialProgress[]>;
  createTutorialProgress(progress: InsertTutorialProgress): Promise<TutorialProgress>;
  updateTutorialProgress(id: string, updates: Partial<InsertTutorialProgress>): Promise<TutorialProgress | undefined>;

  // News Feed
  getNewsFeed(): Promise<NewsFeed[]>;

  // Challenges
  getSavingChallenges(): Promise<SavingChallenge[]>;
  getUserChallenges(userId: string): Promise<UserChallenge[]>;
  createUserChallenge(challenge: InsertUserChallenge): Promise<UserChallenge>;
  updateUserChallenge(id: string, updates: Partial<InsertUserChallenge>): Promise<UserChallenge | undefined>;

  // Stores
  getStores(type?: string): Promise<Store[]>;

  // Products catalog
  getProducts(category?: string, search?: string): Promise<Product[]>;
  getStoreProductPrices(productId: string): Promise<any[]>;
  getAllProductsWithPrices(category?: string, search?: string, storeSlug?: string, onSpecialOnly?: boolean): Promise<any[]>;

  // Promo codes
  getPromoCodes(storeCategory?: string, isHidden?: boolean, isVerified?: boolean, search?: string): Promise<PromoCode[]>;
  getPromoCodesByStore(storeName: string): Promise<PromoCode[]>;
  verifyPromoCode(id: string, success: boolean): Promise<void>;

  // User budgets
  getUserBudgets(userId: string): Promise<UserBudget[]>;
  getBudget(id: string): Promise<UserBudget | undefined>;
  createBudget(budget: InsertUserBudget): Promise<UserBudget>;
  updateBudget(id: string, updates: Partial<InsertUserBudget>): Promise<UserBudget | undefined>;
  deleteBudget(id: string): Promise<boolean>;

  // Budget categories
  getBudgetCategories(budgetId: string): Promise<BudgetCategory[]>;
  createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory>;
  updateBudgetCategory(id: string, updates: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined>;
  deleteBudgetCategory(id: string): Promise<boolean>;

  // User debts
  getUserDebts(userId: string): Promise<UserDebt[]>;
  getDebt(id: string): Promise<UserDebt | undefined>;
  createDebt(debt: InsertUserDebt): Promise<UserDebt>;
  updateDebt(id: string, updates: Partial<InsertUserDebt>): Promise<UserDebt | undefined>;
  deleteDebt(id: string): Promise<boolean>;

  // User mortgages
  getUserMortgages(userId: string): Promise<UserMortgage[]>;
  getMortgage(id: string): Promise<UserMortgage | undefined>;
  createMortgage(mortgage: InsertUserMortgage): Promise<UserMortgage>;
  updateMortgage(id: string, updates: Partial<InsertUserMortgage>): Promise<UserMortgage | undefined>;
  deleteMortgage(id: string): Promise<boolean>;
}

export class DrizzleStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.id, id));
    return user[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0];
  }

  async getUserByStripeCustomerId(stripeCustomerId: string): Promise<User | undefined> {
    const user = await db.select().from(users).where(eq(users.stripeCustomerId, stripeCustomerId));
    return user[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getSavingsGoal(id: string): Promise<SavingsGoal | undefined> {
    const goal = await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.id, id));
    return goal[0];
  }

  async getUserSavingsGoals(userId: string): Promise<SavingsGoal[]> {
    return await db
      .select()
      .from(savingsGoals)
      .where(eq(savingsGoals.userId, userId))
      .orderBy(desc(savingsGoals.createdAt));
  }

  async createSavingsGoal(goal: InsertSavingsGoal): Promise<SavingsGoal> {
    const values = {
      ...goal,
      targetSavings: goal.targetSavings.toString(),
      currentSavings: (goal.currentSavings || "0").toString(),
    } as any;
    const result = await db.insert(savingsGoals).values(values).returning();
    return result[0];
  }

  async updateSavingsGoal(
    id: string,
    updates: Partial<InsertSavingsGoal>,
  ): Promise<SavingsGoal | undefined> {
    const values: any = { ...updates };
    if (values.targetSavings !== undefined) values.targetSavings = values.targetSavings.toString();
    if (values.currentSavings !== undefined) values.currentSavings = values.currentSavings.toString();
    const result = await db
      .update(savingsGoals)
      .set(values)
      .where(eq(savingsGoals.id, id))
      .returning();
    return result[0];
  }

  async deleteSavingsGoal(id: string): Promise<boolean> {
    const result = await db.delete(savingsGoals).where(eq(savingsGoals.id, id));
    return (result as any).rowCount > 0;
  }

  async getProductPrices(category: string, location: string = "Perth, WA"): Promise<ProductPrice[]> {
    return await db
      .select()
      .from(productPrices)
      .where(
        and(
          eq(productPrices.category, category),
          eq(productPrices.location, location),
        ),
      )
      .orderBy(productPrices.price);
  }

  async createProductPrice(price: InsertProductPrice): Promise<ProductPrice> {
    const result = await db.insert(productPrices).values(price).returning();
    return result[0];
  }

  async updateProductPrice(id: string, price: number): Promise<ProductPrice | undefined> {
    const result = await db
      .update(productPrices)
      .set({ price: price.toString() })
      .where(eq(productPrices.id, id))
      .returning();
    return result[0];
  }

  async getUserSavingsRecords(userId: string): Promise<SavingsRecord[]> {
    return await db
      .select()
      .from(savingsRecords)
      .where(eq(savingsRecords.userId, userId))
      .orderBy(desc(savingsRecords.date));
  }

  async createSavingsRecord(record: InsertSavingsRecord): Promise<SavingsRecord> {
    const result = await db.insert(savingsRecords).values(record).returning();
    return result[0];
  }

  async getCommunityPosts(category?: string): Promise<CommunityPost[]> {
    if (category) {
      return await db
        .select()
        .from(communityPosts)
        .where(eq(communityPosts.category, category))
        .orderBy(desc(communityPosts.createdAt));
    }
    return await db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.createdAt));
  }

  async createCommunityPost(post: InsertCommunityPost): Promise<CommunityPost> {
    const result = await db.insert(communityPosts).values(post).returning();
    return result[0];
  }

  async likeCommunityPost(postId: string): Promise<void> {
    const post = await this.getCommunityPost(postId);
    if (post) {
      await db
        .update(communityPosts)
        .set({ likes: (post.likes || 0) + 1 })
        .where(eq(communityPosts.id, postId));
    }
  }

  private async getCommunityPost(id: string): Promise<CommunityPost | undefined> {
    const post = await db
      .select()
      .from(communityPosts)
      .where(eq(communityPosts.id, id));
    return post[0];
  }

  async getUserSmartAlerts(userId: string): Promise<SmartAlert[]> {
    return await db
      .select()
      .from(smartAlerts)
      .where(eq(smartAlerts.userId, userId))
      .orderBy(desc(smartAlerts.createdAt));
  }

  async createSmartAlert(alert: InsertSmartAlert): Promise<SmartAlert> {
    const result = await db.insert(smartAlerts).values(alert).returning();
    return result[0];
  }

  async updateSmartAlert(
    id: string,
    updates: Partial<InsertSmartAlert>,
  ): Promise<SmartAlert | undefined> {
    const result = await db
      .update(smartAlerts)
      .set(updates)
      .where(eq(smartAlerts.id, id))
      .returning();
    return result[0];
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.nextBilling));
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const result = await db.insert(subscriptions).values(subscription).returning();
    return result[0];
  }

  async updateSubscription(
    id: string,
    updates: Partial<InsertSubscription>,
  ): Promise<Subscription | undefined> {
    const result = await db
      .update(subscriptions)
      .set(updates)
      .where(eq(subscriptions.id, id))
      .returning();
    return result[0];
  }

  async deleteSubscription(id: string): Promise<boolean> {
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id));
    return (result as any).rowCount > 0;
  }

  async getUserMealPlans(userId: string): Promise<MealPlan[]> {
    return await db
      .select()
      .from(mealPlans)
      .where(eq(mealPlans.userId, userId))
      .orderBy(desc(mealPlans.weekStart));
  }

  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> {
    const result = await db.insert(mealPlans).values(mealPlan).returning();
    return result[0];
  }

  async updateMealPlan(
    id: string,
    updates: Partial<InsertMealPlan>,
  ): Promise<MealPlan | undefined> {
    const result = await db
      .update(mealPlans)
      .set(updates)
      .where(eq(mealPlans.id, id))
      .returning();
    return result[0];
  }

  async getUserReceipts(userId: string): Promise<Receipt[]> {
    return await db
      .select()
      .from(receipts)
      .where(eq(receipts.userId, userId))
      .orderBy(desc(receipts.purchaseDate));
  }

  async getReceipt(id: string): Promise<Receipt | undefined> {
    const result = await db
      .select()
      .from(receipts)
      .where(eq(receipts.id, id));
    return result[0];
  }

  async createReceipt(receipt: InsertReceipt): Promise<Receipt> {
    const result = await db.insert(receipts).values(receipt).returning();
    return result[0];
  }

  async updateReceipt(id: string, updates: Partial<InsertReceipt>): Promise<Receipt | undefined> {
    const result = await db
      .update(receipts)
      .set(updates)
      .where(eq(receipts.id, id))
      .returning();
    return result[0];
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.userId, userId))
      .orderBy(desc(achievements.earnedAt));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const result = await db.insert(achievements).values(achievement).returning();
    return result[0];
  }

  async getUserPoints(userId: string): Promise<number> {
    const result = await db
      .select({ total: drizzleSql<number>`sum(${achievements.points})` })
      .from(achievements)
      .where(eq(achievements.userId, userId));
    return result[0]?.total || 0;
  }

  async getDeals(category?: string): Promise<Deal[]> {
    if (category) {
      return await db
        .select()
        .from(deals)
        .where(and(eq(deals.isActive, true), eq(deals.category, category)))
        .orderBy(desc(deals.createdAt));
    }
    return await db
      .select()
      .from(deals)
      .where(eq(deals.isActive, true))
      .orderBy(desc(deals.createdAt));
  }

  async createDeal(deal: InsertDeal): Promise<Deal> {
    const result = await db.insert(deals).values(deal).returning();
    return result[0];
  }

  async getDeal(id: string): Promise<Deal | undefined> {
    const deal = await db.select().from(deals).where(eq(deals.id, id));
    return deal[0];
  }

  async getFuelPrices(suburb?: string): Promise<FuelPrice[]> {
    if (suburb) {
      return await db
        .select()
        .from(fuelPrices)
        .where(eq(fuelPrices.suburb, suburb))
        .orderBy(fuelPrices.unleadedPrice);
    }
    return await db
      .select()
      .from(fuelPrices)
      .orderBy(fuelPrices.unleadedPrice);
  }

  async getCheapestFuel(fuelType: 'unleaded' | 'diesel' | 'lpg' | 'premium'): Promise<FuelPrice[]> {
    const priceColumn = fuelType === 'unleaded' ? fuelPrices.unleadedPrice
      : fuelType === 'diesel' ? fuelPrices.dieselPrice
      : fuelType === 'lpg' ? fuelPrices.lpgPrice
      : fuelPrices.premiumPrice;
    
    return await db
      .select()
      .from(fuelPrices)
      .orderBy(priceColumn)
      .limit(10);
  }

  async createFuelPrice(price: InsertFuelPrice): Promise<FuelPrice> {
    const result = await db.insert(fuelPrices).values(price).returning();
    return result[0];
  }

  async getUserPriceAlerts(userId: string): Promise<PriceAlert[]> {
    return await db
      .select()
      .from(priceAlerts)
      .where(eq(priceAlerts.userId, userId))
      .orderBy(desc(priceAlerts.createdAt));
  }

  async createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    const result = await db.insert(priceAlerts).values(alert).returning();
    return result[0];
  }

  async updatePriceAlert(
    id: string,
    updates: Partial<InsertPriceAlert>,
  ): Promise<PriceAlert | undefined> {
    const result = await db
      .update(priceAlerts)
      .set(updates)
      .where(eq(priceAlerts.id, id))
      .returning();
    return result[0];
  }

  async deletePriceAlert(id: string): Promise<boolean> {
    const result = await db.delete(priceAlerts).where(eq(priceAlerts.id, id));
    return (result as any).rowCount > 0;
  }

  async getUserBills(userId: string): Promise<Bill[]> {
    return await db
      .select()
      .from(bills)
      .where(eq(bills.userId, userId))
      .orderBy(bills.dueDate);
  }

  async createBill(bill: InsertBill): Promise<Bill> {
    const result = await db.insert(bills).values(bill).returning();
    return result[0];
  }

  async updateBill(
    id: string,
    updates: Partial<InsertBill>,
  ): Promise<Bill | undefined> {
    const result = await db
      .update(bills)
      .set(updates)
      .where(eq(bills.id, id))
      .returning();
    return result[0];
  }

  async deleteBill(id: string): Promise<boolean> {
    const result = await db.delete(bills).where(eq(bills.id, id));
    return (result as any).rowCount > 0;
  }

  async getUserNotifications(userId: string, limit?: number): Promise<Notification[]> {
    if (limit) {
      return await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(limit);
    }
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db
      .select({ count: drizzleSql<number>`count(*)` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false)
        )
      );
    return Number(result[0]?.count) || 0;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const result = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.userId, userId));
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id));
    return (result as any).rowCount > 0;
  }

  async getLeaderboard(timeframe: "all" | "month" | "week", limit: number = 50): Promise<LeaderboardStats[]> {
    const field = timeframe === "all" ? leaderboardStats.totalSavings :
                  timeframe === "month" ? leaderboardStats.savingsThisMonth :
                  leaderboardStats.savingsThisWeek;
    
    return await db
      .select()
      .from(leaderboardStats)
      .where(eq(leaderboardStats.isPublic, true))
      .orderBy(desc(field))
      .limit(limit);
  }

  async getUserLeaderboardStats(userId: string): Promise<LeaderboardStats | undefined> {
    const stats = await db
      .select()
      .from(leaderboardStats)
      .where(eq(leaderboardStats.userId, userId));
    return stats[0];
  }

  async updateLeaderboardStats(userId: string): Promise<LeaderboardStats> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const allRecords = await this.getUserSavingsRecords(userId);
    const totalSavings = allRecords.reduce((sum, record) => sum + parseFloat(record.amount || "0"), 0);
    
    const monthRecords = allRecords.filter(r => r.date && new Date(r.date) >= startOfMonth);
    const savingsThisMonth = monthRecords.reduce((sum, record) => sum + parseFloat(record.amount || "0"), 0);
    
    const weekRecords = allRecords.filter(r => r.date && new Date(r.date) >= startOfWeek);
    const savingsThisWeek = weekRecords.reduce((sum, record) => sum + parseFloat(record.amount || "0"), 0);

    const achievements = await this.getUserAchievements(userId);
    const badges = this.calculateBadges(allRecords, achievements, totalSavings);

    const displayName = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.email.split('@')[0];

    const existing = await this.getUserLeaderboardStats(userId);
    
    if (existing) {
      const result = await db
        .update(leaderboardStats)
        .set({
          displayName,
          totalSavings: totalSavings.toString(),
          savingsThisMonth: savingsThisMonth.toString(),
          savingsThisWeek: savingsThisWeek.toString(),
          badges,
          lastUpdated: drizzleSql`now()`,
        })
        .where(eq(leaderboardStats.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await db
        .insert(leaderboardStats)
        .values({
          userId,
          displayName,
          totalSavings: totalSavings.toString(),
          savingsThisMonth: savingsThisMonth.toString(),
          savingsThisWeek: savingsThisWeek.toString(),
          badges,
          isPublic: true,
        })
        .returning();
      return result[0];
    }
  }

  private calculateBadges(records: SavingsRecord[], achievements: Achievement[], totalSavings: number): string[] {
    const badges: string[] = [];
    
    const groceryRecords = records.filter(r => r.category === "groceries");
    const grocerySavings = groceryRecords.reduce((sum, r) => sum + parseFloat(r.amount || "0"), 0);
    if (grocerySavings >= 500) badges.push("grocery_guru");
    
    const billAchievements = achievements.filter(a => a.achievementType.includes("bill"));
    if (billAchievements.length >= 5) badges.push("bill_buster");
    
    const dealAchievements = achievements.filter(a => a.achievementType.includes("deal"));
    if (dealAchievements.length >= 20) badges.push("deal_hunter");
    
    const recentDays = 7;
    const recentDate = new Date();
    recentDate.setDate(recentDate.getDate() - recentDays);
    const recentRecords = records.filter(r => r.date && new Date(r.date) >= recentDate);
    const uniqueDays = new Set(recentRecords.map(r => r.date?.toISOString().split('T')[0]));
    if (uniqueDays.size >= 7) badges.push("savings_streak");
    
    badges.push("perth_pioneer");
    
    return badges;
  }

  async toggleLeaderboardVisibility(userId: string, isPublic: boolean): Promise<LeaderboardStats | undefined> {
    await this.updateLeaderboardStats(userId);
    
    const result = await db
      .update(leaderboardStats)
      .set({ isPublic })
      .where(eq(leaderboardStats.userId, userId))
      .returning();
    return result[0];
  }

  async recalculateRankings(): Promise<void> {
    const allStats = await db
      .select()
      .from(leaderboardStats)
      .orderBy(desc(leaderboardStats.totalSavings));
    
    for (let i = 0; i < allStats.length; i++) {
      await db
        .update(leaderboardStats)
        .set({ rank: i + 1 })
        .where(eq(leaderboardStats.id, allStats[i].id));
    }
  }

  async getCoachConversationHistory(userId: string, limit: number = 50): Promise<CoachConversation[]> {
    return await db
      .select()
      .from(coachConversations)
      .where(eq(coachConversations.userId, userId))
      .orderBy(desc(coachConversations.createdAt))
      .limit(limit);
  }

  async createCoachConversation(conversation: InsertCoachConversation): Promise<CoachConversation> {
    const result = await db
      .insert(coachConversations)
      .values(conversation)
      .returning();
    return result[0];
  }

  async getSavingsRecords(userId: string, limit: number = 50): Promise<SavingsRecord[]> {
    return await db
      .select()
      .from(savingsRecords)
      .where(eq(savingsRecords.userId, userId))
      .orderBy(desc(savingsRecords.date))
      .limit(limit);
  }

  async getFamilyMembers(ownerId: string): Promise<FamilyMember[]> {
    return await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.familyOwnerId, ownerId))
      .orderBy(familyMembers.createdAt);
  }

  async getPendingFamilyInvites(ownerId: string): Promise<FamilyMember[]> {
    return await db
      .select()
      .from(familyMembers)
      .where(and(eq(familyMembers.familyOwnerId, ownerId), eq(familyMembers.status, "pending")))
      .orderBy(familyMembers.inviteSentAt);
  }

  async addFamilyMember(member: InsertFamilyMember): Promise<FamilyMember> {
    const result = await db
      .insert(familyMembers)
      .values(member)
      .returning();
    return result[0];
  }

  async updateFamilyMember(id: string, updates: Partial<InsertFamilyMember>): Promise<FamilyMember | undefined> {
    const result = await db
      .update(familyMembers)
      .set(updates)
      .where(eq(familyMembers.id, id))
      .returning();
    return result[0];
  }

  async removeFamilyMember(id: string): Promise<boolean> {
    const result = await db
      .delete(familyMembers)
      .where(eq(familyMembers.id, id));
    return !!result;
  }

  async getFamilyAccessByUserId(userId: string): Promise<FamilyMember | undefined> {
    const result = await db
      .select()
      .from(familyMembers)
      .where(and(eq(familyMembers.memberId, userId), eq(familyMembers.status, "active")));
    return result[0];
  }

  async getUserFinancialReports(userId: string): Promise<FinancialReport[]> {
    return await db
      .select()
      .from(financialReports)
      .where(eq(financialReports.userId, userId))
      .orderBy(desc(financialReports.createdAt));
  }

  async createFinancialReport(report: InsertFinancialReport): Promise<FinancialReport> {
    const result = await db
      .insert(financialReports)
      .values(report)
      .returning();
    return result[0];
  }

  async getFinancialReport(id: string): Promise<FinancialReport | undefined> {
    const result = await db
      .select()
      .from(financialReports)
      .where(eq(financialReports.id, id));
    return result[0];
  }

  async getTutorials(): Promise<Tutorial[]> {
    return await db
      .select()
      .from(tutorials)
      .where(eq(tutorials.isActive, true));
  }

  async getUserTutorialProgress(userId: string): Promise<TutorialProgress[]> {
    return await db
      .select()
      .from(tutorialProgress)
      .where(eq(tutorialProgress.userId, userId));
  }

  async createTutorialProgress(progress: InsertTutorialProgress): Promise<TutorialProgress> {
    const result = await db
      .insert(tutorialProgress)
      .values(progress)
      .returning();
    return result[0];
  }

  async updateTutorialProgress(id: string, updates: Partial<InsertTutorialProgress>): Promise<TutorialProgress | undefined> {
    const result = await db
      .update(tutorialProgress)
      .set(updates)
      .where(eq(tutorialProgress.id, id))
      .returning();
    return result[0];
  }

  async getNewsFeed(): Promise<NewsFeed[]> {
    return await db
      .select()
      .from(newsFeed)
      .orderBy(desc(newsFeed.publishedAt));
  }

  async getSavingChallenges(): Promise<SavingChallenge[]> {
    return await db
      .select()
      .from(savingChallenges)
      .where(eq(savingChallenges.isActive, true));
  }

  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    return await db
      .select()
      .from(userChallenges)
      .where(eq(userChallenges.userId, userId))
      .orderBy(desc(userChallenges.startedAt));
  }

  async createUserChallenge(challenge: InsertUserChallenge): Promise<UserChallenge> {
    const result = await db
      .insert(userChallenges)
      .values(challenge)
      .returning();
    return result[0];
  }

  async updateUserChallenge(id: string, updates: Partial<InsertUserChallenge>): Promise<UserChallenge | undefined> {
    const result = await db
      .update(userChallenges)
      .set(updates)
      .where(eq(userChallenges.id, id))
      .returning();
    return result[0];
  }

  // Stores
  async getStores(type?: string): Promise<Store[]> {
    if (type) {
      return await db
        .select()
        .from(stores)
        .where(eq(stores.type, type));
    }
    return await db.select().from(stores);
  }

  // Products catalog
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const conditions = [];
    if (category) {
      conditions.push(eq(products.category, category));
    }
    if (conditions.length > 0) {
      return await db.select().from(products).where(and(...conditions));
    }
    return await db.select().from(products);
  }

  async getStoreProductPrices(productId: string): Promise<any[]> {
    return await db
      .select({
        id: storeProducts.id,
        productId: storeProducts.productId,
        storeId: storeProducts.storeId,
        currentPrice: storeProducts.currentPrice,
        wasPrice: storeProducts.wasPrice,
        unitPrice: storeProducts.unitPrice,
        isOnSpecial: storeProducts.isOnSpecial,
        specialType: storeProducts.specialType,
        inStock: storeProducts.inStock,
        storeName: stores.name,
        storeSlug: stores.slug,
        storeType: stores.type,
      })
      .from(storeProducts)
      .innerJoin(stores, eq(storeProducts.storeId, stores.id))
      .where(eq(storeProducts.productId, productId));
  }

  async getAllProductsWithPrices(category?: string, search?: string, storeSlug?: string, onSpecialOnly?: boolean): Promise<any[]> {
    const conditions = [];
    
    if (storeSlug) {
      conditions.push(eq(stores.slug, storeSlug));
    }
    if (onSpecialOnly) {
      conditions.push(eq(storeProducts.isOnSpecial, true));
    }
    if (category) {
      conditions.push(eq(products.category, category));
    }
    
    let query = db
      .select({
        id: products.id,
        name: products.name,
        brand: products.brand,
        category: products.category,
        subcategory: products.subcategory,
        unit: products.unit,
        size: products.size,
        storeProductId: storeProducts.id,
        currentPrice: storeProducts.currentPrice,
        wasPrice: storeProducts.wasPrice,
        unitPrice: storeProducts.unitPrice,
        isOnSpecial: storeProducts.isOnSpecial,
        specialType: storeProducts.specialType,
        inStock: storeProducts.inStock,
        storeName: stores.name,
        storeSlug: stores.slug,
      })
      .from(products)
      .innerJoin(storeProducts, eq(products.id, storeProducts.productId))
      .innerJoin(stores, eq(storeProducts.storeId, stores.id));
    
    if (conditions.length > 0) {
      return await query.where(and(...conditions));
    }
    return await query;
  }

  // Promo codes
  async getPromoCodes(storeCategory?: string, isHidden?: boolean, isVerified?: boolean, search?: string): Promise<PromoCode[]> {
    const conditions = [];
    
    if (storeCategory) {
      conditions.push(eq(promoCodes.storeCategory, storeCategory));
    }
    if (isHidden !== undefined) {
      conditions.push(eq(promoCodes.isHidden, isHidden));
    }
    if (isVerified !== undefined) {
      conditions.push(eq(promoCodes.isVerified, isVerified));
    }
    
    if (conditions.length > 0) {
      return await db
        .select()
        .from(promoCodes)
        .where(and(...conditions))
        .orderBy(desc(promoCodes.successRate));
    }
    return await db
      .select()
      .from(promoCodes)
      .orderBy(desc(promoCodes.successRate));
  }

  async getPromoCodesByStore(storeName: string): Promise<PromoCode[]> {
    return await db
      .select()
      .from(promoCodes)
      .where(eq(promoCodes.storeName, storeName))
      .orderBy(desc(promoCodes.successRate));
  }

  async verifyPromoCode(id: string, success: boolean): Promise<void> {
    const code = await db.select().from(promoCodes).where(eq(promoCodes.id, id));
    if (code.length > 0) {
      const currentUsage = code[0].usageCount || 0;
      const currentSuccessRate = code[0].successRate || 0;
      const newUsage = currentUsage + 1;
      const newSuccessRate = Math.round(((currentSuccessRate * currentUsage) + (success ? 100 : 0)) / newUsage);
      
      await db
        .update(promoCodes)
        .set({
          usageCount: newUsage,
          successRate: newSuccessRate,
          lastVerified: new Date(),
          isVerified: success || code[0].isVerified,
        })
        .where(eq(promoCodes.id, id));
    }
  }

  // Admin stats
  async getAdminStats(): Promise<{
    totalUsers: number;
    activeSubscribers: number;
    premiumUsers: number;
    familyUsers: number;
    totalProducts: number;
    newUsersToday: number;
    newUsersThisWeek: number;
    newUsersThisMonth: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [
      totalUsersResult,
      activeSubscribersResult,
      premiumUsersResult,
      familyUsersResult,
      totalProductsResult,
      newUsersTodayResult,
      newUsersWeekResult,
      newUsersMonthResult,
    ] = await Promise.all([
      db.select({ count: drizzleSql<number>`count(*)` }).from(users),
      db.select({ count: drizzleSql<number>`count(*)` }).from(users).where(eq(users.subscriptionStatus, 'active')),
      db.select({ count: drizzleSql<number>`count(*)` }).from(users).where(eq(users.subscriptionPlan, 'premium')),
      db.select({ count: drizzleSql<number>`count(*)` }).from(users).where(eq(users.subscriptionPlan, 'family')),
      db.select({ count: drizzleSql<number>`count(*)` }).from(productPrices),
      db.select({ count: drizzleSql<number>`count(*)` }).from(users).where(gte(users.createdAt, today)),
      db.select({ count: drizzleSql<number>`count(*)` }).from(users).where(gte(users.createdAt, weekAgo)),
      db.select({ count: drizzleSql<number>`count(*)` }).from(users).where(gte(users.createdAt, monthAgo)),
    ]);

    return {
      totalUsers: Number(totalUsersResult[0]?.count) || 0,
      activeSubscribers: Number(activeSubscribersResult[0]?.count) || 0,
      premiumUsers: Number(premiumUsersResult[0]?.count) || 0,
      familyUsers: Number(familyUsersResult[0]?.count) || 0,
      totalProducts: Number(totalProductsResult[0]?.count) || 0,
      newUsersToday: Number(newUsersTodayResult[0]?.count) || 0,
      newUsersThisWeek: Number(newUsersWeekResult[0]?.count) || 0,
      newUsersThisMonth: Number(newUsersMonthResult[0]?.count) || 0,
    };
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async setUserAdmin(userId: string, isAdmin: boolean): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  async setUserOwner(userId: string, isOwner: boolean): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ isOwner })
      .where(eq(users.id, userId))
      .returning();
    return result[0];
  }

  // User budgets
  async getUserBudgets(userId: string): Promise<UserBudget[]> {
    return await db
      .select()
      .from(userBudgets)
      .where(eq(userBudgets.userId, userId))
      .orderBy(desc(userBudgets.createdAt));
  }

  async getBudget(id: string): Promise<UserBudget | undefined> {
    const budget = await db.select().from(userBudgets).where(eq(userBudgets.id, id));
    return budget[0];
  }

  async createBudget(budget: InsertUserBudget): Promise<UserBudget> {
    const values = {
      ...budget,
      totalAllocated: budget.totalAllocated.toString(),
    } as any;
    const result = await db.insert(userBudgets).values(values).returning();
    return result[0];
  }

  async updateBudget(id: string, updates: Partial<InsertUserBudget>): Promise<UserBudget | undefined> {
    const values: any = { ...updates };
    if (values.totalAllocated !== undefined) values.totalAllocated = values.totalAllocated.toString();
    const result = await db.update(userBudgets).set(values).where(eq(userBudgets.id, id)).returning();
    return result[0];
  }

  async deleteBudget(id: string): Promise<boolean> {
    const result = await db.delete(userBudgets).where(eq(userBudgets.id, id));
    return (result as any).rowCount > 0;
  }

  // Budget categories
  async getBudgetCategories(budgetId: string): Promise<BudgetCategory[]> {
    return await db
      .select()
      .from(budgetCategories)
      .where(eq(budgetCategories.budgetId, budgetId))
      .orderBy(budgetCategories.createdAt);
  }

  async createBudgetCategory(category: InsertBudgetCategory): Promise<BudgetCategory> {
    const values = {
      ...category,
      allocated: category.allocated.toString(),
      spent: (category.spent || "0").toString(),
    } as any;
    const result = await db.insert(budgetCategories).values(values).returning();
    return result[0];
  }

  async updateBudgetCategory(id: string, updates: Partial<InsertBudgetCategory>): Promise<BudgetCategory | undefined> {
    const values: any = { ...updates };
    if (values.allocated !== undefined) values.allocated = values.allocated.toString();
    if (values.spent !== undefined) values.spent = values.spent.toString();
    const result = await db.update(budgetCategories).set(values).where(eq(budgetCategories.id, id)).returning();
    return result[0];
  }

  async deleteBudgetCategory(id: string): Promise<boolean> {
    const result = await db.delete(budgetCategories).where(eq(budgetCategories.id, id));
    return (result as any).rowCount > 0;
  }

  // User debts
  async getUserDebts(userId: string): Promise<UserDebt[]> {
    return await db
      .select()
      .from(userDebts)
      .where(eq(userDebts.userId, userId))
      .orderBy(desc(userDebts.createdAt));
  }

  async getDebt(id: string): Promise<UserDebt | undefined> {
    const debt = await db.select().from(userDebts).where(eq(userDebts.id, id));
    return debt[0];
  }

  async createDebt(debt: InsertUserDebt): Promise<UserDebt> {
    const values = {
      ...debt,
      balance: debt.balance.toString(),
      interestRate: debt.interestRate.toString(),
      minimumPayment: debt.minimumPayment.toString(),
    } as any;
    const result = await db.insert(userDebts).values(values).returning();
    return result[0];
  }

  async updateDebt(id: string, updates: Partial<InsertUserDebt>): Promise<UserDebt | undefined> {
    const values: any = { ...updates };
    if (values.balance !== undefined) values.balance = values.balance.toString();
    if (values.interestRate !== undefined) values.interestRate = values.interestRate.toString();
    if (values.minimumPayment !== undefined) values.minimumPayment = values.minimumPayment.toString();
    const result = await db.update(userDebts).set(values).where(eq(userDebts.id, id)).returning();
    return result[0];
  }

  async deleteDebt(id: string): Promise<boolean> {
    const result = await db.delete(userDebts).where(eq(userDebts.id, id));
    return (result as any).rowCount > 0;
  }

  // User mortgages
  async getUserMortgages(userId: string): Promise<UserMortgage[]> {
    return await db
      .select()
      .from(userMortgages)
      .where(eq(userMortgages.userId, userId))
      .orderBy(desc(userMortgages.createdAt));
  }

  async getMortgage(id: string): Promise<UserMortgage | undefined> {
    const mortgage = await db.select().from(userMortgages).where(eq(userMortgages.id, id));
    return mortgage[0];
  }

  async createMortgage(mortgage: InsertUserMortgage): Promise<UserMortgage> {
    const values = {
      ...mortgage,
      principal: mortgage.principal.toString(),
      interestRate: mortgage.interestRate.toString(),
      monthlyPayment: mortgage.monthlyPayment?.toString(),
      propertyValue: mortgage.propertyValue?.toString(),
    } as any;
    const result = await db.insert(userMortgages).values(values).returning();
    return result[0];
  }

  async updateMortgage(id: string, updates: Partial<InsertUserMortgage>): Promise<UserMortgage | undefined> {
    const values: any = { ...updates };
    if (values.principal !== undefined) values.principal = values.principal.toString();
    if (values.interestRate !== undefined) values.interestRate = values.interestRate.toString();
    if (values.monthlyPayment !== undefined) values.monthlyPayment = values.monthlyPayment.toString();
    if (values.propertyValue !== undefined) values.propertyValue = values.propertyValue.toString();
    const result = await db.update(userMortgages).set(values).where(eq(userMortgages.id, id)).returning();
    return result[0];
  }

  async deleteMortgage(id: string): Promise<boolean> {
    const result = await db.delete(userMortgages).where(eq(userMortgages.id, id));
    return (result as any).rowCount > 0;
  }

  // Gamification: Game balances
  async getGameBalance(userId: string) {
    const result = await db.select().from(userGameBalances).where(eq(userGameBalances.userId, userId));
    return result[0];
  }

  async recordSpin(userId: string, rewardLabel: string, rewardValue: number) {
    const now = new Date();
    
    await db.insert(dailySpins).values({
      userId,
      spinDate: now,
      rewardLabel,
      rewardValue,
      streakDay: 1,
    });

    const existingBalance = await this.getGameBalance(userId);
    
    if (existingBalance) {
      const lastSpinDate = existingBalance.lastSpinAt ? new Date(existingBalance.lastSpinAt) : null;
      const isConsecutiveDay = lastSpinDate && 
        (now.getTime() - lastSpinDate.getTime()) < (48 * 60 * 60 * 1000);
      
      const newStreak = isConsecutiveDay ? (existingBalance.currentStreak || 0) + 1 : 1;
      const longestStreak = Math.max(newStreak, existingBalance.longestStreak || 0);

      await db.update(userGameBalances)
        .set({
          lastSpinAt: now,
          currentStreak: newStreak,
          longestStreak,
          updatedAt: now,
        })
        .where(eq(userGameBalances.userId, userId));
    } else {
      await db.insert(userGameBalances).values({
        userId,
        points: 0,
        totalPointsEarned: 0,
        currentStreak: 1,
        longestStreak: 1,
        bonusSpins: 0,
        lastSpinAt: now,
        scratchCardsAvailable: 1,
      });
    }
  }

  async addPoints(userId: string, points: number) {
    const existingBalance = await this.getGameBalance(userId);
    const now = new Date();
    
    if (existingBalance) {
      await db.update(userGameBalances)
        .set({
          points: (existingBalance.points || 0) + points,
          totalPointsEarned: (existingBalance.totalPointsEarned || 0) + points,
          updatedAt: now,
        })
        .where(eq(userGameBalances.userId, userId));
    } else {
      await db.insert(userGameBalances).values({
        userId,
        points,
        totalPointsEarned: points,
        currentStreak: 0,
        longestStreak: 0,
        bonusSpins: 0,
        scratchCardsAvailable: 1,
      });
    }
  }

  async useScratchCard(userId: string) {
    const existingBalance = await this.getGameBalance(userId);
    const now = new Date();
    
    if (existingBalance && (existingBalance.scratchCardsAvailable || 0) > 0) {
      await db.update(userGameBalances)
        .set({
          scratchCardsAvailable: (existingBalance.scratchCardsAvailable || 1) - 1,
          updatedAt: now,
        })
        .where(eq(userGameBalances.userId, userId));
    }
  }
}

export const storage = new DrizzleStorage();
