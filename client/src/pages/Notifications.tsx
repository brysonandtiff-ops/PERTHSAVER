import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/api";
import { AuthRequired } from "@/components/AuthRequired";
import { PageLoader } from "@/components/PageLoader";
import {
  Bell,
  DollarSign,
  FileText,
  Tag,
  TrendingDown,
  Trophy,
  Trash2,
  CheckCheck,
  Filter,
} from "lucide-react";
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

const notificationIcons: Record<string, any> = {
  price_alert: TrendingDown,
  bill_reminder: FileText,
  deal: Tag,
  system: Bell,
  achievement: Trophy,
};

const notificationColors: Record<string, string> = {
  price_alert: "text-green-400",
  bill_reminder: "text-purple-400",
  deal: "text-teal-400",
  system: "text-purple-400",
  achievement: "text-cyan-400",
};

const categoryLabels: Record<string, string> = {
  all: "All Notifications",
  price_alert: "Price Alerts",
  bill_reminder: "Bill Reminders",
  deal: "Deals",
  system: "System",
  achievement: "Achievements",
};

function groupNotificationsByDate(notifications: Notification[]) {
  const groups: Record<string, Notification[]> = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  notifications.forEach((notification) => {
    const date = parseISO(notification.createdAt);
    if (isToday(date)) {
      groups.today.push(notification);
    } else if (isYesterday(date)) {
      groups.yesterday.push(notification);
    } else if (isThisWeek(date, { weekStartsOn: 1 })) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
}

export default function Notifications() {
  const { data: user, isLoading: authLoading } = useAuth();
  const [activeCategory, setActiveCategory] = useState("all");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    refetchInterval: 30000,
    enabled: !!user,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to mark as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to mark all as read");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete notification");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification deleted");
    },
  });

  if (authLoading) return <PageLoader />;
  if (!user) return <AuthRequired />;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  const handleMarkAllRead = () => {
    markAllAsReadMutation.mutate();
  };

  const allNotifications = data?.notifications || [];
  const filteredNotifications =
    activeCategory === "all"
      ? allNotifications
      : allNotifications.filter((n) => n.type === activeCategory);

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);
  const unreadCount = data?.unreadCount || 0;

  const renderNotificationGroup = (
    title: string,
    notifications: Notification[],
    testId: string
  ) => {
    if (notifications.length === 0) return null;

    return (
      <div className="mb-8" data-testid={testId}>
        <h3 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wider">
          {title}
        </h3>
        <div className="space-y-2">
          {notifications.map((notification) => {
            const Icon = notificationIcons[notification.type] || Bell;
            const iconColor = notificationColors[notification.type] || "text-white";

            const cardContent = (
              <Card
                className={cn(
                  "glass-card p-4 hover:bg-white/10 transition-all cursor-pointer group",
                  !notification.isRead && "border-l-4 border-l-primary"
                )}
                onClick={() => handleNotificationClick(notification)}
                data-testid={`notification-${notification.id}`}
              >
                <div className="flex gap-4">
                  <div className={cn("mt-0.5 flex-shrink-0", iconColor)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4
                          className={cn(
                            "text-base font-semibold mb-1",
                            !notification.isRead ? "text-white" : "text-white/80"
                          )}
                        >
                          {notification.title}
                        </h4>
                        <p className="text-sm text-white/70">{notification.message}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(e, notification.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white hover:bg-white/10"
                        data-testid={`delete-notification-${notification.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      <span>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {!notification.isRead && (
                        <span className="flex items-center gap-1 text-primary">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Unread
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );

            return notification.link ? (
              <Link key={notification.id} href={notification.link}>
                {cardContent}
              </Link>
            ) : (
              <div key={notification.id}>{cardContent}</div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2" data-testid="notifications-title">
              Notifications
            </h1>
            <p className="text-xs sm:text-sm text-white/60">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              className="gap-2"
              data-testid="mark-all-read-button"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All as Read
            </Button>
          )}
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="glass-card border-white/10 w-full justify-start flex-wrap h-auto gap-2 p-2">
            <TabsTrigger value="all" data-testid="filter-all">
              All
            </TabsTrigger>
            <TabsTrigger value="price_alert" data-testid="filter-price-alert">
              Price Alerts
            </TabsTrigger>
            <TabsTrigger value="bill_reminder" data-testid="filter-bill-reminder">
              Bill Reminders
            </TabsTrigger>
            <TabsTrigger value="deal" data-testid="filter-deal">
              Deals
            </TabsTrigger>
            <TabsTrigger value="system" data-testid="filter-system">
              System
            </TabsTrigger>
            <TabsTrigger value="achievement" data-testid="filter-achievement">
              Achievements
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <Card className="glass-card p-12 text-center" data-testid="notifications-loading">
            <Bell className="h-16 w-16 mx-auto mb-4 text-white/30 animate-pulse" />
            <p className="text-white/60">Loading notifications...</p>
          </Card>
        ) : filteredNotifications.length === 0 ? (
          <Card className="glass-card p-12 text-center" data-testid="notifications-empty">
            <Bell className="h-16 w-16 mx-auto mb-4 text-white/30" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-white/60">
              {activeCategory === "all"
                ? "You don't have any notifications yet"
                : `No ${categoryLabels[activeCategory]?.toLowerCase() || "notifications"} at the moment`}
            </p>
          </Card>
        ) : (
          <div>
            {renderNotificationGroup("Today", groupedNotifications.today, "notifications-today")}
            {renderNotificationGroup(
              "Yesterday",
              groupedNotifications.yesterday,
              "notifications-yesterday"
            )}
            {renderNotificationGroup(
              "This Week",
              groupedNotifications.thisWeek,
              "notifications-thisweek"
            )}
            {renderNotificationGroup("Older", groupedNotifications.older, "notifications-older")}
          </div>
        )}
      </div>
    </div>
  );
}
