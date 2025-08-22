"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { toast } from "sonner";

export default function EmployerDashboard() {
  const { data: session, isPending: loading } = useSession();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Find top talent and manage your hiring process
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+23 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+5 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications and Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Recent Applications
              </CardTitle>
              <CardDescription>Latest applications for your job postings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  name: "Sarah Johnson",
                  position: "Senior Frontend Developer",
                  experience: "5 years",
                  location: "San Francisco, CA",
                  status: "Under Review",
                },
                {
                  name: "Michael Chen",
                  position: "React Native Developer",
                  experience: "3 years",
                  location: "Remote",
                  status: "Interview Scheduled",
                },
                {
                  name: "Emily Rodriguez",
                  position: "UI/UX Designer",
                  experience: "4 years",
                  location: "New York, NY",
                  status: "Shortlisted",
                },
              ].map((application, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {application.name}
                    </h3>
                    <Badge
                      variant={
                        application.status === "Shortlisted"
                          ? "default"
                          : application.status === "Interview Scheduled"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {application.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                    {application.position}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span>{application.experience} experience</span>
                    <span>•</span>
                    <span>{application.location}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="mr-1 h-3 w-3" />
                      View Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your hiring process efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Post New Job
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Briefcase className="mr-2 h-4 w-4" />
                Manage Jobs
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View All Applications
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Interviews
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                Analytics Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Company Profile Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Company Profile</CardTitle>
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
                  <p className="text-slate-900 dark:text-white">TechCorp Inc.</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Industry
                  </label>
                  <p className="text-slate-900 dark:text-white">Technology</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Company Size
                  </label>
                  <p className="text-slate-900 dark:text-white">100-500 employees</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Location
                  </label>
                  <p className="text-slate-900 dark:text-white">San Francisco, CA</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Website
                  </label>
                  <p className="text-slate-900 dark:text-white">www.techcorp.com</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Founded
                  </label>
                  <p className="text-slate-900 dark:text-white">2018</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline">Edit Company Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
