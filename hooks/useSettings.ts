"use client";

import { useCallback, useMemo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "@/lib/api";

export default function useSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = useMemo(
    () => (resolvedTheme ?? theme) === "dark",
    [resolvedTheme, theme]
  );

  /**
   * toggleDark(checked):
   *  - checked = true  => set dark
   *  - checked = false => set light
   */
  const toggleDark = useCallback(
    (checked: boolean) => setTheme(checked ? "dark" : "light"),
    [setTheme]
  );

  const handleLogout = useCallback(async () => {
    try {
      await api.logout?.();
      toast.success("You have been successfully logged out.");
      router.push("/");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  }, [router]);

  return { isDark, toggleDark, handleLogout, mounted };
}
