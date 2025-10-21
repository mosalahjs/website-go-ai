"use client";

import * as React from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

export const MotionProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};

export const motion = m as typeof m;

// دخول/خروج هادي بدون ارتداد
export const TRANS_FADE = { duration: 0.24, ease: [0.2, 0.8, 0.2, 1] } as const;
export const TRANS_EXIT = { duration: 0.16, ease: [0.2, 0.8, 0.2, 1] } as const;
