"use client";

import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UseLogoutOptions {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useLogout(options: UseLogoutOptions = {}) {
  const { redirectTo = "/login", onSuccess, onError } = options;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = useCallback(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          cache: "no-store",
          headers: { accept: "application/json" },
        });

        if (!res.ok) throw new Error("Logout failed");

        onSuccess?.();
        toast.success("Logged out successfully", {
          description: "You have been logged out",
        });

        router.push(redirectTo);
        router.refresh();

        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.replace(redirectTo);
          }
        }, 150);
      } catch (e) {
        const err = e instanceof Error ? e : new Error("Unknown error");
        onError?.(err);
        toast.error("Logout failed", {
          description: "Failed to log out, please try again",
        });
      }
    });
  }, [redirectTo, onSuccess, onError, router]);

  return { logout, isPending };
}
