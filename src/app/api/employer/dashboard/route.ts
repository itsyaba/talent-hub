import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Job, Application } from "@/models";
import getUserSession from "@/hooks/use-get-user-session";

// GET /api/employer/dashboard - Get employer dashboard data
export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is an employer
    if (session.user.role !== "employer") {
      return NextResponse.json(
        { success: false, error: "Only employers can access this endpoint" },
        { status: 403 }
      );
    }

    await dbConnect();

    const employerId = session.user.id;

    // Get all jobs created by the employer
    const jobs = await Job.find({ createdBy: employerId })
      .populate("applications")
      .sort({ createdAt: -1 })
      .lean();

    // Get all applications for the employer's jobs
    const applications = await Application.find({
      jobId: { $in: jobs.map((job) => job._id) },
    })
      .populate("jobId", "title company location type")
      .populate("userId", "name email image")
      .select(
        "_id status appliedAt fullName email phone location experience skills expectedSalary availability coverLetter resume jobId userId"
      )
      .sort({ appliedAt: -1 })
      .lean();

    // Calculate statistics
    const activeJobs = jobs.filter((job) => job.status === "active").length;
    const totalApplications = applications.length;

    // Count applications by status
    const applicationsByStatus = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get recent applications (last 5)
    const recentApplications = applications.slice(0, 5);

    // Get job statistics
    const jobsByStatus = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate monthly trends (simplified - you can enhance this)
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthApplications = applications.filter((app) => {
      const appDate = new Date(app.appliedAt);
      return appDate.getMonth() === currentMonth && appDate.getFullYear() === currentYear;
    }).length;

    const lastMonthApplications = applications.filter((app) => {
      const appDate = new Date(app.appliedAt);
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      return appDate.getMonth() === lastMonth && appDate.getFullYear() === lastMonthYear;
    }).length;

    const applicationTrend =
      lastMonthApplications > 0
        ? (((thisMonthApplications - lastMonthApplications) / lastMonthApplications) * 100).toFixed(
            1
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          activeJobs,
          totalApplications,
          interviews: applicationsByStatus.interviewed || 0,
          hired: applicationsByStatus.hired || 0,
          shortlisted: applicationsByStatus.shortlisted || 0,
          rejected: applicationsByStatus.rejected || 0,
        },
        trends: {
          applicationsThisMonth: thisMonthApplications,
          applicationsLastMonth: lastMonthApplications,
          applicationTrend: parseFloat(applicationTrend),
        },
        jobs: {
          total: jobs.length,
          byStatus: jobsByStatus,
          recent: jobs.slice(0, 5),
        },
        applications: {
          total: totalApplications,
          byStatus: applicationsByStatus,
          recent: recentApplications,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching employer dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
