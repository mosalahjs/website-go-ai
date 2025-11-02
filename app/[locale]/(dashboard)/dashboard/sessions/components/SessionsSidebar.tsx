"use client";

import React, { memo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SessionListItem from "./SessionListItem";
import { Session } from "@/types/dashboard/sessions.type";

type Props = {
  loading: boolean;
  sessions: Session[];
  searchQuery: string;
  onSearchChange: (v: string) => void;
  selectedSessionId: string | null;
  onSelectSession: (s: Session) => void;
  onRequestCreate: () => void;
  onRequestDelete: (s: Session) => void;
};

const SessionsSidebar = memo(function SessionsSidebar({
  loading,
  sessions,
  searchQuery,
  onSearchChange,
  selectedSessionId,
  onSelectSession,
  onRequestCreate,
  onRequestDelete,
}: Props) {
  return (
    <aside className="w-80 border-r border-border flex flex-col glass-card">
      {/* Header */}
      <div className="p-5 border-b border-border/50 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Chat History
          </h2>
          <Button
            onClick={onRequestCreate}
            size="sm"
            className="gap-2 shadow-soft"
          >
            <Plus className="h-4 w-4" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No matching sessions" : "No sessions yet"}
            </p>
          </div>
        ) : (
          <div className="p-2">
            {sessions.map((s) => (
              <SessionListItem
                key={s.session_id}
                session={s}
                active={selectedSessionId === s.session_id}
                onClick={() => onSelectSession(s)}
                actions={
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Session actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onRequestDelete(s);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                }
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});

export default SessionsSidebar;
