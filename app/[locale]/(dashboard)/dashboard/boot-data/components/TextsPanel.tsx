"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Trash2 } from "lucide-react";
import type {
  CompanyText,
  CompanyTopic,
} from "@/types/dashboard/bootData.types";

type Props = {
  selectedTopic: CompanyTopic;
  loading: boolean;
  texts: CompanyText[];
  onAddText: () => void;
  onEditText: (txt: CompanyText) => void;
  onDeleteText: (id: string) => void;
};

const TextsPanel = memo(function TextsPanel({
  selectedTopic,
  loading,
  texts,
  onAddText,
  onEditText,
  onDeleteText,
}: Props) {
  return (
    <motion.div
      key={selectedTopic.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card border-2 border-border/50 hover:shadow-elevated transition-all duration-500">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {selectedTopic.name}
                </span>
              </CardTitle>
              <CardDescription className="ml-13 mt-2">
                Text content for this topic
              </CardDescription>
            </div>
            <Button onClick={onAddText} className="gap-2" size="sm">
              <Plus className="h-4 w-4" />
              Add Text
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 w-full rounded-xl bg-muted/40 animate-pulse"
                />
              ))}
            </div>
          ) : texts.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground text-sm mb-4">
                No text content yet for this topic
              </p>
              <Button onClick={onAddText} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Add First Text
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {texts.map((text, index) => (
                <motion.div
                  key={text.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="group border-2 border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-soft bg-gradient-to-br from-card to-card/50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="text-xs font-semibold"
                          >
                            Paragraph {text.order}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(text.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onEditText(text)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => onDeleteText(text.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-foreground/90">
                        {text.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default TextsPanel;
