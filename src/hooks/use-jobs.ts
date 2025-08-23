import { useState, useEffect } from "react";

export interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: "full-time" | "part-time" | "contract" | "internship";
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  company: {
    name: string;
    industry?: string;
    size?: string;
    website?: string;
    location?: string;
  };
  status: "active" | "paused" | "closed";
  tags: string[];
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "lead";
  createdAt: string;
  updatedAt: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useJobs = (limit: number = 8) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs?status=active&limit=${limit}`);
        const data: JobsResponse = await response.json();

        if (data.success) {
          setJobs(data.data);
        } else {
          setError("Failed to fetch jobs");
        }
      } catch (err) {
        setError("Error fetching jobs");
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [limit]);

  return { jobs, loading, error };
};
