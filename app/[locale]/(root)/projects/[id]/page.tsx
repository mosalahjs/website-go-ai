import { Metadata } from "next";
import { notFound } from "next/navigation";

import { projectsData } from "@/constant/Projects";
import ProjectDetailClient from "./components/ProjectDetailClient";
import Container from "@/components/shared/Container";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const project = projectsData.find((p) => p.id === Number(id));

  if (!project) {
    return {
      title: "Project Not Found | GO AI",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.title} | GO AI 247`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image || "/og-image.png"],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projectsData.find((p) => p.id === Number(id));

  if (!project) return notFound();

  return (
    <Container>
      <ProjectDetailClient project={project} />
    </Container>
  );
}
