"use client";

import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

// Redirect to Clerk's hosted sign-up (Account Portal).
export default function SignUpPage() {
  const clerk = useClerk();
  useEffect(() => {
    clerk.redirectToSignUp();
  }, [clerk]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center px-4">
      <p className="mono-label text-text-muted">Redirecting to secure sign-up…</p>
    </div>
  );
}
