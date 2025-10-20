"use client";
import { cubicBezier, type Variants } from "framer-motion";

export const easeSoft = cubicBezier(0.22, 1, 0.36, 1);

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (rm: boolean) => ({
    opacity: 1,
    transition: { staggerChildren: rm ? 0 : 0.08 },
  }),
};

export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (rm: boolean) => ({
    opacity: 1,
    y: 0,
    transition: rm ? { duration: 0 } : { duration: 0.6, ease: easeSoft },
  }),
};
