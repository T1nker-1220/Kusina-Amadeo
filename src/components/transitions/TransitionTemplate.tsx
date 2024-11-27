"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TransitionTemplateProps {
  children: ReactNode;
  variant?: "slide" | "fade" | "scale" | "slideUp";
  duration?: number;
  delay?: number;
}

const variants = {
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  }
};

const TransitionTemplate = ({
  children,
  variant = "fade",
  duration = 0.3,
  delay = 0
}: TransitionTemplateProps) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants[variant]}
      transition={{
        duration,
        delay,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

export default TransitionTemplate;
