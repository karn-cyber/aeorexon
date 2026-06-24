import { AccessManager } from "@/components/admin/AccessManager";

export default function AdminAccessPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-text">Team access</h1>
      <p className="mt-1 mb-6 text-text-muted">
        Grant admin access to your tech / product team by email. They sign in with that
        email through Clerk and get the same management permissions.
      </p>
      <AccessManager />
    </div>
  );
}
