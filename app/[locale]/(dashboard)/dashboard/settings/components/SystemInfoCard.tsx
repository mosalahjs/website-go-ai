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

type Props = {
  version?: string;
  apiStatus?: "Operational" | "Degraded" | "Down";
  lastUpdated?: string; // ISO or preformatted
};

const SystemInfoCard = memo(function SystemInfoCard({
  version = "1.0.0",
  apiStatus = "Operational",
  lastUpdated = new Date().toLocaleDateString(),
}: Props) {
  return (
    <motion.div
      className="md:col-span-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Dashboard and API details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Version</span>
            <span className="font-semibold">{version}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">API Status</span>
            <span
              className={`font-semibold ${
                apiStatus === "Operational" ? "text-primary" : ""
              }`}
            >
              {apiStatus}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Last Updated</span>
            <span className="font-semibold">{lastUpdated}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SystemInfoCard;
