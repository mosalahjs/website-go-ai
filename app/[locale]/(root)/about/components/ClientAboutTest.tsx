"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Target,
  Users,
  Lightbulb,
  Zap,
  Shield,
  Heart,
  Award,
  Building2,
  Globe2,
  BarChart3,
  CheckCircle2,
  Brain,
  Sparkles,
  Code2,
  Headphones,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState, memo } from "react";

const coreValues = [
  {
    icon: Users,
    title: "Customer-Centric Approach",
    description:
      "Our clients' success is at the heart of everything we do. We build lasting partnerships through understanding and exceeding expectations.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Technology",
    description:
      "Leveraging AI and emerging technologies to drive efficiency and excellence in every solution we deliver.",
  },
  {
    icon: Shield,
    title: "Integrity & Trust",
    description:
      "Building trust through transparent and ethical business practices, ensuring security and reliability in all our operations.",
  },
  {
    icon: Heart,
    title: "Collaboration",
    description:
      "Partnering closely with clients to ensure tailored solutions that align perfectly with their business objectives.",
  },
  {
    icon: Sparkles,
    title: "Continuous Improvement",
    description:
      "Constantly refining our processes and adopting cutting-edge technologies to deliver the best results.",
  },
  {
    icon: Award,
    title: "Commitment to Excellence",
    description:
      "Delivering measurable outcomes through proven expertise and unwavering dedication to quality.",
  },
];

const strengths = [
  {
    icon: Building2,
    title: "Expertise Across Industries",
    description:
      "Successfully served 12+ diverse industries including logistics, telecom, and e-commerce with over 1.5-2 million monthly interactions.",
    metric: "12+ Industries",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description:
      "Partnered with 20+ satisfied global clients across 4 markets, delivering exceptional results and exceeding expectations.",
    metric: "20+ Clients",
  },
  {
    icon: BarChart3,
    title: "Proven Track Record",
    description:
      "Maintaining a consistent quality score of ~97% while managing millions of interactions monthly with cutting-edge solutions.",
    metric: "97% Quality",
  },
  {
    icon: Zap,
    title: "AI-Powered Innovation",
    description:
      "Advanced AI tools including sentiment analysis, speech-to-text, data summarization, and OCR to enhance decision-making.",
    metric: "AI-Driven",
  },
];

const services = [
  {
    icon: Brain,
    title: "Generative AI Solutions",
    items: [
      "Data Extraction & Insights",
      "Intelligent Summarization",
      "Sentiment Analysis",
      "Speech to Text Conversion",
      "Advanced OCR Technology",
    ],
  },
  {
    icon: Headphones,
    title: "BPO Services",
    items: [
      "Call Center Management",
      "Live Chat Support",
      "Social Media Management",
      "WhatsApp & Email Support",
      "Back Office Support",
    ],
  },
  {
    icon: Code2,
    title: "Technology Services",
    items: [
      "Custom Software Development",
      "AI Integration & Automation",
      "Chatbot Solutions",
      "System Integration",
      "Digital Transformation",
    ],
  },
];

const timeline = [
  {
    year: "2017",
    event: "Company Founded",
    detail: "Started as a 3-person startup in a 6 sqm workspace",
  },
  {
    year: "2019",
    event: "Rapid Expansion",
    detail: "Grew to 70+ employees serving 3 markets",
  },
  {
    year: "2021",
    event: "Regional Leader",
    detail: "Expanded to 270+ seats and 14 accounts",
  },
  {
    year: "2023",
    event: "International Growth",
    detail: "Reached 700+ employees across multiple regions",
  },
  {
    year: "2024",
    event: "Global Excellence",
    detail: "800+ employees, 4 markets, 17 accounts",
  },
];

const achievements = [
  { metric: "800+", label: "Employees" },
  { metric: "50M+", label: "Customers Served" },
  { metric: "1.5-2M", label: "Monthly Interactions" },
  { metric: "97%", label: "Quality Score" },
  { metric: "20+", label: "Global Partners" },
  { metric: "12+", label: "Industries" },
];

function ClientAboutTest() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background via-background/95 to-background text-foreground pt-16">
      {/* خلفية متدرجة متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -left-40 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(circle, rgba(88,28,135,0.4), transparent)"
                : "radial-gradient(circle, rgba(99,102,241,0.4), transparent)",
          }}
          animate={{ x: [0, 30, -30, 0], y: [0, 20, -20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl"
          style={{
            background:
              theme === "dark"
                ? "radial-gradient(circle, rgba(236,72,153,0.3), transparent)"
                : "radial-gradient(circle, rgba(59,130,246,0.3), transparent)",
          }}
          animate={{ x: [0, -40, 40, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="relative z-10 space-y-24">
        {/* ✅ HERO */}
        <HeroSection />

        {/* ✅ Mission & Vision */}
        <MissionVision />

        {/* ✅ Journey */}
        <Journey />

        {/* ✅ Core Values */}
        <CoreValues />

        {/* ✅ Strengths */}
        <Strengths />

        {/* ✅ Services */}
        <Services />

        {/* ✅ Numbers */}
        <Numbers />
      </div>
    </div>
  );
}

