import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const user = process.env.ADMIN_USERNAME;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    console.error("Planning: ADMIN_USERNAME/ADMIN_PASSWORD not configured.");
    return new Response("Accès non configuré.", { status: 503 });
  }

  const auth = request.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      const [suppliedUser, suppliedPass] = atob(encoded).split(":");
      if (suppliedUser === user && suppliedPass === pass) {
        return;
      }
    }
  }

  return new Response("Authentification requise.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Planning", charset="UTF-8"' },
  });
}

export const config = {
  matcher: "/planning/:path*",
};
