"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useRef, useCallback } from "react";

type Props = {
  href?: string;
  label?: string;
  className?: string;
};

export default function BackToProjectsButton({
  href = "/projects",
  label = "Back to Projects",
  className,
}: Props) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const nx = (mx / rect.width) * 2 - 1;
    const ny = (my / rect.height) * 2 - 1;
    setPos({ x: nx, y: ny });
  }, []);

  const tiltX = hover ? -(pos.y * 4) : 0;
  const tiltY = hover ? pos.x * 4 : 0;

  return (
    <Link
      ref={ref}
      href={href}
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      className={[
        "group relative inline-flex items-center",
        "no-underline select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/70",
        "focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900",
        className || "",
      ].join(" ")}
      style={{
        transform: `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        transition: "transform 200ms ease, filter 200ms ease",
      }}
    >
      {/* Gradient border container */}
      <span
        className={[
          "relative p-[2px] rounded-2xl",
          "bg-[linear-gradient(90deg,var(--g1),var(--g2),var(--g3))]",
          "shadow-lg transition-shadow duration-300 group-hover:shadow-xl",
          "[--g1:#2563eb] [--g2:#06b6d4] [--g3:#22d3ee]",
          "dark:[--g1:#60a5fa] dark:[--g2:#38bdf8] dark:[--g3:#22d3ee]",
        ].join(" ")}
        style={{ willChange: "transform" }}
      >
        {/* Inner surface */}
        <span
          className={[
            "relative inline-flex items-center gap-2 rounded-[14px] px-5 py-3 transition-colors duration-300",

            "bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white shadow-md",
            "hover:shadow-lg",

            "dark:bg-zinc-900/75 dark:text-zinc-50 dark:backdrop-blur-md dark:shadow-md/40",
            "dark:border dark:border-white/10",
          ].join(" ")}
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span className="font-medium">{label}</span>

          <span
            aria-hidden
            className={[
              "pointer-events-none absolute -inset-0.5 rounded-[16px] blur-xl",
              "opacity-0 group-hover:opacity-25 transition-opacity duration-300",
              "bg-[radial-gradient(60%_60%_at_50%_50%,rgba(14,165,233,.35),transparent_70%)]",
              "dark:bg-[radial-gradient(60%_60%_at_50%_50%,rgba(56,189,248,.25),transparent_70%)]",
            ].join(" ")}
          />

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]"
          >
            <span
              className={[
                "absolute -inset-y-6 -left-16 w-14 rotate-12 opacity-0",
                "bg-white/65 dark:bg-white/35",
                "transition-all duration-700 ease-out",
                "group-hover:left-[110%] group-hover:opacity-100",
              ].join(" ")}
              style={{ filter: "blur(10px)" }}
            />
          </span>
        </span>

        <span
          aria-hidden
          className={[
            "pointer-events-none absolute inset-0 rounded-2xl",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-400",
          ].join(" ")}
          style={{
            background:
              "linear-gradient(120deg, var(--g1)/.18, var(--g2)/.18, transparent 65%)",
            mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: 2,
          }}
        />
      </span>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          a[aria-label="${label}"] {
            transform: none !important;
          }
        }
      `}</style>
    </Link>
  );
}
