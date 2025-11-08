"use client";

import React, { memo } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  MoreVertical,
  Trash2,
  Loader2,
  Wifi,
  WifiOff,
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
import { Badge } from "@/components/ui/badge";

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
  loadingMore?: boolean;
  hasMore?: boolean;
  observerRef?: React.RefObject<HTMLDivElement | null>;
  useFallback?: boolean;
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
  loadingMore = false,
  hasMore = false,
  observerRef,
  useFallback = false,
}: Props) {
  return (
    <aside className="w-80 border-r border-dash flex flex-col glass-card-dash">
      {/* Header */}
      <div className="p-5 border-b border-dash space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gradient-dash">
              Chat History
            </h2>
            {useFallback && (
              <Badge
                variant="outline"
                className="gap-1 text-xs border-orange-500/50 text-orange-500"
              >
                <WifiOff className="h-3 w-3" />
                Offline
              </Badge>
            )}
            {!useFallback && !loading && (
              <Badge
                variant="outline"
                className="gap-1 text-xs border-green-500/50 text-green-500"
              >
                <Wifi className="h-3 w-3" />
                Live
              </Badge>
            )}
          </div>
          <Button
            onClick={onRequestCreate}
            size="sm"
            className="gap-2 glow-dash"
          >
            <Plus className="size-4" />
            New
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
            <MessageSquare className="size-12 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "No matching sessions" : "No sessions yet"}
            </p>
            {!searchQuery && (
              <Button
                onClick={onRequestCreate}
                size="sm"
                variant="outline"
                className="mt-4"
              >
                Create your first session
              </Button>
            )}
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

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerRef} className="py-4 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading more sessions...</span>
                  </div>
                )}
              </div>
            )}

            {!hasMore && sessions.length > 0 && (
              <div className="py-4 text-center text-sm text-muted-foreground">
                All sessions loaded
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
});

export default SessionsSidebar;
