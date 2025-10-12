import React from "react";
import ProjectsContent from "./components/ProjectsContent";
import { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Projects",
  description:
    "Explore Go AI 247's portfolio of AI-powered projects and digital innovations that drive business growth across the Middle East.",
  path: "/projects",
});

export default function Projects() {
  return (
    <div>
      <ProjectsContent />
    </div>
  );
}
