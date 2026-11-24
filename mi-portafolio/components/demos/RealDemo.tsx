"use client";

import { useEffect, useState } from "react";
import type { Media } from "@/lib/media";

/* =============================================================================
   Demo con TU APP REAL:
   - "En vivo": la app real dentro de un marco (cuando tiene versión web).
   - "Recorrido": tus capturas y videos reales, uno por uno, con su título.
   ============================================================================= */
type Device = "phone" | "watch" | "window";
type Props = {
  device: Device;
  media: Media[];
  notes?: Record<string, string>; // explicación opcional por título
  live?: { url: string; label: string; hint: string };
  folder: string; // carpeta donde van las capturas (para las instrucciones)
};

function Frame({ device, children }: { device: Device; children: React.ReactNode }) {
  if (device === "watch")
    return (
      <div className="relative">
        <div className="absolute top-1/2 -right-3 h-14 w-4 -translate-y-1/2 rounded-r-lg bg-slate-500" aria-hidden="true" />
        <div className="size-[min(360px,85vw)] rounded-full border-[14px] border-slate-600 bg-slate-700 p-1 shadow-[0_40px_80px_-25px_rgba(0,0,0,.8)]">
          <div className="relative size-full overflow-hidden rounded-full bg-[#0a1f33]">{children}</div>
        </div>
      </div>
    );
  if (device === "phone")
    return (
      <div className="h-[min(780px,85vh)] w-[min(380px,90vw)] overflow-hidden rounded-[46px] border-[10px] border-[#0f2a44] bg-[#0f2a44] shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]">
        <div className="relative size-full overflow-hidden rounded-[36px] bg-ink">{children}</div>
      </div>
    );
  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]">
      <div className="flex h-8 items-center gap-2 bg-[#e8edf2] px-3">
        <span className="size-3 rounded-full bg-red-400" /><span className="size-3 rounded-full bg-amber-400" /><span className="size-3 rounded-full bg-green-500" />
      </div>
      <div className="relative bg-[#f4f6f8]">{children}</div>
    </div>
  );
}

export default function RealDemo({ device, media, notes = {}, live, folder }: Props) {
  const [mode, setMode] = useState<"live" | "tour">(live ? "live" : "tour");
  const [i, setI] = useState(0);
  const item = media[i];
  const go = (d: number) => setI((x) => (x + d + media.length) % Math.max(1, media.length));

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

  return (
    <div className="grid w-full justify-items-center gap-5">
      {live && (
        <div className="flex gap-2 rounded-full bg-white/10 p-1 text-sm font-bold">
          <button onClick={() => setMode("live")} className={`rounded-full px-4 py-2 ${mode === "live" ? "bg-mint text-ink" : ""}`}>● App en vivo</button>
          <button onClick={() => setMode("tour")} className={`rounded-full px-4 py-2 ${mode === "tour" ? "bg-mint text-ink" : ""}`}>Recorrido con capturas</button>
        </div>
      )}

      {mode === "live" && live ? (
        <>
          <Frame device={device}>
            <iframe src={live.url} title={live.label} className="size-full border-0 bg-white" allow="geolocation; clipboard-write" />
          </Frame>
          <p className="max-w-md text-center text-sm text-haze">{live.hint}</p>
          <a href={live.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-mint underline">Abrir en otra pestaña ↗</a>
        </>
      ) : media.length ? (
        <>
          <Frame device={itemDevice}>
            {item.type === "video" ? (
              <video key={item.src} src={item.src} className={fit} controls autoPlay muted loop playsInline />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={item.src} src={item.src} alt={item.title} className={fit} />
            )}
          </Frame>

          <div className="flex w-full max-w-3xl items-center justify-between gap-4">
            <button onClick={() => go(-1)} className="rounded-full bg-white/10 px-4 py-2 font-bold hover:bg-white/20" aria-label="Anterior">←</button>
            <div className="text-center">
              <p className="font-mono text-xs text-haze">{i + 1} / {media.length}</p>
              <p className="font-display text-lg font-bold">{item.title}</p>
              {notes[item.title] && <p className="mt-1 text-sm text-haze">{notes[item.title]}</p>}
            </div>
            <button onClick={() => go(1)} className="rounded-full bg-white/10 px-4 py-2 font-bold hover:bg-white/20" aria-label="Siguiente">→</button>
          </div>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {media.map((m, k) => (
              <button key={m.src} onClick={() => setI(k)} title={m.title}
                className={`h-16 shrink-0 overflow-hidden rounded-lg border-2 ${k === i ? "border-mint" : "border-transparent opacity-60 hover:opacity-100"}`}>
                {m.type === "video" ? <span className="grid h-full w-24 place-items-center bg-ink text-xs">▶ {m.title}</span>
                  // eslint-disable-next-line @next/next/no-img-element
                  : <img src={m.src} alt="" className="h-full w-auto" />}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="max-w-lg rounded-3xl border border-dashed border-sun/50 bg-ink/70 p-7 text-sm text-haze">
          <p className="font-display text-lg font-bold text-snow">Agrega las capturas de tu app real</p>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5">
            <li>Toma capturas o graba un video corto de tu app funcionando.</li>
            <li>Ponles nombre con número y título, por ejemplo <code className="text-sun">01-inicio.png</code>, <code className="text-sun">02-registrar-toma.png</code>, <code className="text-sun">03-entrenamiento.mp4</code>.</li>
            <li>Cópialas en <code className="text-sun">{folder}</code> y recarga esta página. Aparecen solas, en orden.</li>
          </ol>
        </div>
      )}
    </div>
  );
}
