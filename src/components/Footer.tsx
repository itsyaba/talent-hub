"use client";

import {
  IconBrandFacebook,
  IconBrandTwitter,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  IconMapPin,
  IconArrowUp,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
    ],
    employers: [
      { name: "Post a Job", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Recruitment Tools", href: "#" },
      { name: "Employer Resources", href: "#" },
    ],
    candidates: [
      { name: "Find Jobs", href: "#" },
      { name: "Resume Builder", href: "#" },
      { name: "Career Advice", href: "#" },
      { name: "Salary Calculator", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <IconBrandFacebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <IconBrandTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <IconBrandInstagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <IconBrandLinkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  ];

  const contactInfo = [
    { icon: <IconMail className="w-5 h-5" />, text: "hello@talenhub.com" },
    { icon: <IconPhone className="w-5 h-5" />, text: "+1 (555) 123-4567" },
    { icon: <IconMapPin className="w-5 h-5" />, text: "San Francisco, CA" },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.footer
      className="bg-foreground text-primary-foreground"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <motion.div className="lg:col-span-2" variants={logoVariants}>
            <div className="mb-6">
              <motion.h3
                className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4"
                whileHover={{ scale: 1.05 }}
              >
                Talent Hub
              </motion.h3>
              <motion.p
                className="text-primary-foreground/80 leading-relaxed mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.8, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Connecting talented professionals with amazing opportunities. Your career journey
                starts here with our comprehensive job search platform.
              </motion.p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((contact, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-3 text-primary-foreground/80"
                  variants={itemVariants}
                  whileHover={{ x: 5, color: "hsl(var(--primary-foreground))" }}
                >
                  {contact.icon}
                  <span>{contact.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                    whileHover={{ x: 5, color: "hsl(var(--primary-foreground))" }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                    whileHover={{ x: 5, color: "hsl(var(--primary-foreground))" }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Employers & Candidates */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <div>
              <h4 className="font-semibold text-lg mb-4">Employers</h4>
              <ul className="space-y-3">
                {footerLinks.employers.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.a
                      href={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                      whileHover={{ x: 5, color: "hsl(var(--primary-foreground))" }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Candidates</h4>
              <ul className="space-y-3">
                {footerLinks.candidates.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.a
                      href={link.href}
                      className="text-primary-foreground/70 hover:text-primary-foreground transition-colors duration-200"
                      whileHover={{ x: 5, color: "hsl(var(--primary-foreground))" }}
                    >
                      {link.name}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Social Links */}
        <motion.div
          className="border-t border-primary-foreground/20 pt-8 mt-12"
          variants={itemVariants}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="flex space-x-4 mb-4 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary-foreground hover:bg-primary/40 transition-colors duration-200"
                  whileHover={{
                    scale: 1.2,
                    rotate: 360,
                    backgroundColor: "hsl(var(--primary) / 0.4)",
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>

            <motion.p
              className="text-primary-foreground/60 text-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.6, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              © 2025 Talent Hub. All rights reserved.
            </motion.p>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center hover:bg-primary/90"
        aria-label="Scroll to top"
        initial={{ opacity: 0, scale: 0, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        whileHover={{
          scale: 1.1,
          y: -5,
          boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
        }}
        whileTap={{ scale: 0.9 }}
      >
        <IconArrowUp className="w-5 h-5" />
      </motion.button>
    </motion.footer>
  );
};

export default Footer;
