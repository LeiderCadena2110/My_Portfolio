import { experience } from "@/data/experience";
import type { ExperienceItem } from "@/data/types";

/* =============================================================================
   6. EXPERIENCIA ACADÉMICA Y LABORAL
   Dos líneas de tiempo: 🎓 académica y 💼 laboral, de lo más reciente a lo más antiguo.
   ============================================================================= */
function Timeline({ title, icon, items, color }: { title: string; icon: string; items: ExperienceItem[]; color: string }) {
  return (
    <div className="reveal">
      <h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
        <span aria-hidden="true">{icon}</span> {title}
      </h3>
      <ol className="relative mt-6 border-l-2 border-brand/20 pl-7">
        {items.map((it, i) => (
          <li key={it.title} className="reveal relative mb-6 last:mb-0" style={{ ["--i" as string]: i }}>
            <span className={`absolute top-6 -left-[37px] size-[18px] rounded-full border-4 bg-ice ${color}`} aria-hidden="true" />
            <div className="lift rounded-2xl border border-brand/15 bg-ice/90 p-5">
              <span className="font-mono text-xs text-dim">{it.date}</span>
              <h4 className="mt-1 font-display text-base font-bold text-ink">{it.title}</h4>
              <p className="text-sm font-medium text-brand-dark">{it.place}</p>
              <p className="mt-2 text-sm text-dim">{it.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function Experience() {
  return (
    // Sección clara (azul hielo) para equilibrar y no abusar del oscuro
    <section id="experiencia" className="bg-gradient-to-b from-ice to-brand-soft py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm tracking-widest text-mint-dark uppercase">04 — Experiencia</p>
          <h2 className="mt-2 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold text-ink">Mi trayectoria <span className="text-gradient-dark">académica y laboral</span></h2>
        </div>
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <Timeline title="Académica" icon="🎓" color="border-brand" items={experience.filter((e) => e.type === "academica")} />
          <Timeline title="Laboral" icon="💼" color="border-sun" items={experience.filter((e) => e.type === "laboral")} />
        </div>
      </div>
    </section>
  );
}
