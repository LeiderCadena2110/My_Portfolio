"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   3. ACERCA DE MÍ
   - Frase grande que se ilumina palabra por palabra al hacer scroll.
   - Cinta de tecnologías.
   - Foto, párrafo corto, datos rápidos y habilidades principales.
   ============================================================================= */
const techs = ["Node.js", "NestJS", "Express", "Java", "Spring Boot", "PostgreSQL", "Docker", "TypeScript", "AWS", "Git"];
const skills = ["APIs REST", "Modelado de datos", "Arquitectura hexagonal", "Patrones de diseño", "Pruebas automáticas", "CI/CD con GitHub Actions"];
const facts = [
  { label: "Ubicación", value: "Pasto, Nariño" },
  { label: "Estudio", value: "Ing. de Software · 5.º sem." },
  { label: "Enfoque", value: "Backend y bases de datos" },
  { label: "Busco", value: "Prácticas y primer empleo" },
];

/* Convierte "texto **resaltado**" en palabras sueltas, marcando las resaltadas */
const words = profile.statement.split(/(\*\*[^*]+\*\*)/).flatMap((part) => {
  const strong = part.startsWith("**");
  return part.replace(/\*\*/g, "").split(" ").filter(Boolean).map((w) => ({ w, strong }));
});

export default function About() {
  const statement = useRef<HTMLParagraphElement>(null);

  // Ilumina las palabras según cuánto has bajado por la frase
  useEffect(() => {
    const el = statement.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll<HTMLSpanElement>(".word"));
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const lit = Math.round(progress * spans.length);
      spans.forEach((s, i) => s.classList.toggle("on", i < lit));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section id="sobre-mi" data-theme="dark" className="relative -mt-8 overflow-hidden rounded-t-[36px] bg-sapphire-900 text-pearl">
      {/* Frase grande */}
      <div className="mx-auto max-w-5xl px-5 pt-28 pb-16 text-center sm:pt-36">
        <p className="kicker text-sapphire-300">Sobre mí</p>
        <p ref={statement} className="mt-8 font-display text-[clamp(1.7rem,4.2vw,3.4rem)] leading-[1.18] font-light tracking-tight">
          {words.map(({ w, strong }, i) => (
            <span key={i} className={`word ${strong ? "font-semibold text-pearl" : "text-sapphire-200"}`}>{w} </span>
          ))}
        </p>
      </div>

      {/* Cinta de tecnologías */}
      <div className="border-y border-sapphire-800 py-5" aria-label="Tecnologías que uso">
        <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
          <ul className="marquee flex shrink-0 gap-10 pr-10 kicker whitespace-nowrap text-sapphire-300">
            {[...techs, ...techs].map((t, i) => (
              <li key={i} aria-hidden={i >= techs.length} className="flex items-center gap-10">{t} <span className="text-ember">✦</span></li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foto + presentación */}
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
        <div className="reveal relative mx-auto w-full max-w-[460px]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px]">
            <Image src="/images/leider-about.webp" alt={`${profile.firstName} programando en su portátil`} fill sizes="(max-width: 1024px) 90vw, 460px"
              className="object-cover transition-transform duration-700 hover:scale-[1.04]" />
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-sapphire-950/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 left-5 kicker text-pearl">Pasto · {new Date().getFullYear()}</p>
          </div>
          <div className="absolute -right-3 -bottom-6 rounded-2xl bg-ember px-5 py-4 text-sapphire-950 shadow-xl sm:-right-8">
            <p className="font-display text-3xl font-bold leading-none">3+1</p>
            <p className="mt-1 text-xs font-semibold">apps terminadas<br />y un videojuego</p>
          </div>
        </div>

        <div className="min-w-0">
          <p className="reveal kicker text-ember">Resumen</p>
          <h2 className="reveal mt-3 font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.05] font-medium tracking-tight">
            Encantado de conocerte, <em className="font-serif font-normal text-ember italic">soy {profile.firstName}</em>
          </h2>
          {profile.about.map((p) => (
            <p key={p.slice(0, 20)} className="reveal mt-5 leading-relaxed text-sapphire-200">{p}</p>
          ))}
          <p className="reveal mt-5 border-l-2 border-ember pl-4 font-serif text-xl text-pearl italic">“{profile.motto}”</p>

          <dl className="reveal mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-sapphire-800">
            {facts.map((f) => (
              <div key={f.label} className="bg-sapphire-900 p-4">
                <dt className="kicker text-sapphire-300">{f.label}</dt>
                <dd className="mt-1.5 text-sm font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>

          <ul className="reveal mt-8 flex flex-wrap gap-2" aria-label="Habilidades principales">
            {skills.map((s) => (
              <li key={s} className="rounded-full border border-sapphire-700 px-3.5 py-1.5 text-sm text-sapphire-200 transition hover:border-ember hover:text-pearl">{s}</li>
            ))}
          </ul>

          <a href={profile.cvUrl} download className="reveal arrow-link mt-10 inline-flex items-center gap-2 border-b border-ember pb-1 text-sm font-semibold text-pearl">
            Descargar mi hoja de vida <Icon name="download" className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
