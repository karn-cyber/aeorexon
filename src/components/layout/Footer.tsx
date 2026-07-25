import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-ink text-white/70">
      <div className="tech-grid-dark">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-white/10 text-sm font-black text-gold">
                A
              </span>
              <span className="text-lg font-extrabold uppercase tracking-tight text-white">
                Aorexon <span className="text-white/50">Systems</span>
              </span>
            </div>
            <p className="mono-label mt-3 text-gold/90">Engineering Solutions. Delivering Excellence.</p>
            <p className="mt-3 max-w-xs text-sm text-white/55">
              High-precision industrial solutions for fluid management, gas infrastructure,
              bearings and architectural-grade seating. Since 1994.
            </p>
          </div>

          <FooterCol title="Engineering">
            <FooterLink href="/products">Dosing Pumps</FooterLink>
            <FooterLink href="/solutions/png-gas-pipeline">PNG Gas Pipelines</FooterLink>
            <FooterLink href="/solutions/urb-bearings">URB Bearings</FooterLink>
            <FooterLink href="/solutions/lynchpin-seating">Furniture &amp; Seating</FooterLink>
          </FooterCol>

          <FooterCol title="Resources">
            <FooterLink href="/services">Services</FooterLink>
            <FooterLink href="/products">Technical Catalogue</FooterLink>
            <FooterLink href="/solutions">Areas of Work</FooterLink>
            <FooterLink href="/compare">Compare Products</FooterLink>
          </FooterCol>

          <FooterCol title="Contact">
            <FooterLink href="/contact">Contact Aorexon Systems</FooterLink>
            <li className="text-sm text-white/60">Nithin Dholay</li>
            <li><a href="tel:9011023081" className="text-sm hover:text-white">+91 90110 23081</a></li>
            <li><a href="mailto:aorexonsystems@outlook.com" className="text-sm hover:text-white">aorexonsystems@outlook.com</a></li>
          </FooterCol>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row">
            <span className="text-xs text-white/45">
              © {new Date().getFullYear()} Aorexon Systems. All rights reserved.
            </span>
            <span className="mono-label text-white/35">
              SERVER_LOC: IN-WEST-1 // STATUS: OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mono-label mb-3 text-white/40">{title}</h3>
      <ul className="space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-white/65 hover:text-white">
        {children}
      </Link>
    </li>
  );
}
