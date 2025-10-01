"use client";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import { ContactCard } from "./ContactCard";

const contactInfo = [
  {
    icon: Mail,
    title: "Email",
    value: "hello@goai247.com",
    link: "mailto:hello@goai247.com",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+1 (555) 123-4567",
    link: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Location",
    value: "San Francisco, CA",
    link: null,
  },
];

export function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-3"
    >
      <div>
        <h2 className="text-2xl font-bold mb-4 text-main">
          Contact Information
        </h2>
        <p className="text-main-muted-foreground">
          Reach out to us through any of these channels, or use the contact
          form.
        </p>
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
