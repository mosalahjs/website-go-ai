import React from "react";

export const GradientMoon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="url(#moonGradient)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <defs>
      <linearGradient id="moonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0C73E3" />
        <stop offset="50%" stopColor="#7A5AF8" />
        <stop offset="100%" stopColor="#A1A9B3" />
      </linearGradient>
    </defs>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);
