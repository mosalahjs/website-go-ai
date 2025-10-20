import { Blog } from "@/types/Blogs";

export const ALL_BLOGS: ReadonlyArray<Blog> = [
  {
    id: 1,
    title: "The Future of AI in Software Development",
    excerpt:
      "Explore how artificial intelligence is revolutionizing the way we build and deploy applications in 2025.",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    date: "March 15, 2025",
    readTime: "5 min read",
    category: "AI & Technology",
    tags: ["AI", "Development", "Future"],
  },
  {
    id: 2,
    title: "Building Scalable Cloud Infrastructure",
    excerpt:
      "Best practices for designing and implementing cloud-native solutions that grow with your business.",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1600&q=80",
    date: "March 10, 2025",
    readTime: "7 min read",
    category: "Cloud Computing",
    tags: ["Cloud", "Infrastructure", "Scalability"],
  },
  {
    id: 3,
    title: "Modern Web Development Trends",
    excerpt:
      "Stay ahead of the curve with the latest frameworks, tools, and methodologies in web development.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    date: "March 5, 2025",
    readTime: "6 min read",
    category: "Web Development",
    tags: ["Web", "Trends", "Framework"],
  },
  {
    id: 4,
    title: "Cybersecurity Best Practices for 2025",
    excerpt:
      "Protect your applications and data with these essential security measures and strategies.",
    image:
      "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1600&q=80",
    date: "February 28, 2025",
    readTime: "8 min read",
    category: "Security",
    tags: ["Security", "Best Practices", "Protection"],
  },
  {
    id: 5,
    title: "Machine Learning for Business Intelligence",
    excerpt:
      "Leverage ML algorithms to extract valuable insights from your business data.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    date: "February 20, 2025",
    readTime: "6 min read",
    category: "AI & Technology",
    tags: ["ML", "Business", "Analytics"],
  },
  {
    id: 6,
    title: "DevOps Culture and Continuous Integration",
    excerpt:
      "Improve your development workflow with CI/CD pipelines and DevOps practices.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80",
    date: "February 15, 2025",
    readTime: "7 min read",
    category: "DevOps",
    tags: ["DevOps", "CI/CD", "Automation"],
  },
] as const;
