"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type Props = {
  role: "user" | "assistant";
  content: string;
  onEdit: () => void;
  onDelete: () => void;
};

const MessageBubble = memo(function MessageBubble({
  role,
  content,
  onEdit,
  onDelete,
}: Props) {
  const isUser = role === "user";
  return (
    <>
      <div
        className={`size-9 rounded-2xl flex items-center justify-center flex-shrink-0 font-semibold shadow-soft ${
          isUser
            ? "bg-main text-white"
            : "bg-secondary text-secondary-foreground"
        }`}
        aria-hidden
      >
        {isUser ? "U" : "A"}
      </div>

      <div className={`flex-1 max-w-3xl ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block p-5 rounded-2xl border transition-all duration-300 hover:shadow-soft ${
            isUser
              ? "bg-main/5 border-primary/20 hover:bg-primary/10"
              : "bg-main/10 border-secondary/30 hover:bg-secondary/40"
          }`}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>

        <div
          className={`mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ${
            isUser ? "justify-end" : ""
          }`}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="h-7 text-xs gap-1"
          >
            <Edit className="h-3 w-3" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </Button>
        </div>
      </div>
    </>
  );
});

export default MessageBubble;
