"use client";
import React, { ComponentProps, forwardRef } from "react";
import { motion } from "framer-motion";

type BurgerButtonProps = {
  isOpen: boolean;
  size?: number | string;
  id: string;
  toggle: () => void;
};

const Path = (props: ComponentProps<typeof motion.path>) => (
  <motion.path
    fill="transparent"
    strokeWidth="2.5"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const BurgerButton = forwardRef<HTMLButtonElement, BurgerButtonProps>(
  ({ isOpen, size = 24, id, toggle }, ref) => {
    return (
      <button
        ref={ref}
        id={id}
        onClick={toggle}
        className="flex items-center hover:cursor-pointer justify-center p-2 text-foreground hover:text-nav-primary transition"
        aria-label="Toggle menu"
      >
        <svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            initial="closed"
            variants={{
              closed: { d: "M 3 6 L 21 6" },
              open: { d: "M 6 18 L 18 6" },
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <Path
            initial="closed"
            variants={{
              closed: { d: "M 3 12 L 21 12", opacity: 1 },
              open: { d: "M 3 12 L 21 12", opacity: 0 },
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
          <Path
            initial="closed"
            variants={{
              closed: { d: "M 3 18 L 21 18" },
              open: { d: "M 6 6 L 18 18" },
            }}
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          />
        </svg>
      </button>
    );
  }
);

BurgerButton.displayName = "BurgerButton";

export default BurgerButton;
