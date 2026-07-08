import { redirect } from "next/navigation";

// Sign-in is handled by Clerk's hosted Account Portal. Route any hit here through
// the protected /account page, which the middleware redirects to the portal
// server-side (reliable — no client-side redirect loop).
export default function SignInPage() {
  redirect("/account");
}
