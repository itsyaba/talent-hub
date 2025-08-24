"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useTalentDashboard } from "@/hooks/use-talent-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  User,
  Building,
  MapPin,
  Calendar,
  Star,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function TalentDashboard() {
  const { data: session, isPending: loading } = useSession();
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch,
  } = useTalentDashboard();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      toast.error("Please login to access your dashboard");
      router.push("/login");
      return;
    }

    // Check if user has completed onboarding and is a talent
    if (!session.user.role || session.user.role === "employer") {
      if (session.user.role === "employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/onboarding");
      }
      return;
    }
  }, [session, loading, router]);

  // Show loading while checking session
  if (loading || !session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show dashboard loading
  if (dashboardLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to Your Talent Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Loading your data...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (dashboardError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to Your Talent Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find your next opportunity and grow your career
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">{dashboardError}</p>
                <Button onClick={refetch}>Try Again</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalApplications: 0,
    currentMonthApplications: 0,
    applicationsChange: 0,
    profileViews: 0,
    rating: 0,
  };

  const recentApplications = dashboardData?.recentApplications || [];
  const recommendedJobs = dashboardData?.recommendedJobs || [];

  const formatSalary = (salary?: { min?: number; max?: number; currency: string }) => {
    if (!salary) return "Not specified";
    if (salary.min && salary.max) {
      return `${salary.currency}${salary.min.toLocaleString()}k - ${
        salary.currency
      }${salary.max.toLocaleString()}k`;
    }
    if (salary.min) return `${salary.currency}${salary.min.toLocaleString()}k+`;
    if (salary.max) return `Up to ${salary.currency}${salary.max.toLocaleString()}k`;
    return "Not specified";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "shortlisted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "interviewed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Your Talent Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Find your next opportunity and grow your career
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalApplications}</div>
              <p className="text-xs text-muted-foreground">
                {stats.applicationsChange >= 0 ? "+" : ""}
                {stats.applicationsChange}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.currentMonthApplications}</div>
              <p className="text-xs text-muted-foreground">Applications this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <p className="text-xs text-muted-foreground">Employers viewed your profile</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating || "N/A"}</div>
              <p className="text-xs text-muted-foreground">Your profile rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Recommendations and Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Recommended Jobs
              </CardTitle>
              <CardDescription>Jobs that match your profile and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedJobs.length > 0 ? (
                recommendedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                      <Badge variant="secondary">{job.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <Building className="h-4 w-4" />
                      {job.company.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="text-sm font-medium text-green-600">
                      {formatSalary(job.salary)}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/jobs/${job._id}`)}
                      >
                        View Details
                      </Button>
                      <Button size="sm" onClick={() => router.push(`/jobs/${job._id}`)}>
                        Apply Now
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No recommended jobs yet</p>
                  <p className="text-sm">Browse available jobs to see recommendations</p>
                  <Button className="mt-4" onClick={() => router.push("/jobs")}>
                    Browse Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Recent Applications
              </CardTitle>
              <CardDescription>Track your recent job applications and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentApplications.length > 0 ? (
                recentApplications.map((application) => (
                  <div
                    key={application._id}
                    className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {application.jobId.title}
                      </h3>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <Building className="h-4 w-4" />
                      {application.jobId.company.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                      <MapPin className="h-4 w-4" />
                      {application.jobId.location}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Applied: {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                    <div className="mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/jobs/${application.jobId._id}`)}
                      >
                        View Job
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No applications yet</p>
                  <p className="text-sm">Start applying to jobs to see them here</p>
                  <Button className="mt-4" onClick={() => router.push("/jobs")}>
                    Browse Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
