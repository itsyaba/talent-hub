import { useState, useEffect } from "react";
import { useSession } from "./use-session";

interface DashboardStats {
  activeJobs: number;
  totalApplications: number;
  interviews: number;
  hired: number;
  shortlisted: number;
  rejected: number;
}

interface DashboardTrends {
  applicationsThisMonth: number;
  applicationsLastMonth: number;
  applicationTrend: number;
}

interface Job {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
  applications: string[];
  company?: {
    name?: string;
    industry?: string;
    size?: string;
    website?: string;
    location?: string;
  };
}

interface Application {
  _id: string;
  status: string;
  appliedAt: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string[];
  expectedSalary?: number;
  availability: string;
  coverLetter: string;
  resume: {
    filename: string;
    url: string;
    key: string;
    size?: number;
    type?: string;
  };
  jobId: {
    _id: string;
    title: string;
    company: {
      name: string;
      location: string;
    };
    type: string;
  };
  userId: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
}

interface DashboardData {
  stats: DashboardStats;
  trends: DashboardTrends;
  jobs: {
    total: number;
    byStatus: Record<string, number>;
    recent: Job[];
  };
  applications: {
    total: number;
    byStatus: Record<string, number>;
    recent: Application[];
  };
}

export function useEmployerDashboard() {
  const { data: session, isPending } = useSession();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isPending) {
      setLoading(true);
    }
  }, [isPending]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/employer/dashboard", {
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and when session changes
  useEffect(() => {
    if (session?.user?.role === "employer") {
      fetchDashboardData();
    }
  }, [session]);

  // Set up real-time updates (polling every 30 seconds)
  //   useEffect(() => {
  //     if (session?.user?.role === "employer") {
  //       const interval = setInterval(fetchDashboardData, 60000); // 1 minute
  //       return () => clearInterval(interval);
  //     }
  //   }, [session]);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
}
