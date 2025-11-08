import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "https://www.goai-bot-backend.goai247.com";

export async function GET() {
  if (!BACKEND_BASE)
    return NextResponse.json(
      { detail: "Missing GOAI_API_URL" },
      { status: 500 }
    );

  const token = (await cookies()).get("auth_token")?.value;
  const res = await fetch(`${BACKEND_BASE}/goai`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") || "application/json",
    },
  });
}
