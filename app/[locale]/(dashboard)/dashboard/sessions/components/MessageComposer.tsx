"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send } from "lucide-react";

type Props = {
  value: string;
  role: "user" | "assistant";
  onChange: (v: string) => void;
  onRoleChange: (r: "user" | "assistant") => void;
  onSend: () => void;
};

const MessageComposer = memo(function MessageComposer({
  value,
  role,
  onChange,
  onRoleChange,
  onSend,
}: Props) {
  return (
    <div className="border-t border-border/50 p-5 glass-card">
      <div className="flex gap-3">
        <Select
          value={role}
          onValueChange={(v: "user" | "assistant") => onRoleChange(v)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="assistant">Assistant</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="Type a message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-h-[60px] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <Button
          onClick={onSend}
          className="gap-2 self-end"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
});

export default MessageComposer;
