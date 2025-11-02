"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import DashboardLogo from "@/components/shared/DashboardLogo";

type Props = { onLogout: () => void };

export function DashboardHeader({ onLogout }: Props) {
  return (
    <header className="border-b border-border bg-white/50 backdrop-blur-lg sticky top-0 z-50 h-full">
      <div className="container mx-auto px-6 h-full">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 h-full">
            <DashboardLogo />

            <div>
              <h1 className="text-xl font-bold text-foreground">
                Chatbot Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage Conversations
              </p>
            </div>
          </div>

          <Button onClick={onLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </motion.div>
      </div>
    </header>
  );
}
