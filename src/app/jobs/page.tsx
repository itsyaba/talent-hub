"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  IconSearch,
  IconMapPin,
  IconBriefcase,
  IconBuilding,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Job {
  _id: string;
  title: string;
  description: string;
  company: {
    name: string;
    industry?: string;
    location?: string;
  };
  location: string;
  type: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  tags: string[];
  experienceLevel: string;
  createdAt: string;
}

const JobsPage = () => {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const experienceLevels = ["entry", "junior", "mid", "senior", "lead"];

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, locationFilter, typeFilter, experienceFilter, currentPage]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (locationFilter) params.append("location", locationFilter);
      if (typeFilter) params.append("type", typeFilter);
      if (experienceFilter) params.append("experienceLevel", experienceFilter);
      params.append("status", "active");
      params.append("page", currentPage.toString());
      params.append("limit", "12");

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setJobs(data.data);
        setTotalPages(data.pagination.pages);
        setTotalJobs(data.pagination.total);
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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setTypeFilter("");
    setExperienceFilter("");
    setCurrentPage(1);
  };

  const formatSalary = (salary?: { min?: number; max?: number; currency?: string }) => {
    if (!salary?.min && !salary?.max) return "Salary not specified";
    if (salary.min && salary.max) {
      return `${salary.currency || "$"}${salary.min.toLocaleString()} - ${
        salary.currency || "$"
      }${salary.max.toLocaleString()}`;
    }
    if (salary.min) return `${salary.currency || "$"}${salary.min.toLocaleString()}+`;
    if (salary.max) return `Up to ${salary.currency || "$"}${salary.max.toLocaleString()}`;
    return "Salary not specified";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Find Your Dream Job"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {totalJobs > 0 ? `${totalJobs} jobs found` : "No jobs found"}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="bg-card p-6 rounded-2xl shadow-lg border border-border mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Job title or keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <IconMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {jobTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                {experienceLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {(searchQuery || locationFilter || typeFilter || experienceFilter) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="flex items-center gap-2"
                >
                  <IconX className="w-4 h-4" />
                  Clear Filters
                </Button>
              )}
            </div>

            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Search Jobs
            </Button>
          </div>
        </motion.div>

        {/* Jobs Grid */}
        {error ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-destructive text-lg">{error}</p>
            <Button onClick={fetchJobs} className="mt-4">
              Try Again
            </Button>
          </motion.div>
        ) : jobs.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <IconBriefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((job, index) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors overflow-hidden">
                            <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                              {job.title}
                            </span>
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <IconBuilding className="w-4 h-4" />
                            <span className="truncate">{job.company.name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <IconMapPin className="w-4 h-4" />
                            <span className="truncate">{job.location}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {job.type}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground overflow-hidden mb-4">
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap max-h-12">
                          {job.description}
                        </span>
                      </p>

                      <div className="space-y-3">
                        {job.salary && (job.salary.min || job.salary.max) && (
                          <div className="text-sm">
                            <span className="font-medium text-foreground">Salary: </span>
                            <span className="text-muted-foreground">
                              {formatSalary(job.salary)}
                            </span>
                          </div>
                        )}

                        <div className="text-sm">
                          <span className="font-medium text-foreground">Experience: </span>
                          <span className="text-muted-foreground capitalize">
                            {job.experienceLevel}
                          </span>
                        </div>

                        {job.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.tags.slice(0, 3).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {job.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground pt-2">
                          Posted {formatDate(job.createdAt)}
                        </div>
                      </div>

                      <Button
                        className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={() => (window.location.href = `/jobs/${job._id}`)}
                      >
                        View Job
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
