import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Application, Job, User } from "@/models";
import { NotificationService } from "@/lib/notification-service";
import getUserSession from "@/hooks/use-get-user-session";

// GET /api/applications - Get applications with optional filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();

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
    const session = await getUserSession();

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

    // Handle FormData for the application
    const formData = await request.formData();
    const jobId = formData.get("jobId") as string;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const location = formData.get("location") as string;
    const experience = formData.get("experience") as string;
    const skills = JSON.parse((formData.get("skills") as string) || "[]");
    const expectedSalary = formData.get("expectedSalary") as string;
    const availability = formData.get("availability") as string;
    const coverLetter = formData.get("coverLetter") as string;
    const resumeData = JSON.parse((formData.get("resume") as string) || "{}");

    console.log("Resume data:", resumeData);

    // Validate required fields
    if (!jobId) {
      return NextResponse.json({ success: false, error: "Job ID is required" }, { status: 400 });
    }

    if (!fullName || !email || !phone || !location || !experience || !coverLetter) {
      return NextResponse.json(
        {
          success: false,
          error: "All required fields must be filled",
        },
        { status: 400 }
      );
    }

    if (!resumeData.url || !resumeData.key || !resumeData.filename) {
      return NextResponse.json(
        {
          success: false,
          error: "Resume file is required and must be a valid file",
        },
        { status: 400 }
      );
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

    // Store resume info from UploadThing
    const resumeInfo = {
      filename: resumeData.filename || "",
      url: resumeData.url || "",
      key: resumeData.key || "",
      size: resumeData.size || 0,
      type: resumeData.type || "",
    };

    console.log("Resume info being stored:", resumeInfo);
    console.log("Skills:", skills);
    console.log("Expected salary:", expectedSalary);

    // Create new application with enhanced data
    const applicationData = {
      jobId,
      userId: session.user.id,
      fullName,
      email,
      phone,
      location,
      experience,
      skills: skills || [],
      expectedSalary:
        expectedSalary && expectedSalary.trim() !== "" ? parseFloat(expectedSalary) : undefined,
      availability: availability || "immediate",
      coverLetter,
      resume: resumeInfo, // Store file info instead of just string
    };

    console.log("Application data being sent to model:", applicationData);
    console.log("Resume field type:", typeof applicationData.resume);
    console.log("Resume field value:", applicationData.resume);

    const application = new Application(applicationData);

    try {
      await application.save();
    } catch (saveError) {
      console.error("Save error details:", saveError);
      if (saveError instanceof Error) {
        console.error("Validation errors:", (saveError as any).errors);
      }
      throw saveError;
    }

    // Add application to job's applications array
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: application._id },
    });

    // Send notification to employer about new application
    try {
      await NotificationService.notifyJobApplicationReceived(
        jobId,
        job.createdBy.toString(),
        application._id.toString(),
        fullName,
        job.title
      );
    } catch (notificationError) {
      console.error("Error sending application notification:", notificationError);
      // Don't fail the application creation if notification fails
    }

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
