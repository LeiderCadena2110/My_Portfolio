import Link from "next/link";
import { projects } from "@/data/projects";

/* =============================================================================
   Marco común de las demos: encabezado, enlaces al proyecto real
   y el GUION para la sustentación (pasos que puedes seguir frente al profesor).
   ============================================================================= */
type Props = {
  slug: string; // slug del proyecto en data/projects.ts
  subtitle: string;
  steps: string[];
  links?: { label: string; href: string }[]; // enlaces extra (versión web, etc.)
  wide?: boolean; // apps de escritorio y juegos: la demo ocupa todo el ancho
  children: React.ReactNode;
};

export default function DemoShell({ slug, subtitle, steps, links = [], wide, children }: Props) {
  const project = projects.find((p) => p.slug === slug)!;
  const allLinks = [{ label: "Código en GitHub", href: project.github }, ...(project.extra ?? []), ...links];

  return (
    <div className="min-h-svh bg-sapphire-900 text-pearl">
      <div aria-hidden="true" className="bg-dots pointer-events-none fixed inset-0 text-sapphire-800 opacity-50" />
      <header className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 pt-6">
        <Link href="/#proyectos" className="rounded-full bg-pearl px-4 py-2 text-sm font-semibold text-sapphire-900 transition hover:bg-ember">
          ← Volver al portafolio
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm" aria-label="Otras demos">
          {projects.map((p) => (
            <Link key={p.slug} href={p.demo} aria-current={p.slug === slug ? "page" : undefined}
              className={`rounded-full px-3 py-1.5 transition ${p.slug === slug ? "bg-sapphire-800 text-ember" : "text-sapphire-300 hover:text-pearl"}`}>
              {p.title.replace("Escape Espacial: ", "")}
            </Link>
          ))}
        </nav>
      </header>

      <main className={`relative mx-auto grid items-start gap-8 px-5 py-10 ${wide ? "max-w-[1320px]" : "max-w-7xl lg:grid-cols-[360px_1fr]"}`}>
        <aside className={wide ? "grid gap-6 lg:grid-cols-[1fr_1.1fr]" : "lg:sticky lg:top-6"}>
          <div>
            <p className="kicker text-ember">Demo · app real</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">{project.title}</h1>
            {project.collaboration && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-sapphire-800 px-3 py-1.5 text-xs font-semibold">
                <span className="size-1.5 rounded-full bg-ember" />
                {project.collaboration.role} · repositorio de {project.collaboration.owner}
              </p>
            )}
            <p className="mt-4 text-sapphire-200">{subtitle}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((t) => <li key={t} className="rounded-full border border-sapphire-700 px-2.5 py-1 font-mono text-[11px] text-sapphire-200">{t}</li>)}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {allLinks.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="rounded-full border border-sapphire-700 px-3.5 py-1.5 text-sm font-semibold transition hover:border-ember hover:text-ember">
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>
          <div>
            <details open className={`${wide ? "" : "mt-7"} rounded-2xl bg-sapphire-950/70 p-5 ring-1 ring-sapphire-800`}>
              <summary className="cursor-pointer font-display font-semibold">🎤 Guion para la sustentación</summary>
              <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm text-sapphire-200 marker:font-bold marker:text-ember">
                {steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </details>
            <p className="mt-4 text-xs text-sapphire-300">
              Todo lo que ves aquí es la app real: capturas y videos tomados de la app funcionando, o su versión web en vivo.
            </p>
          </div>
        </aside>

        <section className="grid min-w-0 place-items-center">{children}</section>
      </main>
    </div>
  );
}
