import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Application, Job, User } from "@/models";

// GET /api/applications - Get applications with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};

    if (userId) {
      // If userId is provided, check if user is requesting their own applications
      // or if they're an employer viewing applications for their jobs
      if (session.user.role === "employer") {
        // Employer can view applications for jobs they created
        const userJobs = await Job.find({ createdBy: session.user.id }).select("_id");
        const jobIds = userJobs.map((job) => job._id);
        filter.jobId = { $in: jobIds };
      } else if (session.user.id !== userId) {
        // Users can only view their own applications
        return NextResponse.json(
          { success: false, error: "Unauthorized to view other users' applications" },
          { status: 403 }
        );
      } else {
        filter.userId = userId;
      }
    } else if (jobId) {
      // If jobId is provided, check if user is the job creator
      const job = await Job.findById(jobId);
      if (!job) {
        return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
      }

      if (session.user.role !== "employer" || job.createdBy.toString() !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized to view applications for this job" },
          { status: 403 }
        );
      }

      filter.jobId = jobId;
    } else {
      // If no specific filters, users can only see their own applications
      if (session.user.role !== "employer") {
        filter.userId = session.user.id;
      } else {
        // Employers can see all applications for their jobs
        const userJobs = await Job.find({ createdBy: session.user.id }).select("_id");
        const jobIds = userJobs.map((job) => job._id);
        filter.jobId = { $in: jobIds };
      }
    }

    if (status) filter.status = status;

    // Get applications with pagination and populate related data
    const applications = await Application.find(filter)
      .populate("jobId", "title company location type")
      .populate("userId", "name email image")
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Application.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

// POST /api/applications - Apply for a job
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Only users (talent) can apply for jobs
    if (session.user.role !== "user") {
      return NextResponse.json(
        { success: false, error: "Only talent can apply for jobs" },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { jobId, coverLetter, resume, experience, skills, expectedSalary, availability } = body;

    // Validate required fields
    if (!jobId) {
      return NextResponse.json({ success: false, error: "Job ID is required" }, { status: 400 });
    }

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ success: false, error: "Job not found" }, { status: 404 });
    }

    if (job.status !== "active") {
      return NextResponse.json({ success: false, error: "Job is not active" }, { status: 400 });
    }

    // Check if user has already applied for this job
    const existingApplication = await Application.findOne({
      jobId,
      userId: session.user.id,
    });

    if (existingApplication) {
      return NextResponse.json(
        { success: false, error: "You have already applied for this job" },
        { status: 400 }
      );
    }

    // Create new application
    const application = new Application({
      jobId,
      userId: session.user.id,
      coverLetter: coverLetter || "",
      resume: resume || "",
      experience: experience || "",
      skills: skills || [],
      expectedSalary: expectedSalary || null,
      availability: availability || "immediate",
    });

    await application.save();

    // Add application to job's applications array
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
    });

    // Populate related data
    await application.populate("jobId", "title company location type");
    await application.populate("userId", "name email image");

    return NextResponse.json({ success: true, data: application }, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create application" },
      { status: 500 }
    );
  }
}
