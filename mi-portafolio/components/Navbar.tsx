"use client";

import { useEffect, useState } from "react";
import { navLinks, profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   1. MENÚ DE NAVEGACIÓN
   Logo + enlaces a todas las secciones + botón CV, fijo arriba,
   hamburguesa en celular y resaltado de la sección activa.
   ============================================================================= */
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("#inicio");

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      setHidden(y > 600 && y > last + 4); // se esconde al bajar y vuelve al subir
      if (y < last - 4) setHidden(false);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Enlace activo según la sección que está en pantalla
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((l) => {
      const el = document.querySelector(l.href);
      if (el) io.observe(el);
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("keydown", onKey); io.disconnect(); };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "bg-navy/85 shadow-[0_8px_30px_-14px_rgba(15,23,42,.8)] backdrop-blur-lg" : ""} ${hidden && !open ? "-translate-y-full" : ""}`}
    >
      <nav className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-4 px-5" aria-label="Navegación principal">
        {/* Logo: foto + iniciales */}
        <a href="#inicio" className="group flex items-center gap-2.5 font-display text-sm font-bold text-snow">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/leider-avatar.webp" alt="" width={38} height={38} className="size-[38px] rounded-full border-2 border-brand-light object-cover transition group-hover:-rotate-6 group-hover:scale-105" />
          <span>Leider<span className="text-mint">.</span>dev</span>
        </a>

        {/* Botón hamburguesa (celular) */}
        <button
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="menu"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="relative z-10 grid size-11 place-items-center rounded-xl border border-white/10 text-snow lg:hidden"
        >
          <span className={`absolute h-0.5 w-5 rounded bg-snow transition ${open ? "rotate-45" : "-translate-y-1.5"}`} />
          <span className={`absolute h-0.5 w-5 rounded bg-snow transition ${open ? "opacity-0" : ""}`} />
          <span className={`absolute h-0.5 w-5 rounded bg-snow transition ${open ? "-rotate-45" : "translate-y-1.5"}`} />
        </button>

        <ul
          id="menu"
          onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}
          className={`fixed inset-x-0 top-0 flex flex-col gap-1 bg-navy/97 px-5 pt-20 pb-6 backdrop-blur-xl transition-transform duration-500 lg:static lg:flex-row lg:items-center lg:bg-transparent lg:p-0 lg:backdrop-blur-none ${open ? "translate-y-0" : "-translate-y-full lg:translate-y-0"}`}
        >
          {navLinks.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`relative block px-3 py-3 text-[15px] font-medium transition hover:text-snow lg:py-2 lg:text-sm after:absolute after:inset-x-3 after:bottom-1 after:h-0.5 after:origin-left after:rounded after:bg-mint after:transition-transform ${active === l.href ? "text-snow after:scale-x-100" : "text-haze after:scale-x-0"}`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-3 lg:mt-0 lg:ml-2">
            <a href={profile.cvUrl} download className="ripple flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-snow transition hover:-translate-y-0.5 hover:bg-brand-dark">
              CV <Icon name="download" className="size-4" />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
