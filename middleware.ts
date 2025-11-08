import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

// ==================== CONFIGURATION ====================

const CONFIG = {
  // Protected routes (require authentication)
  protectedPaths: [
    "/dashboard",
    "/dashboard/settings",
    "/dashboard/boot-data",
    "/dashboard/content",
    "/dashboard/sessions",
    "/dashboard/profile",
    "/profile",
    "/settings",
    "/admin",
  ],

  // Auth routes (redirect if authenticated)
  authPaths: ["/login", "/register", "/forgot-password", "/reset-password"],

  // Public routes (no authentication needed)
  publicPaths: ["/", "/about", "/contact", "/terms", "/privacy"],

  // Rate limiting configuration
  rateLimit: {
    enabled: true,
    maxRequests: 100, // Max requests per window
    windowMs: 60000, // 1 minute
  },

  // JWT configuration
  jwt: {
    maxAge: 30 * 60, // 30 minutes
    expiryBuffer: 30, // 30 seconds buffer before expiry
  },

  // Security headers
  security: {
    enableHSTS: true, // Enable in production with HTTPS
    enableCSP: true,
    enableFrameProtection: true,
  },

  // ==================== FEATURE FLAGS ====================

  featureFlags: {
    dashboardPublic: process.env.DASHBOARD_PUBLIC === "1",
  },
};

// ==================== RATE LIMITING STORE ====================

// In-memory rate limit store (use Redis in production for distributed systems)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Extract locale from pathname
 */
function getLocaleFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (routing.locales.includes(firstSegment as any)) {
    return firstSegment;
  }

  return null;
}

/**
 * Remove locale prefix from pathname
 */
function stripLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  if (locale) {
    return pathname.replace(`/${locale}`, "") || "/";
  }
  return pathname;
}

/**
 * Check if path matches protected routes
 */
function isProtectedPath(pathname: string): boolean {
  const cleanPath = stripLocale(pathname);

  // ==================== FEATURE FLAG OVERRIDE ====================
  // If DASHBOARD_PUBLIC=1, then /dashboard and any subpaths are temporarily not protected.
  if (
    CONFIG.featureFlags.dashboardPublic &&
    (cleanPath === "/dashboard" || cleanPath.startsWith("/dashboard/"))
  ) {
    return false;
  }

  return CONFIG.protectedPaths.some(
    (path) => cleanPath === path || cleanPath.startsWith(`${path}/`)
  );
}

/**
 * Check if path matches auth routes
 */
function isAuthPath(pathname: string): boolean {
  const cleanPath = stripLocale(pathname);
  return CONFIG.authPaths.some(
    (path) => cleanPath === path || cleanPath.startsWith(`${path}/`)
  );
}

/**
 * Check if path matches public routes
 */
function isPublicPath(pathname: string): boolean {
  const cleanPath = stripLocale(pathname);
  return CONFIG.publicPaths.some(
    (path) => cleanPath === path || cleanPath.startsWith(`${path}/`)
  );
}

/**
 * Get client IP address (works with Nginx proxy)
 */
function getClientIp(req: NextRequest): string {
  // Try different headers (Nginx/proxy configurations)
  const xForwardedFor = req.headers.get("x-forwarded-for");
  const xRealIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip"); // Cloudflare
  const trueClientIp = req.headers.get("true-client-ip"); // Cloudflare Enterprise

  if (trueClientIp) return trueClientIp;
  if (cfConnectingIp) return cfConnectingIp;
  if (xRealIp) return xRealIp;
  if (xForwardedFor) {
    // x-forwarded-for can contain multiple IPs
    return xForwardedFor.split(",")[0].trim();
  }

  return "unknown";
}

/**
 * Rate limiting check
 */
function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  if (!CONFIG.rateLimit.enabled) {
    return { allowed: true, remaining: 999, resetTime: Date.now() };
  }

  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // Create new record or reset if expired
  if (!record || now > record.resetTime) {
    const resetTime = now + CONFIG.rateLimit.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: CONFIG.rateLimit.maxRequests - 1,
      resetTime,
    };
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > CONFIG.rateLimit.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: CONFIG.rateLimit.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Decode JWT payload without verification (for expiry check only)
 */
function decodeJwtPayload(token: string): {
  exp?: number;
  iat?: number;
  userId?: string;
  [key: string]: any;
} | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode base64url
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padding =
      payload.length % 4 === 0 ? "" : "=".repeat(4 - (payload.length % 4));
    const decoded = atob(payload + padding);

    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/**
 * Check if JWT token is valid (not expired)
 */
function isValidToken(token: string | undefined): boolean {
  if (!token) return false;

  const payload = decodeJwtPayload(token);
  if (!payload) return false;

  // Check if token has expiry
  if (typeof payload.exp !== "number") return false;

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = payload.exp - CONFIG.jwt.expiryBuffer;

  // Check if expired
  if (now >= expiresAt) return false;

  // Check token age (reject tokens older than maxAge)
  if (payload.iat) {
    const tokenAge = now - payload.iat;
    if (tokenAge > CONFIG.jwt.maxAge) return false;
  }

  return true;
}

/**
 * Sanitize redirect path (prevent open redirect)
 */
