import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_UR?.replace(/\/$/, "") ??
  "https://www.goai-bot-backend.goai247.com";

function filterUpstreamHeaders(upstream: Response) {
  const out = new Headers();
  const allowList = new Set([
    "content-type",
    "cache-control",
    "pragma",
    "expires",
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

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15000);

  try {
    const body = await req.json();

    const upstream = await fetch(`${BACKEND_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "manual",
      signal: controller.signal,
    });

    const text = await upstream.text();
    const headers = filterUpstreamHeaders(upstream);

    let json: Record<string, unknown> | null = null;
    try {
      json = JSON.parse(text) as Record<string, unknown>;
    } catch {
      /* ignore */
    }

    if (!upstream.ok) {
      return NextResponse.json(json ?? { success: false, raw: text }, {
        status: upstream.status,
        headers,
      });
    }

    if (json && typeof json === "object" && "access_token" in json) {
      const token = String(
        (json as { access_token?: string }).access_token || ""
      );
      const tokenType = String(
        (json as { token_type?: string }).token_type || "bearer"
      );

      const res = NextResponse.json(
        { success: true, token_type: tokenType },
        { status: 200, headers }
      );

      res.cookies.set({
        name: "auth_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 60,
      });

      return res;
    }

    return NextResponse.json(json ?? { success: false, raw: text }, {
      status: 200,
      headers,
    });
  } catch (e: unknown) {
    const isAbort = e instanceof Error && e.name === "AbortError";
    const msg =
      e instanceof Error
        ? isAbort
          ? "Auth service timeout"
          : e.message
        : "Proxy error";

    return NextResponse.json(
      { success: false, error: msg },
      { status: isAbort ? 504 : 500 }
    );
  } finally {
    clearTimeout(t);
  }
}
