import { NextRequest, NextResponse } from "next/server";
import { seedData, clearSeededData } from "@/lib/seed-data";
import { auth } from "@/lib/auth/auth";

// Ensure models are registered
import "@/models";
import dbConnect from "@/lib/db";

// GET /api/seed - Seed the database with sample data (development only)
export async function GET() {
  try {
    // Only allow in development environment
    // if (process.env.NODE_ENV === "production") {
    //   return NextResponse.json(
    //     { success: false, error: "Not available in production" },
    //     { status: 403 }
    //   );
    // }

    await dbConnect();

    // Seed the data with a default employer ID (for development)
    const result = await seedData("development");

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.jobs,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json({ success: false, error: "Failed to seed data" }, { status: 500 });
  }
}

// POST /api/seed - Seed the database with sample data (authenticated)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if ((session.user as any).role !== "employer") {
      return NextResponse.json(
        { success: false, error: "Only employers can seed data" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === "clear") {
      await clearSeededData();
      return NextResponse.json({
        success: true,
        message: "Seeded data cleared successfully",
      });
    }

    // Seed the data
    const result = await seedData(session.user.id);

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.jobs,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json({ success: false, error: "Failed to seed data" }, { status: 500 });
  }
}
