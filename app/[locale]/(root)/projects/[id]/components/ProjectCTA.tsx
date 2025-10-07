"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
  buttonGradientStyles: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function ProjectCTA({ buttonGradientStyles }: Props) {
  const router = useRouter();

  return (
    <section className="py-24 bg-gradient-to-br from-muted to-background">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          variants={sectionVariants}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Project?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let&apos;s discuss how we can bring your vision to life with
            cutting-edge technology.
          </p>
          <Button
            size="lg"
            className={buttonGradientStyles}
            onClick={() => router.push("/contact")}
          >
            Get in Touch
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(ProjectCTA);
