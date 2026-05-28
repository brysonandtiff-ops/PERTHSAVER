import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";
import { ErrorType } from "@/components/ErrorState";

export interface ApiError {
  type: ErrorType;
  title: string;
  message: string;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    const message = error.message;
    
    if (message.includes("401")) {
      return {
        type: "auth",
        title: "Authentication Required",
        message: "Please log in to access this content.",
      };
    }
    
    if (message.includes("403")) {
      return {
        type: "auth",
        title: "Access Denied",
        message: "You don't have permission to access this resource.",
      };
    }
    
    if (message.includes("404")) {
      return {
        type: "not-found",
        title: "Not Found",
        message: "The requested resource could not be found.",
      };
    }
    
    if (message.includes("429")) {
      return {
        type: "server",
        title: "Too Many Requests",
        message: "You've made too many requests. Please wait a moment and try again.",
      };
    }
    
    if (message.includes("400")) {
      return {
        type: "validation",
        title: "Invalid Request",
        message: "Please check your input and try again.",
      };
    }
    
    if (message.includes("500") || message.includes("502") || message.includes("503")) {
      return {
        type: "server",
        title: "Server Error",
        message: "Something went wrong on our end. Please try again in a moment.",
      };
    }
    
    if (message.toLowerCase().includes("failed to fetch") || message.toLowerCase().includes("network")) {
      return {
        type: "network",
        title: "Connection Issue",
        message: "Please check your internet connection and try again.",
      };
    }
    
    return {
      type: "server",
      title: "Error",
      message: message || "An unexpected error occurred. Please try again.",
    };
  }
  
  return {
    type: "server",
    title: "Unknown Error",
    message: "An unexpected error occurred. Please try again.",
  };
}

// Auth APIs
export function useAuth() {
  return useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/signup", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
  });
}

// Grocery prices
export function useGroceryPrices(category = "groceries", location = "Perth, WA") {
  return useQuery({
    queryKey: ["/api/products/prices", { category, location }],
    queryFn: async () => {
      const res = await fetch(`/api/products/prices?category=${category}&location=${encodeURIComponent(location)}`);
      if (!res.ok) throw new Error("Failed to fetch prices");
      return res.json();
    },
  });
}

// Deals
export function useDeals(category?: string) {
  return useQuery({
    queryKey: category ? ["/api/deals", { category }] : ["/api/deals"],
    queryFn: async () => {
      const url = category ? `/api/deals?category=${category}` : "/api/deals";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json();
    },
  });
}

// Savings goals
export function useSavingsGoals() {
  return useQuery({
    queryKey: ["/api/savings-goals"],
    queryFn: async () => {
      const res = await fetch("/api/savings-goals", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch savings goals");
      return res.json();
    },
  });
}

export function useCreateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/savings-goals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
    },
  });
}

export function useUpdateSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/savings-goals/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
    },
  });
}

export function useDeleteSavingsGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/savings-goals/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/savings-goals"] });
    },
  });
}

// Dashboard stats
export function useDashboardStats() {
  return useQuery({
    queryKey: ["/api/dashboard/stats"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/stats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

// Subscriptions
export function useSubscriptions() {
  return useQuery({
    queryKey: ["/api/subscriptions"],
    queryFn: async () => {
      const res = await fetch("/api/subscriptions", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch subscriptions");
      return res.json();
    },
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/subscriptions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions"] });
    },
  });
}

// Achievements
export function useAchievements() {
  return useQuery({
    queryKey: ["/api/achievements"],
    queryFn: async () => {
      const res = await fetch("/api/achievements", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    },
  });
}

// Community posts
export function useCommunityPosts(category?: string) {
  return useQuery({
    queryKey: category ? ["/api/community-posts", { category }] : ["/api/community-posts"],
    queryFn: async () => {
      const url = category ? `/api/community-posts?category=${category}` : "/api/community-posts";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch community posts");
      return res.json();
    },
  });
}

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/community-posts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community-posts"] });
    },
  });
}

// Meal plans
export function useMealPlans() {
  return useQuery({
    queryKey: ["/api/meal-plans"],
    queryFn: async () => {
      const res = await fetch("/api/meal-plans", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch meal plans");
      return res.json();
    },
  });
}

// Receipts
export function useReceipts() {
  return useQuery({
    queryKey: ["/api/receipts"],
    queryFn: async () => {
      const res = await fetch("/api/receipts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch receipts");
      return res.json();
    },
  });
}

// Price Alerts
export function usePriceAlerts() {
  return useQuery({
    queryKey: ["/api/price-alerts"],
    queryFn: async () => {
      const res = await fetch("/api/price-alerts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch price alerts");
      return res.json();
    },
  });
}

export function useCreatePriceAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/price-alerts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-alerts"] });
    },
  });
}

