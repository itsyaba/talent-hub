"use client";

import { IconSearch, IconFileText, IconCheck, IconArrowRight } from "@tabler/icons-react";
import { motion } from "framer-motion";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <IconSearch className="w-12 h-12 text-primary" />,
      title: "Search Jobs",
      description:
        "Browse through thousands of job listings and find the perfect match for your skills and experience.",
      step: "01",
    },
    {
      icon: <IconFileText className="w-12 h-12 text-primary" />,
      title: "Apply Easily",
      description:
        "Submit your application with just a few clicks. Upload your resume and cover letter seamlessly.",
      step: "02",
    },
    {
      icon: <IconCheck className="w-12 h-12 text-primary" />,
      title: "Get Hired",
      description:
        "Connect with employers, schedule interviews, and land your dream job with our streamlined process.",
      step: "03",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
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

  const buttonVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        delay: 1,
      },
    },
  };

  return (
    <motion.section
      id="how-it-works"
      className="py-20 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div className="text-center mb-16" variants={headerVariants}>
          <motion.h2
            className="text-3xl lg:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            How It Works
          </motion.h2>
          <motion.p
            className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Get started with your job search in three simple steps. Our platform makes finding and
            applying for jobs effortless.
          </motion.p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div key={index} className="relative" variants={itemVariants}>
              {/* Step Number */}
              <motion.div
                className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {step.step}
              </motion.div>

              {/* Step Card */}
              <motion.div
                className="bg-card p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-200 cursor-pointer group hover:shadow-lg"
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  {/* Icon */}
                  <motion.div
                    className="p-4 bg-primary/10 rounded-2xl inline-block group-hover:bg-primary/20 transition-colors duration-200"
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                      backgroundColor: "hsl(var(--primary) / 0.2)",
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {step.icon}
                  </motion.div>

                  {/* Content */}
                  <div className="space-y-3">
                    <motion.h3
                      className="text-xl font-semibold text-foreground"
                      whileHover={{ color: "hsl(var(--primary))" }}
                    >
                      {step.title}
                    </motion.h3>
                    <motion.p
                      className="text-muted-foreground leading-relaxed"
                      whileHover={{ color: "hsl(var(--muted-foreground))" }}
                    >
                      {step.description}
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              {/* Arrow between steps */}
              {index < steps.length - 1 && (
                <motion.div
                  className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                >
                  <IconArrowRight className="w-8 h-8 text-primary/40" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div className="text-center mt-16" variants={buttonVariants}>
          <motion.button
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            whileHover={{
              scale: 1.05,
              y: -3,
              boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HowItWorksSection;
