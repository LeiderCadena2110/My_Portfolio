"use client";

import { useEffect, useState } from "react";
import { navLinks, profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   1. MENÚ DE NAVEGACIÓN
   - Barra fija arriba: logo, enlaces a cada sección (escritorio) y botón "Menú".
   - "Menú" abre un panel de pantalla completa con enlaces grandes (en el celular
     es el menú hamburguesa).
   - Resalta la sección activa, se esconde al bajar y vuelve al subir.
   ============================================================================= */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 600 && y > last + 4); // se esconde al bajar…
      if (y < last - 4) setHidden(false); // …y vuelve al subir
      last = y;
      // ¿la barra está encima de una sección oscura? (para cambiar sus colores)
      const under = document.elementsFromPoint(window.innerWidth / 2, 40).find((el) => el.closest("[data-theme]"));
      setOnDark(under?.closest("[data-theme]")?.getAttribute("data-theme") === "dark");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // Sección activa: la que ocupa el centro de la pantalla
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((l) => { const s = document.querySelector(l.href); if (s) io.observe(s); });

    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  // Bloquea el scroll del fondo y permite cerrar con Escape
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Cierra el menú y DESPUÉS baja a la sección. Si se salta con el scroll aún
  // bloqueado (body.menu-open), los celulares ignoran el salto y no se mueve.
  const goTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    document.body.classList.remove("menu-open");
    requestAnimationFrame(() => {
      const target = document.querySelector(href);
      if (!target) return;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      history.replaceState(null, "", href);
    });
  };

  const dark = onDark && !open;
  const tone = dark ? "text-pearl" : "text-sapphire-900";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[120] transition-transform duration-500 ${hidden && !open ? "-translate-y-full" : ""}`}
      >
        <nav
          aria-label="Principal"
          className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 transition-colors duration-300 ${tone}`}
        >
          {/* Logo */}
          <a href="#inicio" onClick={(e) => goTo(e, "#inicio")} className="flex items-center gap-3" aria-label="Ir al inicio">
            <span className={`grid size-9 place-items-center rounded-full font-mono text-xs font-bold transition-colors ${dark || open ? "bg-pearl text-sapphire-900" : "bg-sapphire-900 text-pearl"}`}>
              {profile.initials}
            </span>
            <span className={`kicker hidden sm:block ${open ? "text-pearl" : ""}`}>
              {profile.firstName} <span className="text-ember">/</span> Portafolio
            </span>
          </a>

          {/* Enlaces (escritorio) */}
          <ul
            className={`hidden items-center gap-1 rounded-full px-2 py-1.5 backdrop-blur-md transition-all lg:flex ${open ? "pointer-events-none opacity-0" : ""} ${
              scrolled ? (dark ? "bg-sapphire-900/70 shadow-lg" : "bg-pearl-100/80 shadow-[0_10px_30px_-18px_rgba(11,29,71,.6)]") : ""
            }`}
          >
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  aria-current={active === l.href ? "true" : undefined}
                  className={`relative rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    active === l.href ? "text-ember" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {l.label}
                  {active === l.href && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-ember" />}
                </a>
              </li>
            ))}
          </ul>

          {/* Botón Menú (hamburguesa) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="menu-panel"
            className={`ripple flex items-center gap-2.5 rounded-full px-4 py-2 kicker font-bold transition-colors ${
              open ? "bg-ember text-sapphire-950" : dark ? "bg-pearl text-sapphire-900" : "bg-sapphire-900 text-pearl"
            }`}
          >
            {open ? "Cerrar" : "Menú"}
            <span className="relative block size-3" aria-hidden="true">
              <span className={`absolute top-1/2 left-0 h-[1.5px] w-3 -translate-y-1/2 bg-current transition-transform duration-500 ${open ? "rotate-45" : ""}`} />
              <span className={`absolute top-1/2 left-0 h-[1.5px] w-3 -translate-y-1/2 bg-current transition-transform duration-500 ${open ? "-rotate-45" : "rotate-90"}`} />
            </span>
          </button>
        </nav>
      </header>

      {/* Panel de pantalla completa */}
      <div
        id="menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        className={`menu-panel fixed inset-0 z-[110] overflow-y-auto bg-sapphire-950 text-pearl ${open ? "open" : ""}`}
      >
        <div aria-hidden="true" className="bg-dots pointer-events-none absolute inset-0 text-sapphire-800 opacity-40" />
        <div className="relative mx-auto grid min-h-full max-w-7xl gap-10 px-5 pt-28 pb-10 lg:grid-cols-[1fr_320px] lg:items-end">
          <ul className="grid gap-1">
            {navLinks.map((l, i) => (
              <li key={l.href} style={{ ["--i" as string]: i }}>
                <a
                  href={l.href}
                  onClick={(e) => goTo(e, l.href)}
                  tabIndex={open ? 0 : -1}
                  className={`group flex items-baseline gap-4 font-display text-[clamp(2.4rem,7vw,5.2rem)] leading-[1.02] font-semibold tracking-tight uppercase transition-colors ${
                    active === l.href ? "text-ember" : "text-pearl hover:text-ember"
                  }`}
                >
                  <span className="kicker text-sapphire-300 group-hover:text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span className="transition-transform duration-500 group-hover:translate-x-3">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <div className="grid gap-6 border-t border-sapphire-800 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <div>
              <p className="kicker text-sapphire-300">Escríbeme</p>
              <a href={`mailto:${profile.email}`} tabIndex={open ? 0 : -1} className="mt-2 block text-lg break-all hover:text-ember">{profile.email}</a>
            </div>
            <div>
              <p className="kicker text-sapphire-300">Redes</p>
              <div className="mt-3 flex gap-2">
                {[
                  { icon: "github" as const, href: profile.github, label: "GitHub" },
                  { icon: "linkedin" as const, href: profile.linkedin, label: "LinkedIn" },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} tabIndex={open ? 0 : -1}
                    className="grid size-11 place-items-center rounded-full border border-sapphire-700 transition hover:border-ember hover:bg-ember hover:text-sapphire-950">
                    <Icon name={s.icon} />
                  </a>
                ))}
              </div>
            </div>
            <a href={profile.cvUrl} download tabIndex={open ? 0 : -1}
              className="ripple inline-flex w-fit items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-bold text-sapphire-950 transition hover:bg-ember-600">
              <Icon name="download" className="size-4" /> Descargar CV
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
