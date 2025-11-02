"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  History,
  FileEdit,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TabItem = {
  label: string;
  icon: LucideIcon;
  path?: string;
  variant?: "default" | "outline";
  extraClass?: string;
};

const TABS: TabItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    variant: "default",
    extraClass: "bg-main hover:bg-main/75 cursor-pointer",
  },
  { label: "All Chats", icon: History, path: "/chat/all", variant: "outline" },
  { label: "Content", icon: FileEdit, path: "/content", variant: "outline" },
  { label: "Settings", icon: Settings, path: "/settings", variant: "outline" },
];

const TabButton = React.memo(function TabButton({
  item,
  onNavigate,
  isActive,
}: {
  item: TabItem;
  onNavigate?: () => void;
  isActive?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Button
      type="button"
      variant={item.variant ?? "outline"}
      className={cn("gap-2", item.extraClass)}
      onClick={onNavigate}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium">{item.label}</span>
    </Button>
  );
});

export const NavTabs = React.memo(function NavTabs() {
  const router = useRouter();
  const pathname = usePathname();

  const navigateHandlers = React.useMemo(() => {
    return {
      "/chat/all": () => router.push("/chat/all"),
      "/content": () => router.push("/content"),
      "/settings": () => router.push("/settings"),
    } as Record<string, () => void>;
  }, [router]);

  return (
    <motion.nav
      role="navigation"
      aria-label="Primary"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 }}
      className="mt-2 mb-4 flex gap-2"
    >
      {TABS.map((item) => {
        const onNavigate = item.path ? navigateHandlers[item.path] : undefined;
        const isActive = item.path ? pathname === item.path : undefined;

        return (
          <TabButton
            key={item.label}
            item={item}
            onNavigate={onNavigate}
            isActive={isActive}
          />
        );
      })}
    </motion.nav>
  );
});

export default NavTabs;
