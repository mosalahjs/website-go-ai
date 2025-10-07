"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  gradient: string;
  tags: string[];
  title: string;
  description: string;
  buttonGradientStyles: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProjectHero({
  gradient,
  tags,
  title,
  description,
  buttonGradientStyles,
}: Props) {
  const router = useRouter();

  return (
    <section
      className={`py-24 bg-gradient-to-br ${gradient} relative overflow-hidden text-white`}
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/projects")}
            className={`mb-6 ${buttonGradientStyles}`}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="bg-white/20 text-white"
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h1 className="text-5xl font-bold">{title}</h1>
            <p className="text-lg text-white/80">{description}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(ProjectHero);
