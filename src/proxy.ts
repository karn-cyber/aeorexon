import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require a signed-in user. Admin/staff-role enforcement (email in
// the MongoDB admins list) happens in the layout, since the Mongo driver can't
// run in the edge middleware runtime.
const isProtected = createRouteMatcher(["/admin(.*)", "/account(.*)", "/chat(.*)", "/crm(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl;
  const { userId, redirectToSignIn } = await auth();

  // Serve the CRM on the crm.<domain> subdomain by rewriting to /crm/*.
  // Everything on the CRM subdomain requires sign-in.
  if (host.startsWith("crm.") && !url.pathname.startsWith("/crm") && !url.pathname.startsWith("/api")) {
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
    const rewritten = url.clone();
    rewritten.pathname = url.pathname === "/" ? "/crm" : `/crm${url.pathname}`;
    return NextResponse.rewrite(rewritten);
  }

  // Explicit redirect for signed-out users (more reliable than auth.protect(),
  // which can 404 in production when the sign-in URL can't be resolved).
  if (isProtected(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
