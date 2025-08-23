import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Job, User } from "@/models";

// Ensure models are registered
import "@/models";

// GET /api/jobs - Get all jobs with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const location = searchParams.get("location");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (search) {
      filter.$text = { $search: search };
    }

    // Get jobs with pagination
    const jobs = await Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job (employer only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, error: "Only employers can create jobs" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      title,
      description,
      requirements,
      location,
      type,
      salary,
      company,
      tags,
      experienceLevel,
    } = body;

    // Validate required fields
    if (!title || !description || !location) {
      return NextResponse.json(
        { success: false, error: "Title, description, and location are required" },
        { status: 400 }
      );
    }

    // Create new job
    const job = new Job({
      title,
      description,
      requirements: requirements || [],
      location,
      type: type || "full-time",
      salary: salary || {},
      company: {
        name: company?.name || session.user.name,
        industry: company?.industry || "",
        size: company?.size || "",
        website: company?.website || "",
        location: company?.location || "",
      },
      tags: tags || [],
      experienceLevel: experienceLevel || "mid",
      createdBy: session.user.id,
    });

    await job.save();

    // Return the job without populating to avoid the error
    // The frontend can fetch user details separately if needed
    return NextResponse.json({ success: true, data: job }, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ success: false, error: "Failed to create job" }, { status: 500 });
  }
}
