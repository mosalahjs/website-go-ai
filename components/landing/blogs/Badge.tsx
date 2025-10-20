"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const Badge = React.memo(function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-semibold",
        "border-sky-500/30 bg-sky-500/10 text-sky-700",
        "dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-200",
        className
      )}
    >
      {children}
    </span>
  );
});
export default Badge;
