"use client";

import {
  IconChartPie,
  IconBuilding,
  IconMessageCircle,
  IconTrendingUp,
  IconArrowRight,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const CategorySection = () => {
  const categories = [
    {
      icon: <IconChartPie className="w-8 h-8 text-foreground" />,
      name: "Business Development",
      openPositions: 1,
    },
    {
      icon: <IconBuilding className="w-8 h-8 text-foreground" />,
      name: "Construction",
      openPositions: 0,
    },
    {
      icon: <IconMessageCircle className="w-8 h-8 text-foreground" />,
      name: "Customer Service",
      openPositions: 1,
    },
    {
      icon: <IconTrendingUp className="w-8 h-8 text-foreground" />,
      name: "Finance",
      openPositions: 1,
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
    hidden: { opacity: 0, y: 50, scale: 0.8 },
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
      className="py-16 bg-background"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12"
          variants={headerVariants}
        >
          <div className="mb-6 lg:mb-0">
            <motion.h2
              className="text-3xl lg:text-4xl font-bold text-foreground mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Search by Category
            </motion.h2>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Search your career opportunity with our categories
            </motion.p>
          </div>
          <motion.a
            href="#"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            All Categories <IconArrowRight className="ml-2 w-4 h-4" />
          </motion.a>
        </motion.div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-primary/10 p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-200 cursor-pointer group hover:shadow-lg"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <motion.div
                  className="p-3 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors duration-200"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {category.icon}
                </motion.div>
                <h3 className="font-semibold text-foreground text-lg">{category.name}</h3>
                <p className="text-muted-foreground">
                  {category.openPositions} open position{category.openPositions !== 1 ? "s" : ""}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CategorySection;
