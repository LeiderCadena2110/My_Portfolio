import Image from "next/image";
import { projects } from "@/data/projects";
import type { Project } from "@/data/types";
import Icon from "./Icons";

/* =============================================================================
   4. PROYECTOS
   Cada proyecto muestra: imagen, título, descripción, tecnologías,
   link a GitHub y link a la demo (obligatorios, se abren en pestaña nueva).
   En pantallas grandes se alternan izquierda / derecha.
   ============================================================================= */

/* Imagen del proyecto: captura real dentro de un celular, una ventana o un reloj */
function Cover({ project }: { project: Project }) {
  const { cover } = project;

  if (cover.kind === "phone")
    return (
      <div className="relative grid h-full place-items-center bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,90,18,.18),transparent_60%)] p-8">
        <div className="relative aspect-[9/19.5] h-[min(440px,100%)] overflow-hidden rounded-[34px] border-[7px] border-sapphire-900 bg-sapphire-900 shadow-[0_40px_60px_-30px_rgba(11,29,71,.8)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[-2deg]">
          <Image src={cover.src} alt={`Captura de ${project.title}`} fill sizes="240px" className="rounded-[26px] object-cover object-top" />
        </div>
      </div>
    );

  if (cover.kind === "window")
    return (
      <div className="grid h-full place-items-center p-6 sm:p-10">
        <div className="w-full overflow-hidden rounded-xl bg-sapphire-900 shadow-[0_40px_60px_-30px_rgba(11,29,71,.8)] transition-transform duration-700 group-hover:-translate-y-2 group-hover:scale-[1.02]">
          <div className="flex h-6 items-center gap-1.5 px-3" aria-hidden="true">
            <i className="size-2 rounded-full bg-ember" /><i className="size-2 rounded-full bg-pearl-300" /><i className="size-2 rounded-full bg-sapphire-500" />
          </div>
          <div className="relative aspect-[16/10]">
            <Image src={cover.src} alt={`Captura de ${project.title}`} fill sizes="(max-width: 1024px) 90vw, 600px" className="object-cover object-top" />
          </div>
        </div>
      </div>
    );

  // Reloj: ilustración con el nombre de la app mientras no haya capturas
  return (
    <div className="grid h-full place-items-center p-10" aria-hidden="true">
      <div className="relative transition-transform duration-700 group-hover:-translate-y-2 group-hover:rotate-[4deg]">
        <div className="absolute top-1/2 -right-2.5 h-12 w-3 -translate-y-1/2 rounded-r-md bg-sapphire-700" />
        <div className="grid size-[min(250px,60vw)] place-items-center rounded-full border-[12px] border-sapphire-800 bg-sapphire-950 shadow-[0_40px_60px_-30px_rgba(11,29,71,.9)]">
          <div className="grid place-items-center text-center">
            <svg viewBox="0 0 24 24" className="size-12 text-ember" fill="currentColor"><path d="M12 2.5S5 10.3 5 14.8A7 7 0 0 0 19 14.8C19 10.3 12 2.5 12 2.5Z" /></svg>
            <p className="mt-2 font-display text-lg font-semibold text-pearl">HidraSmart</p>
            <p className="kicker text-sapphire-300">Wear OS</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const total = String(projects.length).padStart(2, "0");

  return (
    <section id="proyectos" data-theme="light" className="bg-pearl py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-pearl-300 pb-8">
          <div>
            <p className="reveal kicker text-ember-700">Portafolio · Últimos proyectos</p>
            <h2 className="reveal mt-3 font-display text-[clamp(2.2rem,6vw,4.6rem)] leading-none font-semibold tracking-tight text-sapphire-900 uppercase">
              Proyectos destacados
            </h2>
          </div>
          <p className="reveal max-w-sm text-stone">
            Estas son las apps en las que estoy trabajando. Cada una tiene su código en GitHub y una demo con la app real funcionando.
          </p>
        </header>

        <ul className="mt-6 grid gap-6">
          {projects.map((p, i) => (
            <li key={p.slug} className="reveal">
              <article className="group grid overflow-hidden rounded-[28px] bg-pearl-100 ring-1 ring-pearl-300 transition-shadow duration-500 hover:shadow-[0_40px_70px_-45px_rgba(11,29,71,.6)] lg:grid-cols-2">
                <div className={`min-h-[320px] bg-pearl-200 ${i % 2 ? "lg:order-2" : ""}`}>
                  <Cover project={p} />
                </div>

                <div className="flex min-w-0 flex-col p-7 sm:p-10">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="kicker text-stone">{p.category}</p>
                    <p className="kicker text-stone">{String(i + 1).padStart(2, "0")} / {total}</p>
                  </div>

                  <h3 className="mt-4 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] leading-tight font-semibold tracking-tight text-sapphire-900">
                    {p.title}
                  </h3>

                  {p.collaboration && (
                    <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-sapphire-900 px-3 py-1.5 text-xs font-semibold text-pearl">
                      <span className="size-1.5 rounded-full bg-ember" />
                      {p.collaboration.role} · proyecto en equipo con {p.collaboration.with}
                    </p>
                  )}

                  <p className="mt-4 leading-relaxed text-stone">{p.description}</p>

                  <ul className="mt-5 grid gap-2 text-sm text-sapphire-800">
                    {p.highlights.map((h) => (
                      <li key={h} className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ember" />{h}</li>
                    ))}
                  </ul>

                  <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Tecnologías">
                    {p.tags.map((t) => (
                      <li key={t} className="rounded-full border border-pearl-300 bg-pearl px-2.5 py-1 font-mono text-[11px] text-sapphire-800">{t}</li>
                    ))}
                  </ul>

                  <div className="mt-auto flex flex-wrap gap-2.5 pt-8">
                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                      className="ripple inline-flex items-center gap-2 rounded-full bg-ember px-5 py-2.5 text-sm font-bold text-sapphire-950 transition hover:-translate-y-0.5 hover:bg-ember-600">
                      ▶ Ver demo
                    </a>
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      className="ripple inline-flex items-center gap-2 rounded-full bg-sapphire-900 px-5 py-2.5 text-sm font-semibold text-pearl transition hover:-translate-y-0.5 hover:bg-sapphire-800">
                      <Icon name="github" className="size-4" /> GitHub
                    </a>
                    {p.extra?.map((x) => (
                      <a key={x.href} href={x.href} target="_blank" rel="noopener noreferrer"
                        className="arrow-link inline-flex items-center gap-1.5 rounded-full border border-pearl-300 px-4 py-2.5 text-sm font-semibold text-sapphire-900 transition hover:border-ember hover:text-ember-700">
                        {x.label} <Icon name="external" className="size-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
