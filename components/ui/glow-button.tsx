"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { useReducedMotion } from "framer-motion";

export type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  asChild?: boolean;
  sheen?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  loading?: boolean;

  lightBg?: string;
  darkBg?: string;
  textColorLight?: string;
  textColorDark?: string;
  borderLight?: string;
  borderDark?: string;
  glowFrom?: string;
  glowTo?: string;
};

const defaultColors = {
  lightBg: "rgba(255,255,255,0.9)",
  darkBg: "rgba(255,255,255,0.08)",
  textColorLight: "#000",
  textColorDark: "#fff",
  borderLight: "rgba(255,255,255,0.5)",
  borderDark: "rgba(255,255,255,0.12)",
  glowFrom: "rgba(99,102,241,0.45)",
  glowTo: "rgba(236,72,153,0.45)",
};

const sizeClasses: Record<NonNullable<GlowButtonProps["size"]>, string> = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-3 text-base",
};

// Inject sheen animation keyframes once (HMR-safe)
let sheenInjected = false;
function SheenKeyframes() {
  React.useEffect(() => {
    if (sheenInjected || document.querySelector("[data-glow-sheen]")) return;
    const style = document.createElement("style");
    style.setAttribute("data-glow-sheen", "true");
    style.textContent = `
@keyframes glowSheenMove {
  0% { left: -75%; opacity: 0; }
  40% { opacity: 0.4; }
  60% { left: 125%; opacity: 0.4; }
  100% { left: 125%; opacity: 0; }
}`;
    document.head.appendChild(style);
    sheenInjected = true;
  }, []);
  return null;
}

function cn(...args: Array<string | undefined | false>) {
  return args.filter(Boolean).join(" ");
}

type CSSVarKeys =
  | "--gbg-light"
  | "--gbg-dark"
  | "--gtxt-light"
  | "--gtxt-dark"
  | "--gborder-light"
  | "--gborder-dark"
  | "--gglow-from"
  | "--gglow-to";

type GlowStyleVars = React.CSSProperties & Partial<Record<CSSVarKeys, string>>;

export const GlowButton = React.memo(
  React.forwardRef<HTMLButtonElement, GlowButtonProps>(function GlowButton(
    {
      children,
      asChild,
      sheen = true,
      size = "md",
      className,
      disabled,
      loading = false,

      lightBg = defaultColors.lightBg,
      darkBg = defaultColors.darkBg,
      textColorLight = defaultColors.textColorLight,
      textColorDark = defaultColors.textColorDark,
      borderLight = defaultColors.borderLight,
      borderDark = defaultColors.borderDark,
      glowFrom = defaultColors.glowFrom,
      glowTo = defaultColors.glowTo,
      ...rest
    },
    ref
  ) {
    const reducedMotion = useReducedMotion();

    const Comp: React.ElementType = asChild ? Slot : "button";

    const styleVars: GlowStyleVars = {
      "--gbg-light": lightBg,
      "--gbg-dark": darkBg,
      "--gtxt-light": textColorLight,
      "--gtxt-dark": textColorDark,
      "--gborder-light": borderLight,
      "--gborder-dark": borderDark,
      "--gglow-from": glowFrom,
      "--gglow-to": glowTo,
    };

    const isDisabled = !!disabled || !!loading;

    const nativeButtonProps = asChild ? {} : { type: "button" as const };

    const interactiveStateClasses = isDisabled
      ? "opacity-60 cursor-not-allowed pointer-events-none"
      : "hover:-translate-y-0.5 active:translate-y-0";

    return (
      <>
        {sheen && <SheenKeyframes />}
        <Comp
          ref={ref}
          {...nativeButtonProps}
          {...rest}
          {...(!asChild && { disabled: isDisabled })}
          aria-busy={loading || undefined}
          {...(asChild && isDisabled ? { "aria-disabled": true } : {})}
          className={cn(
            "relative overflow-hidden rounded-full font-semibold inline-flex items-center justify-center select-none",
            "transition-all duration-300 will-change-transform backdrop-blur-md",
            interactiveStateClasses,
            "shadow-md hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
            sizeClasses[size],
            "border bg-[var(--gbg-light)] text-[var(--gtxt-light)] border-[color:var(--gborder-light)]",
            "dark:bg-[var(--gbg-dark)] dark:text-[var(--gtxt-dark)] dark:border-[color:var(--gborder-dark)]",
            // Glow Layer
            "after:content-[''] after:absolute after:inset-0 after:rounded-full after:-z-10 after:pointer-events-none",
            "after:bg-gradient-to-r after:from-[var(--gglow-from)] after:to-[var(--gglow-to)]",
            isDisabled
              ? "after:opacity-0"
              : "after:opacity-0 hover:after:opacity-100",
            "after:blur-sm",
            // Sheen Sweep Layer
            sheen
              ? cn(
                  "before:content-[''] before:absolute before:top-0 before:left-[-75%] before:w-[50%] before:h-full before:rounded-full before:skew-x-[20deg] before:pointer-events-none",
                  "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
                  reducedMotion
                    ? "before:opacity-0"
                    : "hover:before:animate-[glowSheenMove_1.4s_ease-in-out_2_alternate]"
                )
              : "",
            className
          )}
          style={styleVars}
        >
          <span className="relative z-10 flex items-center gap-2">
            {loading && (
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
              />
            )}
            {children}
          </span>
        </Comp>
      </>
    );
  })
);
