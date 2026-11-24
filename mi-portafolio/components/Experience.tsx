"use client";

import Image from "next/image";
import { useRef } from "react";
import { experience } from "@/data/experience";
import Icon from "./Icons";

/* =============================================================================
   6. EXPERIENCIA ACADÉMICA Y LABORAL
   Una sola fila de tarjetas que se desliza de lado. Cada tarjeta indica si es
   académica 🎓 o laboral 💼. Orden: de lo más reciente a lo más antiguo.
   ============================================================================= */
export default function Experience() {
  const track = useRef<HTMLOListElement>(null);
  // Primero la laboral y luego la académica, cada una de lo más reciente a lo más antiguo
  const items = [...experience.filter((e) => e.type === "laboral"), ...experience.filter((e) => e.type === "academica")];

  const scroll = (dir: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section id="experiencia" data-theme="dark" className="relative overflow-hidden bg-sapphire-950 py-24 text-pearl sm:py-32">
      <p aria-hidden="true" className="text-ghost pointer-events-none absolute top-[44%] left-0 font-display text-[19vw] leading-none font-bold whitespace-nowrap uppercase">
        Experiencia · Experiencia
      </p>

      <div className="relative mx-auto max-w-7xl px-5">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-sapphire-800 pb-6">
          <div>
            <p className="reveal kicker text-sapphire-300">Trayectoria</p>
            <h2 className="reveal mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-semibold tracking-tight uppercase">Experiencia</h2>
          </div>
          <div className="reveal flex items-center gap-4">
            <p className="hidden max-w-[260px] text-right text-sm text-sapphire-300 md:block">Lo que he estudiado y en lo que he trabajado, con fechas.</p>
            <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-10 place-items-center rounded-full border border-sapphire-700 transition hover:border-ember hover:bg-ember hover:text-sapphire-950">
              <Icon name="arrow" className="size-4 rotate-180" />
            </button>
            <button onClick={() => scroll(1)} aria-label="Siguiente" className="grid size-10 place-items-center rounded-full border border-sapphire-700 transition hover:border-ember hover:bg-ember hover:text-sapphire-950">
              <Icon name="arrow" className="size-4" />
            </button>
          </div>
        </header>

        <ol ref={track} className="reveal mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-color:var(--color-sapphire-700)_transparent] [scrollbar-width:thin]">
          {items.map((e, i) => (
            <li key={e.title} className="grid w-[min(90vw,880px)] shrink-0 snap-start overflow-hidden rounded-2xl bg-pearl text-sapphire-900 md:grid-cols-[280px_1fr]">
              {/* Panel izquierdo: imagen o número */}
              <div className="relative min-h-[200px] overflow-hidden bg-sapphire-800">
                {e.image ? (
                  <Image src={e.image} alt="" fill sizes="280px" className="object-cover object-left-top opacity-80 grayscale transition duration-700 hover:opacity-100 hover:grayscale-0" />
                ) : (
                  <span aria-hidden="true" className="bg-dots absolute inset-0 text-sapphire-700 opacity-70" />
                )}
                <span className="absolute top-4 right-4 rounded-md bg-sapphire-950/80 px-2 py-1 font-mono text-xs text-pearl">{String(i + 1).padStart(2, "0")}</span>
                <span className="absolute bottom-4 left-4 rounded-full bg-sapphire-950/80 px-3 py-1 kicker text-pearl">
                  {e.type === "academica" ? "🎓 Académica" : "💼 Laboral"}
                </span>
                {!e.image && <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-display text-8xl font-bold text-ember">{String(i + 1).padStart(2, "0")}</span>}
              </div>

              <div className="p-7 sm:p-9">
                <p className="kicker text-stone">{e.place}</p>
                <h3 className="mt-3 font-display text-[clamp(1.6rem,3.2vw,2.5rem)] leading-[1] font-bold tracking-tight uppercase">{e.title}</h3>
                <p className="mt-3 kicker text-ember-700">{e.date}</p>
                <p className="mt-5 leading-relaxed text-stone">{e.description}</p>
                {e.stack && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {e.stack.map((t) => <li key={t} className="rounded-full bg-pearl-200 px-2.5 py-1 font-mono text-[11px]">{t}</li>)}
                  </ul>
                )}
                <p className="mt-6 kicker text-stone">Destacado</p>
                <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ember" />{h}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
