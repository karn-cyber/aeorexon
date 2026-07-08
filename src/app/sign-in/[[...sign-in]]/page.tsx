"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

// Redirect to Clerk's hosted sign-in (Account Portal). More reliable in
// production than embedding <SignIn/>, and matches the CRM subdomain flow.
export default function SignInPage() {
  const clerk = useClerk();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const back = params.get("redirect_url") ?? window.location.origin;
    clerk.redirectToSignIn({ redirectUrl: back });
  }, [clerk]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <p className="mono-label text-text-muted">Redirecting to secure sign-in…</p>
    </div>
  );
}
