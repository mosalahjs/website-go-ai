"use client";

import { useTransition, memo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { CTAButton } from "@/components/ui/cta-button";
import { Link } from "@/i18n/routing";
import Image from "next/image";

// Zod Schema for validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100, { message: "Password is too long" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Memoized Background Component
const BackgroundAnimation = memo(() => (
  <div
    className="absolute inset-0 overflow-hidden pointer-events-none"
    aria-hidden="true"
  >
    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-float" />
    <div
      className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/30 rounded-full blur-3xl animate-float"
      style={{ animationDelay: "1s" }}
    />
  </div>
));

BackgroundAnimation.displayName = "BackgroundAnimation";

// Memoized Logo Component
const Logo = memo(() => (
  <div className="inline-flex items-center justify-center size-24 rounded-2xl mb-4 shadow-lg animate-glow">
    <Image
      src={`/logo/logo.png`}
      alt="logo-login"
      width={120}
      height={120}
      className="size-22 object-cover object-center"
    />
  </div>
));

Logo.displayName = "Logo";

const ClientOld = () => {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "test@example.com",
      password: "123456789",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    startTransition(async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/auth/login', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock validation
        if (data.email && data.password) {
          toast.success(t("success"));
          router.push("/dashboard");
          router.refresh();
        } else {
          toast.error(t("error"));
        }
      } catch (error) {
        console.error("Login error:", error);
        toast.error(t("error"));
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <BackgroundAnimation />

      <Card className="w-full max-w-md mx-4 glass-effect shadow-2xl relative z-10 animate-scale-in py-8">
        <CardHeader className="text-center space-y-2 animate-slide-up">
          <div className="flex justify-center">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent text-gradient-third">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem
                    className="animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <FormLabel className="text-foreground font-medium">
                      {t("email.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none"
                          aria-hidden="true"
                        />
                        <Input
                          type="email"
                          placeholder={t("email.placeholder")}
                          className="pl-10 h-12 bg-white/50 border-border focus:border-primary transition-colors"
                          autoComplete="email"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem
                    className="animate-slide-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <FormLabel className="text-foreground font-medium">
                      {t("password.label")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none"
                          aria-hidden="true"
                        />
                        <Input
                          type="password"
                          placeholder={t("password.placeholder")}
                          className="pl-10 h-12 bg-white/50 border-border focus:border-primary transition-colors"
                          autoComplete="current-password"
                          disabled={isPending}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <CTAButton
                type="submit"
                className="w-full h-12 animate-slide-up"
                style={{ animationDelay: "0.3s" }}
                size="lg"
                sheen
                glowFrom="rgba(52,121,254,0.45)"
                glowTo="rgba(72,152,255,0.45)"
                variant="default"
                showArrow={false}
                disabled={isPending}
                loading={isPending}
                aria-live="polite"
              >
                {isPending ? t("loading") : t("submit")}
              </CTAButton>

              <div
                className="text-center text-sm text-muted-foreground animate-fade-in"
                style={{ animationDelay: "0.4s" }}
              >
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default ClientOld;
