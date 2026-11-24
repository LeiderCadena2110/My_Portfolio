"use client";

import { useEffect, useMemo, useState } from "react";
import { profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   ⭐ SECCIÓN ADICIONAL 2: ACTIVIDAD EN GITHUB
   Mapa de contribuciones del último año, traído en vivo de una API pública
   (github-contributions-api.jogruber.de). Si no responde, muestra un enlace
   a tu perfil en lugar del mapa.
   ============================================================================= */
type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type State = { status: "loading" } | { status: "error" } | { status: "ok"; days: Day[]; total: number };

const API = `https://github-contributions-api.jogruber.de/v4/${profile.githubUser}?y=last`;
const LEVELS = ["bg-pearl-300/70", "bg-ember-100", "bg-[#ffb48a]", "bg-ember", "bg-ember-700"];
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function GithubActivity() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(API, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { total: Record<string, number>; contributions: Day[] }) =>
        setState({ status: "ok", days: d.contributions, total: d.total.lastYear ?? d.contributions.reduce((a, c) => a + c.count, 0) }),
      )
      .catch((e) => { if (e?.name !== "AbortError") setState({ status: "error" }); });
    return () => ctrl.abort();
  }, []);

  // Semanas (columnas) y estadísticas
  const data = useMemo(() => {
    if (state.status !== "ok") return null;
    const days = state.days;
    const weeks: (Day | null)[][] = [];
    const firstDow = new Date(`${days[0].date}T12:00:00`).getDay();
    let week: (Day | null)[] = Array(firstDow).fill(null);
    days.forEach((d) => { week.push(d); if (week.length === 7) { weeks.push(week); week = []; } });
    if (week.length) weeks.push(week);

    let best = 0, run = 0;
    days.forEach((d) => { run = d.count ? run + 1 : 0; best = Math.max(best, run); });
    const active = days.filter((d) => d.count > 0).length;
    const months = weeks.map((w, i) => {
      const first = w.find(Boolean);
      const m = first ? new Date(`${first.date}T12:00:00`).getMonth() : -1;
      const prev = weeks[i - 1]?.find(Boolean);
      return prev && new Date(`${prev.date}T12:00:00`).getMonth() === m ? "" : MONTHS[m] ?? "";
    });
    // Evita que dos nombres de mes queden encimados (la primera semana suele ser de un mes incompleto)
    if (months[0] && months.slice(1, 3).some(Boolean)) months[0] = "";
    return { weeks, months, best, rate: Math.round((active / days.length) * 100) };
  }, [state]);

  const stats = [
    { label: "Contribuciones en el último año", value: state.status === "ok" ? state.total.toLocaleString("es-CO") : "—", big: true },
    { label: "Racha más larga", value: data ? `${data.best} días` : "—" },
    { label: "Días activos", value: data ? `${data.rate} %` : "—" },
  ];

  return (
    <section id="github" data-theme="light" className="relative overflow-hidden bg-pearl-100 py-24 sm:py-32">
      <p aria-hidden="true" className="text-ghost pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 font-display text-[16vw] leading-none font-bold whitespace-nowrap text-sapphire-900 uppercase">
        Commits
      </p>

      <div className="relative mx-auto max-w-7xl px-5">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="reveal kicker text-ember-700">Actividad de código</p>
            <h2 className="reveal mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-semibold tracking-tight text-sapphire-900">
              Mis contribuciones en <em className="font-serif font-normal text-ember-600 italic">GitHub</em>
            </h2>
          </div>
          <p className="reveal max-w-sm text-stone">Cada cuadro es un día. Mientras más naranja, más commits, pull requests y revisiones hice ese día.</p>
        </header>

        <div className="reveal mt-12 grid gap-5 lg:grid-cols-[280px_1fr]">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            {stats.map((s) => (
              <div key={s.label} className={`rounded-2xl bg-pearl p-5 ring-1 ring-pearl-300 ${s.big ? "col-span-2 lg:col-span-1" : ""}`}>
                <dt className="kicker text-stone">{s.label}</dt>
                <dd className={`mt-2 font-serif text-sapphire-900 ${s.big ? "text-6xl" : "text-3xl"}`}>{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex min-w-0 flex-col justify-center rounded-2xl bg-pearl p-5 ring-1 ring-pearl-300 sm:p-7">
            {state.status === "error" ? (
              <div className="grid h-full place-items-center gap-3 py-10 text-center text-stone">
                <p>No pude cargar el mapa de contribuciones en este momento.</p>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="arrow-link inline-flex items-center gap-2 font-semibold text-sapphire-900">
                  Verlo en mi perfil de GitHub <Icon name="external" className="size-4" />
                </a>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto pb-2">
                  <div className="w-max">
                    <div className="mb-2 flex gap-[3px] pl-0 kicker text-[10px] text-stone">
                      {(data?.months ?? Array(53).fill("")).map((m, i) => <span key={i} className="w-[13px] overflow-visible whitespace-nowrap">{m}</span>)}
                    </div>
                    <div className={`flex gap-[3px] ${state.status === "loading" ? "animate-pulse" : ""}`} role="img"
                      aria-label={state.status === "ok" ? `${state.total} contribuciones en GitHub en el último año` : "Cargando contribuciones"}>
                      {(data?.weeks ?? Array.from({ length: 53 }, () => Array(7).fill(null))).map((w, i) => (
                        <div key={i} className="grid grid-rows-7 gap-[3px]">
                          {Array.from({ length: 7 }, (_, k) => w[k]).map((d, k) => (
                            <span key={k} title={d ? `${d.count} contribuciones · ${d.date}` : undefined}
                              className={`size-[13px] rounded-[3px] ${d ? LEVELS[d.level] : state.status === "loading" ? LEVELS[0] : "bg-transparent"}`} />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone">
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="arrow-link inline-flex items-center gap-1.5 font-semibold text-sapphire-900">
                    @{profile.githubUser} <Icon name="external" className="size-3.5" />
                  </a>
                  <span className="flex items-center gap-1.5">
                    Menos {LEVELS.map((l) => <i key={l} className={`size-[11px] rounded-[3px] ${l}`} />)} Más
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
