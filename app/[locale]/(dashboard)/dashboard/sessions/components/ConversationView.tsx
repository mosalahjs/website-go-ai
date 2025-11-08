"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";

import MessageBubble from "./MessageBubble";
// import MessageComposer from "./MessageComposer";
import { Message, Session } from "@/types/dashboard/sessions.type";

type Props = {
  session: Session;
  newMessageRole: "user" | "assistant";
  newMessageContent: string;
  onRoleChange: (r: "user" | "assistant") => void;
  onContentChange: (v: string) => void;
  onSend: () => void;
  onEdit: (index: number, message: Message) => void;
  onDeleteMessage: (index: number) => void;
};

const ConversationView = memo(function ConversationView({
  session,
  newMessageRole,
  newMessageContent,
  onRoleChange,
  onContentChange,
  onSend,
  onEdit,
  onDeleteMessage,
}: Props) {
  void newMessageRole;
  void newMessageContent;
  void onRoleChange;
  void onContentChange;
  void onSend;

  return (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border/50 glass-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {session.session_id}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {session.messages.length} messages •{" "}
              {new Date(
                session.last_updated || session.created_at || Date.now()
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {session.messages.map((message, index) => (
          <motion.div
            key={`${index}-${message.timestamp ?? "t"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`group flex gap-4 ${
              message.role === "assistant" ? "" : "flex-row-reverse"
            }`}
          >
            <MessageBubble
              role={message.role}
              content={message.content}
              onEdit={() => onEdit(index, message)}
              onDelete={() => onDeleteMessage(index)}
            />
          </motion.div>
        ))}
      </div>

      {/* Composer */}
      {/* <MessageComposer
        value={newMessageContent}
        role={newMessageRole}
        onChange={onContentChange}
        onRoleChange={onRoleChange}
        onSend={onSend}
      /> */}
    </>
  );
});

export default ConversationView;
