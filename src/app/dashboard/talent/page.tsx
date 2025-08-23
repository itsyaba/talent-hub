"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, User, Building, MapPin, Calendar, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function TalentDashboard() {
  const { data: session, isPending: loading } = useSession();
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
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">+1 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">+12 from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">+0.2 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Job Recommendations */}
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
              {[
                {
                  title: "Senior Frontend Developer",
                  company: "TechCorp Inc.",
                  location: "San Francisco, CA",
                  type: "Full-time",
                  salary: "$120k - $150k",
                },
                {
                  title: "React Native Developer",
                  company: "MobileApps Ltd.",
                  location: "Remote",
                  type: "Contract",
                  salary: "$80k - $100k",
                },
                {
                  title: "UI/UX Designer",
                  company: "Design Studio",
                  location: "New York, NY",
                  type: "Full-time",
                  salary: "$90k - $120k",
                },
              ].map((job, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{job.title}</h3>
                    <Badge variant="secondary">{job.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <Building className="h-4 w-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                    <MapPin className="h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="text-sm font-medium text-green-600">{job.salary}</div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-green-600" />
                Jobs Applied For
              </CardTitle>
              <CardDescription>Track your job applications and their status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* This will be populated with real data from API */}
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No applications yet</p>
                <p className="text-sm">Start applying to jobs to see them here</p>
                <Button className="mt-4" onClick={() => router.push("/jobs")}>
                  Browse Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
