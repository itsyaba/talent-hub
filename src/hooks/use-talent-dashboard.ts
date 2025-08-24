import { useState, useEffect } from "react";
import { useSession } from "./use-session";

interface DashboardStats {
  totalApplications: number;
  currentMonthApplications: number;
  applicationsChange: number;
  profileViews: number;
  rating: number;
}

interface ApplicationStatus {
  _id: string;
  count: number;
}

interface RecentApplication {
  _id: string;
  status: string;
  appliedAt: string;
  jobId: {
    _id: string;
    title: string;
    company: {
      name: string;
    };
    location: string;
    type: string;
    salary?: {
      min?: number;
      max?: number;
      currency: string;
    };
    status: string;
  };
}

interface RecommendedJob {
  _id: string;
  title: string;
  company: {
    name: string;
    industry?: string;
  };
  location: string;
  type: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  experienceLevel: string;
  tags: string[];
  createdAt: string;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface DashboardData {
  stats: DashboardStats;
  applicationsByStatus: ApplicationStatus[];
  recentApplications: RecentApplication[];
  recommendedJobs: RecommendedJob[];
  monthlyData: MonthlyData[];
}

export function useTalentDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/talent/dashboard", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session?.user]);

  const refetch = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/talent/dashboard", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || "Failed to fetch dashboard data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
