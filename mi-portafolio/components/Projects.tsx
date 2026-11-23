"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import type { Project, ProjectMock, Theme } from "@/data/types";
import Icon from "./Icons";

/* =============================================================================
   4. MIS PROYECTOS
   Tarjeta por proyecto: imagen, título, descripción, tecnologías,
   link a GitHub y link a Demo (target="_blank").
   En escritorio la galería avanza en horizontal con el scroll;
   en celular es un carrusel que se desliza con el dedo.
   ============================================================================= */
const themes: Record<Theme, string> = {
  blue: "from-brand-dark to-brand-light",
  green: "from-mint-dark to-emerald-400",
  amber: "from-sun-dark to-amber-400",
  slate: "from-ink to-slate-500",
};

/* Ilustraciones ligeras hechas con HTML (cuando no hay captura real) */
function Mock({ type }: { type: ProjectMock }) {
  switch (type) {
    case "phone":
      return (
        <div className="grid h-[150px] w-[88px] content-start gap-2 rounded-2xl bg-ice p-3 shadow-xl">
          <span className="text-center text-2xl">🌽</span>
          <i className="h-3.5 rounded bg-emerald-200" /><i className="h-3.5 w-2/3 rounded bg-emerald-200" /><i className="h-3.5 rounded bg-emerald-200" />
        </div>
      );
    case "watch":
      return (
        <div className="grid size-28 place-content-center rounded-[32px] border-[6px] border-brand-soft bg-navy text-center shadow-xl">
          <span className="text-3xl">💧</span><b className="font-display text-brand-light">1.8 L</b>
        </div>
      );
    case "infra":
      return (
        <div className="grid grid-cols-2 gap-2.5 font-mono text-xs font-bold">
          <i className="col-span-2 rounded-lg bg-ice p-2 text-center text-sun-dark not-italic">ALB</i>
          {["EC2", "EC2", "RDS"].map((t, i) => <i key={i} className="w-[72px] rounded-lg bg-navy p-2 text-center text-brand-soft not-italic">{t}</i>)}
        </div>
      );
    case "desktop":
      return (
        <div className="grid h-[64%] w-[76%] grid-cols-[1fr_2fr] gap-2 rounded-xl bg-ice p-3 shadow-xl">
          <i className="row-span-3 rounded bg-brand" /><i className="rounded bg-slate-300" /><i className="rounded bg-slate-300" /><i className="rounded bg-slate-300" />
        </div>
      );
    case "api":
      return (
        <div className="grid gap-2 font-mono text-xs">
          <code className="rounded-lg bg-navy px-3 py-2 text-brand-soft">@Post(&apos;emergencias&apos;)</code>
          <code className="rounded-lg bg-navy px-3 py-2 text-emerald-300">201 Created</code>
        </div>
      );
    default:
      return (
        <div className="w-[76%] rounded-xl bg-navy p-3 shadow-xl">
          <div className="mb-2 flex gap-1"><i className="size-2 rounded-full bg-red-400" /><i className="size-2 rounded-full bg-sun" /><i className="size-2 rounded-full bg-mint" /></div>
          <div className="grid gap-1.5"><i className="h-3 w-2/3 rounded bg-brand-light/70" /><i className="h-8 rounded bg-white/10" /><i className="h-3 w-1/2 rounded bg-white/10" /></div>
        </div>
      );
  }
}

function ProjectLink({ href, label, icon }: { href: string; label: string; icon: "github" | "external" }) {
  if (href.startsWith("/demos/"))
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="ripple inline-flex items-center gap-1.5 rounded-full bg-mint px-4 py-1.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:bg-emerald-300">
        ▶ {label}
      </a>
    );
  if (!href)
    return <span className="inline-flex items-center gap-1.5 text-sm font-bold text-haze/70" title="Enlace pendiente">{label} · pronto</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-bold text-sun transition hover:text-snow">
      <Icon name={icon} className="size-4" /> {label}
    </a>
  );
}