export function useUpdatePriceAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/price-alerts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-alerts"] });
    },
  });
}

export function useDeletePriceAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/price-alerts/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/price-alerts"] });
    },
  });
}

// Bills
export function useBills() {
  return useQuery({
    queryKey: ["/api/bills"],
    queryFn: async () => {
      const res = await fetch("/api/bills", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bills");
      return res.json();
    },
  });
}

export function useCreateBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/bills", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
  });
}

export function useUpdateBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/bills/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
  });
}

export function useDeleteBill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/bills/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bills"] });
    },
  });
}

// Analytics
export function useAnalytics() {
  return useQuery({
    queryKey: ["/api/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/analytics", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch analytics");
      return res.json();
    },
  });
}

// Leaderboard
export function useLeaderboard(timeframe: "all" | "month" | "week" = "all", limit: number = 50) {
  return useQuery({
    queryKey: ["/api/leaderboard", { timeframe, limit }],
    queryFn: async () => {
      const res = await fetch(`/api/leaderboard?timeframe=${timeframe}&limit=${limit}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json();
    },
    refetchInterval: 60000,
  });
}

export function useToggleLeaderboardVisibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (isPublic: boolean) => {
      const res = await apiRequest("PATCH", "/api/leaderboard/visibility", { isPublic });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
  });
}

export function useUpdateLeaderboardStats() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/leaderboard/update");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
  });
}

// Budgets
export function useBudgets() {
  return useQuery({
    queryKey: ["/api/budgets"],
    queryFn: async () => {
      const res = await fetch("/api/budgets", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch budgets");
      return res.json();
    },
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; totalAmount: number; period: string }) => {
      const res = await apiRequest("POST", "/api/budgets", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/budgets/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/budgets/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
    },
  });
}

// Budget Categories
export function useBudgetCategories(budgetId: number) {
  return useQuery({
    queryKey: ["/api/budgets", budgetId, "categories"],
    queryFn: async () => {
      const res = await fetch(`/api/budgets/${budgetId}/categories`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch budget categories");
      return res.json();
    },
    enabled: !!budgetId,
  });
}

export function useCreateBudgetCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ budgetId, data }: { budgetId: number; data: { name: string; allocatedAmount: number; color?: string } }) => {
      const res = await apiRequest("POST", `/api/budgets/${budgetId}/categories`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets", variables.budgetId, "categories"] });
    },
  });
}

export function useUpdateBudgetCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, budgetId, data }: { id: number; budgetId?: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/budget-categories/${id}`, data);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      if (variables.budgetId) {
        queryClient.invalidateQueries({ queryKey: ["/api/budgets", variables.budgetId, "categories"] });
      }
    },
  });
}

export function useDeleteBudgetCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, budgetId }: { id: number; budgetId: number }) => {
      const res = await apiRequest("DELETE", `/api/budget-categories/${id}`);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/budgets", variables.budgetId, "categories"] });
    },
  });
}

// Debts
export function useDebts() {
  return useQuery({
    queryKey: ["/api/debts"],
    queryFn: async () => {
      const res = await fetch("/api/debts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch debts");
      return res.json();
    },
  });
}

export function useCreateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; type: string; balance: number; interestRate: number; minimumPayment: number }) => {
      const res = await apiRequest("POST", "/api/debts", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
    },
  });
}

export function useUpdateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/debts/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
    },
  });
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/debts/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/debts"] });
    },
  });
}

// Mortgages
export function useMortgages() {
  return useQuery({
    queryKey: ["/api/mortgages"],
    queryFn: async () => {
      const res = await fetch("/api/mortgages", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch mortgages");
      return res.json();
    },
  });
}

export function useCreateMortgage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; principal: number; interestRate: number; termYears: number; monthlyPayment: number }) => {
      const res = await apiRequest("POST", "/api/mortgages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mortgages"] });
    },
  });
}

export function useUpdateMortgage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await apiRequest("PATCH", `/api/mortgages/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mortgages"] });
    },
  });
}

export function useDeleteMortgage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/mortgages/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mortgages"] });
    },
  });
}
