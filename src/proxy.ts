import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require a signed-in user. Admin/staff-role enforcement (email in
// the MongoDB admins list) happens in the layout, since the Mongo driver can't
// run in the edge middleware runtime.
const isProtected = createRouteMatcher(["/admin(.*)", "/account(.*)", "/chat(.*)", "/crm(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") ?? "";
  const p = req.nextUrl.pathname;
  const { userId, redirectToSignIn } = await auth();

  // ── CRM subdomain (crm.<domain>) → serve the /crm app ──
  if (host.startsWith("crm.")) {
    // Auth pages, API and Next internals must pass through untouched so the
    // sign-in flow can render on the subdomain (avoids a redirect loop).
    const passthrough =
      p.startsWith("/sign-in") ||
      p.startsWith("/sign-up") ||
      p.startsWith("/api") ||
      p.startsWith("/_next") ||
      p.startsWith("/crm");
    if (passthrough) {
      if (p.startsWith("/crm") && !userId) return redirectToSignIn({ returnBackUrl: req.url });
      return NextResponse.next();
    }
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
    const rewritten = req.nextUrl.clone();
    rewritten.pathname = p === "/" ? "/crm" : `/crm${p}`;
    return NextResponse.rewrite(rewritten);
  }

  // ── Main domain ── explicit redirect for signed-out users on protected routes
  if (isProtected(req) && !userId) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
