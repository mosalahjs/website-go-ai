import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function expireCookie(
  res: NextResponse,
  name: string,
  opts?: Partial<Parameters<typeof res.cookies.set>[2]>
) {
  res.cookies.delete(name);

  const common: Parameters<typeof res.cookies.set>[2] = {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    expires: new Date(0),
    ...opts,
  };
  res.cookies.set(name, "", common);
}

export async function POST(req: NextRequest) {
  void req;
  try {
    const res = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    const CANDIDATES = [
      "auth_token",
      "token",
      "access_token",
      "refresh_token",
      "session",
    ];

    for (const name of CANDIDATES) {
      expireCookie(res, name, { path: "/" });

      expireCookie(res, name, { path: "/", httpOnly: false, secure: false });
    }

    return res;
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  void req;
  return POST(req);
}
