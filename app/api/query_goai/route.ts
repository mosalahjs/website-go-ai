// app/api/query_goai/route.ts
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_UR?.replace(/\/$/, "") ??
  "http://209.38.184.210:5002";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const controller = new AbortController();
  const onAbort = () => controller.abort();

  try {
    req.signal.addEventListener("abort", onAbort, { once: true });

    const upstream = await fetch(`${BACKEND_URL}/api/goai/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${process.env.INTERNAL_TOKEN}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });

    if (!upstream.ok) {
      const text = await upstream.text().catch(() => "Unknown error");
      return new Response(text, {
        status: upstream.status,
        headers: { "Content-Type": "text/plain", "Cache-Control": "no-store" },
      });
    }

    if (!upstream.body) {
      return new Response("Upstream has no body", { status: 502 });
    }

    const headers = new Headers();
    headers.set("Cache-Control", "no-store");
    const xSession = upstream.headers.get("x-session-id");
    if (xSession) headers.set("x-session-id", xSession);
    const contentType =
      upstream.headers.get("content-type") ?? "text/plain; charset=utf-8";
    headers.set("content-type", contentType);

    const { readable, writable } = new TransformStream();
    upstream.body.pipeTo(writable, { signal: req.signal }).catch(() => {});

    return new Response(readable, {
      status: upstream.status,
      headers,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: "Proxy error",
        message: e instanceof Error ? e.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    req.signal.removeEventListener("abort", onAbort);
  }
}
