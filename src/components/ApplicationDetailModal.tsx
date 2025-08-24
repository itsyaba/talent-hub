"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Briefcase,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
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
  };
  onStatusUpdate: (applicationId: string, newStatus: string) => Promise<void>;
}

const ApplicationDetailModal = ({
  isOpen,
  onClose,
  application,
  onStatusUpdate,
}: ApplicationDetailModalProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setIsUpdating(true);
      await onStatusUpdate(application._id, newStatus);
      toast.success(`Application ${newStatus} successfully!`);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${newStatus} application`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "shortlisted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "interviewed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "hired":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case "immediate":
        return "Immediate";
      case "2-weeks":
        return "2 weeks";
      case "1-month":
        return "1 month";
      case "3-months":
        return "3 months";
      default:
        return availability;
    }
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
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-lg shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Application Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {application.jobId.title} at {application.jobId.company.name}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Application Status and Actions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Application Status</CardTitle>
                    <Badge
                      className={`px-3 py-1 text-sm font-medium ${getStatusColor(
                        application.status
                      )}`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-3">
                    {application.status === "applied" && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate("shortlisted")}
                          disabled={isUpdating}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Shortlist
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate("rejected")}
                          disabled={isUpdating}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "shortlisted" && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate("interviewed")}
                          disabled={isUpdating}
                          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
                        >
                          <Calendar className="w-4 h-4" />
                          Mark as Interviewed
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate("rejected")}
                          disabled={isUpdating}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "interviewed" && (
                      <>
                        <Button
                          onClick={() => handleStatusUpdate("hired")}
                          disabled={isUpdating}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Hire
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate("rejected")}
                          disabled={isUpdating}
                          variant="destructive"
                          className="flex items-center gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {application.status === "rejected" && (
                      <Button
                        onClick={() => handleStatusUpdate("applied")}
                        disabled={isUpdating}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Reconsider
                      </Button>
                    )}
                    {application.status === "hired" && (
                      <div className="text-sm text-muted-foreground">
                        This candidate has been hired! 🎉
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Candidate Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Candidate Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{application.fullName}</p>
                        <p className="text-sm text-muted-foreground">{application.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{application.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{application.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Professional Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Experience
                      </label>
                      <p className="text-foreground">{application.experience}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Availability
                      </label>
                      <p className="text-foreground">
                        {getAvailabilityText(application.availability)}
                      </p>
                    </div>
                  </div>
                  {application.expectedSalary && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Expected Salary
                      </label>
                      <p className="text-foreground">
                        ${application.expectedSalary.toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Skills</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {application.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cover Letter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap">{application.coverLetter}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Resume */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{application.resume.filename}</p>
                        {application.resume.size && (
                          <p className="text-sm text-muted-foreground">
                            {(application.resume.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(application.resume.url, "_blank")}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = application.resume.url;
                          link.download = application.resume.filename;
                          link.click();
                        }}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Application Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Application Submitted</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(application.appliedAt)}
                        </p>
                      </div>
                    </div>
                    {application.status !== "applied" && (
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            Status Updated to{" "}
                            {application.status.charAt(0).toUpperCase() +
                              application.status.slice(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">Recently</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    // TODO: Implement messaging functionality
                    toast.info("Messaging feature coming soon!");
                  }}
                >
                  <MessageSquare className="w-4 h-4" />
                  Message Candidate
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplicationDetailModal;
