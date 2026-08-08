export const ACADEMY_COOKIE = "beverlys_academy_access";
export const ACADEMY_SESSION_PAYLOAD = "beverlys-academy-member-v1";

export async function signValue(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const binary = String.fromCharCode(...new Uint8Array(signature));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function constantTimeEqual(left: string, right: string): boolean {
  const maxLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < maxLength; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return difference === 0;
}

export function readCookie(request: Request, name: string): string | null {
  const cookieHeader = request.headers.get("cookie") || "";
  for (const pair of cookieHeader.split(";")) {
    const [key, ...valueParts] = pair.trim().split("=");
    if (key === name) return decodeURIComponent(valueParts.join("="));
  }
  return null;
}

export function safePortalPath(value: FormDataEntryValue | string | null): string {
  const candidate = typeof value === "string" ? value : "/portal";
  return candidate === "/portal" || candidate.startsWith("/portal/") ? candidate : "/portal";
}

export function redirectResponse(location: URL | string, headers: HeadersInit = {}): Response {
  return new Response(null, {
    status: 303,
    headers: {
      Location: String(location),
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}
