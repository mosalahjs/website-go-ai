"use client";

import React, { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { sectionTypes } from "@/lib/content/content.utils";

type FormState = {
  type: string;
  title: string;
  subtitle: string;
  content: string;
  visible: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isEditing: boolean;
  form: FormState;
  setForm: (next: FormState | ((prev: FormState) => FormState)) => void;
  onSave: () => void;
};

const SectionDialog = memo(function SectionDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  setForm,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Section" : "Add New Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update section content"
              : "Add a new content section to the page"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="section-type" className="text-sm font-semibold">
              Section Type
            </Label>
            <Select
              value={form.type}
              onValueChange={(value: string) =>
                setForm((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger id="section-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sectionTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-title" className="text-sm font-semibold">
              Title
            </Label>
            <Input
              id="section-title"
              placeholder="Section heading"
              value={form.title}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-subtitle" className="text-sm font-semibold">
              Subtitle (Optional)
            </Label>
            <Input
              id="section-subtitle"
              placeholder="Section subheading"
              value={form.subtitle}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, subtitle: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-content" className="text-sm font-semibold">
              Content
            </Label>
            <Textarea
              id="section-content"
              placeholder="Section content and description"
              value={form.content}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={8}
              className="resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl border bg-secondary/20">
            <input
              type="checkbox"
              id="section-visible"
              checked={form.visible}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, visible: e.target.checked }))
              }
              className="w-4 h-4 rounded border-border"
            />
            <Label
              htmlFor="section-visible"
              className="text-sm font-medium cursor-pointer"
            >
              Visible on page (uncheck to hide this section)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="gap-2">
            <Save className="h-4 w-4" />
            {isEditing ? "Update Section" : "Add Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default SectionDialog;
