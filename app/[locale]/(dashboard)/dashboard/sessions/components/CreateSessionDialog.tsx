"use client";

import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  newSessionId: string;
  setNewSessionId: (v: string) => void;

  newMessageRole: "user" | "assistant";
  setNewMessageRole: (r: "user" | "assistant") => void;

  newMessageContent: string;
  setNewMessageContent: (v: string) => void;

  onCreate: () => void;
};

const CreateSessionDialog = memo(function CreateSessionDialog({
  open,
  onOpenChange,
  newSessionId,
  setNewSessionId,
  newMessageRole,
  setNewMessageRole,
  newMessageContent,
  setNewMessageContent,
  onCreate,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Create New Session</DialogTitle>
          <DialogDescription>
            Start a new conversation session with an initial message
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="session-id">Session ID</Label>
            <Input
              id="session-id"
              placeholder="e.g., session-001"
              value={newSessionId}
              onChange={(e) => setNewSessionId(e.target.value)}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-role">Message Role</Label>
            <Select
              value={newMessageRole}
              onValueChange={(value: "user" | "assistant") =>
                setNewMessageRole(value)
              }
            >
              <SelectTrigger id="message-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="assistant">Assistant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message-content">Initial Message</Label>
            <Textarea
              id="message-content"
              placeholder="Enter the first message..."
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CreateSessionDialog;
