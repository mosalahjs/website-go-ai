"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

import TopicsList from "./TopicsList";
import TextsPanel from "./TextsPanel";
import TopicDialog from "./TopicDialog";
import TextDialog from "./TextDialog";
import DeleteDialog from "./DeleteDialog";
import { useBootData } from "@/hooks/useBootData";

export default function BootDataClient() {
  const {
    // state
    topics,
    selectedTopic,
    loading,

    // dialogs state
    topicDialogOpen,
    textDialogOpen,
    deleteDialog,

    // forms
    topicForm,
    textForm,
    editingTopic,
    editingText,

    // handlers
    setTopicDialogOpen,
    setTextDialogOpen,
    setDeleteDialog,
    setTopicForm,
    setTextForm,
    openTopicDialog,
    openTextDialog,
    saveTopic,
    saveText,
    deleteTopic,
    deleteText,
    setSelectedTopic,
    getTopicTexts,
  } = useBootData();

  return (
    <div className="p-8 space-y-8 bg-gradient-mesh min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-primary/60 bg-clip-text text-transparent">
              Company Data Management
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Manage topics and their associated text content
            </p>
          </div>
          <Button
            onClick={() => openTopicDialog()}
            className="gap-2 shadow-soft"
            size="lg"
          >
            <Plus className="h-5 w-5" />
            New Topic
          </Button>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Topics */}
        <div className="lg:col-span-1">
          <TopicsList
            topics={topics}
            loading={loading}
            selectedTopicId={selectedTopic?.id ?? null}
            onSelectTopic={setSelectedTopic}
            onEditTopic={openTopicDialog}
            onDeleteTopic={(id) => setDeleteDialog({ type: "topic", id })}
            getTopicTexts={getTopicTexts}
          />
        </div>

        {/* Right: Texts */}
        <div className="lg:col-span-2">
          {!selectedTopic ? (
            <Card className="glass-card border-2 border-border/50">
              <CardContent className="flex flex-col items-center justify-center py-20">
                <Database className="h-20 w-20 text-muted-foreground mb-6 opacity-50" />
                <h3 className="text-2xl font-semibold mb-2">
                  No Topic Selected
                </h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Select a topic from the list to view and manage its text
                  content
                </p>
              </CardContent>
            </Card>
          ) : (
            <TextsPanel
              selectedTopic={selectedTopic}
              loading={loading}
              texts={getTopicTexts(selectedTopic.id)}
              onAddText={() => openTextDialog()}
              onEditText={openTextDialog}
              onDeleteText={(id) => setDeleteDialog({ type: "text", id })}
            />
          )}
        </div>
      </div>

      {/* Dialogs */}
      <TopicDialog
        open={topicDialogOpen}
        onOpenChange={setTopicDialogOpen}
        editingTopic={editingTopic}
        topicForm={topicForm}
        setTopicForm={setTopicForm}
        onSave={saveTopic}
      />

      <TextDialog
        open={textDialogOpen}
        onOpenChange={setTextDialogOpen}
        editingText={editingText}
        textForm={textForm}
        setTextForm={setTextForm}
        onSave={saveText}
        selectedTopicName={selectedTopic?.name}
      />

      <DeleteDialog
        open={!!deleteDialog}
        onOpenChange={() => setDeleteDialog(null)}
        type={deleteDialog?.type}
        onConfirm={deleteDialog?.type === "topic" ? deleteTopic : deleteText}
      />
    </div>
  );
}
