import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Job } from "@/models";

// Ensure models are registered
import "@/models";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const { id } = await params;

    const job = await Job.findById(id).populate("createdBy", "name email").lean();

    if (!job) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
