export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  gradient: string;
  image: string;
  techStack: string[];
  challenges: string[];
  solutions: string[];
  demoLink: string;
  githubLink: string;
  videoUrl?: string;
  gallery?: string[];
}
