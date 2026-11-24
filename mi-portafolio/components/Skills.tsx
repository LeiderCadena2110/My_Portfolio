"use client";

import { useEffect, useRef, useState } from "react";
import { stackKeys } from "@/data/skills";

/* =============================================================================
   ⭐ SECCIÓN ADICIONAL: HABILIDADES
   Teclado 3D hecho con CSS: cada tecla es una tecnología. Al pasar el cursor
   o tocarla se hunde y muestra su descripción en el panel.
   ============================================================================= */
export default function Skills() {
  const [selected, setSelected] = useState<number | null>(null);
  const [pressed, setPressed] = useState<number | null>(null);
  const [panelKey, setPanelKey] = useState(0); // reinicia la animación del panel
  const board = useRef<HTMLDivElement>(null);

  const show = (i: number) => { setSelected(i); setPanelKey((k) => k + 1); };
  const press = (i: number) => { setPressed(i); setTimeout(() => setPressed(null), 140); show(i); };

  // "Ola" de teclas que se presionan solas cuando el teclado aparece
  useEffect(() => {
    const el = board.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      stackKeys.forEach((_, i) => setTimeout(() => { setPressed(i); setTimeout(() => setPressed((p) => (p === i ? null : p)), 160); }, 300 + i * 60));
      io.disconnect();
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const current = selected !== null ? stackKeys[selected] : null;
  const sideColor: Record<string, string> = { sapphire: "#1b3a8c", deep: "#071431", pearl: "#8a7f6c", ember: "#c43f05" };

  return (
    <section id="habilidades" data-theme="light" className="overflow-hidden bg-pearl py-24 sm:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[.9fr_1.4fr]">
        <div className="text-center lg:text-left">
          <p className="reveal kicker text-ember-700">Habilidades · Tecnologías</p>
          <h2 className="reveal mt-3 font-display text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.02] font-semibold tracking-tight text-sapphire-900">Mi <em className="font-serif font-normal text-ember-600 italic">stack</em> de trabajo</h2>
          <p className="reveal mt-3 mb-8 text-stone">Toca o pasa el cursor por una tecla para ver para qué uso cada herramienta.</p>

          <div key={panelKey} className="reveal panel-in mx-auto min-h-[190px] max-w-lg rounded-3xl bg-sapphire-900 p-6 text-left shadow-[0_30px_50px_-30px_rgba(11,29,71,.8)]" aria-live="polite">
            <span className="mb-4 inline-grid h-12 min-w-12 place-items-center rounded-xl px-2 font-mono text-sm font-bold text-pearl" style={{ background: current ? sideColor[current.color] : "#ff5a12" }}>
              {current ? current.label : "⌨️"}
            </span>
            <h3 className="font-display text-lg font-semibold text-pearl">{current ? current.name : "Mi teclado de tecnologías"}</h3>
            <p className="mt-1 text-sapphire-200">{current ? current.description : "Cada tecla es una herramienta que uso para construir software. Explóralas."}</p>
          </div>
        </div>

        <div className="reveal grid place-items-center py-8 [perspective:1400px]">
          <div
            ref={board}
            role="group"
            aria-label="Tecnologías"
            className="keyboard relative grid grid-cols-[repeat(6,var(--key))] gap-[var(--gap)] rounded-[22px] bg-gradient-to-br from-sapphire-700 to-sapphire-950 p-[calc(var(--gap)*2.2)] max-[480px]:[--gap:6px] max-[480px]:[--key:40px]"
          >
            {stackKeys.map((k, i) => (
              <button
                key={k.name}
                type="button"
                data-c={k.color}
                aria-label={`${k.name}: ${k.description}`}
                onPointerEnter={() => show(i)}
                onFocus={() => show(i)}
                onClick={() => press(i)}
                className={`key ${selected === i ? "active" : ""} ${pressed === i ? "pressed" : ""}`}
              >
                {[0, 2, 4, 6, 8, 10].map((z) => <span key={z} className="key-layer" style={{ ["--z" as string]: z }} />)}
                <span className="key-top"><b>{k.label}</b></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
