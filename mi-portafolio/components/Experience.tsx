"use client";

import { useRef, useState } from "react";
import { experience } from "@/data/experience";
import Icon from "./Icons";

/* =============================================================================
   6. EXPERIENCIA ACADÉMICA Y LABORAL
   Pestañas para cambiar entre académica y laboral, y tarjetas que se deslizan
   de lado (de lo más reciente a lo más antiguo).
   ============================================================================= */
const tabs = [
  { id: "academica", label: "Académica" },
  { id: "laboral", label: "Laboral" },
] as const;

export default function Experience() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("academica");
  const track = useRef<HTMLOListElement>(null);
  const items = experience.filter((e) => e.type === tab);

  const scroll = (dir: number) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const change = (id: typeof tab) => { setTab(id); track.current?.scrollTo({ left: 0 }); };

  return (
    <section id="experiencia" data-theme="dark" className="relative overflow-hidden bg-sapphire-950 py-24 text-pearl sm:py-32">
      <p aria-hidden="true" className="text-ghost pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[19vw] leading-none font-bold whitespace-nowrap uppercase">
        Experiencia
      </p>

      <div className="relative mx-auto max-w-7xl px-5">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal kicker text-sapphire-300">Trayectoria</p>
            <h2 className="reveal mt-3 font-display text-[clamp(2.2rem,6vw,4.6rem)] leading-none font-semibold tracking-tight uppercase">Experiencia</h2>
            <p className="reveal mt-4 text-sapphire-300">Académica y laboral, de lo más reciente a lo más antiguo.</p>
          </div>

          <div className="reveal flex items-center gap-3">
            <div role="tablist" aria-label="Tipo de experiencia" className="flex rounded-full bg-sapphire-900 p-1">
              {tabs.map((t) => (
                <button key={t.id} role="tab" aria-selected={tab === t.id} aria-controls="experience-list" onClick={() => change(t.id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${tab === t.id ? "bg-pearl text-sapphire-900" : "text-sapphire-300 hover:text-pearl"}`}>
                  {t.id === "academica" ? "🎓" : "💼"} {t.label}
                </button>
              ))}
            </div>
            <div className="hidden gap-2 sm:flex">
              <button onClick={() => scroll(-1)} aria-label="Anterior" className="grid size-10 place-items-center rounded-full border border-sapphire-700 transition hover:border-ember hover:bg-ember hover:text-sapphire-950">
                <Icon name="arrow" className="size-4 rotate-180" />
              </button>
              <button onClick={() => scroll(1)} aria-label="Siguiente" className="grid size-10 place-items-center rounded-full border border-sapphire-700 transition hover:border-ember hover:bg-ember hover:text-sapphire-950">
                <Icon name="arrow" className="size-4" />
              </button>
            </div>
          </div>
        </header>

        <ol id="experience-list" ref={track} role="tabpanel" key={tab}
          className="panel-in mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:thin] [scrollbar-color:var(--color-sapphire-700)_transparent]">
          {items.map((e, i) => (
            <li key={e.title} className="grid w-[min(88vw,760px)] shrink-0 snap-start overflow-hidden rounded-[24px] bg-pearl text-sapphire-900 sm:grid-cols-[1fr_190px]">
              <div className="p-7 sm:p-9">
                <p className="kicker text-ember-700">{e.date}</p>
                <h3 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.2rem)] leading-[1.05] font-bold tracking-tight uppercase">{e.title}</h3>
                <p className="mt-2 kicker text-stone">{e.place}</p>
                <p className="mt-5 leading-relaxed text-stone">{e.description}</p>
                {e.stack && (
                  <p className="mt-4 text-sm text-sapphire-800">
                    <b>Stack utilizado:</b> {e.stack.join(", ")}.
                  </p>
                )}
                <p className="mt-6 kicker text-stone">Lo más importante</p>
                <ul className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  {e.highlights.map((h, k) => (
                    <li key={h} className="flex gap-2.5"><span className="font-mono text-xs text-ember-700">{String(k + 1).padStart(2, "0")}</span>{h}</li>
                  ))}
                </ul>
              </div>
              <div className="relative flex items-end justify-between bg-sapphire-800 p-6 text-pearl sm:flex-col sm:items-start">
                <span aria-hidden="true" className="bg-dots absolute inset-0 text-sapphire-700 opacity-60" />
                <span className="relative font-display text-6xl font-bold text-ember">{String(i + 1).padStart(2, "0")}</span>
                <span className="relative kicker text-sapphire-200">{e.type === "academica" ? "Académica" : "Laboral"}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
