"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { Link } from "@/i18n/routing";

const MotionLink = motion(Link);

const Logo: React.FC = () => {
  return (
    <MotionLink
      href="/"
      aria-label="Home"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Image
        src={`/logo/main-logo.png`}
        alt="logo"
        width={250}
        height={250}
        priority
        className="object-cover size-36 md:size-56"
      />
    </MotionLink>
  );
};

export default React.memo(Logo);
