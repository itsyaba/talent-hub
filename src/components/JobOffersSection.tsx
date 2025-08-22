"use client";

import {
  IconTrendingUp,
  IconCode,
  IconUsers,
  IconCircle,
  IconMapPin,
  IconCalendar,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const JobOffersSection = () => {
  const jobOffers = [
    {
      category: "Finance",
      categoryIcon: <IconTrendingUp className="w-4 h-4 text-primary" />,
      title: "Financial Analyst",
      location: "San Diego, CA",
      type: "Full Time",
      date: "June 8, 2022",
      company: "Gramware",
      logo: "L9",
      logoBg: "bg-foreground",
    },
    {
      category: "Software Engineering",
      categoryIcon: <IconCode className="w-4 h-4 text-primary" />,
      title: "Fullstack Web Developer",
      location: "San Francisco, CA",
      type: "Internship",
      date: "June 8, 2022",
      company: "Syspresoft",
      logo: "~",
      logoBg: "bg-primary",
    },
    {
      category: "Human Resources",
      categoryIcon: <IconUsers className="w-4 h-4 text-primary" />,
      title: "Human Resources Coordinator",
      location: "San Diego, CA",
      type: "Full Time",
      date: "June 8, 2022",
      company: "DataRes",
      logo: "▶",
      logoBg: "bg-primary",
    },
    {
      category: "Business Development",
      categoryIcon: <IconCircle className="w-4 h-4 text-primary" />,
      title: "Technical Writer",
      location: "Los Angeles, CA",
      type: "Remote",
      date: "June 7, 2022",
      company: "Craftgenics",
      logo: "S",
      logoBg: "bg-orange-500",
    },
  ];

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
            Search your career opportunity through 12,800 jobs
          </motion.p>
        </motion.div>

        {/* Job Offer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobOffers.map((job, index) => (
            <motion.div
              key={index}
              className="bg-card p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group hover:shadow-lg"
              variants={itemVariants}
              whileHover={{
                scale: 1.03,
                y: -8,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Top Section - Category */}
              <motion.div className="flex items-center space-x-2 mb-4" whileHover={{ x: 5 }}>
                {job.categoryIcon}
                <span className="text-sm text-muted-foreground font-medium">{job.category}</span>
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
                  className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                  whileHover={{ scale: 1.1 }}
                >
                  {job.type}
                </motion.span>
              </div>

              {/* Bottom Section - Date, Company & Logo */}
              <div className="flex items-center justify-between pt-4 border-t border-border/30">
                <motion.div
                  className="flex items-center space-x-1 text-sm text-muted-foreground"
                  whileHover={{ x: -3 }}
                >
                  <IconCalendar className="w-4 h-4" />
                  <span>{job.date} by</span>
                  <span className="font-medium text-foreground">{job.company}</span>
                </motion.div>
                <motion.div
                  className={`w-10 h-10 ${job.logoBg} rounded-lg flex items-center justify-center text-card font-bold text-sm`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {job.logo}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default JobOffersSection;
