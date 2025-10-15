"use client";

import * as React from "react";
import { GlowButton } from "@/components/ui/glow-button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useReducedMotion } from "framer-motion";

type CTAButtonProps = React.ComponentProps<typeof GlowButton> & {
  iconLeft?: React.ReactNode;
  showArrow?: boolean;
  arrowIcon?: React.ReactNode;
  alignIconRight?: boolean;
  preset?: "demo" | "default";
  variant?: "default" | "outline";
};

export function CTAButton({
  children,
  className,
  iconLeft,
  showArrow = true,
  arrowIcon,
  alignIconRight = true,
  preset = "default",
  variant = "default",
  sheen = true,
  size = "lg",
  glowFrom,
  glowTo,
  disabled,
  loading,
  ...rest
}: CTAButtonProps) {
  const reducedMotion = useReducedMotion();

  const leftIcon =
    iconLeft ??
    (preset === "demo" ? (
      <PlayCircle className="h-5 w-5 opacity-95" aria-hidden="true" />
    ) : null);

  const rightArrow =
    showArrow &&
    (arrowIcon ?? (
      <ArrowRight
        className={[
          "h-4 w-4",
          "transition-transform duration-300",
          "group-hover:translate-x-1",
          reducedMotion ? "transform-none transition-none" : "",
        ].join(" ")}
        aria-hidden="true"
      />
    ));

  const baseClasses =
    variant === "outline"
      ? [
          "group",
          "bg-blue-50 dark:bg-transparent",
          "text-blue-500",
          "dark:text-white",
          "border-2 border-[#3479fe] dark:border-[#4898ff]",
          "shadow-md hover:shadow-xl",
          "hover:bg-gradient-to-r hover:from-[#3479fe] hover:to-[#4898ff]",
          "hover:dark:from-[#222834] hover:dark:to-[#343f4f]",
          "hover:text-white dark:hover:text-white hover:border-transparent",
          "transition-all duration-300",
        ].join(" ")
      : [
          "group",
          "bg-gradient-to-r from-[#3479fe] to-[#4898ff]",
          "dark:from-[#222834] dark:to-[#343f4f]",
          "text-white border-0 shadow-lg hover:shadow-xl",
        ].join(" ");

  return (
    <GlowButton
      sheen={sheen}
      size={size}
      disabled={disabled}
      loading={loading}
      glowFrom={glowFrom ?? "rgba(52,121,254,0.45)"}
      glowTo={glowTo ?? "rgba(72,152,255,0.45)"}
      className={[baseClasses, className ?? ""].join(" ")}
      {...rest}
    >
      <span className="flex items-center gap-2">
        {!alignIconRight && leftIcon}
        {alignIconRight && leftIcon && <>{leftIcon}</>}
        <span className="font-semibold">{children}</span>
        {rightArrow}
      </span>
    </GlowButton>
  );
}
