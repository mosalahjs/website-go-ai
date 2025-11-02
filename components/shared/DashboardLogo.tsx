import Image from "next/image";
import React from "react";

type DashboardLogoProps = {
  width?: number;
  height?: number;
  src?: string;
  alt?: string;
  className?: string;
  imgClassName?: string;
};

export default function DashboardLogo({
  width = 160,
  height = 85,
  src = "/logo/logo-transparent.png",
  alt = "logo-icon",
  className = "",
  imgClassName = "",
}: DashboardLogoProps) {
  return (
    <div
      style={{ width, height, position: "relative" }}
      className={`rounded-xl overflow-hidden flex items-center justify-center ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 160px"
        className={`object-cover object-center rounded-xl ${imgClassName}`}
        priority
        draggable={false}
      />
    </div>
  );
}
