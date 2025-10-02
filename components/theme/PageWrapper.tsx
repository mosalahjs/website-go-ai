"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, memo } from "react";

type PageWrapperProps = {
  children: React.ReactNode;
};

const PageWrapperComponent: React.FC<PageWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const [showPage, setShowPage] = useState(true);

  useEffect(() => {
    setShowPage(false);

    const timeout = setTimeout(() => setShowPage(true), 1500);
    document.body.style.overflow = "hidden";
    return () => clearTimeout(timeout);
  }, [pathname]);

  return <>{showPage && children}</>;
};

const PageWrapper = memo(PageWrapperComponent);
PageWrapper.displayName = "PageWrapper";

export default PageWrapper;
