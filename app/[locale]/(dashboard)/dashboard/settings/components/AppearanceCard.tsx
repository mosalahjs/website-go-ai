"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import useSettings from "@/hooks/useSettings";

const AppearanceCard = memo(function AppearanceCard() {
  const { isDark, toggleDark, mounted } = useSettings();

  const Icon = mounted ? (
    isDark ? (
      <Moon className="h-5 w-5 text-primary" />
    ) : (
      <Sun className="h-5 w-5 text-primary" />
    )
  ) : (
    <span className="inline-block h-5 w-5" aria-hidden />
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize how the dashboard looks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon}
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark theme
                </p>
              </div>
            </div>

            <div suppressHydrationWarning>
              <Switch
                checked={mounted ? isDark : false}
                onCheckedChange={toggleDark}
                aria-busy={!mounted}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default AppearanceCard;
