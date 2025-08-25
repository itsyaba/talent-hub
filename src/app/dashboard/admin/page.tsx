"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Users,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const { data: session, isPending: loading } = useSession();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.push("/login");
      toast.error("Please login to access your dashboard");
      return;
    }

    // Check if user has admin role
    if (!session.user.role || session.user.role !== "admin") {
      if (session.user.role === "employer") {
        router.push("/dashboard/employer");
      } else if (session.user.role === "user") {
        router.push("/dashboard/talent");
      } else {
        router.push("/onboarding");
      }
      return;
    }

    // Fetch admin dashboard data
    fetchAdminDashboardData();
  }, [session, loading, router]);

  const fetchAdminDashboardData = async () => {
    try {
      setDashboardLoading(true);
      const response = await fetch("/api/admin/dashboard");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      setDashboardError(error instanceof Error ? error.message : "Failed to load dashboard");
    } finally {
      setDashboardLoading(false);
    }
  };

  const refreshData = () => {
    fetchAdminDashboardData();
  };

  // Show loading while checking session
  if (loading || !session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error state if dashboard data fails to load
  if (dashboardError && !dashboardLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Error Loading Dashboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{dashboardError}</p>
            <Button onClick={refreshData} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    totalUsers: 0,
    totalEmployers: 0,
    totalTalents: 0,
  };

  const jobTrends = dashboardData?.jobTrends || [];
  const applicationTrends = dashboardData?.applicationTrends || [];
  const applicationStatusBreakdown = dashboardData?.applicationStatusBreakdown || [];
  const topCompanies = dashboardData?.topCompanies || [];
  const recentJobs = dashboardData?.recentJobs || [];
  const recentApplications = dashboardData?.recentApplications || [];

  // Handle empty data states
  const hasData = dashboardData && !dashboardLoading;
  const hasJobs = hasData && jobTrends.length > 0;
  const hasApplications = hasData && applicationTrends.length > 0;
  const hasStatusData = hasData && applicationStatusBreakdown.length > 0;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Monitor and analyze platform performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              disabled={dashboardLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${dashboardLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardLoading ? "..." : stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">{stats.activeJobs} active jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? "..." : stats.totalApplications}
              </div>
              <p className="text-xs text-muted-foreground">Across all jobs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? "..." : stats.totalUsers}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalEmployers} employers, {stats.totalTalents} talents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Platform Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardLoading ? "..." : "Active"}</div>
              <p className="text-xs text-muted-foreground">Platform is running</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Posting Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Job Posting Trends
                  </CardTitle>
                  <CardDescription>Monthly job posting activity</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-slate-500">Loading...</div>
                    </div>
                  ) : !hasJobs ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-slate-500">No job data available</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={jobTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="jobs"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Application Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    Application Trends
                  </CardTitle>
                  <CardDescription>Monthly application submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardLoading ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-slate-500">Loading...</div>
                    </div>
                  ) : !hasApplications ? (
                    <div className="h-[300px] flex items-center justify-center">
                      <div className="text-slate-500">No application data available</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={applicationTrends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="applications"
                          stackId="1"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Application Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-purple-600" />
                  Application Status Breakdown
                </CardTitle>
                <CardDescription>Distribution of applications by status</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-slate-500">Loading...</div>
                  </div>
                ) : !hasStatusData ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-slate-500">No status data available</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Pie
                          data={applicationStatusBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${((percent || 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {applicationStatusBreakdown.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  Recent Job Postings
                </CardTitle>
                <CardDescription>Latest jobs posted on the platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : recentJobs.length > 0 ? (
                  recentJobs.map((job: any) => (
                    <div
                      key={job._id}
                      className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {job.title}
                        </h3>
                        <Badge variant={job.status === "active" ? "default" : "secondary"}>
                          {job.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <Building className="h-4 w-4" />
                        {job.company.name}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                        <Calendar className="h-4 w-4" />
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Applications: {job.applications || 0}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No jobs posted yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Recent Applications
                </CardTitle>
                <CardDescription>Latest job applications submitted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dashboardLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                      </div>
                    ))}
                  </div>
                ) : recentApplications.length > 0 ? (
                  recentApplications.map((application: any) => (
                    <div
                      key={application._id}
                      className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {application.fullName}
                        </h3>
                        <Badge
                          variant={
                            application.status === "hired"
                              ? "default"
                              : application.status === "shortlisted"
                              ? "secondary"
                              : application.status === "rejected"
                              ? "destructive"
                              : "outline"
                          }
                        >
                          {application.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Job: {application.jobId?.title || "Unknown Job"}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Company: {application.jobId?.company?.name || "Unknown Company"}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        Applied: {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No applications yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="companies" className="space-y-6">
            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  Top Companies by Job Postings
                </CardTitle>
                <CardDescription>Companies with the most active job postings</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg animate-pulse"
                      >
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : topCompanies.length > 0 ? (
                  <div className="space-y-4">
                    {topCompanies.map((company: any, index: number) => (
                      <div
                        key={company._id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white">
                              {company.name}
                            </h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {company.industry || "Unknown Industry"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-slate-900 dark:text-white">
                            {company.jobCount}
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">jobs</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Building className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No company data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
