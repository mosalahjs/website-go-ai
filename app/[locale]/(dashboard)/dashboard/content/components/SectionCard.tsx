"use client";

import React, { memo } from "react";
import type { Section } from "@/types/dashboard/content.type";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GripVertical, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import { getSectionTypeLabel } from "@/lib/content/content.utils";

type Props = {
  section: Section;
  onToggle: (id: string) => void;
  onEdit: (s: Section) => void;
  onDelete: (id: string) => void;
};

const SectionCard = memo(function SectionCard({
  section,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  return (
    <Card
      className={`group hover:shadow-soft transition-all duration-300 border ${
        section.visible
          ? "border-border"
          : "border-dashed border-muted-foreground/30 opacity-60"
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex items-center gap-3">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              {section.order}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="font-medium">
                {getSectionTypeLabel(section.type)}
              </Badge>
              {!section.visible && (
                <Badge variant="secondary" className="text-xs">
                  Hidden
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-bold mb-1">{section.title}</h3>
            {section.subtitle && (
              <p className="text-sm text-muted-foreground mb-2">
                {section.subtitle}
              </p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2">
              {section.content}
            </p>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onToggle(section.id)}
            >
              {section.visible ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onEdit(section)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => onDelete(section.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default SectionCard;
