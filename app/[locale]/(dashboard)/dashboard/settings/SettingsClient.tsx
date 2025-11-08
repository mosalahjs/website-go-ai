"use client";

import React from "react";
import { motion } from "framer-motion";
import SystemInfoCard from "./components/SystemInfoCard";
import AccountCard from "./components/AccountCard";
import AppearanceCard from "./components/AppearanceCard";
import { useLogout } from "@/hooks/use-logout";

export default function SettingsClient() {
  const { logout } = useLogout();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your preferences and account
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppearanceCard />
        <AccountCard onLogout={logout} />
        <SystemInfoCard />
      </div>
    </div>
  );
}
