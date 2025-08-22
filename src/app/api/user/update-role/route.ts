import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import getUserSession from "@/hooks/use-get-user-session";

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - Please log in" }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    // Get request body
    const { role } = await request.json();

    // Validate role
    if (!role || !["user", "employer"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be 'user' or 'employer'" },
        { status: 400 }
      );
    }

    // Update user role in database
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        role: role,
        onboardingCompleted: true,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Role updated successfully to ${role}`,
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        onboardingCompleted: updatedUser.onboardingCompleted,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
