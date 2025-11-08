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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Edit, Layers, Trash2 } from "lucide-react";
import type { CompanyTopic } from "@/types/dashboard/bootData.types";

type Props = {
  topics: CompanyTopic[];
  loading: boolean;
  selectedTopicId: string | null;
  onSelectTopic: (t: CompanyTopic) => void;
  onEditTopic: (t: CompanyTopic) => void;
  onDeleteTopic: (id: string) => void;
  getTopicTexts: (id: string) => { id: string }[];
};

const TopicsList = memo(function TopicsList({
  topics,
  loading,
  selectedTopicId,
  onSelectTopic,
  onEditTopic,
  onDeleteTopic,
  getTopicTexts,
}: Props) {
  return (
    <Card className="glass-card border-2 border-border/50 hover:shadow-elevated transition-all duration-500 sticky top-8">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Topics
          </span>
        </CardTitle>
        <CardDescription>All company data topics</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12">
            <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-sm">
              No topics yet. Create your first topic!
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {topics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className={`group p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    isSelected
                      ? "bg-primary/10 border-primary/40 shadow-soft"
                      : "hover:bg-secondary/30 border-transparent hover:border-border/50"
                  }`}
                  onClick={() => onSelectTopic(topic)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="h-4 w-4 text-primary flex-shrink-0" />
                        <h3 className="font-semibold truncate">{topic.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {getTopicTexts(topic.id).length} texts
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditTopic(topic);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTopic(topic.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default TopicsList;
