"use client";

import * as React from "react";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CTAButton } from "@/components/ui/cta-button";

export type ProjectMediaCTAProps = {
  src: string;
  alt: string;
  title?: string;
  demoHref?: string;
  detailsHref?: string;
  demoLabel?: string;
  detailsLabel?: string;
  index?: number;
  priorityFirst?: number;
  ctaSize?: "sm" | "md" | "lg";
  heightClass?: string;
  className?: string;
};

function ProjectMediaCTAComponent({
  src,
  alt,
  title,
  demoHref,
  detailsHref,
  demoLabel = "View Demo",
  detailsLabel = "View Details",
  index = 0,
  priorityFirst = 2,
  ctaSize = "md",
  heightClass = "h-64",
  className = "",
}: ProjectMediaCTAProps) {
  const reducedMotion = useReducedMotion();

  const eager = index < priorityFirst;

  return (
    <div
      className={`relative ${heightClass} w-full overflow-hidden ${className}`}
    >
      <motion.div
        className="relative w-full h-full"
        whileHover={reducedMotion ? undefined : { scale: 1.06 }}
        transition={
          reducedMotion
            ? undefined
            : { type: "spring", stiffness: 220, damping: 24 }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={eager}
          loading={eager ? "eager" : "lazy"}
        />

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          initial={{ opacity: 0 }}
          whileHover={reducedMotion ? undefined : { opacity: 1 }}
          transition={
            reducedMotion ? undefined : { duration: 0.35, ease: "easeOut" }
          }
        />

        {/* Hover Buttons */}
        {(demoHref || detailsHref) && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileHover={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reducedMotion
                ? undefined
                : { type: "spring", stiffness: 240, damping: 22 }
            }
            className="absolute inset-0 flex items-center justify-center"
            aria-label={title ? `Actions for ${title}` : undefined}
          >
            <div className="hidden lg:flex items-center gap-3">
              {demoHref && (
                <CTAButton
                  asChild
                  size={ctaSize}
                  preset="demo"
                  showArrow={false}
                >
                  <Link
                    href={demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {demoLabel}
                  </Link>
                </CTAButton>
              )}

              {detailsHref && (
                <CTAButton asChild size={ctaSize}>
                  <Link href={detailsHref} prefetch={false}>
                    {detailsLabel}
                  </Link>
                </CTAButton>
              )}
            </div>

            <div className="lg:hidden">
              {demoHref && (
                <CTAButton asChild size={ctaSize} preset="demo">
                  <Link
                    href={demoHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {demoLabel}
                  </Link>
                </CTAButton>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export const ProjectMediaCTA = memo(ProjectMediaCTAComponent);
