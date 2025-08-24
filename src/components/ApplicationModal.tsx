// @ts-nocheck
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconUpload,
  IconFile,
  IconUser,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBriefcase,
  IconCalendar,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UploadButton } from "@/utils/uploadthing";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (applicationData: ApplicationFormData) => void;
  jobTitle: string;
  companyName: string;
  loading?: boolean;
  userData?: {
    name?: string;
    email?: string;
  };
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

const ApplicationModal = ({
  isOpen,
  onClose,
  onSubmit,
  jobTitle,
  companyName,
  loading = false,
  userData,
}: ApplicationModalProps) => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: userData?.name || "",
    email: userData?.email || "",
    phone: "",
    location: "",
    experience: "",
    skills: [],
    expectedSalary: undefined,
    availability: "immediate",
    coverLetter: "",
    resume: null,
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [errors, setErrors] = useState<Partial<ApplicationFormData>>({});

  const handleInputChange = (
    field: keyof ApplicationFormData,
    value:
      | string
      | number
      | { filename: string; url: string; key: string; size?: number; type?: string }
      | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSkillsInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillsInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillsInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillsInput.trim()],
        }));
      }
      setSkillsInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleResumeUpload = (res: any) => {
    if (res && res.length > 0) {
      const file = res[0];
      setFormData((prev) => ({
        ...prev,
        resume: {
          filename: file.name,
          url: file.url,
          key: file.key,
          size: file.size,
          type: file.type,
        },
      }));
      toast.success("Resume uploaded successfully!");
    }
  };

  const handleResumeError = (error: Error) => {
    toast.error(`Upload failed: ${error.message}`);
  };

  const removeResume = () => {
    setFormData((prev) => ({ ...prev, resume: null }));
    toast.success("Resume removed");
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ApplicationFormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.experience.trim()) newErrors.experience = "Experience is required";
    if (formData.skills.length === 0) newErrors.skills = "At least one skill is required";
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required";
    if (!formData.resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      experience: "",
      skills: [],
      expectedSalary: undefined,
      availability: "immediate",
      coverLetter: "",
      resume: null,
    });
    setErrors({});
    setSkillsInput("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-lg shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Apply for Position</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {jobTitle} at {companyName}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                <IconX className="h-4 w-4" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconUser className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        className={errors.fullName ? "border-destructive" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive mt-1">{errors.fullName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="Enter your phone number"
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive mt-1">{errors.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="Enter your location"
                        className={errors.location ? "border-destructive" : ""}
                      />
                      {errors.location && (
                        <p className="text-sm text-destructive mt-1">{errors.location}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconBriefcase className="w-5 h-5" />
                    Professional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience *</Label>
                    <Input
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      placeholder="e.g., 3 years in software development"
                      className={errors.experience ? "border-destructive" : ""}
                    />
                    {errors.experience && (
                      <p className="text-sm text-destructive mt-1">{errors.experience}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills *</Label>
                    <Input
                      id="skills"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      onKeyDown={handleSkillsInputKeyDown}
                      placeholder="Type a skill and press Enter"
                      className={errors.skills ? "border-destructive" : ""}
                    />
                    {errors.skills && (
                      <p className="text-sm text-destructive mt-1">{errors.skills}</p>
                    )}
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-sm rounded-md"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => removeSkill(skill)}
                              className="ml-1 hover:text-primary/70"
                            >
                              <IconX className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedSalary">Expected Salary (Optional)</Label>
                      <Input
                        id="expectedSalary"
                        type="number"
                        value={formData.expectedSalary || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "expectedSalary",
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                        placeholder="Enter expected salary"
                      />
                    </div>
                    <div>
                      <Label htmlFor="availability">Availability *</Label>
                      <Select
                        value={formData.availability}
                        onValueChange={(value) => handleInputChange("availability", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select availability" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="2-weeks">2 weeks</SelectItem>
                          <SelectItem value="1-month">1 month</SelectItem>
                          <SelectItem value="3-months">3 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconFile className="w-5 h-5" />
                    Cover Letter
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="coverLetter">Why are you interested in this position? *</Label>
                  <Textarea
                    id="coverLetter"
                    value={formData.coverLetter}
                    onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                    placeholder="Tell us why you're the perfect fit for this role..."
                    rows={4}
                    className={errors.coverLetter ? "border-destructive mt-2" : "mt-2"}
                  />
                  {errors.coverLetter && (
                    <p className="text-sm text-destructive mt-1">{errors.coverLetter}</p>
                  )}
                </CardContent>
              </Card>

              {/* Resume Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <IconUpload className="w-5 h-5" />
                    Resume Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Label htmlFor="resume">Upload your resume (PDF, DOC, DOCX) *</Label>
                  <div className="mt-2">
                    {!formData.resume ? (
                      <UploadButton
                        endpoint="resumeUploader"
                        onClientUploadComplete={handleResumeUpload}
                        onUploadError={handleResumeError}
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <IconFile className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{formData.resume.filename}</span>
                        {formData.resume.size && (
                          <span className="text-xs text-muted-foreground">
                            ({(formData.resume.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeResume}
                          className="ml-auto h-6 w-6 p-0"
                        >
                          <IconTrash className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum file size: 5MB. Supported formats: PDF, DOC, DOCX
                    </p>
                    {errors.resume && (
                      <p className="text-sm text-destructive mt-1">{errors.resume}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                  {loading ? (
                    <>
                      <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationModal;
