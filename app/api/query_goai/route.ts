// app/api/query_goai/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.BACKEND_URL?.replace(/\/$/, "") ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${BACKEND_URL}/api/query_goai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.INTERNAL_TOKEN}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => "Unknown error");
      return new Response(errorText, {
        status: upstream.status,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (!upstream.body) {
      return new Response("Upstream has no body", { status: 502 });
    }

    const headers = new Headers();
    const xSession = upstream.headers.get("x-session-id");
    if (xSession) {
      headers.set("x-session-id", xSession);
    }

    const contentType =
      upstream.headers.get("content-type") ?? "text/plain; charset=utf-8";
    headers.set("content-type", contentType);

    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return new Response(
      JSON.stringify({
        error: "Proxy error",
        message: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
