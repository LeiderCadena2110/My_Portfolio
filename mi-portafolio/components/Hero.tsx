"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   2. HERO + CV
   Nombre, rol que se escribe solo, foto, frase de presentación,
   botón "Descargar CV" (obligatorio) y botón secundario "Ver proyectos".
   ============================================================================= */

/* Rol que se escribe y se borra letra por letra, con cursor de bloque */
function useTypewriter(words: string[]) {
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0, i = words[0].length, deleting = true, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[w];
      i += deleting ? -1 : 1;
      setText(word.slice(0, i));
      let delay = deleting ? 45 : 85;
      if (!deleting && i === word.length) { deleting = true; delay = 1800; }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 2200);
    return () => clearTimeout(t);
  }, [words]);
  return text;
}

export default function Hero() {
  const role = useTypewriter(profile.roles);
  const card = useRef<HTMLDivElement>(null);

  // Inclinación 3D suave de la tarjeta de la foto al mover el mouse
  const onMove = (e: React.PointerEvent) => {
    const el = card.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
  };
  const onLeave = () => { if (card.current) card.current.style.transform = ""; };

  const socials = [
    { icon: "github" as const, href: profile.github, label: "GitHub" },
    { icon: "linkedin" as const, href: profile.linkedin, label: "LinkedIn" },
    { icon: "mail" as const, href: `mailto:${profile.email}`, label: "Correo" },
  ];

  return (
    <section id="inicio" data-theme="light" className="relative overflow-hidden bg-pearl pt-28 pb-24 sm:pt-32 lg:pb-32">
      <div aria-hidden="true" className="bg-dots pointer-events-none absolute inset-0 text-pearl-300 [mask-image:radial-gradient(ellipse_at_70%_40%,#000_10%,transparent_65%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.15fr_.85fr]">
        <div className="min-w-0">
          <div className="enter flex items-center gap-2" style={{ ["--d" as string]: 0 }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target={s.icon === "mail" ? undefined : "_blank"} rel="noopener noreferrer" aria-label={s.label}
                className="grid size-8 place-items-center rounded-full text-stone transition hover:bg-sapphire-900 hover:text-pearl">
                <Icon name={s.icon} className="size-4" />
              </a>
            ))}
          </div>

          <p className="enter kicker mt-6 text-stone" style={{ ["--d" as string]: 1 }}>
            {profile.location} <span className="text-ember">·</span> {profile.semester}
          </p>

          <h1 className="enter mt-4 font-display text-[clamp(3rem,9vw,7.2rem)] leading-[.95] font-medium tracking-tight text-sapphire-900" style={{ ["--d" as string]: 2 }}>
            Hola, soy <em className="font-serif font-normal text-ember-600 italic">{profile.firstName}.</em>
          </h1>

          <p className="enter mt-5 min-h-[1.4em] text-[clamp(1.25rem,2.6vw,1.9rem)] font-light text-sapphire-800" style={{ ["--d" as string]: 3 }} aria-label={profile.roles.join(", ")}>
            <span aria-hidden="true">{role}<span className="caret" /></span>
          </p>

          <p className="enter mt-6 max-w-xl leading-relaxed text-stone" style={{ ["--d" as string]: 4 }}>
            {profile.greeting}
          </p>

          <ul className="enter mt-5 flex flex-wrap gap-2" style={{ ["--d" as string]: 4 }} aria-label="Lo que me gusta">
            {profile.interests.map((t, i) => (
              <li key={t} className="flex items-center gap-2 rounded-full bg-pearl-200 px-3.5 py-1.5 text-sm font-medium text-sapphire-800">
                <span aria-hidden="true">{["⚽", "🤝", "⚙️"][i] ?? "•"}</span> {t}
              </li>
            ))}
          </ul>

          <div className="enter mt-9 flex flex-wrap gap-3" style={{ ["--d" as string]: 5 }}>
            <a href={profile.cvUrl} download
              className="ripple inline-flex items-center gap-2 rounded-full bg-sapphire-900 px-6 py-3.5 text-sm font-semibold whitespace-nowrap text-pearl shadow-[0_14px_30px_-14px_rgba(11,29,71,.9)] transition hover:-translate-y-0.5 hover:bg-sapphire-800">
              <Icon name="download" className="size-4" /> Descargar CV
            </a>
            <a href="#proyectos"
              className="ripple arrow-link inline-flex items-center gap-2 rounded-full border border-sapphire-900/20 px-6 py-3.5 text-sm font-semibold whitespace-nowrap text-sapphire-900 transition hover:border-ember hover:text-ember-700">
              Ver proyectos <Icon name="external" className="size-4" />
            </a>
          </div>
        </div>

        {/* Tarjeta de la foto */}
        <div className="enter mx-auto w-full max-w-[400px] [perspective:1200px]" style={{ ["--d" as string]: 3 }} onPointerMove={onMove} onPointerLeave={onLeave}>
          <div ref={card} className="group relative transition-transform duration-300 ease-out [transform-style:preserve-3d]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-sapphire-900 shadow-[0_50px_80px_-40px_rgba(11,29,71,.9)]">
              {/* Símbolos de código de fondo */}
              <div aria-hidden="true" className="absolute inset-0 font-mono text-sapphire-700 select-none">
                <span className="absolute top-[12%] left-[8%] text-5xl">&lt;/&gt;</span>
                <span className="absolute top-[22%] right-[10%] text-4xl">{"{ }"}</span>
                <span className="absolute top-[48%] left-[6%] text-3xl">( )</span>
                <span className="absolute top-[40%] right-[8%] text-3xl">=&gt;</span>
              </div>
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,90,18,.35),transparent_65%)]" />
              <Image src="/images/leider-cutout.webp" alt={`Foto de ${profile.name}`} fill priority sizes="(max-width: 1024px) 90vw, 400px"
                className="object-contain object-bottom grayscale transition-[filter] duration-700 group-hover:grayscale-0" />

              {/* Etiqueta inferior */}
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-2xl border border-pearl/10 bg-sapphire-950/70 px-4 py-3 backdrop-blur-md">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-pearl">@{profile.githubUser}</p>
                  <p className="text-xs text-sapphire-300">Disponible para prácticas</p>
                </div>
                <span className="ping-soft size-2.5 shrink-0 rounded-full bg-online" aria-label="Disponible" />
              </div>
            </div>
            <span className="float-y absolute -top-4 -left-4 rounded-full bg-ember px-3.5 py-1.5 kicker font-bold text-sapphire-950 shadow-lg [transform:translateZ(60px)]">
              Backend
            </span>
          </div>
        </div>
      </div>

      <a href="#sobre-mi" aria-label="Bajar a Sobre mí" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-stone lg:flex">
        <span className="kicker">Scroll</span>
        <span className="h-10 w-px overflow-hidden bg-pearl-300"><span className="scroll-cue block h-1/2 w-px bg-ember" /></span>
      </a>
    </section>
  );
}
