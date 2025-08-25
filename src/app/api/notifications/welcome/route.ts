import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { NotificationService } from "@/lib/notification-service";

// POST /api/notifications/welcome - Send welcome notification to user
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Send welcome notification
    const notification = await NotificationService.notifyWelcome(
      session.user.id,
      session.user.name || "there"
    );

    return NextResponse.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error sending welcome notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send welcome notification" },
      { status: 500 }
    );
  }
}
