"use client";
import * as React from "react";
import { GlowButton } from "@/components/ui/glow-button";
import { useReducedMotion } from "framer-motion";

type TagPillProps = {
  label: string;
  className?: string;
  size?: "sm" | "md";
  from?: string;
  to?: string;
  fromDark?: string;
  toDark?: string;
  glowFrom?: string;
  glowTo?: string;
};

function cn(...a: Array<string | false | undefined>) {
  return a.filter(Boolean).join(" ");
}

function TagPillInner({
  label,
  size = "sm",
  className,
  from = "#3479fe",
  to = "#4898ff",
  fromDark = "#222834",
  toDark = "#343f4f",
  glowFrom = "rgba(52,121,254,0.45)",
  glowTo = "rgba(72,152,255,0.45)",
}: TagPillProps) {
  const reduced = useReducedMotion();

  const stop = React.useCallback((e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const gradLight = React.useMemo(
    () => `linear-gradient(90deg, ${from}, ${to})`,
    [from, to]
  );
  const gradDark = React.useMemo(
    () => `linear-gradient(90deg, ${fromDark}, ${toDark})`,
    [fromDark, toDark]
  );

  return (
    <GlowButton
      asChild
      size={size}
      sheen
      glowFrom={glowFrom}
      glowTo={glowTo}
      lightBg="transparent"
      darkBg="transparent"
      borderLight="transparent"
      borderDark="transparent"
      textColorLight="#fff"
      textColorDark="#fff"
      className={cn(
        "relative cursor-default select-none rounded-full text-xs font-medium",
        "px-3 py-1 text-white shadow-sm hover:shadow-md",
        "!bg-transparent !border-transparent",
        className
      )}
      aria-hidden
      role="presentation"
      tabIndex={-1}
      draggable={false}
      onPointerDown={stop}
      onClick={stop}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full"
        style={{ backgroundImage: gradLight }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-full hidden dark:block"
        style={{ backgroundImage: gradDark }}
      />

      <span
        className={cn(
          "relative z-10 flex items-center gap-2",
          reduced
            ? ""
            : "transition-transform duration-300 group-hover:scale-[1.03]"
        )}
      >
        {label}
      </span>
    </GlowButton>
  );
}

export const TagPill = React.memo(TagPillInner);
TagPill.displayName = "TagPill";
