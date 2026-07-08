import { solutionAreas } from "@/data/solutions";
import { SolutionCard } from "@/components/solutions/SolutionCard";

export const metadata = {
  title: "Areas of Work — Aorexon",
  description:
    "Aorexon's areas of work: dosing & water treatment, PNG gas pipeline installations, URB industrial bearings, and Lynchpin café & dining seating.",
};

export default function SolutionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-extrabold text-text sm:text-4xl">Our areas of work</h1>
        <p className="mt-3 text-lg text-text-muted">
          Beyond dosing systems, Aorexon partners with trusted principals across gas
          infrastructure, industrial components and commercial seating.
        </p>
      </header>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {solutionAreas.map((area) => (
          <SolutionCard key={area.slug} area={area} />
        ))}
      </div>
    </div>
  );
}
