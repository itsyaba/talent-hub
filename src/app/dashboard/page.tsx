"use client";

import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const DashboardPage = () => {
  const { data: session, isPending: loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.push("/login");
      return;
    }

    // Check user role and redirect accordingly
    if (session.user.role === "admin") {
      router.push("/dashboard/admin");
    } else if (session.user.role === "employer") {
      router.push("/dashboard/employer");
    } else if (session.user.role === "user") {
      router.push("/dashboard/talent");
    } else {
      // If no role or incomplete onboarding, redirect to onboarding
      toast.error("Please complete your onboarding to access your dashboard");
      router.push("/onboarding");
    }
  }, [session, loading, router]);

  // Show loading while checking session and redirecting
  if (loading || !session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
