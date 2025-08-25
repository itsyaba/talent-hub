import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { User } from "@/models";
import { NotificationService } from "@/lib/notification-service";

// Ensure models are registered
import "@/models";

// PATCH /api/employer/company-profile - Update company profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, error: "Only employers can update company profile" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { name, industry, size, website, location } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Company name is required" },
        { status: 400 }
      );
    }

    // Update user profile with company information
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        name: name.trim(),
        companyProfile: {
          industry: industry?.trim() || "",
          size: size || "",
          website: website?.trim() || "",
          location: location?.trim() || "",
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Send notification about profile update
    try {
      await NotificationService.notifyProfileUpdated(session.user.id, "company_profile");
    } catch (notificationError) {
      console.error("Error sending profile update notification:", notificationError);
      // Don't fail the profile update if notification fails
    }

    return NextResponse.json({
      success: true,
      data: {
        name: updatedUser.name,
        companyProfile: updatedUser.companyProfile,
      },
    });
  } catch (error) {
    console.error("Error updating company profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update company profile" },
      { status: 500 }
    );
  }
}

// GET /api/employer/company-profile - Get company profile
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, error: "Only employers can access company profile" },
        { status: 403 }
      );
    }

    await dbConnect();

    const user = await User.findById(session.user.id).select("name companyProfile");

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        companyProfile: user.companyProfile || {},
      },
    });
  } catch (error) {
    console.error("Error fetching company profile:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch company profile" },
      { status: 500 }
    );
  }
}
