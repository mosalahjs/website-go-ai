export interface IProduct {
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
}

export const projectsData: IProduct[] = [
  {
    id: 1,
    title: "SmartDocs AI",
    description:
      "Intelligent document processing platform with NLP for automated data extraction and classification.",
    fullDescription:
      "SmartDocs AI leverages advanced NLP and ML algorithms to automatically extract, classify, and analyze unstructured documents. It supports multiple formats, enabling businesses to automate tedious document-based workflows and achieve faster insights.",
    category: "AI/ML",
    tags: ["AI/ML", "Next.js", "Python", "FastAPI"],
    gradient: "from-cyan-500 to-blue-500",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    techStack: [
      "Next.js",
      "TypeScript",
      "Python",
      "FastAPI",
      "TensorFlow",
      "PostgreSQL",
      "Redis",
    ],
    challenges: [
      "Handling large-scale document ingestion efficiently",
      "Maintaining accuracy across different document formats",
    ],
    solutions: [
      "Implemented distributed processing pipeline using Redis workers",
      "Fine-tuned transformer-based NLP models for domain-specific data",
    ],
    demoLink: "https://example.com/smartdocs-demo",
    githubLink: "https://github.com/example/smartdocs",
  },
  {
    id: 2,
    title: "FinTech Dashboard",
    description:
      "Real-time financial analytics with advanced visualization and portfolio management.",
    fullDescription:
      "FinTech Dashboard is a powerful analytics platform providing real-time market data visualization, portfolio tracking, and risk insights. It integrates multiple APIs to present up-to-date financial metrics for investment professionals.",
    category: "Web",
    tags: ["React", "Node.js", "PostgreSQL", "D3.js"],
    gradient: "from-blue-500 to-indigo-500",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    techStack: [
      "React",
      "Node.js",
      "Express",
      "PostgreSQL",
      "D3.js",
      "WebSocket",
      "AWS",
    ],
    challenges: [
      "Streaming real-time financial data from multiple sources",
      "Optimizing heavy chart rendering for performance",
    ],
    solutions: [
      "Built WebSocket-based data streams with load balancing",
      "Used D3.js canvas rendering for high-performance visualizations",
    ],
    demoLink: "https://example.com/fintech-dashboard",
    githubLink: "https://github.com/example/fintech-dashboard",
  },
  {
    id: 3,
    title: "E-Commerce Platform",
    description:
      "Multi-vendor marketplace with AI recommendations and inventory management.",
    fullDescription:
      "A scalable e-commerce platform that supports multiple vendors, currencies, and AI-powered recommendations. It ensures smooth user experience, real-time inventory management, and secure checkout flow.",
    category: "SaaS",
    tags: ["Next.js", "Stripe", "MongoDB", "Redis"],
    gradient: "from-indigo-500 to-purple-500",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    techStack: [
      "Next.js",
      "TypeScript",
      "Stripe",
      "MongoDB",
      "Redis",
      "Docker",
      "Kubernetes",
    ],
    challenges: [
      "Synchronizing inventory data across multiple vendors",
      "Building accurate product recommendation system",
    ],
    solutions: [
      "Implemented event-driven architecture for inventory updates",
      "Developed hybrid AI recommendation engine using collaborative filtering",
    ],
    demoLink: "https://example.com/ecommerce",
    githubLink: "https://github.com/example/ecommerce-platform",
  },
  {
    id: 4,
    title: "Healthcare Portal",
    description:
      "Patient management system with telemedicine and appointment scheduling.",
    fullDescription:
      "A modern healthcare portal providing telemedicine features, appointment scheduling, and secure electronic health records. Built with HIPAA-compliant architecture and real-time video consultations.",
    category: "Web",
    tags: ["React", "Node.js", "MySQL", "WebRTC"],
    gradient: "from-purple-500 to-pink-500",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
    techStack: [
      "React",
      "Node.js",
      "MySQL",
      "WebRTC",
      "Socket.io",
      "AWS",
      "Docker",
    ],
    challenges: [
      "Ensuring secure video consultations under healthcare regulations",
      "Managing overlapping appointment bookings efficiently",
    ],
    solutions: [
      "Integrated WebRTC with secure token-based authentication",
      "Implemented smart scheduling algorithm for providers",
    ],
    demoLink: "https://example.com/healthcare",
    githubLink: "https://github.com/example/healthcare-portal",
  },
  {
    id: 5,
    title: "AI Chatbot Platform",
    description:
      "Conversational AI platform with custom training and multi-channel deployment.",
    fullDescription:
      "An enterprise-grade AI chatbot platform allowing organizations to design, train, and deploy chatbots across multiple channels. It supports advanced NLU, multi-language detection, and integrations with CRMs.",
    category: "AI/ML",
    tags: ["Python", "TensorFlow", "React", "AWS"],
    gradient: "from-pink-500 to-rose-500",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&q=80",
    techStack: [
      "Python",
      "TensorFlow",
      "React",
      "Node.js",
      "MongoDB",
      "AWS Lambda",
      "SageMaker",
    ],
    challenges: [
      "Understanding domain-specific terminology in conversations",
      "Scaling concurrent users without latency issues",
    ],
    solutions: [
      "Used transfer learning for domain adaptation in NLU models",
      "Implemented serverless architecture with AWS Lambda and DynamoDB",
    ],
    demoLink: "https://example.com/chatbot",
    githubLink: "https://github.com/example/chatbot-platform",
  },
  {
    id: 6,
    title: "Mobile Fitness App",
    description:
      "Personalized workout tracking with AI-powered form correction and nutrition planning.",
    fullDescription:
      "Mobile Fitness App provides real-time feedback using AI-based pose estimation. It generates personalized workout and meal plans while syncing with wearable devices for detailed performance analytics.",
    category: "Mobile",
    tags: ["React Native", "Firebase", "TensorFlow Lite"],
    gradient: "from-rose-500 to-orange-500",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    techStack: [
      "React Native",
      "TypeScript",
      "Firebase",
      "TensorFlow Lite",
      "Node.js",
      "AWS S3",
    ],
    challenges: [
      "Running AI models efficiently on mobile devices",
      "Providing accurate feedback in offline mode",
    ],
    solutions: [
      "Optimized ML models with TensorFlow Lite quantization",
      "Implemented local-first architecture with background sync",
    ],
    demoLink: "https://example.com/fitness",
    githubLink: "https://github.com/example/fitness-app",
  },
];
