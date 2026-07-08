import { CrmBoard } from "@/components/crm/CrmBoard";

export const dynamic = "force-dynamic";

export default function CrmDashboard() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-text">Sales Pipeline</h1>
        <p className="text-sm text-text-muted">
          Track every lead from first approach through quotation, order, delivery and final payment.
        </p>
      </div>
      <CrmBoard />
    </div>
  );
}
