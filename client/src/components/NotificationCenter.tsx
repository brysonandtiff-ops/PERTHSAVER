import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, DollarSign, FileText, Tag, TrendingDown, Trophy, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  deal: "text-cyan-400",
  system: "text-purple-400",
  achievement: "text-cyan-400",
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<NotificationsResponse>({
    queryKey: ["notifications", { limit: 10 }],
    queryFn: async () => {
      const response = await fetch("/api/notifications?limit=10", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
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

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, notificationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNotificationMutation.mutate(notificationId);
  };

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-white/10 text-white/70 hover:text-white"
          data-testid="notifications-button"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-96 glass-strong border-white/15 p-0"
        data-testid="notifications-dropdown"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Notifications</h3>
          <Link href="/notifications">
            <Button
              variant="link"
              className="h-auto p-0 text-primary hover:text-primary/80 text-sm"
              data-testid="view-all-notifications"
            >
              View All
            </Button>
          </Link>
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="p-8 text-center text-white/60" data-testid="notifications-loading">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-white/60" data-testid="notifications-empty">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Bell;
                const iconColor = notificationColors[notification.type] || "text-white";

                const notificationContent = (
                  <div
                    className={cn(
                      "block p-4 hover:bg-white/5 transition-colors cursor-pointer relative group",
                      !notification.isRead && "border-l-2 border-l-primary bg-white/5"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex gap-3">
                      <div className={cn("mt-0.5", iconColor)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={cn(
                              "text-sm font-medium",
                              !notification.isRead ? "text-white" : "text-white/80"
                            )}
                          >
                            {notification.title}
                          </h4>
                          <button
                            onClick={(e) => handleDelete(e, notification.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-white/80"
                            data-testid={`delete-notification-${notification.id}`}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-white/60 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-white/40">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="absolute right-4 top-4">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                );

                return notification.link ? (
                  <Link key={notification.id} href={notification.link}>
                    {notificationContent}
                  </Link>
                ) : (
                  <div key={notification.id}>{notificationContent}</div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
