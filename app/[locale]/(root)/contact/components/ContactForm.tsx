"use client";
import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CTAButton } from "@/components/ui/cta-button";

/* -------- motion constants -------- */
const MOTION_INITIAL = { opacity: 0, x: 30 } as const;
const MOTION_ANIMATE = { opacity: 1, x: 0 } as const;
const MOTION_TRANSITION = { duration: 0.8 } as const;

const contactSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

function ContactFormBase() {
  const t = useTranslations("Contact.CONTACT_FORM");

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
    mode: "onTouched",
  });

  const { isSubmitting, errors, isSubmitSuccessful } = form.formState;

  const onSubmit = useCallback(
    (data: ContactFormValues) => {
      // console.log("📩 Contact form data:", data);
      form.reset();
    },
    [form]
  );

  return (
    <motion.div
      initial={MOTION_INITIAL}
      animate={MOTION_ANIMATE}
      transition={MOTION_TRANSITION}
      className="md:col-span-2"
    >
      <Card className="border border-blue-500 dark:border-gray-50">
        <CardContent className="p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
              noValidate
              aria-busy={isSubmitting}
            >
              {/* Name + Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    const id = "contact-name";
                    return (
                      <FormItem>
                        <FormLabel
                          htmlFor={id}
                          className="text-main-muted-foreground"
                        >
                          {t("labels.name")}
                        </FormLabel>
                        <FormControl className="border-blue-500 dark:border-gray-50">
                          <Input
                            id={id}
                            className="placeholder:text-main-muted-foreground"
                            placeholder={t("placeholders.name")}
                            autoComplete="name"
                            aria-required="true"
                            aria-invalid={!!errors.name || undefined}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    const id = "contact-email";
                    return (
                      <FormItem>
                        <FormLabel
                          htmlFor={id}
                          className="text-main-muted-foreground"
                        >
                          {t("labels.email")}
                        </FormLabel>
                        <FormControl className="border-blue-500 dark:border-gray-50">
                          <Input
                            id={id}
                            className="placeholder:text-main-muted-foreground"
                            type="email"
                            placeholder={t("placeholders.email")}
                            autoComplete="email"
                            inputMode="email"
                            aria-required="true"
                            aria-invalid={!!errors.email || undefined}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => {
                  const id = "contact-message";
                  return (
                    <FormItem>
                      <FormLabel
                        htmlFor={id}
                        className="text-main-muted-foreground"
                      >
                        {t("labels.message")}
                      </FormLabel>
                      <FormControl className="border-blue-500 dark:border-gray-50">
                        <Textarea
                          id={id}
                          placeholder={t("placeholders.message")}
                          className="min-h-[150px] resize-none placeholder:text-main-muted-foreground"
                          autoComplete="off"
                          aria-required="true"
                          aria-invalid={!!errors.message || undefined}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Submit */}
              <CTAButton
                type="submit"
                size="lg"
                className="w-full cursor-pointer"
                showArrow={false}
                sheen
                disabled={isSubmitting}
                loading={isSubmitting}
                aria-live="polite"
                aria-disabled={isSubmitting}
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </CTAButton>

              {isSubmitSuccessful && (
                <p role="status" aria-live="polite" className="sr-only">
                  {t("success_sr")}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const ContactForm = memo(ContactFormBase);
