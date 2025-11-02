"use client";
import * as React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend: string;
  delayIndex?: number;
  className?: string;
};

function getTrendState(trend: string) {
  const t = trend.trim();
  if (!t) return "neutral" as const;
  if (t.startsWith("+")) return "up" as const;
  if (t.startsWith("-")) return "down" as const;
  return "neutral" as const;
}

const BASE_DELAY = 0.06;

export const StatsCard: React.FC<StatsCardProps> = React.memo(
  function StatsCard({ icon, title, value, trend, delayIndex = 0, className }) {
    const state = getTrendState(trend);

    const TrendIcon =
      state === "up" ? ArrowUp : state === "down" ? ArrowDown : null;
    const trendColor =
      state === "up"
        ? "text-primary"
        : state === "down"
        ? "text-destructive"
        : "text-muted-foreground";

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: BASE_DELAY * delayIndex }}
        whileHover={{ y: -2, scale: 1.01 }} // ✨ رفع خفيف + سكيل
        style={{ willChange: "transform" }}
      >
        <Card
          className={cn(
            "group relative overflow-hidden p-6 border border-border/50 bg-card/80 backdrop-blur-sm",
            "transition-all duration-200 ease-out transform-gpu",
            "hover:shadow-xl hover:ring-2 hover:ring-main/25 hover:border-main/60",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/40",
            className
          )}
          aria-label={`${title}: ${value} (${trend})`}
          tabIndex={0}
        >
          <div
            className="
            pointer-events-none absolute inset-0 opacity-0
            transition-opacity duration-300
            group-hover:opacity-100
            bg-[radial-gradient(120px_80px_at_20%_0%,rgba(255,255,255,0.08),transparent_60%)]
          "
          />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl bg-main text-white flex items-center justify-center shadow-lg",
                  "transition-transform duration-200 group-hover:-translate-y-0.5"
                )}
              >
                {icon}
              </div>

              <div
                className={cn(
                  "flex items-center gap-1 text-sm font-medium",
                  "transition-colors duration-200",
                  trendColor
                )}
                aria-live="polite"
              >
                {TrendIcon ? (
                  <TrendIcon className="w-4 h-4 text-main" aria-hidden="true" />
                ) : null}
                <span className="text-main">{trend || "—"}</span>
              </div>
            </div>

            <h3 className="text-3xl font-bold text-foreground leading-none mb-1">
              {value}
            </h3>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </Card>
      </motion.div>
    );
  }
);

export default StatsCard;
