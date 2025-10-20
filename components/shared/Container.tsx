import React, { ReactNode } from "react";

export default function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`container mx-auto px-2 sm:px-4 md:px-8 xl:px-16 ${className}`}
    >
      {children}
    </div>
  );
}
