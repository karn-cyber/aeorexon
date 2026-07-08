import { LeadDetail } from "@/components/crm/LeadDetail";

export const dynamic = "force-dynamic";

export default async function LeadPage(props: PageProps<"/crm/leads/[id]">) {
  const { id } = await props.params;
  return <LeadDetail id={id} />;
}
