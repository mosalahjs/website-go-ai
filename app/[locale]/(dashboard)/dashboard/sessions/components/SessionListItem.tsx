"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { Session } from "@/types/dashboard/sessions.type";
import { getSessionTitle } from "@/lib/sessions/utils";

type Props = {
  session: Session;
  active: boolean;
  onClick: () => void;
  actions?: React.ReactNode;
};

const SessionListItem = memo(function SessionListItem({
  session,
  active,
  onClick,
  actions,
}: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative p-4 mb-2 rounded-2xl cursor-pointer transition-all duration-300 ${
        active
          ? "bg-main-muted-foreground/30 border border-primary/30 shadow-soft"
          : "hover:bg-main/10 border border-transparent hover:border-border/50"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm font-medium truncate">
              {getSessionTitle(session)}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {session.messages.length} messages
          </p>
        </div>
        {actions}
      </div>
    </motion.div>
  );
});

export default SessionListItem;
