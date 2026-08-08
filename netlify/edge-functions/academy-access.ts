import {
  ACADEMY_COOKIE,
  ACADEMY_SESSION_PAYLOAD,
  constantTimeEqual,
  redirectResponse,
  safePortalPath,
  signValue,
} from "./_shared/academy-auth.ts";

declare const Netlify: { env: { get(name: string): string | undefined } };

export default async (request: Request): Promise<Response> => {
  const requestUrl = new URL(request.url);
  const sessionSecret = Netlify.env.get("ACADEMY_SESSION_SECRET");
  const configuredPasscode = Netlify.env.get("ACADEMY_PASSCODE");

  if (requestUrl.pathname === "/academy-logout") {
    return redirectResponse(new URL("/academy.html", request.url), {
      "Set-Cookie": `${ACADEMY_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    });
  }

  if (request.method !== "POST") {
    return redirectResponse(new URL("/academy-login.html", request.url));
  }

  if (!sessionSecret || !configuredPasscode) {
    return new Response("Academy access is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const formData = await request.formData();
  const enteredPasscode = String(formData.get("passcode") || "");
  const nextPath = safePortalPath(formData.get("next"));
  const [enteredFingerprint, configuredFingerprint] = await Promise.all([
    signValue(`passcode:${enteredPasscode}`, sessionSecret),
    signValue(`passcode:${configuredPasscode}`, sessionSecret),
  ]);

  if (!constantTimeEqual(enteredFingerprint, configuredFingerprint)) {
    const loginUrl = new URL("/academy-login.html", request.url);
    loginUrl.searchParams.set("error", "1");
    loginUrl.searchParams.set("next", nextPath);
    return redirectResponse(loginUrl);
  }

  const sessionToken = await signValue(ACADEMY_SESSION_PAYLOAD, sessionSecret);
  return redirectResponse(new URL(nextPath, request.url), {
    "Set-Cookie": `${ACADEMY_COOKIE}=${encodeURIComponent(sessionToken)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=28800`,
  });
};
