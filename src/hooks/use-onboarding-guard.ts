"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "./use-session";

export function useOnboardingGuard() {
  const { data: session, isPending: loading } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!session?.user) {
      // User not logged in, redirect to login
      router.push("/login");
      return;
    }

    // Check if user has completed onboarding
    if (session.user.role && session.user.role !== "user") {
      // User has a role, redirect to appropriate dashboard
      if (session.user.role === "employer") {
        router.push("/dashboard/employer");
      } else {
        router.push("/dashboard/talent");
      }
      return;
    }

    // User is logged in but hasn't completed onboarding
    if (session.user.role === "user") {
      // This means they're still in the default "user" state
      // They should complete onboarding
      setIsChecking(false);
      return;
    }

    setIsChecking(false);
  }, [session, loading, router]);

  return {
    isChecking,
    session: session?.user,
    loading,
  };
}
