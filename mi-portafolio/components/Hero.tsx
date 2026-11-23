"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   2. BIENVENIDA / HERO CON CV
   Nombre grande · rol · foto · frase corta · botón «Descargar CV» (obligatorio)
   · botón secundario «Ver proyectos». Foto con órbita 3D de tecnologías.
   ============================================================================= */
const orbitChips = ["NestJS", "PostgreSQL", "Docker", "Spring", "Node", "AWS", "Python", "Git"];

export default function Hero() {
  const [role, setRole] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);

  // Palabra que cambia cada 2,6 s
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let current = 0;
    const id = setInterval(() => {
      setLeaving(current);
      current = (current + 1) % profile.roles.length;
      setRole(current);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  // Inclina la foto con el mouse (efecto 3D)
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !stage.current) return;
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    stage.current.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 10}deg)`;
  };

  return (
    <section
      id="inicio"
      onPointerMove={onMove}
      onPointerLeave={() => stage.current && (stage.current.style.transform = "")}
      className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-24 lg:pt-20
        bg-[radial-gradient(ellipse_60%_70%_at_50%_55%,rgba(37,99,235,.55),transparent_70%),radial-gradient(ellipse_40%_40%_at_15%_90%,rgba(16,185,129,.25),transparent_70%),radial-gradient(ellipse_30%_30%_at_90%_15%,rgba(245,158,11,.16),transparent_70%),linear-gradient(180deg,#172554,#1e3a8a)]"
    >
      <div className="bg-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 text-center lg:grid-cols-[1fr_1.05fr_1.1fr] lg:text-left">
        {/* Izquierda: nombre */}
        <div>
          <p className="enter mb-2 font-mono text-sm text-brand-light" style={{ ["--d" as string]: 0 }}>Hola, soy</p>
          <h1 className="enter font-display text-[clamp(2rem,4.6vw,3.1rem)] leading-[1.08] font-extrabold tracking-tight text-snow" style={{ ["--d" as string]: 1 }}>
            Leider Alexander <span className="text-gradient">Cadena Cabrera</span>
          </h1>
        </div>

        {/* Centro: foto con órbita 3D */}
        <div className="enter mx-auto w-[min(270px,66vw)] [perspective:1200px] lg:w-[min(27vw,350px)]" style={{ ["--d" as string]: 2 }}>
          <div ref={stage} className="stage relative aspect-[520/604]">
            <div className="absolute top-[-4%] left-1/2 aspect-square w-[115%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,.9)_0%,rgba(30,58,138,.2)_55%,transparent_70%)]" aria-hidden="true" />
            <div className="absolute top-[-8%] left-1/2 aspect-square w-[120%] -translate-x-1/2 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-brand-light/35" aria-hidden="true" />
            <ul className="orbit" aria-hidden="true">
              {orbitChips.map((c, i) => (
                <li
                  key={c}
                  style={{ ["--a" as string]: `${(360 / orbitChips.length) * i}deg` }}
                  className={`rounded-full border border-white/60 px-3 py-1.5 font-mono text-[11px] font-medium text-ink shadow-lg max-lg:[--r:160px] lg:[--r:205px] ${i % 3 === 0 ? "bg-emerald-100" : i % 4 === 0 ? "bg-amber-100" : "bg-brand-soft"}`}
                >
                  {c}
                </li>
              ))}
            </ul>
            {/* ✏️ Tu foto: public/images/leider-cutout.webp (fondo transparente) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/leider-cutout.webp"
              alt={`Foto de ${profile.name}`}
              width={520}
              height={604}
              fetchPriority="high"
              className="photo-fade relative size-full object-contain object-bottom drop-shadow-[0_30px_30px_rgba(23,37,84,.55)] [transform:translateZ(40px)]"
            />
          </div>
        </div>

        {/* Derecha: rol, frase y botones */}
        <div className="lg:text-right">
          <p className="enter mb-2 font-mono text-sm text-brand-light" style={{ ["--d" as string]: 2 }}>
            {profile.role} · {profile.semester}
          </p>
          <p className="enter mb-4 font-display text-[clamp(1.4rem,2.5vw,2.1rem)] font-extrabold text-sun" style={{ ["--d" as string]: 3 }} aria-live="polite">
            <span className="roles">
              {profile.roles.map((r, i) => (
                <span key={r} className={i === role ? "on" : i === leaving ? "off" : ""}>{r}</span>
              ))}
            </span>
          </p>
          <p className="enter mx-auto mb-7 max-w-md text-haze lg:mr-0" style={{ ["--d" as string]: 4 }}>{profile.tagline}</p>

          <div className="enter flex flex-col justify-center gap-3 sm:flex-row lg:justify-end" style={{ ["--d" as string]: 5 }}>
            {/* Botón obligatorio: descarga public/cv.pdf */}
            <a href={profile.cvUrl} download className="ripple group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand px-5 py-3.5 font-bold text-snow shadow-[0_10px_30px_-10px_rgba(37,99,235,.9)] transition hover:-translate-y-1 hover:bg-brand-dark">
              Descargar CV <Icon name="download" className="size-[18px] transition group-hover:translate-y-0.5" />
            </a>
            <a href="#proyectos" className="ripple group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-5 py-3.5 font-bold text-snow transition hover:-translate-y-1 hover:border-mint hover:bg-mint/15">
              Ver proyectos <Icon name="arrow" className="size-[18px] transition group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Redes + indicador de scroll */}
      <ul className="enter absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2.5 lg:left-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] lg:translate-x-0" style={{ ["--d" as string]: 6 }} aria-label="Redes">
        {[
          { href: profile.github, icon: "github" as const, label: "GitHub" },
          { href: profile.linkedin, icon: "linkedin" as const, label: "LinkedIn" },
          { href: `mailto:${profile.email}`, icon: "mail" as const, label: "Correo" },
        ].map((s) => (
          <li key={s.label}>
            <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={s.label}
              className="grid size-[42px] place-items-center rounded-full border border-white/15 bg-white/5 text-haze transition hover:-translate-y-1 hover:border-brand-light hover:bg-brand/35 hover:text-snow">
              <Icon name={s.icon} className="size-[18px]" />
            </a>
          </li>
        ))}
      </ul>
      <a href="#sobre-mi" aria-label="Bajar a Sobre mí" className="absolute right-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] bottom-6 hidden items-center gap-3 font-mono text-xs tracking-[.15em] text-haze uppercase lg:flex">
        Scroll <span className="relative h-12 w-px overflow-hidden bg-white/20"><span className="drip absolute inset-0 bg-mint" /></span>
      </a>
    </section>
  );
}