function Card({ p, i }: { p: Project; i: number }) {
  return (
    <article className="lift group grid shrink-0 basis-[86vw] snap-center items-center gap-6 rounded-[26px] border border-white/10 bg-ink/60 p-5 backdrop-blur sm:basis-[min(820px,82vw)] sm:p-8 md:grid-cols-[1fr_1.15fr]">
      <div className="order-2 md:order-1">
        <span className="font-display text-5xl font-extrabold text-transparent [-webkit-text-stroke:1.5px_#60a5fa]">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="mt-3 font-display text-xl font-bold text-snow sm:text-2xl">{p.title}</h3>
        <p className="mt-1 font-mono text-xs text-mint">{p.category}</p>
        <p className="mt-4 text-[15px] text-haze">{p.description}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {p.tags.map((t) => <li key={t} className="rounded-full bg-brand/20 px-2.5 py-1 font-mono text-[11px] text-brand-soft">{t}</li>)}
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-5">
          <ProjectLink href={p.github} label="GitHub" icon="github" />
          <ProjectLink href={p.demo} label="Ver demo" icon="external" />
          {p.extra?.map((x) => <ProjectLink key={x.href} href={x.href} label={x.label} icon="external" />)}
        </div>
      </div>
      <div className={`shot relative order-1 grid aspect-[16/11] place-items-center overflow-hidden rounded-2xl bg-gradient-to-br [perspective:800px] md:order-2 ${themes[p.theme]}`}>
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={`Captura de ${p.title}`} loading="lazy" className="size-full object-cover" />
        ) : (
          <Mock type={p.mock} />
        )}
      </div>
    </article>
  );
}

export default function Projects() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(1);
  const [progress, setProgress] = useState(0);
  const total = projects.length;

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const s = section.current, t = track.current;
      if (!s || !t) return;
      if (window.innerWidth < 1024) { t.style.transform = ""; return; }
      const rect = s.getBoundingClientRect();
      const p = Math.min(Math.max(-rect.top / (s.offsetHeight - window.innerHeight), 0), 1);
      t.style.transform = `translate3d(${-p * (t.scrollWidth - window.innerWidth)}px,0,0)`;
      setProgress(p);
      setCurrent(Math.min(total, Math.floor(p * total) + 1));
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", update); };
  }, [total]);

  // En celular el contador sigue al carrusel táctil
  const onTrackScroll = () => {
    const t = track.current;
    if (!t || window.innerWidth >= 1024) return;
    const p = t.scrollLeft / (t.scrollWidth - t.clientWidth || 1);
    setProgress(p);
    setCurrent(Math.min(total, Math.round(p * (total - 1)) + 1));
  };

  return (
    <section
      id="proyectos"
      ref={section}
      style={{ ["--count" as string]: total }}
      className="relative bg-gradient-to-b from-navy to-navy2 py-24 lg:h-[calc(var(--count)*70vh)] lg:py-0"
    >
      <div className="flex flex-col justify-center gap-8 overflow-hidden lg:sticky lg:top-0 lg:h-svh">
        <div className="mx-auto flex w-full max-w-6xl items-end justify-between px-5">
          <div>
            <p className="font-mono text-sm tracking-widest text-mint uppercase">02 — Proyectos</p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,4.5vw,3.4rem)] font-bold text-snow">Mis <span className="text-gradient">proyectos</span></h2>
          </div>
          <p className="font-display font-bold text-haze" aria-hidden="true">
            <span className="text-2xl text-sun">{String(current).padStart(2, "0")}</span> / {String(total).padStart(2, "0")}
          </p>
        </div>

        <div
          ref={track}
          onScroll={onTrackScroll}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-2 [scrollbar-width:none] lg:snap-none lg:overflow-visible lg:px-[max(1.25rem,calc((100vw-72rem)/2+1.25rem))] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((p, i) => <Card key={p.title} p={p} i={i} />)}
        </div>

        <div className="mx-auto h-[3px] w-[calc(100%-2.5rem)] max-w-6xl overflow-hidden rounded bg-white/15" aria-hidden="true">
          <span className="block h-full bg-gradient-to-r from-brand-light to-mint" style={{ width: `${Math.max(progress, 1 / total) * 100}%` }} />
        </div>
      </div>
    </section>
  );
}
