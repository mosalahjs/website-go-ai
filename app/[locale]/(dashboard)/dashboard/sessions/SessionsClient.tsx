"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Message, UISession as Session } from "@/types/dashboard/sessions.type";

import { ConversationView, SessionsSidebar } from "./components";
import CreateSessionDialog from "./components/CreateSessionDialog";
import DeleteSessionDialog from "./components/DeleteSessionDialog";
import EditMessageDialog from "./components/EditMessageDialog";
import {
  createMessage,
  deriveTitle,
  ensureSessionId,
  getSessionId,
  uid,
} from "@/lib/sessions/utils";

export default function SessionsClient() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteSession, setDeleteSession] = useState<Session | null>(null);

  const [editingMessage, setEditingMessage] = useState<{
    index: number;
    message: Message;
  } | null>(null);

  // form states (create + composer + edit)
  const [newSessionId, setNewSessionId] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [newMessageRole, setNewMessageRole] = useState<"user" | "assistant">(
    "user"
  );
  const [editMessageContent, setEditMessageContent] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Load sessions once
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await api.getSessions();
        if (response?.success && response?.data) {
          const normalized = (response.data as Session[]).map(ensureSessionId);
          setSessions(normalized);
        } else {
          toast.error("Failed to load sessions");
        }
      } catch {
        toast.error("Failed to load sessions");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredSessions = useMemo(() => {
    if (!searchQuery) return sessions;
    const q = searchQuery.toLowerCase();
    return sessions.filter(
      (s) =>
        getSessionId(s).toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [sessions, searchQuery]);

  // Create Session
  const handleCreateSession = useCallback(() => {
    if (!newSessionId.trim() || !newMessageContent.trim()) {
      toast.error("Session ID and initial message are required");
      return;
    }

    const firstMsg = createMessage({
      role: newMessageRole,
      content: newMessageContent,
      timestamp: new Date().toISOString(),
    });

    const now = new Date().toISOString();
    const id = uid();

    const newSession: Session = ensureSessionId({
      id,
      session_id: newSessionId, // نستخدم المدخل كـ session_id
      title: deriveTitle([firstMsg], newSessionId),
      messages: [firstMsg],
      created_at: now,
      last_updated: now,
    });

    setSessions((prev) => [newSession, ...prev]);
    setIsCreateOpen(false);
    setNewSessionId("");
    setNewMessageContent("");
    setNewMessageRole("user");

    toast.success("Session created successfully");
  }, [newSessionId, newMessageContent, newMessageRole]);

  // Delete Session
  const handleDeleteSession = useCallback(
    (sessionKey: string) => {
      setSessions((prev) => prev.filter((s) => getSessionId(s) !== sessionKey));
      setDeleteSession(null);

      if (selectedSession && getSessionId(selectedSession) === sessionKey) {
        setSelectedSession(null);
      }

      toast.success("Session deleted successfully");
    },
    [selectedSession]
  );

  // Add Message
  const handleAddMessage = useCallback(() => {
    if (!selectedSession || !newMessageContent.trim()) return;

    const msg = createMessage({
      role: newMessageRole,
      content: newMessageContent,
      timestamp: new Date().toISOString(),
    });

    const updated: Session = ensureSessionId({
      ...selectedSession,
      messages: [...selectedSession.messages, msg],
      last_updated: new Date().toISOString(),
    });

    setSessions((prev) =>
      prev.map((s) => (getSessionId(s) === getSessionId(updated) ? updated : s))
    );
    setSelectedSession(updated);
    setNewMessageContent("");
    setNewMessageRole("user");

    toast.success("Message added successfully");
  }, [selectedSession, newMessageContent, newMessageRole]);

  // Edit Message
  const handleEditMessage = useCallback(() => {
    if (!selectedSession || !editingMessage || !editMessageContent.trim())
      return;

    const updatedMessages = [...selectedSession.messages];
    updatedMessages[editingMessage.index] = {
      ...editingMessage.message,
      content: editMessageContent,
    };

    const updated: Session = ensureSessionId({
      ...selectedSession,
      messages: updatedMessages,
      last_updated: new Date().toISOString(),
    });

    setSessions((prev) =>
      prev.map((s) => (getSessionId(s) === getSessionId(updated) ? updated : s))
    );
    setSelectedSession(updated);
    setEditingMessage(null);
    setEditMessageContent("");
    setIsEditOpen(false);

    toast.success("Message updated successfully");
  }, [selectedSession, editingMessage, editMessageContent]);

  // Delete Message
  const handleDeleteMessage = useCallback(
    (index: number) => {
      if (!selectedSession) return;

      const updatedMessages = selectedSession.messages.filter(
        (_, i) => i !== index
      );

      const updated: Session = ensureSessionId({
        ...selectedSession,
        messages: updatedMessages,
        last_updated: new Date().toISOString(),
      });

      setSessions((prev) =>
        prev.map((s) =>
          getSessionId(s) === getSessionId(updated) ? updated : s
        )
      );
      setSelectedSession(updated);

      toast.success("Message deleted successfully");
    },
    [selectedSession]
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-gradient-mesh">
      {/* Sidebar */}
      <SessionsSidebar
        loading={loading}
        sessions={filteredSessions}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSessionId={
          selectedSession ? getSessionId(selectedSession) : null
        }
        onSelectSession={(s) => setSelectedSession(ensureSessionId(s))}
        onRequestCreate={() => setIsCreateOpen(true)}
        onRequestDelete={(s) => setDeleteSession(ensureSessionId(s))}
      />

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <ConversationView
            session={ensureSessionId(selectedSession)}
            newMessageRole={newMessageRole}
            newMessageContent={newMessageContent}
            onRoleChange={setNewMessageRole}
            onContentChange={setNewMessageContent}
            onSend={handleAddMessage}
            onEdit={(index, message) => {
              setEditingMessage({ index, message });
              setEditMessageContent(message.content);
              setIsEditOpen(true);
            }}
            onDeleteMessage={handleDeleteMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Select a conversation
              </h3>
              <p className="text-muted-foreground mb-6">
                Choose a session from the sidebar to view its messages
              </p>
              <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
                Start New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateSessionDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        newSessionId={newSessionId}
        setNewSessionId={setNewSessionId}
        newMessageRole={newMessageRole}
        setNewMessageRole={setNewMessageRole}
        newMessageContent={newMessageContent}
        setNewMessageContent={setNewMessageContent}
        onCreate={handleCreateSession}
      />

      <EditMessageDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        editMessageContent={editMessageContent}
        setEditMessageContent={setEditMessageContent}
        onUpdate={handleEditMessage}
      />

      <DeleteSessionDialog
        open={!!deleteSession}
        session={deleteSession}
        onOpenChange={() => setDeleteSession(null)}
        onConfirm={() =>
          deleteSession && handleDeleteSession(getSessionId(deleteSession))
        }
      />
    </div>
  );
}
