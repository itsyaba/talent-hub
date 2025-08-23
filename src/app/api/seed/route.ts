import { NextRequest, NextResponse } from "next/server";
import { seedData, clearSeededData } from "@/lib/seed-data";
import getUserSession from "@/hooks/use-get-user-session";

// POST /api/seed - Seed the database with sample data
export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== "employer") {
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
