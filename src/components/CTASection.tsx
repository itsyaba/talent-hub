"use client";

import { IconArrowRight, IconUsers, IconBriefcase, IconTrendingUp } from "@tabler/icons-react";
import { motion } from "framer-motion";

const CTASection = () => {
  const stats = [
    {
      icon: <IconUsers className="w-6 h-6 text-primary" />,
      number: "50K+",
      label: "Active Users",
    },
    {
      icon: <IconBriefcase className="w-6 h-6 text-primary" />,
      number: "12.8K+",
      label: "Job Listings",
    },
    {
      icon: <IconTrendingUp className="w-6 h-6 text-primary" />,
      number: "95%",
      label: "Success Rate",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
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
        ease: "easeOut" as const,
      },
    },
  };

  const backgroundVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 0.1,
      transition: {
        duration: 1.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      className="py-20 bg-primary relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <motion.div className="absolute inset-0 opacity-10" variants={backgroundVariants}>
        <motion.div
          className="absolute top-0 left-0 w-72 h-72 bg-accent rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full translate-x-1/2 translate-y-1/2"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </motion.div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main CTA */}
          <motion.div variants={itemVariants}>
            <motion.h2
              className="text-3xl lg:text-5xl font-bold text-primary-foreground mb-6"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Ready to Find Your Dream Job?
            </motion.h2>
            <motion.p
              className="text-xl text-primary-foreground/90 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join thousands of professionals who have already discovered their perfect career
              match. Start your journey today and unlock endless opportunities.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={itemVariants}
          >
            <motion.button
              className="bg-primary-foreground text-primary px-8 py-4 rounded-xl hover:bg-primary-foreground/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              whileHover={{
                scale: 1.05,
                y: -3,
                boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Get Started Free</span>
              <IconArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              className="border-2 border-primary-foreground text-primary-foreground px-8 py-4 rounded-xl hover:bg-primary-foreground hover:text-primary transition-all duration-200 font-medium"
              whileHover={{
                scale: 1.05,
                y: -3,
                backgroundColor: "hsl(var(--primary-foreground))",
                color: "hsl(var(--primary))",
              }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-8" variants={itemVariants}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="flex items-center justify-center space-x-2 mb-2"
                  whileHover={{ rotate: 5 }}
                >
                  {stat.icon}
                  <motion.span
                    className="text-3xl font-bold text-primary-foreground"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      delay: index * 0.1 + 0.5,
                    }}
                  >
                    {stat.number}
                  </motion.span>
                </motion.div>
                <p className="text-primary-foreground/80 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-12 pt-8 border-t border-primary-foreground/20"
            variants={itemVariants}
          >
            <motion.p
              className="text-primary-foreground/70 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              Trusted by leading companies worldwide
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center justify-center gap-8 opacity-60"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
            >
              {["Google", "Microsoft", "Apple", "Amazon", "Meta"].map((company, index) => (
                <motion.span
                  key={company}
                  className="text-primary-foreground/60 font-medium"
                  whileHover={{
                    opacity: 1,
                    scale: 1.1,
                    color: "hsl(var(--primary-foreground))",
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 0.6, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 1 }}
                >
                  {company}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default CTASection;
