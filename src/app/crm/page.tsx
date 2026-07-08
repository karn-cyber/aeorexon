import { CrmBoard } from "@/components/crm/CrmBoard";

export const dynamic = "force-dynamic";

export default function CrmDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text">Sales Pipeline</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Lead → quotation → order → delivery → payment, all in one place.
        </p>
      </div>
      <CrmBoard />
    </div>
  );
}
