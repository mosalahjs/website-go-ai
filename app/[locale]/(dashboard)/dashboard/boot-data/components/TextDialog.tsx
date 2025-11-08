"use client";

import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CompanyText, TextForm } from "@/types/dashboard/bootData.types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingText: CompanyText | null;
  textForm: TextForm;
  setTextForm: (f: TextForm) => void;
  onSave: () => void;
  selectedTopicName?: string;
};

const TextDialog = memo(function TextDialog({
  open,
  onOpenChange,
  editingText,
  textForm,
  setTextForm,
  onSave,
  selectedTopicName,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingText ? "Edit Text" : "Add New Text"}
          </DialogTitle>
          <DialogDescription>
            {editingText
              ? "Update the text content below"
              : `Add a new paragraph to ${selectedTopicName || "this topic"}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="text-content">Text Content</Label>
            <Textarea
              id="text-content"
              placeholder="Enter the text content for this topic..."
              value={textForm.text}
              onChange={(e) =>
                setTextForm({ ...textForm, text: e.target.value })
              }
              rows={6}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {textForm.text.length} characters
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>{editingText ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default TextDialog;
