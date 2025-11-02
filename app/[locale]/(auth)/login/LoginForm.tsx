"use client";
import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Toaster, toast } from "sonner";
import { Sparkles, ArrowRight } from "lucide-react";

type LoginBody = { email: string; password: string };

type LoginResponse = {
  access_token?: string;
  success?: boolean;
  message?: string;
  error?: string;
  [k: string]: unknown;
};

const LOGIN_URL = "/api/auth/login";

async function loginFetcher(
  url: string,
  { arg }: { arg: LoginBody }
): Promise<LoginResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(arg),
  });

  const copy = res.clone();
  const raw = await copy.text();

  let data: LoginResponse | null = null;
  try {
    data = JSON.parse(raw) as LoginResponse;
  } catch {}

  if (!res.ok) {
    const msg =
      (data && (data.error || data.message)) ||
      res.statusText ||
      `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return (data ?? {}) as LoginResponse;
}

export default function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = sp.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { trigger, isMutating } = useSWRMutation<
    LoginResponse,
    Error,
    string,
    LoginBody
  >(LOGIN_URL, loginFetcher, {
    throwOnError: true,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const data = await trigger({ email, password });
        console.log("[login response]", data);

        if (data?.access_token || data?.success) {
          toast.success(t("successTitle"), {
            description: t("successDesc"),
            duration: 2500,
          });
          router.replace(redirect);
        } else {
          toast.error(t("failedTitle"), {
            description:
              data?.message || t("failedDesc") || "Invalid credentials.",
            duration: 3000,
          });
        }
      } catch (err: unknown) {
        const description = err instanceof Error ? err.message : t("errorDesc");
        toast.error(t("errorTitle"), {
          description,
          duration: 3000,
        });
      }
    },
    [email, password, redirect, router, t, trigger]
  );

  return (
    <>
      <Toaster richColors position="top-center" closeButton />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="card-dash glass-card-dash border-2 py-8">
          <CardHeader className="space-y-1 text-center pb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-dash-primary flex items-center justify-center text-white text-4xl font-bold glow-dash relative overflow-hidden group"
            >
              <Sparkles className="h-10 w-10 absolute opacity-0 group-hover:opacity-100 transition-smooth" />
              <span className="group-hover:opacity-0 transition-smooth">G</span>
            </motion.div>
            <CardTitle className="text-4xl font-bold tracking-tight">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("subtitle")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("emailLabel")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 rounded-xl border-2 transition-smooth focus:border-[hsl(var(--dash-primary))]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  {t("passwordLabel")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 rounded-xl border-2 transition-smooth focus:border-[hsl(var(--dash-primary))]"
                />
              </div>

              <Button
                type="submit"
                className="btn-dash-primary glow-dash h-12 text-base font-semibold group w-full"
                disabled={isMutating}
              >
                {isMutating ? (
                  t("signingIn")
                ) : (
                  <>
                    {t("signIn")}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-smooth" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
