import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { isAdminEmail } from "@/lib/admins";

export interface CurrentUserInfo {
  email: string | null;
  name: string | null;
  isAdmin: boolean;
}

/** Resolve the signed-in Clerk user and whether they have admin access. */
export async function getCurrentUserInfo(): Promise<CurrentUserInfo> {
  const user = await currentUser();
  if (!user) return { email: null, name: null, isAdmin: false };
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;
  return {
    email,
    name: user.fullName ?? user.firstName ?? email,
    isAdmin: await isAdminEmail(email),
  };
}

/** Throws-style guard for admin-only server actions. Returns the admin email. */
export async function requireAdmin(): Promise<string> {
  const { email, isAdmin } = await getCurrentUserInfo();
  if (!isAdmin || !email) {
    throw new Error("Unauthorized: admin access required");
  }
  return email;
}
