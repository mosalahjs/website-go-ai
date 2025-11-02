"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, MessageCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ===========================
   Local Types (in-file)
   =========================== */

export type SessionStatus = "active" | "completed" | "pending";

export interface Session {
  id: string;
  userName: string;
  lastMessage: string;
  messageCount: number;
  timestamp: string;
  status: SessionStatus;
}

interface SessionCardProps {
  session: Session;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  delayIndex?: number;
  className?: string;
}

/* ===========================
   Constants
   =========================== */

const BASE_DELAY = 0.04;

const STATUS_CLASSES = {
  active: "bg-main text-white",
  completed: "bg-secondary text-foreground",
  pending: "bg-muted text-muted-foreground",
} satisfies Record<SessionStatus, string>;

const STATUS_LABELS = {
  active: "Active",
  completed: "Completed",
  pending: "Pending",
} satisfies Record<SessionStatus, string>;

/* ===========================
   Helpers
   =========================== */

function getInitial(name: string) {
  const t = name.trim();
  return t ? t.charAt(0) : "?";
}

/* ===========================
   Component
   =========================== */

const SessionCard: React.FC<SessionCardProps> = React.memo(
  function SessionCard({
    session,
    onDelete,
    onEdit,
    delayIndex = 0,
    className,
  }) {
    const router = useRouter();

    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: BASE_DELAY * delayIndex }}
      >
        <Card className={cn("p-6 glass-effect hover-lift", className)}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <div
                aria-hidden="true"
                className="w-12 h-12 rounded-xl bg-main text-white font-bold shadow-lg grid place-items-center"
              >
                {getInitial(session.userName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {session.userName}
                  </h3>
                  <Badge className={cn(STATUS_CLASSES[session.status])}>
                    {STATUS_LABELS[session.status]}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-sm mb-2 truncate">
                  {session.lastMessage}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" aria-hidden="true" />
                    {session.messageCount} messages
                  </span>
                  <span>{session.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/chat/${session.id}`)}
                className="hover-scale"
                aria-label="View chat"
                title="View chat"
              >
                <Eye className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(session.id)}
                className="hover-scale"
                aria-label="Edit"
                title="Edit"
              >
                <Edit className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onDelete(session.id)}
                className="hover-scale text-destructive hover:text-destructive"
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }
);

export default SessionCard;