function sanitizeRedirectPath(path: string): string {
  try {
    // Reject absolute URLs
    if (
      path.startsWith("http://") ||
      path.startsWith("https://") ||
      path.startsWith("//")
    ) {
      return "/";
    }

    // Ensure path is relative
    const url = new URL(path, "http://localhost");
    if (url.origin !== "http://localhost") return "/";

    const safePath = url.pathname + url.search;

    // Reject paths with dangerous characters
    if (/[<>"']/.test(safePath)) return "/";

    return safePath;
  } catch {
    return "/";
  }
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(
  response: NextResponse,
  req: NextRequest
): NextResponse {
  const headers = response.headers;

  // Basic security headers (always enabled)
  headers.set("X-Frame-Options", "DENY");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-XSS-Protection", "1; mode=block");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  );

  // HSTS (only in production with HTTPS)
  if (CONFIG.security.enableHSTS && process.env.NODE_ENV === "production") {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }

  // Content Security Policy
  if (CONFIG.security.enableCSP) {
    const isDev = process.env.NODE_ENV === "development";

    let apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

    // Remove trailing /api or /api/ to allow all endpoints
    apiUrl = apiUrl.replace(/\/api\/?$/, "");

    const csp = [
      "default-src 'self'",
      isDev
        ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
        : "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      `connect-src 'self' ${apiUrl}`.trim(),
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    headers.set("Content-Security-Policy", csp);
  }

  // Custom headers for tracking
  headers.set("X-Request-ID", crypto.randomUUID());

  return response;
}

/**
 * Log security events (production-ready)
 */
function logSecurityEvent(
  event: string,
  details: Record<string, any>,
  req: NextRequest
): void {
  const logData = {
    timestamp: new Date().toISOString(),
    event,
    ip: getClientIp(req),
    userAgent: req.headers.get("user-agent"),
    path: req.nextUrl.pathname,
    ...details,
  };

  if (process.env.NODE_ENV === "production") {
    // In production: send to logging service (Sentry, DataDog, etc.)
    console.log(JSON.stringify({ type: "SECURITY_EVENT", ...logData }));
  } else {
    console.log(`🔒 [SECURITY] ${event}`, logData);
  }
}

// ==================== CREATE I18N MIDDLEWARE ====================

const IntlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

// ==================== MAIN MIDDLEWARE ====================

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ==================== SKIP STATIC ASSETS ====================
  // Performance optimization: skip middleware for static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|css|js|json|map)$/i.test(
      pathname
    )
  ) {
    return NextResponse.next();
  }

  // ==================== RATE LIMITING ====================
  const clientIp = getClientIp(req);
  const rateLimitKey = `${clientIp}:${pathname}`;
  const rateCheck = checkRateLimit(rateLimitKey);

  if (!rateCheck.allowed) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip: clientIp }, req);

    return new NextResponse("Too many requests. Please try again later.", {
      status: 429,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": String(
          Math.ceil((rateCheck.resetTime - Date.now()) / 1000)
        ),
        "X-RateLimit-Limit": String(CONFIG.rateLimit.maxRequests),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(rateCheck.resetTime / 1000)),
      },
    });
  }

  // ==================== RUN I18N MIDDLEWARE FIRST ====================
  const intlResponse = IntlMiddleware(req);

  // Get normalized URL after i18n processing
  const normalizedUrl =
    intlResponse.headers.get("x-middleware-rewrite") || pathname;

  // ==================== AUTHENTICATION CHECK ====================
  const authToken = req.cookies.get("auth_token")?.value;
  const isAuthenticated = isValidToken(authToken);

  // ==================== PROTECTED ROUTES ====================
  if (isProtectedPath(pathname)) {
    if (!isAuthenticated) {
      logSecurityEvent(
        "UNAUTHORIZED_ACCESS",
        {
          path: pathname,
          hasToken: !!authToken,
        },
        req
      );

      // Get current locale
      const locale = getLocaleFromPath(pathname) || routing.defaultLocale;

      // Redirect to login with return URL
      const loginUrl = new URL(`/${locale}/login`, req.url);
      const returnPath = sanitizeRedirectPath(pathname + req.nextUrl.search);
      loginUrl.searchParams.set("redirect", returnPath);

      const response = NextResponse.redirect(loginUrl);
      // Delete any existing auth cookie
      response.cookies.delete("auth_token");
      return addSecurityHeaders(response, req);
    }
  }

  // ==================== AUTH ROUTES (Redirect if logged in) ====================
  if (isAuthPath(pathname) && isAuthenticated) {
    const locale = getLocaleFromPath(pathname) || routing.defaultLocale;
    const dashboardUrl = new URL(`/${locale}/dashboard`, req.url);

    const response = NextResponse.redirect(dashboardUrl);
    return addSecurityHeaders(response, req);
  }

  // ==================== APPLY SECURITY HEADERS ====================
  return addSecurityHeaders(intlResponse, req);
}

// ==================== MATCHER CONFIGURATION ====================

export const config = {
  // Match all routes except static files and API routes
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

// import createMiddleware from "next-intl/middleware";
// import { NextRequest } from "next/server";
// import { routing } from "./i18n/routing";

// const IntlMiddleware = createMiddleware({
//   locales: routing.locales,
//   defaultLocale: routing.defaultLocale,
// });

// export async function middleware(req: NextRequest) {
//   return IntlMiddleware(req);
// }

// export const config = {
//   matcher: ["/((?!api|_next|.*\\..*).*)"],
// };
