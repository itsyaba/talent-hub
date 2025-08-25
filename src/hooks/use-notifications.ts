import { useState, useEffect, useCallback } from "react";
import { useSession } from "./use-session";

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  data?: {
    jobId?: string;
    applicationId?: string;
    userId?: string;
    companyId?: string;
    oldStatus?: string;
    newStatus?: string;
    scheduledDate?: Date;
    messageId?: string;
  };
  isRead: boolean;
  priority: "low" | "medium" | "high" | "urgent";
  category: "job" | "application" | "profile" | "system" | "message";
  createdAt: string;
  expiresAt: string;
}

interface NotificationsData {
  notifications: Notification[];
  unreadCount: number;
  pagination: {
    limit: number;
    skip: number;
    total: number;
  };
}

export function useNotifications() {
  const { data: session } = useSession();
  const [data, setData] = useState<NotificationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(
    async (options?: {
      limit?: number;
      skip?: number;
      unreadOnly?: boolean;
      category?: string;
    }) => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options?.limit) params.append("limit", options.limit.toString());
        if (options?.skip) params.append("skip", options.skip.toString());
        if (options?.unreadOnly) params.append("unreadOnly", "true");
        if (options?.category) params.append("category", options.category);

        const response = await fetch(`/api/notifications?${params.toString()}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch notifications");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [session?.user?.id]
  );

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "markAsRead",
            notificationId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark notification as read");
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              notifications: prev.notifications.map((notification) =>
                notification._id === notificationId
                  ? { ...notification, isRead: true }
                  : notification
              ),
              unreadCount: Math.max(0, prev.unreadCount - 1),
            };
          });
        } else {
          throw new Error(result.error || "Failed to mark notification as read");
        }
      } catch (err) {
        console.error("Error marking notification as read:", err);
        throw err;
      }
    },
    [session?.user?.id]
  );

  const markAllAsRead = useCallback(
    async (category?: string) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch("/api/notifications", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "markAllAsRead",
            category,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to mark all notifications as read");
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setData((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              notifications: prev.notifications.map((notification) => ({
                ...notification,
                isRead: true,
              })),
              unreadCount: 0,
            };
          });
        } else {
          throw new Error(result.error || "Failed to mark all notifications as read");
        }
      } catch (err) {
        console.error("Error marking all notifications as read:", err);
        throw err;
      }
    },
    [session?.user?.id]
  );

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/notifications?id=${notificationId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete notification");
        }

        const result = await response.json();

        if (result.success) {
          // Update local state
          setData((prev) => {
            if (!prev) return prev;
            const notification = prev.notifications.find((n) => n._id === notificationId);
            return {
              ...prev,
              notifications: prev.notifications.filter((n) => n._id !== notificationId),
              unreadCount: notification?.isRead
                ? prev.unreadCount
                : Math.max(0, prev.unreadCount - 1),
            };
          });
        } else {
          throw new Error(result.error || "Failed to delete notification");
        }
      } catch (err) {
        console.error("Error deleting notification:", err);
        throw err;
      }
    },
    [session?.user?.id]
  );

  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Fetch notifications on mount and when session changes
  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications();
    }
  }, [session?.user?.id, fetchNotifications]);

  // Set up polling for new notifications (every 30 seconds)
  useEffect(() => {
    if (session?.user?.id) {
      const interval = setInterval(() => {
        fetchNotifications({ unreadOnly: true });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [session?.user?.id, fetchNotifications]);

  return {
    data,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  };
}
