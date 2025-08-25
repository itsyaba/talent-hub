import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { NotificationService } from "@/lib/notification-service";

// GET /api/notifications - Get user notifications
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const category = searchParams.get("category") || undefined;

    const notifications = await NotificationService.getUserNotifications(session.user.id, {
      limit,
      skip,
      unreadOnly,
      category,
    });

    const unreadCount = await NotificationService.getUnreadCount(session.user.id);

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: {
          limit,
          skip,
          total: notifications.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, notificationId, category } = body;

    if (action === "markAsRead" && notificationId) {
      const notification = await NotificationService.markAsRead(notificationId, session.user.id);
      return NextResponse.json({
        success: true,
        data: notification,
      });
    }

    if (action === "markAllAsRead") {
      const result = await NotificationService.markAllAsRead(session.user.id, category);
      return NextResponse.json({
        success: true,
        data: { modifiedCount: result.modifiedCount },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update notifications" },
      { status: 500 }
    );
  }
}

// DELETE /api/notifications - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const result = await NotificationService.deleteNotification(notificationId, session.user.id);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Notification not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
