"use client";

import React, { memo } from "react";
import type { Page, Section } from "@/types/dashboard/content.type";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Layers, ArrowLeft, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionCard from "./SectionCard";

type Props = {
  page: Page;
  sections: Section[];
  onBack: () => void;
  onAdd: () => void;
  onToggle: (id: string) => void;
  onEdit: (s: Section) => void;
  onDelete: (id: string) => void;
};

const SectionsPanel = memo(function SectionsPanel({
  page,
  sections,
  onBack,
  onAdd,
  onToggle,
  onEdit,
  onDelete,
}: Props) {
  const hasSections = sections.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="glass-card border border-border hover:shadow-elevated transition-all duration-500">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                      <Layers className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {page.title} Sections
                    </span>
                  </CardTitle>
                  <CardDescription className="mt-2 ml-13">
                    Manage content sections for this page
                  </CardDescription>
                </div>
              </div>
            </div>
            <Button onClick={onAdd} className="gap-2 shadow-soft">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {!hasSections ? (
            <div className="text-center py-16">
              <Layers className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg mb-2">
                No sections yet
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Add your first section to start building this page
              </p>
              <Button onClick={onAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <SectionCard
                      section={section}
                      onToggle={onToggle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default SectionsPanel;
