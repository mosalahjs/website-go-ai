"use client";

import React, { memo } from "react";
import type { Page } from "@/types/dashboard/content.type";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Globe, FileText, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  loading: boolean;
  pages: Page[];
  selectedPageId: string | null;
  onSelect: (p: Page) => void;
  onEdit: (p: Page) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
};

const PagesSidebar = memo(function PagesSidebar({
  loading,
  pages,
  selectedPageId,
  onSelect,
  onEdit,
  onDelete,
  onCreate,
}: Props) {
  return (
    <Card className="glass-card border border-border hover:shadow-elevated transition-all duration-500 sticky top-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Pages
          </span>
        </CardTitle>
        <CardDescription>All website pages</CardDescription>
        <Button onClick={onCreate} className="mt-3">
          New Page
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-sm">
              No pages yet. Create your first page!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02 }}
                className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  selectedPageId === page.id
                    ? "bg-primary/10 border-primary/30 shadow-soft"
                    : "hover:bg-secondary/30 border-transparent hover:border-border/50"
                }`}
                onClick={() => onSelect(page)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold truncate">{page.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={
                          page.status === "published" ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {page.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        /{page.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(page);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(page.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default PagesSidebar;
