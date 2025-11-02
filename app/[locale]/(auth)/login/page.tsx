import { getTranslations } from "next-intl/server";
import LoginForm from "./LoginForm";

export const metadata = { title: "Login | GoAI" };

export default async function LoginPage() {
  const t = await getTranslations("login");
  return (
    <div className="min-h-screen flex items-center justify-center gradient-dash-blue-subtle p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse"
          style={{ background: "hsl(var(--dash-primary) / 0.08)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{
            background: "hsl(var(--dash-primary) / 0.08)",
            animationDelay: "1s",
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <h1 className="sr-only">{t("pageTitle")}</h1>
        <LoginForm />
        <p
          className="text-center text-xs mt-6"
          style={{ color: "hsl(var(--dash-muted-foreground))" }}
        >
          {t("poweredBy")}
        </p>
      </div>
    </div>
  );
}
