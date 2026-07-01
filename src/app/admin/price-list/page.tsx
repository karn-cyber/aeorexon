import { priceList, priceGroups } from "@/data/priceList";
import { QuoteBuilder } from "@/components/admin/QuoteBuilder";

export const metadata = { title: "Price List Builder — Admin" };

export default function PriceListPage() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-text">Price list / quote builder</h1>
      <p className="mt-1 mb-6 max-w-2xl text-text-muted">
        Start from the SEKO channel-partner prices, add your commission or a shown
        discount, then download a customer price list (CSV / PDF) or copy it into a chat.
      </p>
      <QuoteBuilder items={priceList} groups={priceGroups} />
    </div>
  );
}
