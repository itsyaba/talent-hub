"use client";

import {
  IconTrendingUp,
  IconCode,
  IconUsers,
  IconCircle,
  IconMapPin,
  IconCalendar,
  IconBriefcase,
  IconBuilding,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useJobs } from "@/hooks/use-jobs";
import { useRouter } from "next/navigation";

const JobOffersSection = () => {
  const { jobs, loading, error } = useJobs(12);
  const router = useRouter();

  // Function to get category icon based on job tags or company industry
  const getCategoryIcon = (job: any) => {
    const tags = job.tags || [];
    const industry = job.company?.industry || "";

    if (
      tags.some(
        (tag: string) =>
          tag.toLowerCase().includes("finance") || tag.toLowerCase().includes("accounting")
      )
    ) {
      return <IconTrendingUp className="w-4 h-4 text-primary" />;
    }
    if (
      tags.some(
        (tag: string) =>
          tag.toLowerCase().includes("software") ||
          tag.toLowerCase().includes("development") ||
          tag.toLowerCase().includes("programming")
      )
    ) {
      return <IconCode className="w-4 h-4 text-primary" />;
    }
    if (
      tags.some(
        (tag: string) =>
          tag.toLowerCase().includes("hr") ||
          tag.toLowerCase().includes("human") ||
          tag.toLowerCase().includes("recruitment")
      )
    ) {
      return <IconUsers className="w-4 h-4 text-primary" />;
    }
    if (
      industry.toLowerCase().includes("technology") ||
      industry.toLowerCase().includes("software")
    ) {
      return <IconCode className="w-4 h-4 text-primary" />;
    }
    if (industry.toLowerCase().includes("finance") || industry.toLowerCase().includes("banking")) {
      return <IconTrendingUp className="w-4 h-4 text-primary" />;
    }

    return <IconBriefcase className="w-4 h-4 text-primary" />;
  };

  // Function to get category name
  const getCategoryName = (job: any) => {
    const tags = job.tags || [];
    const industry = job.company?.industry || "";

    if (
      tags.some(
        (tag: string) =>
          tag.toLowerCase().includes("finance") || tag.toLowerCase().includes("accounting")
      )
    ) {
      return "Finance";
    }
    if (
      tags.some(
        (tag: string) =>
          tag.toLowerCase().includes("software") ||
          tag.toLowerCase().includes("development") ||
          tag.toLowerCase().includes("programming")
      )
    ) {
      return "Software Engineering";
    }
    if (
      tags.some(
        (tag: string) =>
          tag.toLowerCase().includes("hr") ||
          tag.toLowerCase().includes("human") ||
          tag.toLowerCase().includes("recruitment")
      )
    ) {
      return "Human Resources";
    }
    if (
      industry.toLowerCase().includes("technology") ||
      industry.toLowerCase().includes("software")
    ) {
      return "Technology";
    }
    if (industry.toLowerCase().includes("finance") || industry.toLowerCase().includes("banking")) {
      return "Finance";
    }

    return industry || "General";
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to get company logo initials
  const getCompanyLogo = (companyName: string) => {
    if (!companyName) return "?";
    const words = companyName.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return companyName[0] || "?";
  };

  // Function to get random background color for company logo
  const getLogoBg = (companyName: string) => {
    const colors = [
      "bg-primary",
      "bg-orange-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = companyName.length % colors.length;
    return colors[index];
  };

  // Function to handle job card click
  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Featured Job Offers
            </h2>
            <p className="text-lg text-muted-foreground">Loading available opportunities...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-2xl border border-border/50 animate-pulse"
              >
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-6 bg-muted rounded mb-3"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
              Featured Job Offers
            </h2>
            <p className="text-lg text-muted-foreground">
              Unable to load jobs at the moment. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <motion.section
      className="py-16 bg-muted/30"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div className="mb-12" variants={headerVariants}>
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Featured Job Offers
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Search your career opportunity through {jobs.length} active jobs
          </motion.p>
        </motion.div>

        {/* Job Offer Cards */}
        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {jobs.map((job, index) => (
              <motion.div
                key={job._id}
                className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group hover:shadow-lg relative overflow-hidden"
                variants={itemVariants}
                whileHover={{
                  scale: 1.03,
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleJobClick(job._id)}
              >
                {/* Click indicator */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                {/* Top Section - Category */}
                <motion.div className="flex items-center space-x-2 mb-4" whileHover={{ x: 5 }}>
                  {getCategoryIcon(job)}
                  <span className="text-sm text-muted-foreground font-medium">
                    {getCategoryName(job)}
                  </span>
                </motion.div>

                {/* Job Title */}
                <motion.h3
                  className="text-lg font-semibold text-foreground mb-3 line-clamp-2"
                  whileHover={{ color: "hsl(var(--primary))" }}
                >
                  {job.title}
                </motion.h3>

                {/* Location & Type */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-muted-foreground">
                  <motion.div className="flex items-center space-x-1" whileHover={{ scale: 1.05 }}>
                    <IconMapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </motion.div>
                  <motion.span
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize"
                    whileHover={{ scale: 1.1 }}
                  >
                    {job.type.replace("-", " ")}
                  </motion.span>
                </div>

                {/* Bottom Section - Date, Company & Logo */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <motion.div
                    className="flex items-center space-x-1 text-sm text-muted-foreground"
                    whileHover={{ x: -3 }}
                  >
                    <IconCalendar className="w-4 h-4" />
                    <span>{formatDate(job.createdAt)} by</span>
                    <span className="font-medium text-foreground">{job.company.name}</span>
                  </motion.div>
                  {/* <motion.div
                    className={`w-10 h-10 ${getLogoBg(
                      job.company.name
                    )} rounded-lg flex items-center justify-center text-card font-bold text-sm`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {getCompanyLogo(job.company.name)}
                  </motion.div> */}
                </div>

                {/* Click hint */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs text-primary font-medium">Click to view details</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <IconBuilding className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Jobs Available</h3>
            <p className="text-muted-foreground">Check back later for new opportunities!</p>
          </motion.div>
        )}

        {/* View All Jobs Button */}
        {/* {jobs.length > 0 && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Jobs
            </motion.button>
          </motion.div>
        )} */}
      </div>
    </motion.section>
  );
};

export default JobOffersSection;