/* --- Sub Components --- */

const HeroSection = memo(() => (
  <section className="relative py-32 overflow-hidden">
    <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto text-center space-y-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            Pioneering Digital Excellence Since 2017
          </span>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
          Transforming Businesses with{" "}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            AI-Powered Solutions
          </span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Go Ai 247 is a pioneering Digital Business Process Outsourcing company
          delivering comprehensive AI and customer service solutions to
          progressive, digitally advanced organizations.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
          {achievements.slice(0, 4).map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="space-y-2"
            >
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                {item.metric}
              </div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
));
HeroSection.displayName = "HeroSection";

const MissionVision = memo(() => (
  <section className="py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {[
          {
            icon: Target,
            title: "Our Vision",
            text: "To be the leading digital BPO and AI solutions partner in the Middle East and beyond, transforming customer experiences with cutting-edge technology and unparalleled service delivery.",
          },
          {
            icon: Zap,
            title: "Our Mission",
            text: "To provide innovative, scalable, and cost-effective AI and technology solutions that empower our partners to achieve their business objectives while delivering exceptional customer experiences.",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Card className="border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-md">
              <CardContent className="p-8 space-y-4 relative">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));
MissionVision.displayName = "MissionVision";

const Journey = memo(() => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background:
            theme === "dark"
              ? "radial-gradient(circle at 20% 30%, rgba(99,102,241,0.25), transparent 70%), radial-gradient(circle at 80% 70%, rgba(236,72,153,0.25), transparent 70%)"
              : "radial-gradient(circle at 20% 30%, rgba(147,51,234,0.25), transparent 70%), radial-gradient(circle at 80% 70%, rgba(59,130,246,0.25), transparent 70%)",
        }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Our Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From a modest 3-person startup to a powerhouse of 800+ employees
            serving global clients across continents.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 opacity-40" />

          <div className="space-y-12">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`relative flex flex-col md:flex-row items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: index * 0.1 + 0.2,
                    type: "spring",
                    stiffness: 200,
                  }}
                  viewport={{ once: true }}
                  className="absolute left-8 md:left-1/2 md:-translate-x-1/2 z-20 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 shadow-lg flex items-center justify-center text-white font-bold"
                >
                  {item.year}
                </motion.div>
                <div
                  className={`mt-20 md:mt-0 md:w-1/2 ${
                    index % 2 === 0
                      ? "md:pr-16 md:text-left"
                      : "md:pl-16 md:text-right"
                  }`}
                >
                  <Card className="border border-border/40 hover:border-primary/50 bg-gradient-to-br from-muted/20 to-background/60 backdrop-blur-md transition-all duration-500 hover:shadow-xl">
                    <CardContent className="p-8 relative">
                      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
                        {item.event}
                      </h3>
                      <p className="text-muted-foreground">{item.detail}</p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
Journey.displayName = "Journey";

const CoreValues = memo(() => (
  <section className="py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Our Core Values
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {coreValues.map((value, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-md">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));
CoreValues.displayName = "CoreValues";

const Strengths = memo(() => (
  <section className="py-24 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Our Strengths
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {strengths.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-md text-center">
              <CardContent className="p-8 space-y-4">
                <div className="inline-flex p-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500 mx-auto">
                  <s.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
                  {s.metric}
                </div>
                <h3 className="text-xl font-bold">{s.title}</h3>
                <p className="text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));
Strengths.displayName = "Strengths";

const Services = memo(() => (
  <section className="py-24">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-5xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
        Our Expertise
      </h2>
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, i) => (
          <motion.div key={i} whileHover={{ scale: 1.03 }}>
            <Card className="border border-border/40 hover:border-primary/40 transition-all duration-500 hover:shadow-lg bg-gradient-to-br from-muted/30 to-muted/10 backdrop-blur-md">
              <CardContent className="p-8 space-y-6">
                <div className="inline-flex p-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-500">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));
Services.displayName = "Services";

const Numbers = memo(() => (
  <section className="py-24 bg-muted/30">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-5xl font-bold mb-12 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
        Our Impact in Numbers
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-6xl mx-auto">
        {achievements.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <div className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
              {item.metric}
            </div>
            <div className="text-muted-foreground">{item.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
));
Numbers.displayName = "Numbers";

export default memo(ClientAboutTest);
ClientAboutTest.displayName = "ClientAboutTest";
