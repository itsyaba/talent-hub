"use client";

import {
  IconSearch,
  IconMapPin,
  IconChevronDown,
  IconBriefcase,
  IconBuilding,
  IconMapPin as IconLocation,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Job {
  _id: string;
  title: string;
  company: {
    name: string;
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
}

const HeroSection = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Job[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularSearches = [
    "designer",
    "Writer",
    "Team leader",
    "Fullstack",
    "Senior",
    "Software",
    "Financial Analyst",
    "web developer",
    "Web",
    "Tech",
  ];

  const companyLogos = ["Google", "Meta", "Tesla", "Amazon", "Microsoft", "Apple"];

  const jobStats = [
    { count: "319", title: "job offers In Business Development" },
    { count: "265", title: "job offers In Marketing & Communication" },
    { count: "324", title: "job offers Project Management" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search jobs when query changes
  useEffect(() => {
    const searchJobs = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/jobs?search=${encodeURIComponent(searchQuery)}&status=active&limit=8`
        );
        const data = await response.json();

        if (data.success) {
          setSearchResults(data.data);
          setShowDropdown(data.data.length > 0);
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      } catch (error) {
        console.error("Error searching jobs:", error);
        setSearchResults([]);
        setShowDropdown(false);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchJobs, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setSearchQuery(job.title);
    setShowDropdown(false);
    router.push(`/jobs/${job._id}`);
  };

  const handlePopularSearch = (search: string) => {
    setSearchQuery(search);
    router.push(`/jobs?search=${encodeURIComponent(search)}`);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.8,
      },
    },
  };

  return (
    <motion.section
      className="relative min-h-screen bg-primary/20 overflow-clip"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-14 w-full">
          {/* Left Side - Content */}
          <motion.div
            className="order-2 lg:order-1 mt-8 flex items-start justify-between flex-col w-full h-11/12"
            variants={itemVariants as any}
          >
            {/* Main Headline */}
            <motion.div className="text-center lg:text-left" variants={itemVariants as any}>
              <motion.h1
                className="text-4xl lg:text-6xl font-bold text-foreground font-sans uppercase"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                Find the perfect job for you
              </motion.h1>
              <motion.p
                className="text-lg lg:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-3"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              >
                Search your career opportunity through 12,800 jobs
              </motion.p>
            </motion.div>

            {/* Search Interface */}
            <motion.div
              className="relative bg-card p-3 rounded-2xl shadow-lg border border-border/50 w-10/12"
              variants={itemVariants as any}
              whileHover={{ scale: 1.02, y: -2 }}
              ref={searchRef}
            >
              <div className="flex flex-row gap-4 w-full">
                <div className="w-full relative">
                  <Input
                    type="text"
                    placeholder="Job Title or Keyword"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full px-4 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground h-full"
                  />

                  {/* Search Dropdown */}
                  {showDropdown && (
                    <motion.div
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-[999] max-h-96 overflow-y-auto"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {isSearching ? (
                        <div className="p-4 text-center text-muted-foreground">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                          Searching jobs...
                        </div>
                      ) : searchResults.length > 0 ? (
                        <div className="p-2">
                          {searchResults.map((job) => (
                            <motion.div
                              key={job._id}
                              className="p-3 hover:bg-accent rounded-lg cursor-pointer transition-colors"
                              whileHover={{ backgroundColor: "hsl(var(--accent))" }}
                              onClick={() => handleJobSelect(job)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                  <IconBriefcase className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-foreground text-sm truncate">
                                    {job.title}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <IconBuilding className="w-3 h-3" />
                                    <span className="truncate">{job.company.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <IconLocation className="w-3 h-3" />
                                    <span className="truncate">{job.location}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary" className="text-xs">
                                      {job.type}
                                    </Badge>
                                    {job.salary?.min && (
                                      <Badge variant="outline" className="text-xs">
                                        {formatSalary(job.salary)}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          <div className="p-3 border-t border-border">
                            <Button
                              onClick={handleSearch}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              View All Results
                            </Button>
                          </div>
                        </div>
                      ) : searchQuery.trim().length >= 2 ? (
                        <div className="p-4 text-center text-muted-foreground">
                          No jobs found for "{searchQuery}"
                        </div>
                      ) : null}
                    </motion.div>
                  )}
                </div>

                <motion.button
                  className="bg-primary text-primary-foreground p-4 rounded-xl hover:bg-primary/90 transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSearch}
                >
                  <IconSearch size={24} />
                </motion.button>
              </div>
            </motion.div>

            <motion.div className="" variants={itemVariants as any}>
              {/* Popular Searches */}
              <div className="space-y-4 text-center lg:text-left">
                <h3 className="text-lg font-semibold text-foreground">Popular Searches</h3>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {popularSearches.map((search, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-primary/20 text-foreground rounded-full text-sm hover:bg-primary/30 transition-all duration-200 cursor-pointer border border-primary/30 hover:border-primary/50"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handlePopularSearch(search)}
                    >
                      {search}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Company Logos */}
              <div className="pt-8 text-center lg:text-left">
                <div className="flex flex-wrap items-center gap-8 opacity-60 justify-center lg:justify-start">
                  {companyLogos.map((logo, index) => (
                    <motion.div
                      key={index}
                      className="text-sm font-medium text-muted-foreground"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 0.6, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {logo}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Visual */}
          <motion.div
            className="relative lg:h-[700px] flex items-center justify-end order-1 lg:order-2 lg:mb-0"
            variants={cardVariants as any}
          >
            {/* Dark Blue Background with Curved Shape */}
            <motion.div
              className="absolute inset-0 bg-primary rounded-[120px] transform rotate-[20deg] -top-36 left-20 -right-72"
              initial={{ rotate: 0, scale: 0.8 }}
              whileInView={{ rotate: 20, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />

            {/* Abstract Blue Shapes */}
            <motion.div
              className="absolute top-24 -right-10 w-36 h-36 bg-accent rounded-full opacity-80 animate-pulse"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.8, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.div
              className="absolute bottom-30 right-48 w-36 h-36 bg-accent rounded-full opacity-60 animate-pulse delay-1000"
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 0.6, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />

            {/* Woman's Image Card */}
            <motion.div
              className="relative z-10 bg-card rounded-2xl p-3 shadow-2xl max-w-sm border border-border/50"
              initial={{ opacity: 0, y: 100, rotateY: -30 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
            >
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Professional woman"
                className="w-full h-96 object-cover rounded-2xl"
              />
            </motion.div>

            {/* Statistics Card */}
            <motion.div
              className="absolute bottom-16 -right-36 z-20 bg-card rounded-2xl p-6 shadow-xl max-w-xs border border-border/50"
              variants={statsVariants as any}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="space-y-4">
                {jobStats.map((stat, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="text-2xl font-bold text-foreground">{stat.count}</span>
                    <span className="text-sm text-muted-foreground leading-tight">
                      {stat.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
