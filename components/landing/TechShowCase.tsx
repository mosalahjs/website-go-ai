"use client";
import { WEBSITE_NAME } from "@/constant";
import { motion } from "framer-motion";

export default function TechShowcase() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-gradient-third border-2 border-main/80 backdrop-blur-xl"
          >
            <div className="h-2 w-2 rounded-full bg-main animate-pulse" />
            <span className="text-sm font-bold text-primary">
              Powered by Advanced AI
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl leading-20 font-bold text-gradient-third">
            Why Choose <span className="">{WEBSITE_NAME}</span>
          </h2>

          <p className="text-xl text-main-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We combine cutting-edge AI technology with proven software
            development practices to deliver solutions that don&apos;t just meet
            expectations they exceed them.
          </p>

          <div className="grid md:grid-cols-3 gap-8 pt-12 items-stretch">
            {[
              {
                value: "10x",
                label: "Faster Development",
                description: "AI-assisted coding accelerates delivery",
              },
              {
                value: "99.9%",
                label: "On Prem For Data Sovereignty",
                description: "Enterprise-grade reliability",
              },
              {
                value: "24/7",
                label: "Support Available",
                description: "Always here when you need us",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 + 0.4 }}
                className="group h-full"
              >
                <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur-xl transition-all duration-500 card-gradient-border h-full flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_30px_rgba(0,0,0,0.25)]">
                  <div className="absolute inset-0 bg-gradient-third opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500" />

                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="text-5xl font-bold text-gradient-third mb-3"
                  >
                    {stat.value}
                  </motion.div>

                  <div className="text-lg font-semibold mb-2 text-main-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-sm text-main-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
