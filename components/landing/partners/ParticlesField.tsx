"use client";

import React, { memo, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { seededRng, randBetween } from "@/lib/random/seeded";

function useParticles(count: number, seedKey: string) {
  return useMemo(() => {
    const r = seededRng(`particles:${seedKey}:${count}`);
    return Array.from({ length: count }).map(() => ({
      left: `${randBetween(r, 0, 100)}%`,
      top: `${randBetween(r, 0, 100)}%`,
      delay: randBetween(r, 0, 2),
      duration: randBetween(r, 3, 7),
    }));
  }, [count, seedKey]);
}

interface ParticlesFieldProps {
  count: number;
  seedKey: string;
}

const ParticlesField: React.FC<ParticlesFieldProps> = ({ count, seedKey }) => {
  const prefersReducedMotion = useReducedMotion();
  const particles = useParticles(count, seedKey);

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{ left: p.left, top: p.top }}
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -30, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: p.duration, repeat: Infinity, delay: p.delay }
          }
          aria-hidden
        />
      ))}
    </>
  );
};

export default memo(ParticlesField);
