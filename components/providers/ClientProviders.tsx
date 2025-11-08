// components/providers/ClientProviders.tsx
"use client";

import { Toaster } from "sonner";
import AutoLogoutClient from "@/components/auth/AutoLogoutClient";

type Props = {
  locale: string;
};

export default function ClientProviders({ locale }: Props) {
  const isRTL = locale === "ar";

  return (
    <>
      <Toaster
        richColors
        closeButton
        expand={false}
        position={isRTL ? "top-left" : "top-right"}
      />
      <AutoLogoutClient
        options={{
          tokenCookieName: "auth_token",

          clockSkewMs: 1000,
          debug: false,
        }}
      />
    </>
  );
}
