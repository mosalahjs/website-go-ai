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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CompanyTopic, TopicForm } from "@/types/dashboard/bootData.types";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editingTopic: CompanyTopic | null;
  topicForm: TopicForm;
  setTopicForm: (f: TopicForm) => void;
  onSave: () => void;
};

const TopicDialog = memo(function TopicDialog({
  open,
  onOpenChange,
  editingTopic,
  topicForm,
  setTopicForm,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingTopic ? "Edit Topic" : "Create New Topic"}
          </DialogTitle>
          <DialogDescription>
            {editingTopic
              ? "Update the topic information below"
              : "Add a new topic to organize your company data"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic-name">Topic Name</Label>
            <Input
              id="topic-name"
              placeholder="e.g., Product Features, Pricing, Support..."
              value={topicForm.name}
              onChange={(e) =>
                setTopicForm({ ...topicForm, name: e.target.value })
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>{editingTopic ? "Update" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default TopicDialog;
