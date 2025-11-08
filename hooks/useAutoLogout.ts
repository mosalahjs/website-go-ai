// hooks/useAutoLogout.ts
"use client";

import { useEffect, useMemo, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

/* =============== CONFIG =============== */
export type AutoLogoutOptions = {
  tokenCookieName?: string;
  toastMessageEN?: string;
  clockSkewMs?: number;
  debug?: boolean;
  locale?: string;

  /** (NEW) Optional readable expiry sources */
  expCookieName?: string; // e.g., "auth_exp" (epoch ms)
  metaExpName?: string; // e.g., <meta name="session-exp" content="...">
};

const DEFAULTS: Required<
  Omit<AutoLogoutOptions, "locale" | "expCookieName" | "metaExpName">
> & {
  locale?: string;
  expCookieName?: string;
  metaExpName?: string;
} = {
  tokenCookieName: "auth_token",
  toastMessageEN: "Your session has expired. Please log in again.",
  clockSkewMs: 1000,
  debug: false,
  locale: undefined,
  expCookieName: undefined,
  metaExpName: undefined,
};

/* =============== UTILS =============== */
function log(debug: boolean, ...args: unknown[]) {
  if (debug) console.debug("[useAutoLogout]", ...args);
}

function base64UrlDecode(b64url: string): string {
  const b64 =
    b64url.replace(/-/g, "+").replace(/_/g, "/") +
    "===".slice((b64url.length + 3) % 4);
  const latin1 = atob(b64);
  let out = "";
  for (let i = 0; i < latin1.length; i++)
    out += "%" + latin1.charCodeAt(i).toString(16).padStart(2, "0");
  try {
    return decodeURIComponent(out);
  } catch {
    return latin1;
  }
}

function readCookie(name: string): string | null {
  const prefix = `${encodeURIComponent(name)}=`;
  const hit = document.cookie.split("; ").find((r) => r.startsWith(prefix));
  return hit ? decodeURIComponent(hit.slice(prefix.length)) : null;
}

function clearCookie(name: string): void {
  document.cookie = `${encodeURIComponent(
    name
  )}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

function getJwtExpMs(token: string | null, debug = false): number | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(parts[1] ?? "")) as {
      exp?: number;
    };
    const expMs = typeof payload.exp === "number" ? payload.exp * 1000 : null;
    log(debug, "Decoded JWT expMs:", expMs);
    return expMs;
  } catch (e) {
    console.error("[useAutoLogout] JWT decode error:", e);
    return null;
  }
}

function readExpFromCookie(name?: string): number | null {
  if (!name) return null;
  const raw = readCookie(name);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

function readExpFromMeta(name?: string): number | null {
  if (!name) return null;
  const el = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;
  if (!el) return null;
  const raw = el.getAttribute("content");
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) ? n : null;
}

/* =============== HOOK =============== */
export function useAutoLogout(opts?: AutoLogoutOptions) {
  const cfg = { ...DEFAULTS, ...(opts ?? {}) };
  const router = useRouter();
  const pathname = usePathname();

  // Arabic toast fallback if none provided
  const toastMsg = useMemo(() => {
    if (cfg.toastMessageEN && cfg.toastMessageEN.trim())
      return cfg.toastMessageEN;
    if (cfg.locale === "ar") return "انتهت الجلسة. من فضلك سجّل الدخول مجددًا.";
    return DEFAULTS.toastMessageEN;
  }, [cfg.toastMessageEN, cfg.locale]);

  const locale = useMemo(() => {
    if (cfg.locale && cfg.locale.trim()) return cfg.locale;
    const seg = (pathname || "/").split("/")[1];
    return seg || "en";
  }, [cfg.locale, pathname]);

  const loginPath = useMemo(() => {
    const fallbackNext = `/${locale}/dashboard`;
    const next = encodeURIComponent(pathname || fallbackNext);
    return `/${locale}/login?next=${next}`;
  }, [locale, pathname]);

  const didLogoutRef = useRef(false);
  const expiryTimerRef = useRef<number | null>(null);
  const fetchPatchedRef = useRef(false);
  const didToastRef = useRef(false);

  const logoutNow = useMemo(
    () => () => {
      if (didLogoutRef.current) return;
      didLogoutRef.current = true;

      if (expiryTimerRef.current !== null) {
        window.clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }

      clearCookie(cfg.tokenCookieName);

      if (!didToastRef.current) {
        didToastRef.current = true;
        toast.error(toastMsg);
      }

      try {
        router.replace(loginPath);
      } catch (e) {
        console.error("[useAutoLogout] router.replace error:", e);
      }
    },
    [router, loginPath, cfg.tokenCookieName, toastMsg]
  );

  const scheduleExpiryCheck = useMemo(
    () =>
      (token: string | null): void => {
        if (expiryTimerRef.current !== null) {
          window.clearTimeout(expiryTimerRef.current);
          expiryTimerRef.current = null;
        }

        // Read exp from cookie/meta first, fallback to JWT exp
        const expMsFromCookie = readExpFromCookie(cfg.expCookieName);
        const expMsFromMeta = readExpFromMeta(cfg.metaExpName);
        const expMsJwt = getJwtExpMs(token, cfg.debug);
        const expMs = expMsFromCookie ?? expMsFromMeta ?? expMsJwt;

        if (!expMs) {
          // لا تعمل logout — اعتمد على 401
          log(
            cfg.debug,
            "No readable exp (cookie/meta/jwt) → skip scheduling (rely on 401)"
          );
          return;
        }

        const delay = Math.max(expMs - Date.now() - cfg.clockSkewMs, 0);
        log(cfg.debug, "Scheduling logout in ms:", delay, {
          expMs,
          expMsFromCookie,
          expMsFromMeta,
          expMsJwt,
        });
        expiryTimerRef.current = window.setTimeout(logoutNow, delay);
      },
    [logoutNow, cfg.debug, cfg.clockSkewMs, cfg.expCookieName, cfg.metaExpName]
  );

  useEffect(() => {
    const token = readCookie(cfg.tokenCookieName);
    scheduleExpiryCheck(token);

    return () => {
      if (expiryTimerRef.current !== null) {
        window.clearTimeout(expiryTimerRef.current);
        expiryTimerRef.current = null;
      }
    };
  }, [scheduleExpiryCheck, cfg.tokenCookieName]);

  // Safer fetch patch across HMR using a Symbol flag
  useEffect(() => {
    if (fetchPatchedRef.current) return;

    const PATCH_FLAG = Symbol.for("goai.fetch.patched");
    const g = globalThis as Record<string | symbol, unknown>;

    if (!g[PATCH_FLAG]) {
      const originalFetch: typeof fetch = globalThis.fetch.bind(globalThis);

      const patchedFetch: typeof fetch = async (input, init) => {
        try {
          const res = await originalFetch(input, init);
          if (res.status === 401) {
            log(cfg.debug, "Fetch 401 → logout");
            logoutNow();
          }
          return res;
        } catch (e) {
          const msg =
            e instanceof Error ? e.message : typeof e === "string" ? e : "";
          if (/unauthorized|session\s*expired|jwt|token/i.test(msg)) {
            console.warn("[useAutoLogout] Network/Unauthorized error:", e);
            logoutNow();
          }
          throw e;
        }
      };

      (globalThis as { fetch: typeof fetch }).fetch = patchedFetch;
      g[PATCH_FLAG] = true;
      fetchPatchedRef.current = true;

      // Cleanup: only restore if we're the ones who patched
      return () => {
        (globalThis as { fetch: typeof fetch }).fetch = originalFetch;
        g[PATCH_FLAG] = false;
        fetchPatchedRef.current = false;
      };
    } else {
      fetchPatchedRef.current = true; // already patched elsewhere
    }
  }, [logoutNow, cfg.debug]);

  useEffect(() => {
    const recheck = (): void => {
      const token = readCookie(cfg.tokenCookieName);
      scheduleExpiryCheck(token);
    };
    const onVisibility = (): void => {
      if (!document.hidden) recheck();
    };

    window.addEventListener("focus", recheck);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("focus", recheck);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scheduleExpiryCheck, cfg.tokenCookieName]);

  return { logoutNow, locale, loginPath };
}
