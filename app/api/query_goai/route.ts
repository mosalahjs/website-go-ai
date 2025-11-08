// app/api/query_goai/route.ts
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ==================== CONFIGURATION ====================
const CONFIG = {
  BACKEND_URL:
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "https://www.goai-bot-backend.goai247.com",
  TIMEOUT_MS: 90000, // 90 seconds
  MAX_RETRIES: 1,
  RATE_LIMIT: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 60000, // 1 minute
  },
} as const;

// ==================== RATE LIMITING ====================
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

function checkRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    const resetTime = now + CONFIG.RATE_LIMIT.WINDOW_MS;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - 1,
      resetTime,
    };
  }

  record.count++;

  if (record.count > CONFIG.RATE_LIMIT.MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: CONFIG.RATE_LIMIT.MAX_REQUESTS - record.count,
    resetTime: record.resetTime,
  };
}

function getClientIp(req: NextRequest): string {
  const trueClientIp = req.headers.get("true-client-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  const xRealIp = req.headers.get("x-real-ip");
  const xForwardedFor = req.headers.get("x-forwarded-for");

  if (trueClientIp) return trueClientIp;
  if (cfConnectingIp) return cfConnectingIp;
  if (xRealIp) return xRealIp;
  if (xForwardedFor) return xForwardedFor.split(",")[0].trim();

  return "unknown";
}

// ==================== VALIDATION ====================
function isValidRequestBody(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;

  // Must have query
  if (!b.query || typeof b.query !== "string") return false;

  // Query length limits
  if (b.query.length < 1 || b.query.length > 10000) return false;

  // Optional fields validation
  if (b.n_results !== undefined) {
    if (
      typeof b.n_results !== "number" ||
      b.n_results < 1 ||
      b.n_results > 10
    ) {
      return false;
    }
  }

  if (b.session_id !== undefined) {
    if (typeof b.session_id !== "string" || b.session_id.length > 100) {
      return false;
    }
  }

  return true;
}

function detectMode(ct: string | null): "sse" | "ndjson" | "json" | "text" {
  const s = (ct || "").toLowerCase();
  if (s.includes("text/event-stream")) return "sse";
  if (s.includes("application/x-ndjson")) return "ndjson";
  if (s.includes("application/json")) return "json";
  return "text";
}

// ==================== MAIN HANDLER ====================
export async function POST(req: NextRequest) {
  // Rate limiting
  const clientIp = getClientIp(req);
  const rateCheck = checkRateLimit(clientIp);

  if (!rateCheck.allowed) {
    return new NextResponse("Too many requests. Please try again later.", {
      status: 429,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Retry-After": String(
          Math.ceil((rateCheck.resetTime - Date.now()) / 1000)
        ),
        "X-RateLimit-Limit": String(CONFIG.RATE_LIMIT.MAX_REQUESTS),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(rateCheck.resetTime / 1000)),
      },
    });
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new NextResponse("Invalid JSON", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  if (!isValidRequestBody(body)) {
    return new NextResponse("Invalid request body", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Abort controller
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS);

  const onAbort = () => controller.abort();

  try {
    req.signal.addEventListener("abort", onAbort, { once: true });

    // Forward to backend
    const url = `${CONFIG.BACKEND_URL}/api/goai/query`;
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept:
          "text/event-stream, application/x-ndjson, text/plain, application/json",
        "User-Agent": "GoAI-Proxy/1.0",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const ct = upstream.headers.get("content-type");
    const mode = detectMode(ct);

    // Handle errors
    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "Unknown error");
      return new NextResponse(text || `HTTP ${upstream.status}`, {
        status: upstream.status,
        headers: {
          "Content-Type":
            ct && ct.includes("json")
              ? "application/json; charset=utf-8"
              : "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    if (!upstream.body) {
      return new NextResponse("Upstream has no body", {
        status: 502,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    // Session ID handling
    const baseHeaders: HeadersInit = {
      "X-Request-ID": crypto.randomUUID(),
    };
    const xSession = upstream.headers.get("x-session-id");
    if (xSession) {
      baseHeaders["x-session-id"] = xSession;
    }

    // SSE: Convert plain text chunks to proper SSE format
    if (mode === "sse") {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const transformStream = new TransformStream({
        transform(chunk, controller) {
          try {
            const text =
              typeof chunk === "string"
                ? chunk
                : decoder.decode(chunk, { stream: true });

            if (!text) return;

            // Convert to SSE format with delta field
            const sseData = `data: ${JSON.stringify({ delta: text })}\n\n`;
            controller.enqueue(encoder.encode(sseData));
          } catch (err) {
            // Silently ignore transform errors in production
            if (process.env.NODE_ENV === "development") {
              console.error("[SSE Transform]", err);
            }
          }
        },
      });

      const readableStream = upstream.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(transformStream);

      return new NextResponse(readableStream, {
        status: 200,
        headers: {
          ...baseHeaders,
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
          "X-Accel-Buffering": "no",
        },
      });
    }

    // NDJSON passthrough
    if (mode === "ndjson") {
      const text = await upstream.text();
      return new NextResponse(text, {
        status: 200,
        headers: {
          ...baseHeaders,
          "Content-Type": "application/x-ndjson; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    // JSON / TEXT
    const bodyText = await upstream.text();
    return new NextResponse(bodyText, {
      status: 200,
      headers: {
        ...baseHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    clearTimeout(timeoutId);

    const isAbort = e instanceof Error && e.name === "AbortError";

    // Log errors in development only
    if (!isAbort && process.env.NODE_ENV === "development") {
      console.error("[Proxy Error]", e);
    }

    return new NextResponse(
      JSON.stringify({
        error: isAbort ? "Request timeout" : "Proxy error",
        message:
          e instanceof Error ? e.message : "An unexpected error occurred",
      }),
      {
        status: isAbort ? 408 : 500,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );
  } finally {
    clearTimeout(timeoutId);
    req.signal.removeEventListener("abort", onAbort);
  }
}
