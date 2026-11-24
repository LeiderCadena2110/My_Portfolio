import Image from "next/image";
import { Fragment } from "react";
import { projects } from "@/data/projects";
import { profile } from "@/data/profile";
import type { Project } from "@/data/types";
import Icon from "./Icons";

/* =============================================================================
   4. PROYECTOS
   Cada proyecto muestra: imagen, título, descripción, tecnologías,
   link a GitHub y link a la demo (obligatorios, se abren en pestaña nueva).
   ============================================================================= */

/* Imagen del proyecto: captura real dentro de un celular, una ventana o un reloj */
function Cover({ project }: { project: Project }) {
  const { cover } = project;
  const lift = "transition-transform duration-700 group-hover:-translate-y-2";

  if (cover.kind === "phone")
    return (
      <div className={`relative aspect-[9/19.5] h-[min(420px,100%)] overflow-hidden rounded-[32px] border-[7px] border-sapphire-900 bg-sapphire-900 shadow-[0_40px_60px_-30px_rgba(11,29,71,.7)] ${lift}`}>
        <Image src={cover.src} alt={`Captura de ${project.title}`} fill sizes="220px" className="rounded-[24px] object-cover object-top" />
      </div>
    );

  if (cover.kind === "watch")
    return (
      <div className={`relative ${lift}`}>
        <div className="absolute top-1/2 -right-2.5 h-12 w-3 -translate-y-1/2 rounded-r-md bg-sapphire-700" aria-hidden="true" />
        <div className="relative size-[min(270px,62vw)] overflow-hidden rounded-full border-[12px] border-sapphire-800 bg-sapphire-950 shadow-[0_40px_60px_-30px_rgba(11,29,71,.9)]">
          <Image src={cover.src} alt={`Captura de ${project.title} en el reloj`} fill sizes="270px" className="object-cover" />
        </div>
      </div>
    );

  return (
    <div className={`w-full overflow-hidden rounded-xl bg-sapphire-900 shadow-[0_40px_60px_-30px_rgba(11,29,71,.7)] ${lift}`}>
      <div className="flex h-6 items-center gap-1.5 px-3" aria-hidden="true">
        <i className="size-2 rounded-full bg-ember" /><i className="size-2 rounded-full bg-pearl-300" /><i className="size-2 rounded-full bg-sapphire-500" />
      </div>
      <div className="relative aspect-[16/10]">
        <Image src={cover.src} alt={`Captura de ${project.title}`} fill sizes="(max-width: 1024px) 90vw, 560px" className="object-cover object-top" />
      </div>
    </div>
  );
}

export default function Projects() {
  const total = String(projects.length).padStart(2, "0");

  return (
    <section id="proyectos" data-theme="light" className="bg-pearl py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal kicker text-ember-700">Portafolio</p>
            <h2 className="reveal mt-3 font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none font-semibold tracking-tight text-sapphire-900 uppercase">
              Proyectos seleccionados
            </h2>
          </div>
          <a href={profile.github} target="_blank" rel="noopener noreferrer"
            className="reveal arrow-link inline-flex items-center gap-2 kicker font-bold text-sapphire-900 hover:text-ember-700">
            Ver todo en GitHub <Icon name="external" className="size-3.5" />
          </a>
        </header>

        <ol className="mt-14">
          {projects.map((p, i) => (
            <Fragment key={p.slug}>
              {i > 0 && (
                <li aria-hidden="true" className="my-14 flex items-center gap-4 kicker text-stone">
                  <span className="h-px flex-1 bg-pearl-300" />
                  Siguiente proyecto · {String(i + 1).padStart(2, "0")} / {total}
                  <span className="h-px flex-1 bg-pearl-300" />
                </li>
              )}
              <li className="reveal">
                <article className="group grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
                  <figure>
                    <div className="grid min-h-[340px] place-items-center rounded-2xl bg-pearl-200 p-8 sm:p-10">
                      <Cover project={p} />
                    </div>
                    <figcaption className="mt-3 flex items-center justify-between kicker text-stone">
                      <span>{p.category}</span>
                      <span className="flex items-center gap-1" aria-hidden="true">
                        <i className="h-1 w-6 rounded-full bg-sapphire-900" /><i className="h-1 w-2 rounded-full bg-pearl-300" /><i className="h-1 w-2 rounded-full bg-pearl-300" />
                      </span>
                    </figcaption>
                  </figure>

                  <div className="min-w-0">
                    <p className="kicker text-stone">{String(i + 1).padStart(2, "0")} — {p.year}</p>
                    <h3 className="mt-3 flex items-start gap-2 font-display text-[clamp(1.9rem,3.6vw,2.8rem)] leading-tight font-medium tracking-tight text-sapphire-900">
                      {p.title}
                      <Icon name="external" className="mt-2 size-5 shrink-0 text-stone transition group-hover:text-ember" />
                    </h3>

                    {p.collaboration && (
                      <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-sapphire-900/15 px-3 py-1.5 text-xs font-semibold text-sapphire-900">
                        <span className="size-1.5 rounded-full bg-ember" />
                        {p.collaboration.role} · en equipo con {p.collaboration.with}
                      </p>
                    )}

                    <p className="mt-4 leading-relaxed text-stone">{p.description}</p>

                    <p className="mt-6 kicker text-stone">Lo más importante</p>
                    <ul className="mt-3 grid gap-2 text-sm text-sapphire-800">
                      {p.highlights.map((h) => (
                        <li key={h} className="flex gap-2.5"><span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-ember" />{h}</li>
                      ))}
                    </ul>

                    <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-pearl-300 pt-5" aria-label="Tecnologías">
                      {p.tags.map((t) => <li key={t} className="kicker text-sapphire-800">{t}</li>)}
                    </ul>

                    <div className="mt-7 flex flex-wrap items-center gap-2.5">
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
                          className="arrow-link inline-flex items-center gap-1.5 px-2 py-2.5 kicker font-bold text-sapphire-900 hover:text-ember-700">
                          {x.label} <Icon name="external" className="size-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
