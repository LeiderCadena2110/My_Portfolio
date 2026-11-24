"use client";

import { useEffect, useState } from "react";
import { humanize, type Captions, type Media } from "@/lib/media-shared";

/* =============================================================================
   Demo con la APP REAL:
   - "Recorrido": capturas y videos reales, uno por uno, con su título y explicación.
   - "En vivo": la app real dentro de un marco (cuando tiene versión web).
   ============================================================================= */
type Device = "phone" | "watch" | "window";
type Props = {
  device: Device;
  media: Media[];
  captions?: Captions;
  live?: { url: string; label: string; hint: string };
  folder: string; // carpeta donde van las capturas (para las instrucciones)
};

function Frame({ device, children }: { device: Device; children: React.ReactNode }) {
  if (device === "watch")
    return (
      <div className="relative">
        <div className="absolute top-1/2 -right-3 h-14 w-4 -translate-y-1/2 rounded-r-lg bg-sapphire-700" aria-hidden="true" />
        <div className="size-[min(360px,85vw)] rounded-full border-[14px] border-sapphire-800 bg-sapphire-800 p-1 shadow-[0_40px_80px_-25px_rgba(0,0,0,.7)]">
          <div className="relative size-full overflow-hidden rounded-full bg-sapphire-950">{children}</div>
        </div>
      </div>
    );
  if (device === "phone")
    return (
      <div className="h-[min(780px,82vh)] aspect-[9/19.5] max-w-[90vw] overflow-hidden rounded-[46px] border-[10px] border-sapphire-950 bg-sapphire-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
        <div className="relative size-full overflow-hidden rounded-[36px] bg-pearl">{children}</div>
      </div>
    );
  return (
    <div className="w-full overflow-hidden rounded-xl bg-sapphire-950 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ring-1 ring-sapphire-700">
      <div className="flex h-8 items-center gap-2 px-3" aria-hidden="true">
        <span className="size-3 rounded-full bg-ember" /><span className="size-3 rounded-full bg-pearl-300" /><span className="size-3 rounded-full bg-sapphire-500" />
      </div>
      <div className="relative bg-sapphire-950">{children}</div>
    </div>
  );
}

export default function RealDemo({ device, media, captions = {}, live, folder }: Props) {
  const [mode, setMode] = useState<"live" | "tour">(media.length || !live ? "tour" : "live");
  const [i, setI] = useState(0);
  const item = media[i];
  const go = (d: number) => setI((x) => (x + d + media.length) % Math.max(1, media.length));
  const title = (m: Media) => captions[m.key]?.title ?? humanize(m.key);

  // Flechas del teclado para avanzar en el recorrido
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (mode !== "tour" || !media.length) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const itemDevice: Device = item?.device ?? device;
  const fit = itemDevice === "window" ? "w-full h-auto" : "size-full object-cover object-top";
  const tabBtn = (on: boolean) => `rounded-full px-4 py-2 transition ${on ? "bg-ember text-sapphire-950" : "text-sapphire-200 hover:text-pearl"}`;

  return (
    <div className="grid w-full justify-items-center gap-5">
      {live && (
        <div className="flex gap-1 rounded-full bg-sapphire-800 p-1 text-sm font-bold" role="tablist">
          <button role="tab" aria-selected={mode === "tour"} onClick={() => setMode("tour")} className={tabBtn(mode === "tour")}>Recorrido con capturas</button>
          <button role="tab" aria-selected={mode === "live"} onClick={() => setMode("live")} className={tabBtn(mode === "live")}>● App en vivo</button>
        </div>
      )}

      {mode === "live" && live ? (
        <>
          <Frame device={device}>
            <iframe src={live.url} title={live.label} className="size-full border-0 bg-pearl" allow="geolocation; clipboard-write" />
          </Frame>
          <p className="max-w-md text-center text-sm text-sapphire-300">{live.hint}</p>
          <a href={live.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-ember underline underline-offset-4">Abrir en otra pestaña ↗</a>
        </>
      ) : media.length ? (
        <>
          <Frame device={itemDevice}>
            {item.type === "video" ? (
              <video key={item.src} src={item.src} className={fit} controls autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={item.src} src={item.src} alt={title(item)} className={`panel-in ${fit}`} />
            )}
          </Frame>

          <div className="flex w-full max-w-3xl items-center justify-between gap-4">
            <button onClick={() => go(-1)} className="grid size-11 shrink-0 place-items-center rounded-full border border-sapphire-700 font-bold transition hover:border-ember hover:bg-ember hover:text-sapphire-950" aria-label="Anterior">←</button>
            <div className="text-center" aria-live="polite">
              <p className="kicker text-sapphire-300">{String(i + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}</p>
              <p className="mt-1 font-display text-xl font-semibold">{title(item)}</p>
              {captions[item.key]?.note && <p className="mt-1 text-sm text-sapphire-200">{captions[item.key]?.note}</p>}
            </div>
            <button onClick={() => go(1)} className="grid size-11 shrink-0 place-items-center rounded-full border border-sapphire-700 font-bold transition hover:border-ember hover:bg-ember hover:text-sapphire-950" aria-label="Siguiente">→</button>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {media.map((m, k) => (
              <button key={m.src} onClick={() => setI(k)} title={title(m)} aria-label={`Ver ${title(m)}`}
                className={`h-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${k === i ? "border-ember" : "border-transparent opacity-55 hover:opacity-100"}`}>
                {m.type === "video" ? <span className="grid h-full w-24 place-items-center bg-sapphire-800 px-1 text-xs">▶ {title(m)}</span>
                  // eslint-disable-next-line @next/next/no-img-element
                  : <img src={m.src} alt="" className="h-full w-auto" />}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-lg rounded-3xl border border-dashed border-ember/60 bg-sapphire-800/60 p-7 text-sm text-sapphire-200">
          <p className="font-display text-lg font-semibold text-pearl">Agrega las capturas de la app real</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5">
            <li>Toma capturas o graba un video corto de la app funcionando en el emulador.</li>
            <li>Ponles nombre en inglés con número, por ejemplo <code className="text-ember">01-home-watch.png</code>, <code className="text-ember">02-log-drink-watch.png</code>, <code className="text-ember">03-training.mp4</code>.</li>
            <li>Cópialas en <code className="text-ember">{folder}</code> y recarga esta página. Aparecen solas, en orden.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
