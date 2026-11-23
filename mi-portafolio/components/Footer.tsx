import { navLinks, profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   8. PIE DE PÁGINA
   Nombre y © año · íconos de redes · enlaces rápidos · volver arriba · créditos
   ============================================================================= */
export default function Footer() {
  const year = new Date().getFullYear(); // se actualiza solo

  return (
    <footer className="border-t border-white/10 bg-ink py-12 text-haze">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 md:grid-cols-[1.2fr_1fr_auto] md:items-start">
        <div>
          <a href="#inicio" className="flex items-center gap-2.5 font-display text-sm font-bold text-snow">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/leider-avatar.webp" alt="" width={38} height={38} loading="lazy" className="size-[38px] rounded-full border-2 border-brand-light object-cover" />
            <span>Leider<span className="text-mint">.</span>dev</span>
          </a>
          <p className="mt-3 max-w-xs text-sm">{profile.role} · Backend, arquitectura y bases de datos.</p>
        </div>

        <nav aria-label="Enlaces rápidos">
          <p className="mb-3 text-xs font-bold tracking-widest text-snow uppercase">Enlaces</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navLinks.map((l) => <li key={l.href}><a href={l.href} className="transition hover:text-snow">{l.label}</a></li>)}
          </ul>
        </nav>

        <div>
          <p className="mb-3 text-xs font-bold tracking-widest text-snow uppercase">Sígueme</p>
          <ul className="flex gap-2">
            {[
              { href: profile.github, icon: "github" as const, label: "GitHub" },
              { href: profile.linkedin, icon: "linkedin" as const, label: "LinkedIn" },
              { href: `mailto:${profile.email}`, icon: "mail" as const, label: "Correo" },
            ].map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full border border-white/15 transition hover:-translate-y-1 hover:border-brand-light hover:text-snow">
                  <Icon name={s.icon} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col-reverse items-start justify-between gap-4 border-t border-white/10 pt-6 text-sm sm:flex-row sm:items-center md:col-span-3">
          <p>© {year} {profile.name} · Hecho con Next.js + Tailwind CSS 💙</p>
          {/* Botón volver arriba */}
          <a href="#inicio" className="ripple inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 font-bold text-snow transition hover:-translate-y-1 hover:bg-brand-dark">
            <Icon name="up" className="size-4" /> Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
