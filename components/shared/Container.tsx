import React, { ReactNode } from "react";

export default function Container({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-8 lg:px-16">
      {children}
    </div>
  );
}
