import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Application, Job } from "@/models";

// PATCH /api/applications/[id] - Update application status
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, error: "Only employers can update application status" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();
    const { status, interviewNotes } = body;

    // Validate status
    const validStatuses = ["applied", "shortlisted", "interviewed", "rejected", "hired"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    // Find the application
    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    // Check if the employer owns the job for this application
    const job = await Job.findById(application.jobId);
    if (!job || job.createdBy.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to update this application" },
        { status: 403 }
      );
    }

    // Update the application
    const updateData: any = {};
    if (status) updateData.status = status;
    if (interviewNotes !== undefined) updateData.interviewNotes = interviewNotes;
    updateData.updatedAt = new Date();

    const updatedApplication = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate([
      { path: "jobId", select: "title company location type" },
      { path: "userId", select: "name email image" },
    ]);

    return NextResponse.json({
      success: true,
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update application" },
      { status: 500 }
    );
  }
}

// GET /api/applications/[id] - Get application details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;

    // Find the application
    const application = await Application.findById(id).populate([
      { path: "jobId", select: "title company location type requirements" },
      { path: "userId", select: "name email image" },
    ]);

    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    // Check if user has permission to view this application
    if (session.user.role === "employer") {
      // Employer can view applications for jobs they created
      const job = await Job.findById(application.jobId);
      if (!job || job.createdBy.toString() !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized to view this application" },
          { status: 403 }
        );
      }
    } else if (session.user.role === "user") {
      // Users can only view their own applications
      if (application.userId._id.toString() !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Unauthorized to view this application" },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: application,
    });
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}
