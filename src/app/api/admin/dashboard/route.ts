import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { User, Job, Application } from "@/models";

// Ensure models are registered
import "@/models";
import getUserSession from "@/hooks/use-get-user-session";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getUserSession();

    console.log("session", session);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    await dbConnect();

    // Get current date and calculate date ranges
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Get last 6 months for trends
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      months.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
      });
    }

    // Fetch basic stats
    const [totalJobs, activeJobs, totalApplications, totalUsers, totalEmployers, totalTalents] =
      await Promise.all([
        Job.countDocuments(),
        Job.countDocuments({ status: "active" }),
        Application.countDocuments(),
        User.countDocuments(),
        User.countDocuments({ role: "employer" }),
        User.countDocuments({ role: "user" }),
      ]);

    // Fetch job trends for last 6 months
    const jobTrends = await Promise.all(
      months.map(async ({ month, startDate, endDate }) => {
        const jobCount = await Job.countDocuments({
          createdAt: { $gte: startDate, $lte: endDate },
        });
        return { month, jobs: jobCount };
      })
    );

    // Fetch application trends for last 6 months
    const applicationTrends = await Promise.all(
      months.map(async ({ month, startDate, endDate }) => {
        const applicationCount = await Application.countDocuments({
          appliedAt: { $gte: startDate, $lte: endDate },
        });
        return { month, applications: applicationCount };
      })
    );

    // Fetch application status breakdown
    let applicationStatusBreakdown = [];
    try {
      applicationStatusBreakdown = await Application.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $sort: { count: -1 },
        },
      ]);
    } catch (error) {
      console.error("Error aggregating application status:", error);
      applicationStatusBreakdown = [];
    }

    // Transform the data to match the chart requirements
    const transformedStatusBreakdown = applicationStatusBreakdown.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1).toLowerCase(),
      value: item.count,
    }));

    // Fetch top companies by job count
    let topCompanies = [];
    try {
      topCompanies = await Job.aggregate([
        {
          $group: {
            _id: "$company.name",
            jobCount: { $sum: 1 },
            industry: { $first: "$company.industry" },
          },
        },
        {
          $sort: { jobCount: -1 },
        },
        {
          $limit: 10,
        },
      ]);
    } catch (error) {
      console.error("Error aggregating top companies:", error);
      topCompanies = [];
    }

    // Transform the data to match the frontend requirements
    const transformedTopCompanies = topCompanies.map((company) => ({
      name: company._id,
      jobCount: company.jobCount,
      industry: company.industry,
    }));

    // Fetch recent jobs
    const recentJobs = await Job.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("title company location status createdAt");

    // Fetch recent applications
    const recentApplications = await Application.find()
      .sort({ appliedAt: -1 })
      .limit(10)
      .populate("jobId", "title company")
      .select("fullName status appliedAt jobId");

    // Get application counts for recent jobs
    let applicationCounts = [];
    try {
      const jobIds = recentJobs.map((job) => job._id);
      if (jobIds.length > 0) {
        applicationCounts = await Application.aggregate([
          {
            $match: { jobId: { $in: jobIds } },
          },
          {
            $group: {
              _id: "$jobId",
              count: { $sum: 1 },
            },
          },
        ]);
      }
    } catch (error) {
      console.error("Error aggregating application counts:", error);
      applicationCounts = [];
    }

    // Create a map of job ID to application count
    const applicationCountMap = new Map();
    applicationCounts.forEach((item) => {
      applicationCountMap.set(item._id.toString(), item.count);
    });

    // Add application counts to jobs
    const jobsWithApplicationCount = recentJobs.map((job) => ({
      ...job.toObject(),
      applications: applicationCountMap.get(job._id.toString()) || 0,
    }));

    return NextResponse.json({
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        totalUsers,
        totalEmployers,
        totalTalents,
      },
      jobTrends,
      applicationTrends,
      applicationStatusBreakdown: transformedStatusBreakdown,
      topCompanies: transformedTopCompanies,
      recentJobs: jobsWithApplicationCount,
      recentApplications,
    });
  } catch (error) {
    console.error("Admin dashboard API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
