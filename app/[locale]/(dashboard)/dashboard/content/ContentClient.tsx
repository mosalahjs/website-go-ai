"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Layout, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

import useContentManager from "@/lib/content/useContentManager";
import PagesSidebar from "./components/PagesSidebar";
import SectionsPanel from "./components/SectionsPanel";
import PageDialog from "./components/PageDialog";
import SectionDialog from "./components/SectionDialog";
import DeleteConfirm from "./components/DeleteConfirm";

export default function ContentClient() {
  const cm = useContentManager();

  return (
    <div className="p-8 space-y-8 bg-gradient-mesh min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary/60 bg-clip-text text-transparent">
              Content Management
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Manage your website pages and sections like WordPress
            </p>
          </div>
          <Button
            onClick={() => cm.openPageDialog()}
            className="gap-2 shadow-soft"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            New Page
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PagesSidebar
            loading={cm.loading}
            pages={cm.pages}
            selectedPageId={cm.selectedPage?.id ?? null}
            onSelect={cm.setSelectedPage}
            onEdit={cm.openPageDialog}
            onDelete={cm.requestDeletePage}
            onCreate={() => cm.openPageDialog()}
          />
        </div>

        <div className="lg:col-span-2">
          {cm.selectedPage ? (
            <SectionsPanel
              page={cm.selectedPage}
              sections={cm.currentSections}
              onBack={() => cm.setSelectedPage(null)}
              onAdd={() => cm.openSectionDialog()}
              onToggle={cm.toggleSectionVisibility}
              onEdit={cm.openSectionDialog}
              onDelete={cm.requestDeleteSection}
            />
          ) : (
            <Card className="glass-card border border-border h-full min-h-[600px]">
              <CardContent className="flex items-center justify-center h-full py-20">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
                    <Layout className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Select a Page</h3>
                  <p className="text-muted-foreground mb-8 max-w-md">
                    Choose a page from the sidebar to view and manage its
                    content sections
                  </p>
                  <Button
                    onClick={() => cm.openPageDialog()}
                    className="gap-2"
                    size="lg"
                  >
                    <Plus className="h-5 w-5" />
                    Create New Page
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Page Dialog */}
      <PageDialog
        open={cm.pageDialog}
        onOpenChange={cm.setPageDialog}
        isEditing={!!cm.editingPage}
        form={cm.pageForm}
        setForm={cm.setPageForm}
        onSave={cm.savePage}
      />

      {/* Section Dialog */}
      <SectionDialog
        open={cm.sectionDialog}
        onOpenChange={cm.setSectionDialog}
        isEditing={!!cm.editingSection}
        form={cm.sectionForm}
        setForm={cm.setSectionForm}
        onSave={cm.saveSection}
      />

      {/* Delete Confirm */}
      <DeleteConfirm
        open={!!cm.deleteDialog}
        type={cm.deleteDialog?.type ?? null}
        onOpenChange={() => cm.setDeleteDialog(null)}
        onConfirm={
          cm.deleteDialog?.type === "page" ? cm.deletePage : cm.deleteSection
        }
      />
    </div>
  );
}
