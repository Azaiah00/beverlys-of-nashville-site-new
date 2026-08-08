import {
  ACADEMY_COOKIE,
  ACADEMY_SESSION_PAYLOAD,
  constantTimeEqual,
  readCookie,
  signValue,
} from "./_shared/academy-auth.ts";

declare const Netlify: { env: { get(name: string): string | undefined } };

type EdgeContext = {
  next(): Promise<Response>;
};

export default async (request: Request, context: EdgeContext): Promise<Response> => {
  const sessionSecret = Netlify.env.get("ACADEMY_SESSION_SECRET");
  if (!sessionSecret) {
    return new Response("Academy access is not configured.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const suppliedToken = readCookie(request, ACADEMY_COOKIE) || "";
  const expectedToken = await signValue(ACADEMY_SESSION_PAYLOAD, sessionSecret);

  if (constantTimeEqual(suppliedToken, expectedToken)) {
    // Serve the React application explicitly. Netlify's pretty-URL resolver
    // otherwise finds the old static portal.html before redirects are applied.
    const appUrl = new URL("/index.html", request.url);
    const appResponse = await fetch(appUrl, {
      method: "GET",
      headers: request.headers,
    });
    const responseHeaders = new Headers(appResponse.headers);
    responseHeaders.set("Cache-Control", "private, no-store");
    responseHeaders.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return new Response(appResponse.body, {
      status: appResponse.status,
      statusText: appResponse.statusText,
      headers: responseHeaders,
    });
  }

  const requestUrl = new URL(request.url);
  const loginUrl = new URL("/academy-login.html", request.url);
  loginUrl.searchParams.set("next", `${requestUrl.pathname}${requestUrl.search}`);
  return new Response(null, {
    status: 303,
    headers: {
      Location: loginUrl.toString(),
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
};
