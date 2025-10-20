"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactCard } from "./ContactCard";

export function ContactInfo() {
  const t = useTranslations("Contact.CONTACT_INFO");

  const contactInfo = React.useMemo(
    () => [
      {
        icon: Mail,
        title: t("items.email.title"),
        value: "hello@goai247.com",
        link: "mailto:hello@goai247.com",
      },
      {
        icon: Phone,
        title: t("items.phone.title"),
        value: "+1 (555) 123-4567",
        link: "tel:+15551234567",
      },
      {
        icon: MapPin,
        title: t("items.location.title"),
        value: "San Francisco, CA",
        link: null as string | null,
      },
    ],
    [t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-3"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4 text-main">{t("heading")}</h2>
        <p className="text-main-muted-foreground">{t("subheading")}</p>
      </div>

      {contactInfo.map((info, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.3 }}
          className="flex flex-col gap-y-0"
        >
          <ContactCard {...info} />
        </motion.div>
      ))}
    </motion.div>
  );
}
