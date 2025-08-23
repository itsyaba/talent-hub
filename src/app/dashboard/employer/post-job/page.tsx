"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary: {
    min: string;
    max: string;
    currency: string;
  };
  company: {
    name: string;
    industry: string;
    size: string;
    website: string;
    location: string;
  };
  tags: string[];
  experienceLevel: string;
}

export default function PostJobPage() {
  const { data: session, isPending: loading } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newRequirement, setNewRequirement] = useState("");
  const [newTag, setNewTag] = useState("");

  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: [],
    location: "",
    type: "full-time",
    salary: {
      min: "",
      max: "",
      currency: "USD",
    },
    company: {
      name: session?.user?.name || "",
      industry: "",
      size: "",
      website: "",
      location: "",
    },
    tags: [],
    experienceLevel: "mid",
  });

  // Redirect if not logged in or not an employer
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  if (session.user.role !== "employer") {
    router.push("/dashboard/talent");
    return null;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSalaryChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  };

  const handleCompanyChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      company: {
        ...prev.company,
        [field]: value,
      },
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      setFormData((prev) => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement("");
    }
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enhanced validation
    if (!formData.title.trim()) {
      toast.error("Please enter a job title");
      return;
    }

    if (!formData.description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    if (!formData.location.trim()) {
      toast.error("Please enter a job location");
      return;
    }

    if (formData.requirements.length === 0) {
      toast.error("Please add at least one requirement");
      return;
    }

    if (
      formData.salary.min &&
      formData.salary.max &&
      parseInt(formData.salary.min) > parseInt(formData.salary.max)
    ) {
      toast.error("Minimum salary cannot be greater than maximum salary");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          salary: {
            min: formData.salary.min ? parseInt(formData.salary.min) : undefined,
            max: formData.salary.max ? parseInt(formData.salary.max) : undefined,
            currency: formData.salary.currency,
          },
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Job posted successfully!");
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/dashboard/employer");
        }, 1500);
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to post job");
      }
    } catch (error) {
      toast.error("An error occurred while posting the job");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Job Posted Successfully!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Your job posting has been created and is now live. Redirecting to dashboard...
            </p>
            <Button
              onClick={() => router.push("/dashboard/employer")}
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 mt-12">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Post a New Job</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create a compelling job posting to attract top talent
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential details about the position</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                      rows={6}
                      required
                      maxLength={2000}
                    />
                    <div className="text-sm text-slate-500 mt-1 text-right">
                      {formData.description.length}/2000 characters
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="e.g., San Francisco, CA or Remote"
                        required
                      />
                    </div>
                    <div className="space-y-2 col-span-1 w-full  min-w-full">
                      <Label htmlFor="type">Job Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleInputChange("type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-1">
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <Select
                        value={formData.experienceLevel}
                        onValueChange={(value) => handleInputChange("experienceLevel", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry">Entry Level</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="mid">Mid Level</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements & Skills</CardTitle>
                  <CardDescription>List the key requirements and skills needed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Requirements *</Label>
                    <p className="text-sm text-slate-500 mb-2">
                      Add key skills, technologies, and experience requirements
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="e.g., React, 5+ years experience, Team leadership..."
                        onKeyPress={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addRequirement())
                        }
                      />
                      <Button type="button" onClick={addRequirement} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {req}
                          <button
                            type="button"
                            onClick={() => removeRequirement(index)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    {formData.requirements.length === 0 && (
                      <p className="text-sm text-amber-600 mt-2">
                        ⚠️ Please add at least one requirement
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <p className="text-sm text-slate-500 mb-2">
                      Add relevant tags to help candidates find your job (optional)
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="e.g., remote, startup, benefits..."
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Salary Information</CardTitle>
                  <CardDescription>
                    Set the salary range for this position (optional but recommended)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin">Min Salary</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={formData.salary.min}
                        onChange={(e) => handleSalaryChange("min", e.target.value)}
                        placeholder="80000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax">Max Salary</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={formData.salary.max}
                        onChange={(e) => handleSalaryChange("max", e.target.value)}
                        placeholder="120000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={formData.salary.currency}
                      onValueChange={(value) => handleSalaryChange("currency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Company Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Help candidates learn more about your company</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.company.name}
                      onChange={(e) => handleCompanyChange("name", e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.company.industry}
                      onChange={(e) => handleCompanyChange("industry", e.target.value)}
                      placeholder="e.g., Technology, Healthcare"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select
                      value={formData.company.size}
                      onValueChange={(value) => handleCompanyChange("size", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                        <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                        <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                        <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                        <SelectItem value="501-1000 employees">501-1000 employees</SelectItem>
                        <SelectItem value="1000+ employees">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.company.website}
                      onChange={(e) => handleCompanyChange("website", e.target.value)}
                      placeholder="https://company.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyLocation">Company Location</Label>
                    <Input
                      id="companyLocation"
                      value={formData.company.location}
                      onChange={(e) => handleCompanyChange("location", e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Preview */}
          {(formData.title || formData.description || formData.location) && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Job Preview</CardTitle>
                <CardDescription>How your job posting will appear to candidates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {formData.title || "Job Title"}
                    </h3>
                    <Badge variant="outline">{formData.type || "Full-time"}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <span>📍 {formData.location || "Location"}</span>
                    <span>👤 {formData.experienceLevel || "Mid Level"}</span>
                    {formData.salary.min && formData.salary.max && (
                      <span>
                        💰 ${formData.salary.min} - ${formData.salary.max}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">
                    {formData.description || "Job description will appear here..."}
                  </p>
                  {formData.requirements.length > 0 && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Requirements:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.requirements.map((req, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {formData.company.name && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <p className="font-medium">{formData.company.name}</p>
                      {formData.company.industry && <p>{formData.company.industry}</p>}
                      {formData.company.location && <p>📍 {formData.company.location}</p>}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Posting Job..." : "Post Job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
