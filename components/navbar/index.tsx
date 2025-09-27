"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Navbar() {
  // Scroll progress
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 w-full z-50 shadow-lg",
        "bg-white/60 backdrop-blur-xl border-b border-white/20"
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <motion.h1
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-extrabold text-2xl tracking-tight text-blue-600"
        >
         Go Ai
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex gap-3"
        >
          <Button variant="ghost" className="hover:text-blue-600">Home</Button>
          <Button variant="ghost" className="hover:text-blue-600">About</Button>
          <Button variant="ghost" className="hover:text-blue-600">Contact</Button>
        </motion.div>
      </div>

      {/* Progress Bar تحت الناف بار */}
      <motion.div
        className="h-1.5 bg-gradient-to-r from-blue-500 to-gray-200 origin-left"
        style={{ scaleX }}
      />
    </motion.div>
  );
}
