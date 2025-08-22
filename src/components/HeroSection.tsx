"use client";

import { IconSearch, IconMapPin, IconChevronDown } from "@tabler/icons-react";
import { motion } from "framer-motion";

const HeroSection = () => {
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
              className="bg-card p-3 rounded-2xl shadow-lg border border-border/50 w-10/12"
              variants={itemVariants as any}
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <div className="flex flex-row gap-4 w-full">
                <div className="w-full">
                  <input
                    type="text"
                    placeholder="Job Title or Keyword"
                    className="w-full px-4 py-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <motion.button
                  className="bg-primary text-primary-foreground p-4 rounded-xl hover:bg-primary/90 transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
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
