import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://www.goai-bot-backend.goai247.com";

function filterUpstreamHeaders(upstream: Response) {
  const out = new Headers();
  const allowList = new Set([
    "content-type",
    "cache-control",
    "pragma",
    "expires",
    "etag",
    "last-modified",
  ]);

  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (allowList.has(k)) out.set(k, value);
  });

  if (!out.get("content-type")) {
    out.set("content-type", "application/json; charset=utf-8");
  }

  return out;
}

/**
 * Extract auth token from cookies
 */
function getAuthToken(req: NextRequest): string | null {
  return req.cookies.get("auth_token")?.value ?? null;
}

export async function GET(req: NextRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    // Get auth token from cookies
    const token = getAuthToken(req);

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Build upstream URL
    const upstreamUrl = `${BACKEND_BASE}/api/goai/history?page=${page}&limit=${limit}`;

    // Make authenticated request to backend
    const upstream = await fetch(upstreamUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });

    // Read response
    const text = await upstream.text();
    const headers = filterUpstreamHeaders(upstream);

    // Try to parse JSON
    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      // Invalid JSON response
    }

    // Handle error responses
    if (!upstream.ok) {
      // Token expired or invalid
      if (upstream.status === 401) {
        return NextResponse.json(
          { success: false, error: "Token expired or invalid" },
          { status: 401, headers }
        );
      }

      return NextResponse.json(
        json ?? { success: false, error: "Backend error", raw: text },
        { status: upstream.status, headers }
      );
    }

    // Return successful response
    return NextResponse.json(
      json ?? { success: false, error: "Invalid response format" },
      { status: 200, headers }
    );
  } catch (e: unknown) {
    const isAbort = e instanceof Error && e.name === "AbortError";
    const msg =
      e instanceof Error
        ? isAbort
          ? "Request timeout"
          : e.message
        : "Proxy error";

    return NextResponse.json(
      { success: false, error: msg },
      { status: isAbort ? 504 : 500 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
