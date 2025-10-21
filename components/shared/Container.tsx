import React, { ReactNode, forwardRef } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  overflow?: "auto" | "hidden" | "visible" | "scroll" | "clip";
};

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ children, className = "", fullHeight = false, overflow }, ref) => {
    const heightClass = fullHeight ? "h-full" : "";
    const overflowClass = overflow ? `overflow-${overflow}` : "";

    return (
      <div
        ref={ref}
        className={`container mx-auto px-2 sm:px-4 md:px-8 xl:px-16 ${heightClass} ${overflowClass} ${className}`}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
