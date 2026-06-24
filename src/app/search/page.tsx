import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { searchProducts, matchIntentTags, parseNumericIntent } from "@/lib/search";
import { useCases } from "@/data/categories";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchBar } from "@/components/layout/SearchBar";

export const metadata = { title: "Search — Aorexon" };

export default async function SearchPage(props: PageProps<"/search">) {
  const sp = await props.searchParams;
  const raw = sp.q;
  const query = (Array.isArray(raw) ? raw[0] : raw ?? "").toString();

  const products = await getAllProducts();
  const results = searchProducts(query, products).map((r) => r.product);

  const intentTags = matchIntentTags(query);
  const numeric = parseNumericIntent(query);
  const suggestedUseCases = useCases.filter((u) => intentTags.includes(u.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="max-w-2xl">
        <SearchBar initialQuery={query} />
      </div>

      <h1 className="mt-6 text-2xl font-bold text-text">
        {query ? (
          <>
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="text-primary">“{query}”</span>
          </>
        ) : (
          "Search the catalogue"
        )}
      </h1>

      {(suggestedUseCases.length > 0 ||
        numeric.minFlowLH !== undefined ||
        numeric.minPressureBar !== undefined) && (
        <div className="mt-4 rounded-xl border border-primary-light/30 bg-primary/5 p-4">
          <p className="text-sm font-semibold text-primary">It looks like you need:</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {numeric.minFlowLH !== undefined && (
              <span className="rounded-full bg-surface px-3 py-1 text-text-muted">
                ≥ {numeric.minFlowLH} l/h
              </span>
            )}
            {numeric.minPressureBar !== undefined && (
              <span className="rounded-full bg-surface px-3 py-1 text-text-muted">
                ≥ {numeric.minPressureBar} bar
              </span>
            )}
            {suggestedUseCases.map((u) => (
              <Link
                key={u.slug}
                href={`/use-cases/${u.slug}`}
                className="rounded-full bg-accent px-3 py-1 font-medium text-white hover:brightness-110"
              >
                {u.icon} {u.title.replace(/^.*for /i, "")}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8">
        {query ? (
          <ProductGrid products={results} />
        ) : (
          <p className="text-text-muted">
            Try “chlorine dosing for swimming pool”, “high pressure boiler 100 bar”,
            or “off grid solar 12v”.
          </p>
        )}
      </div>
    </div>
  );
}
