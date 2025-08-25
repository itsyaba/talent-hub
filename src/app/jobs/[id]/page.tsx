"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  IconMapPin,
  IconCalendar,
  IconBriefcase,
  IconBuilding,
  IconUsers,
  IconTrendingUp,
  IconCode,
  IconClock,
  IconBookmark,
  IconShare,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";
import ApplicationModal from "@/components/ApplicationModal";

interface Job {
  _id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary: {
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
  tags: string[];
  experienceLevel: string;
  createdAt: string;
  status: string;
}

interface ApplicationFormData {
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
  } | null;
}

const JobDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`/api/jobs/${params.id}`);
        if (!response.ok) {
          throw new Error("Job not found");
        }
        const jobData = await response.json();
        setJob(jobData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch job");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleApply = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (applicationData: ApplicationFormData) => {
    if (!session || !job) return;

    setApplying(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("jobId", job._id);
      formData.append("userId", session.user.id);
      formData.append("fullName", applicationData.fullName);
      formData.append("email", applicationData.email);
      formData.append("phone", applicationData.phone);
      formData.append("location", applicationData.location);
      formData.append("experience", applicationData.experience);
      formData.append("skills", JSON.stringify(applicationData.skills));
      formData.append("expectedSalary", applicationData.expectedSalary?.toString() || "");
      formData.append("availability", applicationData.availability);
      formData.append("coverLetter", applicationData.coverLetter);
      if (applicationData.resume) {
        formData.append("resume", JSON.stringify(applicationData.resume));
      }

      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData, // Don't set Content-Type header for FormData
      });

      if (response.ok) {
        // Show success message and redirect
        toast.success("Application submitted successfully!");
        setShowApplicationModal(false);
        router.push("/dashboard/talent");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }
    } catch (err) {
      console.error("Application error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    // TODO: Implement save functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company.name}`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const getCompanyLogo = (companyName: string) => {
    if (!companyName) return "?";
    const words = companyName.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return companyName[0] || "?";
  };

  const getLogoBg = (companyName: string) => {
    const colors = [
      "bg-primary",
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = companyName.length % colors.length;
    return colors[index];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "a day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getExperienceText = (level: string) => {
    switch (level) {
      case "entry":
        return "Fresh Graduate";
      case "junior":
        return "1-3 Years";
      case "mid":
        return "2-4 Years";
      case "senior":
        return "3-5 Years";
      case "lead":
        return "5+ Years";
      default:
        return level;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 py-16 mt-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-muted rounded w-3/4 mb-6"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
              <div className="h-4 bg-muted rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-muted/30 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Job Not Found</h1>
            <p className="text-muted-foreground mb-6">
              {error || "The job you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-muted/30 py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={() => router.back()}
              variant="ghost"
              className="mb-6 hover:bg-background"
            >
              <IconArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Job Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border border-border/50 shadow-sm">
                  <CardContent className="p-6">
                    {/* Company Logo and Info */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div
                        className={`w-16 h-16 ${getLogoBg(
                          job.company.name
                        )} rounded-lg flex items-center justify-center text-primary-foreground font-bold text-xl flex-shrink-0`}
                      >
                        {getCompanyLogo(job.company.name)}
                      </div>
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                        <div className="flex items-center space-x-4 text-muted-foreground">
                          <span className="font-medium">{job.company.name}</span>
                          <div className="flex items-center space-x-1">
                            <IconMapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Job Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {job.type.replace("-", " ")}
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {job.location.includes("Remote") ? "Remote" : "Onsite"}
                      </Badge>
                      <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                        {getExperienceText(job.experienceLevel)}
                      </Badge>
                    </div>

                    {/* About this role */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        About this role
                      </h3>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {job.description}
                      </p>
                    </div>

                    {/* Qualification */}
                    {job.requirements && job.requirements.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xl font-semibold text-foreground mb-3">
                          Qualification
                        </h3>
                        <ul className="space-y-2">
                          {job.requirements.map((requirement, index) => (
                            <li key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-muted-foreground">{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Responsibility */}
                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-3">Responsibility</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            Create design and user journey on every features and product/business
                            units across multiples devices (Web+App).
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            Identifying design problems through user journey and devising elegant
                            solutions.
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            Develop low and hi fidelity designs, user experience flow, & prototype,
                            translate it into highly-polished visual composites following style and
                            brand guidelines.
                          </span>
                        </li>
                        <li className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-muted-foreground/60 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-muted-foreground">
                            Brainstorm and works together with Design Lead, UX Engineers, and PMs to
                            execute a design sprint on specific story or task.
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Attachment */}
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">Attachment</h3>
                      <div className="text-muted-foreground text-sm">No attachments available</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="border border-border/50 shadow-sm">
                  <CardContent className="p-6">
                    <Button onClick={handleApply} disabled={applying} className="w-full">
                      {applying ? "Applying..." : "Apply Now"}
                    </Button>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={handleSave}
                        variant="outline"
                        className="w-full mt-2 col-span-2"
                      >
                        <IconBookmark className="w-4 h-4 mr-2" />
                        Save Job
                      </Button>
                      <Button onClick={handleShare} variant="outline" className="w-full mt-2">
                        <IconShare className="w-4 h-4 mr-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Similar Jobs */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">Similar Jobs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Similar Job 1 */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        G
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">Lead UI Designer</h4>
                        <p className="text-muted-foreground text-xs">Gojek • Jakarta, Indonesia</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Fulltime
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Onsite
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            3-5 Years
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mt-2">
                          2 days ago • 521 Applicants
                        </p>
                      </div>
                      <IconBookmark className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>

                    {/* Similar Job 2 */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        <IconBriefcase className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">Sr. UX Designer</h4>
                        <p className="text-muted-foreground text-xs">GoPay • Jakarta, Indonesia</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Fulltime
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Onsite
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            3-5 Years
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mt-2">
                          2 days ago • 210 Applicants
                        </p>
                      </div>
                      <IconBookmark className="w-4 h-4 text-primary fill-current mt-1" />
                    </div>

                    {/* Similar Job 3 */}
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        O
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">Jr. UI Designer</h4>
                        <p className="text-muted-foreground text-xs">OVO • Jakarta, Indonesia</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Fulltime
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Onsite
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            1-3 Years
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mt-2">
                          an hour ago • 120 Applicants
                        </p>
                      </div>
                      <IconBookmark className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Other Jobs From Same Company */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-foreground">
                      Other Jobs From {job.company.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                      <div
                        className={`w-10 h-10 ${getLogoBg(
                          job.company.name
                        )} rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0`}
                      >
                        {getCompanyLogo(job.company.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground text-sm">UI Designer</h4>
                        <p className="text-muted-foreground text-xs">
                          {job.company.name} • {job.location}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Internship
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Onsite
                          </Badge>
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            Fresh Graduate
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs mt-2">
                          a day ago • 35 Applicants
                        </p>
                      </div>
                      <IconBookmark className="w-4 h-4 text-muted-foreground mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
        jobTitle={job.title}
        companyName={job.company.name}
        loading={applying}
        userData={{
          name: session?.user?.name,
          email: session?.user?.email,
        }}
      />
    </>
  );
};

export default JobDetailPage;
