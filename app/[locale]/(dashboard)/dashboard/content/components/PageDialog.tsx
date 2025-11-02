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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save } from "lucide-react";
import { pageTemplates, slugify } from "@/lib/content/content.utils";

type FormState = {
  title: string;
  slug: string;
  status: "published" | "draft";
  template: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isEditing: boolean;
  form: FormState;
  setForm: (next: FormState | ((prev: FormState) => FormState)) => void;
  onSave: () => void;
};

const PageDialog = memo(function PageDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  setForm,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEditing ? "Edit Page" : "Create New Page"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update page settings"
              : "Add a new page to your website"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="page-title" className="text-sm font-semibold">
              Page Title
            </Label>
            <Input
              id="page-title"
              placeholder="e.g., Homepage, About Us, Services"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: prev.slug || slugify(title),
                }));
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="page-slug" className="text-sm font-semibold">
              URL Slug
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/</span>
              <Input
                id="page-slug"
                placeholder="page-url"
                value={form.slug}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    slug: slugify(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="page-status" className="text-sm font-semibold">
                Status
              </Label>
              <Select
                value={form.status}
                onValueChange={(value: FormState["status"]) =>
                  setForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="page-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-template" className="text-sm font-semibold">
                Template
              </Label>
              <Select
                value={form.template}
                onValueChange={(value: string) =>
                  setForm((prev) => ({ ...prev, template: value }))
                }
              >
                <SelectTrigger id="page-template">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageTemplates.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave} className="gap-2">
            <Save className="h-4 w-4" />
            {isEditing ? "Update Page" : "Create Page"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default PageDialog;
