import Image from "next/image";
import { testimonials } from "@/data/testimonials";

/* =============================================================================
   5. TESTIMONIOS (mínimo 3): nombre, cargo, foto y texto.
   Los que aún no son reales se muestran como "Testimonio pendiente".
   ============================================================================= */
export default function Testimonials() {
  return (
    <section id="testimonios" data-theme="light" className="relative overflow-hidden bg-pearl-200 py-24 sm:py-32">
      <p aria-hidden="true" className="text-ghost pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-display text-[22vw] leading-none font-bold whitespace-nowrap text-sapphire-900 uppercase">
        Opiniones
      </p>

      <div className="relative mx-auto max-w-7xl px-5">
        <header className="max-w-2xl">
          <p className="reveal kicker text-ember-700">Testimonios</p>
          <h2 className="reveal mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-semibold tracking-tight text-sapphire-900">
            Lo que dicen de <em className="font-serif font-normal text-ember-600 italic">mi trabajo</em>
          </h2>
          <p className="reveal mt-4 text-stone">Personas con las que he estudiado y trabajado.</p>
        </header>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <li key={t.name} className="reveal" style={{ ["--i" as string]: i }}>
              <figure className={`flex h-full flex-col rounded-[24px] p-7 transition-transform duration-500 hover:-translate-y-1.5 ${
                i === 1 ? "bg-sapphire-900 text-pearl" : "bg-pearl-100 text-sapphire-900 ring-1 ring-pearl-300"
              }`}>
                <span aria-hidden="true" className="font-serif text-6xl leading-none text-ember">“</span>
                <blockquote className={`mt-2 flex-1 text-[1.05rem] leading-relaxed ${t.pending ? "italic opacity-70" : ""}`}>
                  {t.text}
                </blockquote>
                {t.pending && (
                  <p className={`mt-4 w-fit rounded-full px-3 py-1 kicker ${i === 1 ? "bg-sapphire-800 text-sapphire-200" : "bg-ember-100 text-ember-700"}`}>
                    Testimonio pendiente
                  </p>
                )}
                <figcaption className={`mt-6 flex items-center gap-3 border-t pt-5 ${i === 1 ? "border-sapphire-800" : "border-pearl-300"}`}>
                  {t.avatar ? (
                    <Image src={t.avatar} alt={`Foto de ${t.name}`} width={44} height={44} className="size-11 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden="true" className={`grid size-11 place-items-center rounded-full font-mono text-sm font-bold ${i === 1 ? "bg-ember text-sapphire-950" : "bg-sapphire-900 text-pearl"}`}>
                      {t.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                  )}
                  <span className="min-w-0">
                    <b className="block truncate">{t.name}</b>
                    <span className={`text-sm ${i === 1 ? "text-sapphire-300" : "text-stone"}`}>{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
