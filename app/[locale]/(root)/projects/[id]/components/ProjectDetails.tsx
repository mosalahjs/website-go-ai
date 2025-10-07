"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  fullDescription: string;
  challenges: string[];
  solutions: string[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProjectDetails({ fullDescription, challenges, solutions }: Props) {
  return (
    <div className="lg:col-span-2 space-y-12">
      {/* Overview */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold mb-4">Overview</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {fullDescription}
        </p>
      </motion.div>

      {/* Challenges */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold mb-4">Challenges</h2>
        <Card className="border-border/40">
          <CardContent className="p-6 space-y-4">
            {challenges.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Solutions */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        variants={sectionVariants}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl font-bold mb-4">Solutions</h2>
        <Card className="border-border/40">
          <CardContent className="p-6 space-y-4">
            {solutions.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="inline-block w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default memo(ProjectDetails);
