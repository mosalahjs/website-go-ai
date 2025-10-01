"use client";
import { motion } from "framer-motion";

export function ContactHero() {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gradient-third">
            Get in <span className="">Touch</span>
          </h1>
          <p className="text-xl text-main-muted-foreground">
            Have a project in mind? Let&apos;s discuss how we can help bring
            your vision to life.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
