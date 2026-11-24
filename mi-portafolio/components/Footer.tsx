import { navLinks, profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   8. PIE DE PÁGINA
   Nombre y © año · íconos de redes · enlaces rápidos · volver arriba · créditos
   ============================================================================= */
export default function Footer() {
  const year = new Date().getFullYear(); // se actualiza solo

  return (
    <footer data-theme="dark" className="bg-sapphire-950 text-sapphire-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.3fr_1fr_auto]">
        <div>
          <a href="#inicio" className="flex items-center gap-3 text-pearl">
            <span className="grid size-10 place-items-center rounded-full bg-pearl font-mono text-xs font-bold text-sapphire-900">{profile.initials}</span>
            <span className="font-display text-lg font-semibold">Leider Cadena<span className="text-ember">.</span></span>
          </a>
          <p className="mt-4 max-w-xs text-sm">{profile.role} en Pasto. Backend, arquitectura de software y bases de datos.</p>
        </div>

        <nav aria-label="Enlaces rápidos">
          <p className="kicker text-pearl">Enlaces</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {navLinks.map((l) => <li key={l.href}><a href={l.href} className="transition hover:text-ember">{l.label}</a></li>)}
          </ul>
        </nav>

        <div>
          <p className="kicker text-pearl">Sígueme</p>
          <ul className="mt-4 flex gap-2">
            {[
              { href: profile.github, icon: "github" as const, label: "GitHub" },
              { href: profile.linkedin, icon: "linkedin" as const, label: "LinkedIn" },
              { href: `mailto:${profile.email}`, icon: "mail" as const, label: "Correo" },
            ].map((s) => (
              <li key={s.label}>
                <a href={s.href} target={s.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" aria-label={s.label}
                  className="grid size-11 place-items-center rounded-full border border-sapphire-800 text-pearl transition hover:-translate-y-1 hover:border-ember hover:bg-ember hover:text-sapphire-950">
                  <Icon name={s.icon} className="size-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sapphire-900">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-start justify-between gap-4 px-5 py-6 text-sm sm:flex-row sm:items-center">
          <p>
            © {year} {profile.name} · Todos los derechos reservados
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> · </span>Hecho con Next.js + Tailwind CSS
          </p>
          <a href="#inicio" className="ripple inline-flex items-center gap-2 rounded-full bg-pearl px-4 py-2 text-sm font-semibold text-sapphire-900 transition hover:-translate-y-1 hover:bg-ember">
            <Icon name="up" className="size-4" /> Volver arriba
          </a>
        </div>
      </div>
    </footer>
  );
}
