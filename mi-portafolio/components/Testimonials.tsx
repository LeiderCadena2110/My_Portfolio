import { testimonials } from "@/data/testimonials";

/* =============================================================================
   5. TESTIMONIOS (mínimo 3)
   Nombre · cargo o relación · foto o avatar · texto · estrellas
   ============================================================================= */
export default function Testimonials() {
  return (
    <section id="testimonios" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <div className="reveal max-w-2xl">
          <p className="font-mono text-sm tracking-widest text-mint uppercase">03 — Testimonios</p>
          <h2 className="mt-2 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold text-snow">Lo que dicen <span className="text-gradient">de mí</span></h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => {
            const initials = t.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
            return (
              <figure
                key={i}
                style={{ ["--i" as string]: i }}
                className={`reveal lift flex flex-col rounded-3xl border bg-white/[.04] p-7 ${t.pending ? "border-dashed border-sun/40" : "border-white/10"}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sun" aria-label="5 estrellas">★★★★★</span>
                  {t.pending && <span className="rounded-full bg-sun/15 px-2.5 py-0.5 text-xs font-bold text-sun">Testimonio pendiente</span>}
                </div>
                <blockquote className={`mt-4 flex-1 text-lg leading-relaxed ${t.pending ? "text-haze italic" : "text-snow"}`}>“{t.text}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar} alt={t.name} width={48} height={48} className="size-12 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-brand to-mint font-display text-sm font-bold text-snow">{initials}</span>
                  )}
                  <div>
                    <p className="font-bold text-snow">{t.name}</p>
                    <p className="text-sm text-haze">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
