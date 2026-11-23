import { profile } from "@/data/profile";

/* =============================================================================
   3. ACERCA DE MÍ
   Párrafo de presentación (3–5 líneas) · foto · habilidades · datos rápidos
   ============================================================================= */
const facts = [
  { icon: "📍", label: "Pasto, Colombia" },
  { icon: "🎓", label: profile.semester },
  { icon: "🧩", label: "Backend y arquitectura" },
  { icon: "💼", label: "Estudio y trabajo" },
];

const skills = ["Node.js", "NestJS", "Java · Spring Boot", "Python", "PostgreSQL", "Docker", "Git", "TypeScript", "HTML", "Tailwind CSS"];

const focus = [
  {
    num: "01",
    title: "Backend & Datos",
    text: "Diseño APIs REST claras y modelo bases de datos relacionales sólidas, con capas bien separadas y principios SOLID.",
  },
  {
    num: "02",
    title: "Arquitectura & Cloud",
    text: "Pienso la solución antes de programar y la despliego en la nube: alta disponibilidad, contenedores y servicios gestionados.",
  },
];

export default function About() {
  return (
    <section id="sobre-mi" className="bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[.8fr_1.6fr] lg:gap-16">
        {/* Foto + datos rápidos */}
        <div className="reveal lg:sticky lg:top-28 lg:self-start">
          <p className="font-mono text-sm tracking-widest text-mint uppercase">01 — Sobre mí</p>
          <div className="mx-auto mt-6 max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/30 to-mint/15 p-4 lg:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/leider-about.webp" alt={`Retrato de ${profile.name}`} width={600} height={700} loading="lazy" className="aspect-[6/7] w-full rounded-2xl object-cover" />
            <p className="mt-4 font-display text-sm font-bold text-snow">{profile.name}</p>
            <p className="text-sm text-haze">{profile.role}</p>
          </div>
          <ul className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-2 text-sm lg:max-w-none" aria-label="Datos rápidos">
            {facts.map((f) => (
              <li key={f.label} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-snow">
                <span aria-hidden="true">{f.icon}</span> {f.label}
              </li>
            ))}
          </ul>
        </div>

        <div>
          {/* ✏️ Presentación en primera persona: 3–5 líneas, que se lea en 20 segundos */}
          <h2 className="reveal font-display text-[clamp(1.7rem,3.4vw,2.6rem)] leading-tight font-bold text-snow">
            Construyo el <span className="text-gradient">motor</span> que hace funcionar las aplicaciones.
          </h2>
          <p className="reveal mt-6 text-lg leading-relaxed text-haze">
            Soy estudiante de quinto semestre de Ingeniería de Software en la Universidad Cooperativa de Colombia, en Pasto,
            y trabajo mientras estudio, lo que me enseñó a organizarme y a entender a los usuarios. Me apasionan el{" "}
            <strong className="text-snow">backend</strong>, la <strong className="text-snow">arquitectura de software</strong> y las{" "}
            <strong className="text-snow">bases de datos</strong>: me gusta resolver problemas con código limpio y soluciones robustas.
          </p>

          {/* Lo que hago */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {focus.map((f, i) => (
              <article key={f.title} className="reveal lift rounded-2xl border border-dashed border-white/15 bg-brand/10 p-6" style={{ ["--i" as string]: i }}>
                <span className="font-mono text-sm text-mint">{f.num}</span>
                <h3 className="mt-2 font-display text-lg font-bold text-snow uppercase">{f.title}</h3>
                <p className="mt-2 text-haze">{f.text}</p>
              </article>
            ))}
          </div>

          {/* Habilidades / tecnologías */}
          <h3 className="reveal mt-10 font-mono text-xs tracking-widest text-brand-light uppercase">Tecnologías que manejo</h3>
          <ul className="reveal mt-4 flex flex-wrap gap-2">
            {skills.map((s) => (
              <li key={s} className="rounded-full border border-mint/30 bg-mint/10 px-3.5 py-1.5 text-sm text-snow">{s}</li>
            ))}
          </ul>

          {/* Números */}
          <dl className="mt-10 grid grid-cols-3 gap-3">
            {[
              ["5.º", "semestre"],
              ["3", "apps con demo"],
              ["15+", "tecnologías"],
            ].map(([n, l], i) => (
              <div key={l} className="reveal rounded-2xl border border-white/10 bg-brand/10 p-4" style={{ ["--i" as string]: i }}>
                <dt className="font-display text-2xl font-extrabold text-sun sm:text-3xl">{n}</dt>
                <dd className="mt-1 text-sm text-haze">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
