"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
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

// Dummy fallback data
const DUMMY_SESSIONS: Session[] = [
  {
    id: "dummy-1",
    session_id: "81fdd7df-9aa6-4b8c-8fe7-f80606dfda3d",
    title: "GoAI247 Chat",
    messages: [
      {
        id: uid(),
        role: "assistant",
        content: "Hello! Welcome to GoAI247. How can we assist you today?",
        created_at: "2025-11-03T09:41:00",
        timestamp: "2025-11-03T09:41:00",
      },
      {
        id: uid(),
        role: "user",
        content: "hi",
        created_at: "2025-11-03T09:41:02",
        timestamp: "2025-11-03T09:41:02",
      },
    ],
    created_at: "2025-11-03T09:41:00",
    last_updated: "2025-11-03T09:41:02",
  },
  {
    id: "dummy-2",
    session_id: "b71c0cd2-6421-4aa7-aa43-59ce8a5b9cc3",
    title: "Welcome Session",
    messages: [
      {
        id: uid(),
        role: "assistant",
        content: "أهلاً وسهلاً! كيف يمكنني مساعدتك اليوم مع GoAI247؟",
        created_at: "2025-11-03T09:43:30",
        timestamp: "2025-11-03T09:43:30",
      },
      {
        id: uid(),
        role: "user",
        content: "أهلا وسهلأ",
        created_at: "2025-11-03T09:43:31",
        timestamp: "2025-11-03T09:43:31",
      },
    ],
    created_at: "2025-11-03T09:43:30",
    last_updated: "2025-11-03T09:43:31",
  },
];

const PROXY_API_URL = "/api/history";
const SESSIONS_PER_PAGE = 10;

// API Response Types
interface ApiMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface ApiSession {
  session_id: string;
  messages: ApiMessage[];
  last_message_at: string;
  message_count: number;
}

interface ApiResponse {
  success: boolean;
  data?: {
    sessions: ApiSession[];
    total_sessions: number;
    page: number;
    limit: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  error?: string;
}

/* ========= Strict type guards instead of `any` ========= */
function isApiMessage(x: unknown): x is ApiMessage {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    (r.role === "user" || r.role === "assistant") &&
    typeof r.content === "string" &&
    typeof r.created_at === "string"
  );
}

function isApiSession(x: unknown): x is ApiSession {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.session_id === "string" &&
    Array.isArray(r.messages) &&
    r.messages.every(isApiMessage) &&
    typeof r.last_message_at === "string" &&
    typeof r.message_count === "number"
  );
}

type DirectFormat = {
  sessions: ApiSession[];
  total_sessions?: number;
  page?: number;
  limit?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
};

function isDirectFormat(x: unknown): x is DirectFormat {
  if (typeof x !== "object" || x === null) return false;
  const r = x as Record<string, unknown>;
  return Array.isArray(r.sessions) && r.sessions.every(isApiSession);
}

