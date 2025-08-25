"use client";

import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession } from "@/hooks/use-session";
import { SignOut } from "./auth/sign-out";
import ThemeSwitcher from "./theme-switcher-01";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut" as const,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <motion.nav
      className="px-4 py-4 lg:px-8 shadow-md backdrop-blur-sm absolute top-0 z-50 right-0 left-0"
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <motion.div className="flex items-center" variants={itemVariants}>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Talent Hub
              </h1>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <motion.div
            className="hidden md:flex md:items-center md:space-x-8"
            variants={itemVariants}
          >
            <motion.a
              href="#jobs"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Find Jobs
            </motion.a>
            <motion.a
              href="#how-it-works"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              How It Works
            </motion.a>
            <motion.a
              href="#companies"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Companies
            </motion.a>
            <motion.a
              href="#categories"
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Job Categories
            </motion.a>
          </motion.div>

          {/* Sign In Button */}
          <motion.div className="hidden md:flex items-center space-x-4" variants={itemVariants}>
            <NotificationBell />
            <ThemeSwitcher />
            {session && !isPending ? (
              <>
                {/* {session.user.role === "admin" && (
                  <Link href="/dashboard/admin">
                    <motion.button
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Admin Dashboard
                    </motion.button>
                  </Link>
                )} */}
                <SignOut />
              </>
            ) : (
              <Link href="/login">
                <motion.button
                  className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.div className="md:hidden" variants={itemVariants}>
            <motion.button
              onClick={toggleMenu}
              className="text-foreground hover:text-primary transition-colors duration-200 p-2 rounded-lg hover:bg-primary/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </motion.button>
          </motion.div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 pb-4 border-t border-border/20"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="flex flex-col space-y-4 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.a
                  href="#jobs"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  whileHover={{ x: 10 }}
                >
                  Find Jobs
                </motion.a>
                <motion.a
                  href="#how-it-works"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  whileHover={{ x: 10 }}
                >
                  How It Works
                </motion.a>
                <motion.a
                  href="#companies"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  whileHover={{ x: 10 }}
                >
                  Companies
                </motion.a>
                <motion.a
                  href="#categories"
                  className="text-foreground hover:text-primary transition-colors duration-200 font-medium py-2"
                  whileHover={{ x: 10 }}
                >
                  Job Categories
                </motion.a>
                {session && !isPending && session.user.role === "admin" && (
                  <Link href="/dashboard/admin">
                    <motion.button
                      className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Admin Dashboard
                    </motion.button>
                  </Link>
                )}
                {session && !isPending ? (
                  <SignOut />
                ) : (
                  <motion.button
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 font-medium w-full mt-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign in
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
