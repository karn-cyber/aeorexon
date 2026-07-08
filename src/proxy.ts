import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Routes that require a signed-in user. Admin/staff-role enforcement (email in
// the MongoDB admins list) happens in the layout, since the Mongo driver can't
// run in the edge middleware runtime.
const isProtected = createRouteMatcher(["/admin(.*)", "/account(.*)", "/chat(.*)", "/crm(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const host = req.headers.get("host") ?? "";
  const url = req.nextUrl;

  // Serve the CRM on the crm.<domain> subdomain by rewriting to /crm/*.
  // Everything on the CRM subdomain requires sign-in.
  if (host.startsWith("crm.") && !url.pathname.startsWith("/crm") && !url.pathname.startsWith("/api")) {
    await auth.protect();
    const rewritten = url.clone();
    rewritten.pathname = url.pathname === "/" ? "/crm" : `/crm${url.pathname}`;
    return NextResponse.rewrite(rewritten);
  }

  if (isProtected(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else.
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
