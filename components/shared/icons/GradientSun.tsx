import React from "react";

export const GradientSun = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className={className}
  >
    <defs>
      <radialGradient id="sunCore3D" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF9C4" />
        <stop offset="40%" stopColor="#FFD43B" />
        <stop offset="75%" stopColor="#FF8E3C" />
        <stop offset="100%" stopColor="#D84315" />
      </radialGradient>

      <radialGradient id="sunGlow3D" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="rgba(255,200,0,0.6)" />
        <stop offset="70%" stopColor="rgba(255,126,71,0.25)" />
        <stop offset="100%" stopColor="transparent" />
      </radialGradient>
    </defs>

    {/* Halo Glow */}
    <circle cx="24" cy="24" r="20" fill="url(#sunGlow3D)" />

    {/* Core 3D sphere */}
    <circle cx="24" cy="24" r="12" fill="url(#sunCore3D)" />
  </svg>
);
