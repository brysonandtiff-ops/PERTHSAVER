import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  Shield, Users, DollarSign, TrendingUp, Crown, Package,
  UserPlus, Calendar, BarChart3, Settings, ChevronRight,
  Lock, Loader2, AlertTriangle, RefreshCw, UserCheck, UserX, Trash2, Plus, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  premiumUsers: number;
  familyUsers: number;
  totalProducts: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface Revenue {
  monthly: string;
  yearly: string;
  premiumRevenue: string;
  familyRevenue: string;
  activeSubscribers: number;
  premiumUsers: number;
  familyUsers: number;
}

interface AdminUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  subscriptionStatus: string | null;
  subscriptionPlan: string | null;
  isAdmin: boolean | null;
  isOwner: boolean | null;
  createdAt: string | null;
  lastLoginAt: string | null;
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  subvalue, 
  color = "blue" 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  subvalue?: string;
  color?: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "from-purple-500 to-purple-600",
    amber: "from-cyan-500 to-cyan-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-5 border border-white/5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/60 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subvalue && (
            <p className="text-xs text-white/40 mt-1">{subvalue}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "revenue">("overview");
  
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserFirstName, setNewUserFirstName] = useState("");
  const [newUserLastName, setNewUserLastName] = useState("");
  const [newUserIsAdmin, setNewUserIsAdmin] = useState(false);

  const { data: adminCheck, isLoading: checkLoading } = useQuery({
    queryKey: ["/api/admin/check"],
    queryFn: async () => {
      const res = await fetch("/api/admin/check");
      return res.json();
    },
  });

  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    enabled: adminCheck?.isAdmin || adminCheck?.isOwner,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ["/api/admin/revenue"],
    queryFn: async () => {
      const res = await fetch("/api/admin/revenue");
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json();
    },
    enabled: adminCheck?.isAdmin || adminCheck?.isOwner,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
    enabled: (adminCheck?.isAdmin || adminCheck?.isOwner) && activeTab === "users",
  });

  const setAdminMutation = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      const res = await fetch("/api/admin/set-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, isAdmin }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update admin status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Admin status updated" });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string; firstName: string; lastName: string; isAdmin: boolean }) => {
      const res = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User created successfully" });
      setShowCreateDialog(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserFirstName("");
      setNewUserLastName("");
      setNewUserIsAdmin(false);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/delete-user/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "User deleted successfully" });
      setShowDeleteDialog(false);
      setUserToDelete(null);
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  if (checkLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!adminCheck?.isAdmin && !adminCheck?.isOwner) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Access Denied</h1>
          <p className="text-white/60 mb-6">
            This dashboard is only accessible to admins and owners. Please contact the app owner if you believe you should have access.
          </p>
          <Button 
            onClick={() => setLocation("/dashboard")}
            className="bg-gradient-to-r from-purple-500 to-cyan-500"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const stats: AdminStats = statsData?.stats || {
    totalUsers: 0,
    activeSubscribers: 0,
    premiumUsers: 0,
    familyUsers: 0,
    totalProducts: 0,
    newUsersToday: 0,
    newUsersThisWeek: 0,
    newUsersThisMonth: 0,
  };

  const revenue: Revenue = revenueData?.revenue || {
    monthly: "0.00",
    yearly: "0.00",
    premiumRevenue: "0.00",
    familyRevenue: "0.00",
    activeSubscribers: 0,
    premiumUsers: 0,
    familyUsers: 0,
  };

  const users: AdminUser[] = usersData?.users || [];

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      <div className="bg-gradient-to-b from-purple-950/30 to-transparent">
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600"
              animate={{ 
                boxShadow: [
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                  "0 0 40px rgba(168, 85, 247, 0.6)",
                  "0 0 20px rgba(168, 85, 247, 0.4)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Shield className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white" data-testid="admin-title">
                Admin Dashboard
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {adminCheck?.isOwner && (
                  <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Owner
                  </Badge>
                )}
                {adminCheck?.isAdmin && !adminCheck?.isOwner && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    Admin
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
              { id: "revenue", label: "Revenue", icon: DollarSign },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className={`rounded-xl whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" 
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                data-testid={`tab-${tab.id}`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Platform Overview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetchStats()}
                  className="text-white/60 hover:text-white"
                  data-testid="refresh-stats"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {statsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      icon={Users}
                      label="Total Users"
                      value={stats.totalUsers}
                      color="blue"
                    />
                    <StatCard
                      icon={Crown}
                      label="Active Subscribers"
                      value={stats.activeSubscribers}
                      color="amber"
                    />
                    <StatCard
                      icon={Package}
                      label="Products"
                      value={stats.totalProducts.toLocaleString()}
                      color="green"
                    />
                    <StatCard
                      icon={UserPlus}
                      label="New This Month"
                      value={stats.newUsersThisMonth}
                      subvalue={`${stats.newUsersToday} today`}
                      color="purple"
                    />
                  </div>

                  <div className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
                    <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      Quick Stats
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Premium Users</span>
                        <span className="text-white font-medium">{stats.premiumUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">Family Users</span>
                        <span className="text-white font-medium">{stats.familyUsers}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/60">New Users This Week</span>
                        <span className="text-white font-medium">{stats.newUsersThisWeek}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === "revenue" && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Revenue Dashboard
              </h2>

              {revenueLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="col-span-2 bg-gradient-to-br from-green-500/20 to-purple-500/20 rounded-2xl p-6 border border-green-500/30"
                    >
                      <p className="text-white/60 text-sm mb-1">Monthly Revenue</p>
                      <p className="text-4xl font-bold text-white" data-testid="monthly-revenue">
                        ${revenue.monthly}
                        <span className="text-lg text-white/40 ml-2">AUD</span>
                      </p>
                      <p className="text-green-400 text-sm mt-2">
                        Projected yearly: ${revenue.yearly}
                      </p>
                    </motion.div>

                    <StatCard
                      icon={Crown}
                      label="Premium Revenue"
                      value={`$${revenue.premiumRevenue}`}
                      subvalue={`${revenue.premiumUsers} users`}
                      color="blue"
                    />
                    <StatCard
                      icon={Users}
                      label="Family Revenue"
                      value={`$${revenue.familyRevenue}`}
                      subvalue={`${revenue.familyUsers} users`}
                      color="purple"
                    />
                  </div>

                  <div className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl p-5 border border-white/5">
                    <h3 className="text-white font-semibold mb-4">Revenue Breakdown</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Premium ($9.99/mo)</span>
                          <span className="text-white">{revenue.premiumUsers} subscribers</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${(revenue.premiumUsers / (revenue.premiumUsers + revenue.familyUsers || 1)) * 100}%` }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60">Family ($19.99/mo)</span>
                          <span className="text-white">{revenue.familyUsers} subscribers</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${(revenue.familyUsers / (revenue.premiumUsers + revenue.familyUsers || 1)) * 100}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  User Management
                </h2>
                {adminCheck?.isOwner && (
                  <Button
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400"
                    data-testid="btn-create-user"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create User
                  </Button>
                )}
              </div>

              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/50">No users found</p>
                </div>
              ) : (
                <div className="bg-zinc-900/70 backdrop-blur-xl rounded-2xl border border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="text-white/60">User</TableHead>
                          <TableHead className="text-white/60">Plan</TableHead>
                          <TableHead className="text-white/60">Role</TableHead>
                          <TableHead className="text-white/60">Joined</TableHead>
                          {adminCheck?.isOwner && (
                            <TableHead className="text-white/60">Actions</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id} className="border-white/5">
                            <TableCell>
                              <div>
                                <p className="text-white font-medium truncate max-w-[200px]">
                                  {user.firstName && user.lastName 
                                    ? `${user.firstName} ${user.lastName}` 
                                    : user.email}
                                </p>
                                <p className="text-white/40 text-xs truncate max-w-[200px]">
                                  {user.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={
                                  user.subscriptionPlan === "family"
                                    ? "border-purple-500/50 text-purple-400"
                                    : user.subscriptionPlan === "premium"
                                    ? "border-purple-500/50 text-purple-400"
                                    : "border-white/20 text-white/60"
                                }
                              >
                                {user.subscriptionPlan || "Free"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.isOwner ? (
                                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                  Owner
                                </Badge>
                              ) : user.isAdmin ? (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                  Admin
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-white/20 text-white/60">
                                  User
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-white/60 text-sm">
                              {user.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "N/A"}
                            </TableCell>
                            {adminCheck?.isOwner && (
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {!user.isOwner && (
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setAdminMutation.mutate({
                                            userId: user.id,
                                            isAdmin: !user.isAdmin,
                                          })
                                        }
                                        className={
                                          user.isAdmin
                                            ? "text-yellow-400 hover:text-yellow-300"
                                            : "text-white/60 hover:text-white"
                                        }
                                      >
                                        {user.isAdmin ? (
                                          <UserX className="w-4 h-4" />
                                        ) : (
                                          <UserCheck className="w-4 h-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          setUserToDelete(user);
                                          setShowDeleteDialog(true);
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-zinc-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Create New User</DialogTitle>
            <DialogDescription className="text-white/60">
              Create a new user account. They will receive login credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                placeholder="user@example.com"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Password</Label>
              <Input
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">First Name</Label>
                <Input
                  value={newUserFirstName}
                  onChange={(e) => setNewUserFirstName(e.target.value)}
                  placeholder="John"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Last Name</Label>
                <Input
                  value={newUserLastName}
                  onChange={(e) => setNewUserLastName(e.target.value)}
                  placeholder="Doe"
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={newUserIsAdmin}
                onCheckedChange={setNewUserIsAdmin}
              />
              <Label className="text-white">Make Admin</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCreateDialog(false)}
              className="text-white/60"
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                createUserMutation.mutate({
                  email: newUserEmail,
                  password: newUserPassword,
                  firstName: newUserFirstName,
                  lastName: newUserLastName,
                  isAdmin: newUserIsAdmin,
                })
              }
              disabled={createUserMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-cyan-500"
            >
              {createUserMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Create User"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-zinc-900 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete {userToDelete?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 text-white border-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => userToDelete && deleteUserMutation.mutate(userToDelete.id)}
              className="bg-red-500 hover:bg-red-600"
            >
              {deleteUserMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
