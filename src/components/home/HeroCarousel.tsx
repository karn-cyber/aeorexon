"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export interface Slide {
  img: string;
  tag: string;
  title: string;
  href: string;
}

// Rotating full-bleed hero images (crossfade). Priority order is the slide order.
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  const active = slides[i];

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* Rotating background images */}
      {slides.map((s, idx) => (
        <div
          key={s.img + idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0"}`}
          aria-hidden={idx !== i}
        >
          <Image
            src={s.img}
            alt={s.title}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
      {/* Dark overlay + grid for legibility */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
      <div className="tech-grid-dark absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 lg:py-28">
        <p className="mono-label text-accent-light">SYSTEM_STATUS: OPERATIONAL // EST. 1994</p>
        <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
          Engineering the <span className="text-accent-light">infrastructure</span> of tomorrow.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-white/70">
          Gas-pipeline installation, high-precision fluid dosing &amp; automation, industrial
          bearings and architectural-grade seating — under one roof.
        </p>

        {/* Changing caption chip → links to the active vertical */}
        <Link
          href={active.href}
          className="group mt-7 inline-flex items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-3 backdrop-blur transition hover:border-accent-light/60"
        >
          <span className="mono-label rounded bg-accent px-2 py-1 text-white">{active.tag}</span>
          <span className="font-semibold">{active.title}</span>
          <Icon name="arrow-right" size={16} className="text-accent-light transition group-hover:translate-x-1" />
        </Link>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/solutions/png-gas-pipeline" className="mono-label inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 font-bold text-white transition hover:brightness-110">
            Pipeline Services <Icon name="arrow-right" size={15} />
          </Link>
          <Link href="/products" className="mono-label inline-flex items-center gap-2 rounded-md border border-white/25 px-6 py-3.5 font-bold text-white transition hover:bg-white/10">
            Explore Products
          </Link>
        </div>

        {/* Slide indicators */}
        <div className="mt-10 flex gap-2">
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Show ${s.title}`}
              className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-accent-light" : "w-3 bg-white/30 hover:bg-white/50"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
