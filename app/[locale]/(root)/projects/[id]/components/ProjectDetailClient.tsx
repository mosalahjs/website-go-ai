"use client";
import { memo, useMemo } from "react";
import ProjectHero from "./ProjectHero";
import ProjectDetails from "./ProjectDetails";
import ProjectSidebar from "./ProjectSidebar";
import ProjectCTA from "./ProjectCTA";
import ImageGallery from "./ImageGallery";
import { Project } from "@/types/Projects";
import VideoPlayer from "./VideoPlayer";

function ProjectDetailClientComponent({ project }: { project: Project }) {
  const {
    title,
    description,
    fullDescription,
    gradient,
    tags,
    techStack,
    challenges,
    solutions,
    demoLink,
    githubLink,
    gallery,
    // videoUrl,
  } = useMemo(() => project, [project]);

  const buttonGradientStyles =
    "text-white text-base px-8 py-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-500 hover:via-blue-400 hover:to-blue-300 shadow-lg hover:shadow-xl transition-all duration-500 group dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:hover:from-gray-800 dark:hover:via-gray-700 dark:hover:to-gray-600";

  // const fallbackVideo =
  //   videoUrl ||
  //   "https://cdn.coverr.co/videos/coverr-working-on-laptop-5322/1080p.mp4";

  const fallbackGallery =
    gallery && gallery.length > 0
      ? gallery
      : [
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
          "https://images.unsplash.com/photo-1506765515384-028b60a970df?w=800",
          "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
        ];

  return (
    <div className="bg-background text-foreground">
      <ProjectHero
        gradient={gradient}
        tags={tags}
        title={title}
        description={description}
        buttonGradientStyles={buttonGradientStyles}
      />

      {/* <section className=" bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <VideoPlayer gradient={gradient} />
          </div>
        </div>
      </section>

      <section className=" bg-gradient-hero">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <ImageGallery images={fallbackGallery} />
          </div>
        </div>
      </section> */}
      <VideoPlayer gradient={gradient} />

      <ImageGallery images={fallbackGallery} />

      <section className="py-16">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-8">
          <ProjectDetails
            fullDescription={fullDescription}
            challenges={challenges}
            solutions={solutions}
          />
          <ProjectSidebar
            techStack={techStack}
            demoLink={demoLink}
            githubLink={githubLink}
            buttonGradientStyles={buttonGradientStyles}
          />
        </div>
      </section>

      <ProjectCTA buttonGradientStyles={buttonGradientStyles} />
    </div>
  );
}

export default memo(ProjectDetailClientComponent);
