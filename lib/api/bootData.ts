export async function fetchJSON(
  path: string,
  init?: RequestInit
): Promise<unknown>;
export async function fetchJSON<T>(
  path: string,
  init?: RequestInit
): Promise<T>;
export async function fetchJSON<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const url = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      // نحافظ على typing آمن بدون any
      const err: unknown = await res.json();
      if (err && typeof err === "object") {
        const e = err as { detail?: string; error?: string };
        msg = e.detail || e.error || msg;
      }
    } catch {
      // تجاهل: السيرفر قد لا يرجع JSON في الأخطاء
    }
    throw new Error(msg);
  }

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    // لو محتاج نوع محدد مرّره كـ <T> من مكان الاستدعاء
    return (await res.json()) as T;
  }

  const text = await res.text();
  return text as unknown as T;
}
