"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
};

export function RevealSection({ children, delay = 0 }: Props) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
      animate={
        isInView
          ? { opacity: 1, scale: 1, rotate: 0 }
          : { opacity: 0, scale: 0.9, rotate: -2 }
      }
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
