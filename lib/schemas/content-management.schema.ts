import { z } from "zod";

export const heroSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  subtitle: z.string().min(2, "Subtitle is too short"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(2, "Section title is too short"),
  content: z.string().min(5, "Section content is too short"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const contactSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  address: z.string().min(4),
});

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  description: z.string().min(5),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  category: z.string().min(2),
});
