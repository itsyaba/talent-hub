"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Building2,
  ArrowRight,
  Sparkles,
  Briefcase,
  Users,
  CheckCircle,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import {
  IconBuildingBurjAlArab,
  IconSparkles,
  IconStar,
  IconStarFilled,
  IconUserBolt,
} from "@tabler/icons-react";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";

export default function OnboardingPage() {
  const router = useRouter();
  const { isChecking } = useOnboardingGuard();
  const [selectedRole, setSelectedRole] = useState<"user" | "employer" | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = async (role: "user" | "employer") => {
    setSelectedRole(role);
    setLoading(true);

    try {
      // Make API call to update user role
      const response = await axios.post("/api/user/update-role", {
        role: role,
      });

      if (response.data.success) {
        toast.success(
          `Welcome! You've chosen to continue as a ${role === "user" ? "talent" : "employer"}`
        );

        // Redirect based on role
        if (role === "user") {
          router.push("/dashboard/talent");
        } else {
          router.push("/dashboard/employer");
        }
      } else {
        throw new Error(response.data.error || "Failed to update role");
      }
    } catch (error: any) {
      console.error("Error updating role:", error);

      if (error.response?.status === 401) {
        toast.error("Please log in to continue");
        router.push("/login");
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

      setLoading(false);
    }
  };

  const userFeatures = [
    "Find your dream job",
    "Build your professional profile",
    "Connect with top employers",
    "Get personalized job recommendations",
    "Track your applications",
  ];

  const employerFeatures = [
    "Post job opportunities",
    "Find top talent",
    "Manage applications",
    "Schedule interviews",
    "Analytics dashboard",
  ];

  // Show loading while checking onboarding status
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Checking your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16 mt-2">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Choose Your Path
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Tell us how you'd like to use TalentHub and we'll customize your experience
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
          {/* User/Talent Card */}
          <Card
            className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedRole === "user"
                ? "ring-4 ring-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20"
                : "hover:shadow-xl hover:shadow-blue-500/10"
            }`}
            onClick={() => setSelectedRole("user")}
          >
            {selectedRole === "user" && (
              <div className="absolute -top-3 -right-3">
                <CheckCircle className="w-8 h-8 text-blue-600 bg-white rounded-full" />
              </div>
            )}
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <IconUserBolt className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                I'm a Talent
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                Looking for opportunities to grow my career
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {userFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <IconStarFilled stroke={1} className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  Perfect for job seekers
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Employer Card */}
          <Card
            className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
              selectedRole === "employer"
                ? "ring-4 ring-green-500 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20"
                : "hover:shadow-xl hover:shadow-green-500/10"
            }`}
            onClick={() => setSelectedRole("employer")}
          >
            {selectedRole === "employer" && (
              <div className="absolute -top-3 -right-3">
                <CheckCircle className="w-8 h-8 text-green-600 bg-white rounded-full" />
              </div>
            )}
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
                <IconBuildingBurjAlArab className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                I'm an Employer
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
                Looking to hire talented professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {employerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <IconStarFilled stroke={1} className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Perfect for recruiters
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            size="lg"
            disabled={!selectedRole || loading}
            onClick={() => selectedRole && handleRoleSelection(selectedRole)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up your account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Continue to{" "}
                {selectedRole === "user"
                  ? "Talent Dashboard"
                  : selectedRole === "employer"
                  ? "Employer Dashboard"
                  : "Dashboard"}
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            You can change your role preference later in your account settings
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Join thousands of users</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Trusted by top companies</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
