"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface Props {
  techStack: string[];
  demoLink: string;
  githubLink: string;
  buttonGradientStyles: string;
}

function ProjectSidebar({
  techStack,
  demoLink,
  githubLink,
  buttonGradientStyles,
}: Props) {
  return (
    <div className="space-y-8">
      {/* Tech Stack */}
      <Card className="border-border/40 sticky top-24">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech, i) => (
              <Badge key={i} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-border/40">
        <CardContent className="p-6 space-y-3">
          <Button
            className={`w-full ${buttonGradientStyles}`}
            onClick={() => window.open(demoLink, "_blank")}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live Demo
          </Button>
          <Button
            className={`w-full ${buttonGradientStyles}`}
            onClick={() => window.open(githubLink, "_blank")}
          >
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default memo(ProjectSidebar);
