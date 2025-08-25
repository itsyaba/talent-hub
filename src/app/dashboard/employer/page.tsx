// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { useEmployerDashboard } from "@/hooks/use-employer-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CompanyProfileModal from "@/components/CompanyProfileModal";
import ApplicationDetailModal from "@/components/ApplicationDetailModal";
import {
  Briefcase,
  Users,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  Plus,
  Eye,
  MessageSquare,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function EmployerDashboard() {
  const { data: session, isPending: loading } = useSession();
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refreshData,
  } = useEmployerDashboard();
  const router = useRouter();
  const [showCompanyProfileModal, setShowCompanyProfileModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.push("/login");
      toast.error("Please login to access your dashboard");
      return;
    }

    // Check if user has completed onboarding and is an employer
    if (!session.user.role || session.user.role === "user") {
      if (session.user.role === "user") {
        router.push("/dashboard/talent");
      } else {
        router.push("/onboarding");
      }
      return;
    }
  }, [session, loading, router]);

  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update application status");
      }

      // Refresh dashboard data to show updated status
      refreshData();
    } catch (error) {
      console.error("Error updating application status:", error);
      throw error;
    }
  };

  // Show loading while checking session
  if (loading || !session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome to Your Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Find top talent and manage your hiring process
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/dashboard/employer/post-job")}
              size="sm"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
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
            <Button
              onClick={async () => {
                try {
                  const response = await fetch("/api/seed", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "seed" }),
                  });
                  if (response.ok) {
                    toast.success("Sample data added successfully!");
                    refreshData();
                  } else {
                    toast.error("Failed to add sample data");
                  }
                } catch (error) {
                  toast.error("Error adding sample data");
                }
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              🌱 Seed Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? "..." : dashboardData?.stats.activeJobs || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.jobs.total || 0} total jobs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? "..." : dashboardData?.stats.totalApplications || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.trends.applicationTrend && dashboardData.trends.applicationTrend > 0
                  ? "+"
                  : ""}
                {dashboardData?.trends.applicationTrend || 0}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shortlisted</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? "..." : dashboardData?.stats.shortlisted || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.stats.interviews || 0} interviews scheduled
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardLoading ? "..." : dashboardData?.stats.hired || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardData?.stats.rejected || 0} rejected
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Recent Applications
              </CardTitle>
              <CardDescription>Latest applications for your job postings</CardDescription>
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
              ) : dashboardData?.applications.recent &&
                dashboardData.applications.recent.length > 0 ? (
                dashboardData.applications.recent.map((application) => (
                  <div
                    key={application._id}
                    className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {application.userId.name}
                      </h3>
                      <Badge
                        variant={
                          application.status === "shortlisted"
                            ? "default"
                            : application.status === "interviewed"
                            ? "secondary"
                            : application.status === "hired"
                            ? "default"
                            : "outline"
                        }
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                      {application.jobId.title}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {application.experience && (
                        <>
                          <span>{application.experience} experience</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{application.jobId.company.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowApplicationModal(true);
                        }}
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Message
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No applications yet</p>
                  <p className="text-sm">Applications will appear here once candidates apply</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Company Profile Section */}
        <Card className="pt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Company Profile
            </CardTitle>
            <CardDescription>
              Keep your company information up to date to attract better candidates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company Name
                  </label>
                  <p className="text-slate-900 dark:text-white">{session.user.name || "Not set"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Industry
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {session.user.companyProfile?.industry || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company Size
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {session.user.companyProfile?.size || "Not specified"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Location
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {session.user.companyProfile?.location || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Website
                  </label>
                  <p className="text-slate-900 dark:text-white">
                    {session.user.companyProfile?.website || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Active Jobs
                  </label>
                  <p className="text-slate-900 dark:text-slate-400">
                    {dashboardData?.stats.activeJobs || 0} jobs posted
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCompanyProfileModal(true)}
                className="flex items-center gap-2"
              >
                <Building className="w-4 h-4" />
                Edit Company Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <ApplicationDetailModal
            isOpen={showApplicationModal}
            onClose={() => {
              setShowApplicationModal(false);
              setSelectedApplication(null);
            }}
            application={selectedApplication}
            onStatusUpdate={handleApplicationStatusUpdate}
          />
        )}

        {/* Company Profile Edit Modal */}
        <CompanyProfileModal
          isOpen={showCompanyProfileModal}
          onClose={() => setShowCompanyProfileModal(false)}
          currentProfile={{
            name: session.user.name || "",
            industry: session.user.companyProfile?.industry || "",
            size: session.user.companyProfile?.size || "",
            website: session.user.companyProfile?.website || "",
            location: session.user.companyProfile?.location || "",
          }}
          onSave={async (profile) => {
            try {
              const response = await fetch("/api/employer/company-profile", {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(profile),
              });

              if (response.ok) {
                // Refresh dashboard data to show updated company profile
                refreshData();
              } else {
                const error = await response.json();
                throw new Error(error.error || "Failed to update company profile");
              }
            } catch (error) {
              console.error("Error updating company profile:", error);
              throw error;
            }
          }}
        />
      </div>
    </div>
  );
}
