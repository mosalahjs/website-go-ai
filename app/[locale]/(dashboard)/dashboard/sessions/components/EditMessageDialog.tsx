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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit } from "lucide-react";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editMessageContent: string;
  setEditMessageContent: (v: string) => void;
  onUpdate: () => void;
};

const EditMessageDialog = memo(function EditMessageDialog({
  open,
  onOpenChange,
  editMessageContent,
  setEditMessageContent,
  onUpdate,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
          <DialogDescription>Update the message content</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-content">Message Content</Label>
            <Textarea
              id="edit-content"
              value={editMessageContent}
              onChange={(e) => setEditMessageContent(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdate} className="gap-2">
            <Edit className="h-4 w-4" />
            Update Message
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default EditMessageDialog;
