"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTheme } from "next-themes";

const MotionLink = motion.create(Link);

const Logo: React.FC = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = !mounted
    ? "/logo/logo-light-png.png" // fallback
    : theme === "dark"
    ? "/logo/logo-dark.png"
    : "/logo/logo-light-png.png";

  return (
    <MotionLink
      href="/"
      aria-label="Home"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="relative h-16 w-40 sm:w-48">
        <Image
          src={logoSrc}
          alt="logo"
          fill
          priority
          className="object-cover"
        />
      </div>
    </MotionLink>
  );
};

export default React.memo(Logo);