export default function SessionsClient() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [useFallback, setUseFallback] = useState(false);

  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteSession, setDeleteSession] = useState<Session | null>(null);

  const [editingMessage, setEditingMessage] = useState<{
    index: number;
    message: Message;
  } | null>(null);

  // form states
  const [newSessionId, setNewSessionId] = useState("");
  const [newMessageContent, setNewMessageContent] = useState("");
  const [newMessageRole, setNewMessageRole] = useState<"user" | "assistant">(
    "user"
  );
  const [editMessageContent, setEditMessageContent] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const observerRef = useRef<HTMLDivElement | null>(null);

  // استهلاك ما لم يُستخدم للحفاظ على الـ API بدون تحذيرات
  void createMessage;
  void totalPages;

  // Transform API session to UI Session
  const transformApiSession = useCallback((apiSession: ApiSession): Session => {
    const messages: Message[] = apiSession.messages.map((msg) => ({
      id: uid(),
      role: msg.role,
      content: msg.content,
      created_at: msg.created_at,
      timestamp: msg.created_at,
    }));

    return ensureSessionId({
      id: uid(),
      session_id: apiSession.session_id,
      title: deriveTitle(messages, apiSession.session_id),
      messages,
      created_at: messages[0]?.created_at || apiSession.last_message_at,
      last_updated: apiSession.last_message_at,
    });
  }, []);

  // ✅ Fetch sessions from proxy with better error handling
  const fetchSessions = useCallback(
    async (page: number, append: boolean = false) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(
          `${PROXY_API_URL}?limit=${SESSIONS_PER_PAGE}&page=${page}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // ✅ Debug: Log response status
        // console.log("API Response Status:", response.status);

        // Handle authentication errors
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          throw new Error("Authentication required");
        }

        // Get response text first for debugging
        const responseText = await response.text();
        // console.log("API Response Text:", responseText);

        // Try to parse JSON
        let data: unknown;
        try {
          data = JSON.parse(responseText) as unknown;
          // console.log("Parsed API Response:", data);
        } catch (parseError) {
          console.error("JSON Parse Error:", parseError);
          throw new Error("Invalid JSON response from server");
        }

        if (isDirectFormat(data)) {
          // console.log("Direct sessions format detected");
          const transformedSessions = data.sessions.map(transformApiSession);

          setSessions((prev) =>
            append ? [...prev, ...transformedSessions] : transformedSessions
          );

          setHasMore(data.has_next ?? false);
          setTotalPages(data.total_pages ?? 0);
          setCurrentPage(data.page ?? page);
          setUseFallback(false);

          return; // Exit early if successful
        }

        // Check standard success format
        const maybe = data as ApiResponse;
        if (
          maybe &&
          typeof maybe === "object" &&
          (maybe as ApiResponse).success &&
          (maybe as ApiResponse).data
        ) {
          // console.log("Standard success format detected");

          const transformedSessions = (maybe as ApiResponse).data!.sessions.map(
            transformApiSession
          );

          setSessions((prev) =>
            append ? [...prev, ...transformedSessions] : transformedSessions
          );

          setHasMore((maybe as ApiResponse).data!.has_next);
          setTotalPages((maybe as ApiResponse).data!.total_pages);
          setCurrentPage((maybe as ApiResponse).data!.page);
          setUseFallback(false);

          return; // Exit early if successful
        }

        // ✅ If we reach here, the format is unexpected
        // console.error("Unexpected response format:", data);
        const err =
          (typeof data === "object" &&
            data !== null &&
            "error" in (data as Record<string, unknown>) &&
            typeof (data as Record<string, unknown>).error === "string" &&
            (data as Record<string, string>).error) ||
          `Unexpected response format. Got: ${JSON.stringify(data).substring(
            0,
            100
          )}`;
        throw new Error(err);
      } catch (error) {
        console.error("Error fetching sessions:", error);

        if (!append) {
          // Use fallback data only on initial load
          console.log("Using fallback data");
          setSessions(DUMMY_SESSIONS);
          setUseFallback(true);
          setHasMore(false);

          const errorMessage =
            error instanceof Error ? error.message : "API unavailable";
          if (errorMessage !== "Authentication required") {
            toast.error(`Using offline data - ${errorMessage}`);
          }
        } else {
          toast.error("Failed to load more sessions");
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [transformApiSession]
  );

  // Initial load
  useEffect(() => {
    fetchSessions(1);
  }, [fetchSessions]);

  // Infinite scroll observer
  useEffect(() => {
    if (loading || loadingMore || !hasMore || useFallback) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchSessions(currentPage + 1, true);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loading, loadingMore, hasMore, currentPage, useFallback, fetchSessions]);

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

    const now = new Date().toISOString();

    const firstMsg: Message = {
      id: uid(),
      role: newMessageRole,
      content: newMessageContent,
      created_at: now,
      timestamp: now,
    };

    const newSession: Session = ensureSessionId({
      id: uid(),
      session_id: newSessionId,
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

    const now = new Date().toISOString();

    const msg: Message = {
      id: uid(),
      role: newMessageRole,
      content: newMessageContent,
      created_at: now,
      timestamp: now,
    };

    const updated: Session = ensureSessionId({
      ...selectedSession,
      messages: [...selectedSession.messages, msg],
      last_updated: now,
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
        loadingMore={loadingMore}
        hasMore={hasMore}
        observerRef={observerRef as React.RefObject<HTMLDivElement>}
        useFallback={useFallback}
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
