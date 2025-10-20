"use client";
import React, { useEffect, useRef } from "react";
import { Link } from "@/i18n/routing";
import { AnimatePresence, motion, Variants, cubicBezier } from "framer-motion";
import Actions from "./Actions";

type MobileMenuProps = {
  isOpen: boolean;
  navLinks: { name: string; href: string }[];
  burgerRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
};

const menuVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(0% 0% 100% 0%)",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      duration: 0.45,
      ease: cubicBezier(0.22, 1, 0.36, 1),
    },
  },
  exit: {
    opacity: 0,
    clipPath: "inset(0% 0% 100% 0%)",
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
};

const LinkMotion = motion.create(Link);

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  navLinks,
  burgerRef,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => onClose();
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        burgerRef.current &&
        !burgerRef.current.contains(target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, burgerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          variants={menuVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          ref={menuRef}
          className="lg:hidden overflow-hidden"
        >
          <div className="px-4 py-12 space-y-1 bg-gray-50 text-white dark:bg-[#222] backdrop-blur-glass border-t border-glass-border shadow-lg rounded-b-2xl">
            <div className="pb-6">
              <Actions showOn="mobile" />
            </div>
            {navLinks.map((link, i) => (
              <LinkMotion
                key={link.name}
                href={link.href}
                onClick={onClose}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-400 dark:text-white hover:text-white transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-gray-600"
              >
                {link.name}
              </LinkMotion>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(MobileMenu);
