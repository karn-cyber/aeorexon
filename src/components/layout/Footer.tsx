import Link from "next/link";
import { categories } from "@/data/categories";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-primary text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-2xl font-extrabold uppercase tracking-tight">
            <span className="text-white">A</span>
            <span className="text-accent">O</span>
            <span className="text-white">REXON</span>
          </div>
          <p className="mt-3 text-sm text-white/60">
            Industrial dosing equipment from SEKO / Water &amp; Industry —
            ordered intelligently.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Shop by use case</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/use-cases/swimming-pool" className="hover:text-white">Swimming Pools</Link></li>
            <li><Link href="/use-cases/water-treatment" className="hover:text-white">Water Treatment</Link></li>
            <li><Link href="/use-cases/high-pressure" className="hover:text-white">High Pressure</Link></li>
            <li><Link href="/use-cases/solar-offgrid" className="hover:text-white">Off-Grid / Solar</Link></li>
            <li><Link href="/use-cases/iot-remote" className="hover:text-white">IoT Remote</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Areas of work</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/solutions" className="hover:text-white">All areas of work</Link></li>
            <li><Link href="/solutions/png-gas-pipeline" className="hover:text-white">PNG Gas Pipelines</Link></li>
            <li><Link href="/solutions/urb-bearings" className="hover:text-white">URB Bearings</Link></li>
            <li><Link href="/solutions/lynchpin-seating" className="hover:text-white">Lynchpin Seating</Link></li>
            <li><Link href="/chat/new?name=Quote%20request" className="hover:text-white">Request a Quote</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Aorexon. Product data from SEKO / W&amp;I catalogues.
      </div>
    </footer>
  );
}
