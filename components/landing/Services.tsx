"use client";
import { motion } from "framer-motion";
import { Code, Cpu, Database, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

export default function Services() {
  const t = useTranslations("HomePage.SERVICES");

  const services = [
    {
      icon: Code,
      title: t("items.frontend.title"),
      description: t("items.frontend.desc"),
      color: "from-cyan-400 via-blue-500 to-indigo-600",
    },
    {
      icon: Cpu,
      title: t("items.ai.title"),
      description: t("items.ai.desc"),
      color: "from-blue-500 via-purple-500 to-pink-600",
    },
    {
      icon: Database,
      title: t("items.backend.title"),
      description: t("items.backend.desc"),
      color: "from-indigo-500 via-purple-600 to-fuchsia-600",
    },
    {
      icon: Lightbulb,
      title: t("items.consulting.title"),
      description: t("items.consulting.desc"),
      color: "from-purple-500 via-pink-500 to-rose-600",
    },
  ] as const;

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-50 h-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gradient-third">
            {t("headingPrefix")}{" "}
            {t("headingHighlight") ? (
              <span className="">{t("headingHighlight")}</span>
            ) : null}
          </h2>
          <p className="text-lg text-main-muted-foreground  max-w-2xl mx-auto">
            {t("subheading")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item} className="h-full">
              <Card className="group h-full border-2 border-main/20 hover:border-main/60 hover:cursor-pointer transition-all duration-500 hover:shadow-intense backdrop-blur-sm bg-card/80 relative overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-0`}
                />

                <CardContent className="p-8 space-y-5 relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} shadow-lg relative z-10`}
                  >
                    <service.icon className="h-7 w-7 text-white" />
                  </motion.div>

                  <h3 className="text-xl text-gradient-third font-bold group-hover:text-primary transition-colors relative z-10">
                    {service.title}
                  </h3>

                  <p className=" text-main-muted-foreground leading-relaxed relative z-10">
                    {service.description}
                  </p>

                  {/* Decorative element */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${service.color} rounded-full blur-2xl`}
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
