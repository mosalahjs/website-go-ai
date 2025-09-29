"use client";
import { motion } from "framer-motion";
import React from "react";
import clsx from "clsx";
import { Link } from "@/i18n/routing";

const MotionLink = motion(Link);

type NavLinkProps = {
  href: string;
  label: string;
  delay?: number;
};

const NavLink: React.FC<NavLinkProps> = ({ href, label, delay = 0 }) => {
  return (
    <MotionLink
      href={href}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay, duration: 0.35 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        "relative px-3 py-2 text-lg font-medium group",
        "text-foreground transition-colors duration-300",
        "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r",
        "hover:from-[#0C73E3] hover:to-[#4A90E2]",
        "dark:hover:from-[#8E969B] dark:hover:to-[#525456]"
      )}
    >
      {label}

      <motion.span
        variants={{
          initial: { scaleX: 0, opacity: 0 },
          hover: { scaleX: 1, opacity: 1 },
        }}
        className={clsx(
          "absolute left-0 bottom-0 h-[2px] w-full origin-left",
          "bg-gradient-to-r from-[#0C73E3] via-[#B4CBE3] to-[#D9DEE2]",
          "dark:from-[#1F1E24] dark:via-[#525456] dark:to-[#8E969B]"
        )}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </MotionLink>
  );
};

export default React.memo(NavLink);
