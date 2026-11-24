import Link from "next/link";

/* =============================================================================
   Marco común de las 3 demos: encabezado, enlaces al proyecto real
   y el GUION para la sustentación (pasos que puedes seguir frente al profesor).
   ============================================================================= */
type Props = {
  title: string;
  subtitle: string;
  tags: string[];
  links: { label: string; href: string }[];
  steps: string[];
  accent: string; // color del acento (hex)
  wide?: boolean; // apps de escritorio: la demo ocupa todo el ancho
  children: React.ReactNode;
};

export default function DemoShell({ title, subtitle, tags, links, steps, accent, wide, children }: Props) {
  return (
    <div className="min-h-svh bg-[radial-gradient(ellipse_60%_50%_at_70%_10%,rgba(37,99,235,.35),transparent_70%),linear-gradient(180deg,#172554,#1e293b)] text-snow">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 pt-6">
        <Link href="/#proyectos" className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-snow transition hover:border-brand-light hover:bg-brand/30">
          ← Volver al portafolio
        </Link>
        <nav className="flex gap-2 text-sm" aria-label="Otras demos">
          {[["/demos/minga", "Minga App"], ["/demos/hidrasmart", "HidraSmart"], ["/demos/stockflow", "StockFlow"]].map(([href, label]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-1.5 text-haze transition hover:bg-white/10 hover:text-snow">{label}</Link>
          ))}
        </nav>
      </header>

      <main className={`mx-auto grid items-start gap-8 px-5 py-8 ${wide ? "max-w-[1320px]" : "max-w-7xl lg:grid-cols-[340px_1fr]"}`}>
        <aside className={wide ? "grid gap-6 lg:grid-cols-[1fr_1.1fr]" : "lg:sticky lg:top-6"}>
          <div>
          <p className="font-mono text-xs tracking-widest uppercase" style={{ color: accent }}>Demo · app real</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold">{title}</h1>
          <p className="mt-3 text-haze">{subtitle}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((t) => <li key={t} className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[11px]">{t}</li>)}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            {links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/20 px-3.5 py-1.5 text-sm font-bold transition hover:border-mint hover:text-mint">
                {l.label} ↗
              </a>
            ))}
          </div>

          </div>
          <div>
          <details open className={`${wide ? "" : "mt-6"} rounded-2xl border border-white/10 bg-ink/70 p-5`}>
            <summary className="cursor-pointer font-display text-sm font-bold">🎤 Guion para la sustentación</summary>
            <ol className="mt-3 grid list-decimal gap-2 pl-5 text-sm text-haze marker:font-bold marker:text-snow">
              {steps.map((s) => <li key={s}>{s}</li>)}
            </ol>
          </details>
          <p className="mt-4 text-xs text-haze">
            Todo lo que ves aquí es la app real: su versión web en vivo o capturas y videos tomados de la app funcionando.
          </p>
          </div>
        </aside>

        <section className="grid min-w-0 place-items-center">{children}</section>
      </main>
    </div>
  );
}
