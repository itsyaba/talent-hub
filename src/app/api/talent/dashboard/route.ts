import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import dbConnect from "@/lib/db";
import { Application, Job, User } from "@/models";
import mongoose from "mongoose";
import getUserSession from "@/hooks/use-get-user-session";

export async function GET(request: NextRequest) {
  try {
    const session = await getUserSession();

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Only talent users can access this endpoint
    if (session.user.role !== "user") {
      return NextResponse.json(
        { success: false, error: "Only talent can access this endpoint" },
        { status: 403 }
      );
    }

    await dbConnect();

    const userId = session.user.id;

    // Get application statistics
    const totalApplications = await Application.countDocuments({ userId });

    // Get applications by status
    const applicationsByStatus = await Application.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get recent applications with job details
    const recentApplications = await Application.find({ userId })
      .populate("jobId", "title company location type salary status")
      .sort({ appliedAt: -1 })
      .limit(5)
      .lean();

    const recommendedJobs = await Job.find({
      status: "active",
    })
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const profileViews = 0;

    const rating = 0;

    // Get monthly application trends
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyApplications = await Application.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          appliedAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$appliedAt" },
            month: { $month: "$appliedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const monthlyData = monthlyApplications.map((item) => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`,
      count: item.count,
    }));

    // Get current month vs previous month comparison
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthApplications = await Application.countDocuments({
      userId,
      appliedAt: {
        $gte: new Date(currentYear, currentMonth, 1),
        $lt: new Date(currentYear, currentMonth + 1, 1),
      },
    });

    const previousMonthApplications = await Application.countDocuments({
      userId,
      appliedAt: {
        $gte: new Date(currentYear, currentMonth - 1, 1),
        $lt: new Date(currentYear, currentMonth, 1),
      },
    });

    const applicationsChange =
      previousMonthApplications > 0
        ? ((currentMonthApplications - previousMonthApplications) / previousMonthApplications) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalApplications,
          currentMonthApplications,
          applicationsChange: Math.round(applicationsChange),
          profileViews,
          rating,
        },
        applicationsByStatus,
        recentApplications,
        recommendedJobs,
        monthlyData,
      },
    });
  } catch (error) {
    console.error("Error fetching talent dashboard data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
