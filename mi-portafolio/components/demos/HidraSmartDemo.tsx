"use client";

import { useEffect, useRef, useState } from "react";

/* =============================================================================
   DEMO · HIDRASMART — hidratación inteligente para Wear OS
   Reproduce las pantallas del reloj (Kotlin + Wear Compose):
   inicio con anillo de progreso, registrar toma, entrenamiento con alertas,
   resumen, coach IA (modo local), planear y historial.
   Cálculo: guía NATA 2017 + factor de ajuste (altitud, calor, humedad, FC).
   MODO DEMO: las alertas llegan cada 20 segundos (en el reloj real cada 15 min).
   ============================================================================= */

// Colores reales de la app (wear/ui/theme/Theme.kt)
const W = { blue: "#1E88E5", water: "#0288D1", light: "#4FC3F7", green: "#2E7D32", gray: "#616161", amber: "#F9A825", red: "#C62828", dark: "#1c2d42", ai: "#7E57C2", aiLight: "#B39DDB" };

const GOAL = 2500; // meta diaria (ml)
const SWEAT_RATE = 1.0; // L/h, de la prueba de sudoración
const INTERVAL_MIN = 15; // minutos entre alertas en el reloj real
const DEMO_SECONDS = 20; // segundos entre alertas en esta demo
const MAX_HR = 195;

type Screen = "home" | "log" | "custom" | "ok" | "type" | "session" | "alert" | "end" | "summary" | "coach" | "plan" | "history";
type Session = { type: string; elapsed: number; paused: boolean; drank: number; nextIn: number; hr: number; hrSum: number; ticks: number; alerts: number };
type Summary = { type: string; minutes: number; drank: number; recommended: number; avgHr: number; alerts: number };

const fmt = (n: number) => n.toLocaleString("es-CO");
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/* Factor f (1,0 a 1,3): +0,1 por cada condición más exigente que la prueba */
function factor(hr: number) {
  let f = 1.0;
  f += 0.1; // Pasto está a ~2.500 m de altitud (> 500 m)
  if (hr > MAX_HR * 0.85) f += 0.1;
  return Math.min(1.3, f);
}
/* ml por alerta = tasa × f × 1000 × (intervalo / 60), redondeado a 10 ml */
const mlPerAlert = (hr: number) => Math.round((SWEAT_RATE * factor(hr) * 1000 * (INTERVAL_MIN / 60)) / 10) * 10;

export default function HidraSmartDemo() {
  const [screen, setScreen] = useState<Screen>("home");
  const [today, setToday] = useState(1250);
  const [lastMl, setLastMl] = useState(0);
  const [custom, setCustom] = useState(300);
  const [session, setSession] = useState<Session | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [history] = useState([2380, 2610, 1950, 2500, 2720, 2100]);
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  // Motor de la sesión: cada segundo avanza el tiempo, simula la FC y cuenta regresiva
  useEffect(() => {
    if (!session || session.paused || screen === "alert" || screen === "end") return;
    tick.current = setInterval(() => {
      setSession((s) => {
        if (!s) return s;
        const hr = Math.max(95, Math.min(188, s.hr + Math.round((Math.random() - 0.4) * 6)));
        const nextIn = s.nextIn - 1;
        if (nextIn <= 0) { setScreen("alert"); return { ...s, hr, nextIn: DEMO_SECONDS, alerts: s.alerts + 1, elapsed: s.elapsed + 45 }; }
        // 1 segundo de demo = 45 segundos de entrenamiento (20 s de demo ≈ 15 min reales)
        return { ...s, elapsed: s.elapsed + 45, hr, hrSum: s.hrSum + hr, ticks: s.ticks + 1, nextIn };
      });
    }, 1000);
    return () => { if (tick.current) clearInterval(tick.current); };
  }, [session?.paused, screen, !!session]); // eslint-disable-line react-hooks/exhaustive-deps

  const log = (ml: number) => { setToday((t) => t + ml); setLastMl(ml); setScreen("ok"); setTimeout(() => setScreen((s) => (s === "ok" ? "home" : s)), 1600); };
  const start = (type: string) => { setSession({ type, elapsed: 0, paused: false, drank: 0, nextIn: DEMO_SECONDS, hr: 128, hrSum: 0, ticks: 0, alerts: 0 }); setScreen("session"); };
  const finish = () => {
    if (!session) return;
    const minutes = Math.max(1, Math.round(session.elapsed / 60));
    setSummary({ type: session.type, minutes, drank: session.drank, recommended: Math.round((SWEAT_RATE * factor(session.hr) * 1000 * minutes) / 60 / 10) * 10, avgHr: session.ticks ? Math.round(session.hrSum / session.ticks) : session.hr, alerts: session.alerts });
    setSession(null); setScreen("summary");
  };

  const pct = Math.min(1, today / GOAL);
  const ring = (frac: number, color: string, w = 7) => (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 -rotate-90">
      <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={w / 3.6} />
      <circle cx="50" cy="50" r="47" fill="none" stroke={color} strokeWidth={w / 3.6} strokeLinecap="round" strokeDasharray={`${frac * 295.3} 295.3`} style={{ transition: "stroke-dasharray .6s" }} />
    </svg>
  );
  const Btn = ({ children, color, onClick, small }: { children: React.ReactNode; color: string; onClick: () => void; small?: boolean }) => (
    <button onClick={onClick} className={`w-full rounded-full font-bold text-white transition active:scale-95 ${small ? "py-2 text-xs" : "py-2.5 text-sm"}`} style={{ background: color }}>{children}</button>
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {/* Reloj */}
      <div className="relative">
        <div className="absolute top-1/2 -right-3 h-14 w-4 -translate-y-1/2 rounded-r-lg bg-slate-500" aria-hidden="true" />
        <div className="relative size-[340px] rounded-full border-[14px] border-slate-600 bg-gradient-to-b from-slate-500 to-slate-700 p-1 shadow-[0_40px_80px_-25px_rgba(0,0,0,.8)]">
          <div className="relative size-full overflow-hidden rounded-full text-white" style={{ background: "radial-gradient(circle at 50% 30%, #12324f, #0a1f33 70%)", fontFamily: "system-ui, sans-serif" }}>

            {screen === "home" && (
              <>
                {ring(pct, W.light)}
                <div className="absolute inset-0 overflow-y-auto px-12 pt-9 pb-10 text-center [scrollbar-width:none]">
                  <p className="text-[11px] text-white/60">10:24</p>
                  <p className="mt-1 text-[11px] font-semibold" style={{ color: W.light }}>💧 HidraSmart</p>
                  <p className="text-3xl font-extrabold">{fmt(today)}<span className="text-sm font-normal text-white/60"> ml</span></p>
                  <p className="text-[11px] text-white/60">{today >= GOAL ? "¡Meta cumplida! 🎉" : `de ${fmt(GOAL)} ml`}</p>
                  <div className="mt-3 grid gap-2">
                    <Btn color={W.blue} onClick={() => setScreen("type")}>▶ Entrenar</Btn>
                    <Btn color={W.water} onClick={() => setScreen("log")}>💧 Registrar toma</Btn>
                    <Btn color={W.ai} onClick={() => setScreen("coach")}>✨ Coach IA</Btn>
                    <Btn color={W.dark} onClick={() => setScreen("plan")}>🧭 Planear</Btn>
                    <Btn color={W.dark} onClick={() => setScreen("history")}>📅 Historial</Btn>
                  </div>
                  <p className="mt-3 text-[10px] text-white/50">Desliza ↕</p>
                </div>
              </>
            )}

            {screen === "log" && (
              <div className="grid h-full place-content-center gap-2 px-14 text-center">
                <p className="text-sm font-bold">Registrar toma</p>
                {[150, 250, 500].map((ml) => <Btn key={ml} color={W.water} onClick={() => log(ml)}>+{ml} ml</Btn>)}
                <Btn color={W.dark} small onClick={() => setScreen("custom")}>Otra cantidad</Btn>
                <button onClick={() => setScreen("home")} className="text-xs text-white/60">← Volver</button>
              </div>
            )}

            {screen === "custom" && (
              <div className="grid h-full place-content-center gap-3 px-14 text-center">
                <p className="text-xs text-white/70">Mililitros</p>
                <div className="flex items-center justify-center gap-3">
                  <button onClick={() => setCustom((c) => Math.max(50, c - 50))} className="size-10 rounded-full text-xl" style={{ background: W.dark }}>−</button>
                  <span className="w-20 text-3xl font-extrabold">{custom}</span>
                  <button onClick={() => setCustom((c) => Math.min(1500, c + 50))} className="size-10 rounded-full text-xl" style={{ background: W.dark }}>+</button>
                </div>
                <Btn color={W.green} onClick={() => log(custom)}>Registrar</Btn>
              </div>
            )}

            {screen === "ok" && (
              <div className="grid h-full place-content-center text-center">
                <div className="mx-auto grid size-24 animate-[ping_1s_ease-out_1] place-items-center rounded-full text-4xl" style={{ background: W.green }}>✓</div>
                <p className="mt-4 text-xl font-extrabold">+{lastMl} ml</p>
                <p className="text-xs text-white/60">Guardado en el historial</p>
              </div>
            )}

            {screen === "type" && (
              <div className="grid h-full place-content-center gap-2 px-14 text-center">
                <p className="text-sm font-bold">¿Qué vas a hacer?</p>
                {[["🏃", "Correr"], ["🚴", "Ciclismo"], ["🏋️", "Gimnasio"], ["⚡", "Otro"]].map(([i, t]) => <Btn key={t} color={W.blue} small onClick={() => start(t)}>{i} {t}</Btn>)}
                <button onClick={() => setScreen("home")} className="text-xs text-white/60">← Volver</button>
              </div>
            )}

            {screen === "session" && session && (
              <>
                {ring(1 - session.nextIn / DEMO_SECONDS, W.light, 9)}
                <div className="grid h-full place-content-center px-12 text-center">
                  <p className="text-xs" style={{ color: W.light }}>{session.type}{session.paused && " · en pausa"}</p>
                  <p className="text-4xl font-extrabold tabular-nums">{clock(session.elapsed)}</p>
                  <p className="text-[11px] text-white/60">tiempo de entrenamiento</p>
                  <p className="mt-1 text-sm">❤️ <b>{session.hr}</b> lpm</p>
                  <p className="mt-1 text-[11px] leading-tight text-white/80">Próxima toma en {session.nextIn} s<br />~{mlPerAlert(session.hr)} ml · tomado {session.drank} ml</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Btn small color={W.amber} onClick={() => setSession({ ...session, paused: !session.paused })}>{session.paused ? "Reanudar" : "Pausar"}</Btn>
                    <Btn small color={W.red} onClick={() => setScreen("end")}>Terminar</Btn>
                  </div>
                </div>
              </>
            )}

            {screen === "alert" && session && (
              <div className="grid h-full animate-[wiggle_.5s_ease-in-out_3] place-content-center px-12 text-center" style={{ background: `radial-gradient(circle, ${W.water}, #0a1f33 75%)` }}>
                <p className="text-4xl">💧</p>
                <p className="text-xl font-extrabold">¡Hora de hidratarte!</p>
                <p className="mt-1 text-sm">Toma <b>{mlPerAlert(session.hr)} ml</b></p>
                <p className="text-[10px] text-white/70">FC {session.hr} lpm · factor {factor(session.hr).toFixed(1)}</p>
                <div className="mt-3 grid gap-2">
                  <Btn color={W.green} onClick={() => { const ml = mlPerAlert(session.hr); setSession({ ...session, drank: session.drank + ml }); setToday((t) => t + ml); setScreen("session"); }}>Ya tomé</Btn>
                  <Btn small color={W.gray} onClick={() => { setSession({ ...session, nextIn: 7 }); setScreen("session"); }}>En 5 min</Btn>
                </div>
              </div>
            )}

            {screen === "end" && (
              <div className="grid h-full place-content-center gap-2 px-14 text-center">
                <p className="font-bold">¿Terminar el entrenamiento?</p>
                <Btn color={W.red} onClick={finish}>Sí, terminar</Btn>
                <Btn small color={W.dark} onClick={() => setScreen("session")}>Seguir entrenando</Btn>
              </div>
            )}

            {screen === "summary" && summary && (
              <div className="absolute inset-0 overflow-y-auto px-12 pt-10 pb-10 text-center [scrollbar-width:none]">
                <p className="text-sm font-bold" style={{ color: W.light }}>Resumen · {summary.type}</p>
                <p className="text-3xl font-extrabold">{summary.minutes} min</p>
                <div className="mt-2 grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="rounded-xl p-2" style={{ background: W.dark }}>Tomado<br /><b className="text-sm">{fmt(summary.drank)} ml</b></div>
                  <div className="rounded-xl p-2" style={{ background: W.dark }}>Recomendado<br /><b className="text-sm">{fmt(summary.recommended)} ml</b></div>
                  <div className="rounded-xl p-2" style={{ background: W.dark }}>FC media<br /><b className="text-sm">{summary.avgHr} lpm</b></div>
                  <div className="rounded-xl p-2" style={{ background: W.dark }}>Alertas<br /><b className="text-sm">{summary.alerts}</b></div>
                </div>
                <div className="mt-2 rounded-xl p-2.5 text-left text-[11px] leading-snug" style={{ background: "rgba(126,87,194,.25)", color: W.aiLight }}>
                  <b>✨ Análisis IA</b><br />
                  {summary.drank >= summary.recommended * 0.8
                    ? `Buen trabajo: cubriste el ${Math.round((summary.drank / Math.max(1, summary.recommended)) * 100)} % de lo recomendado. Mantén este ritmo en tus próximas sesiones.`
                    : `Tomaste ${fmt(summary.recommended - summary.drank)} ml menos de lo recomendado. En la próxima sesión responde las alertas con "Ya tomé" y lleva una botella de ${fmt(Math.ceil(summary.recommended / 250) * 250)} ml.`}
                </div>
                <div className="mt-2"><Btn color={W.blue} onClick={() => setScreen("home")}>Listo</Btn></div>
              </div>
            )}

            {screen === "coach" && <Coach today={today} onBack={() => setScreen("home")} />}

            {screen === "plan" && <Plan onBack={() => setScreen("home")} />}

            {screen === "history" && (
              <div className="grid h-full place-content-center px-12 text-center">
                <p className="text-sm font-bold">Historial · 7 días</p>
                <div className="mt-3 flex h-28 items-end justify-center gap-2">
                  {[...history, today].map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="w-5 rounded-t-md" style={{ height: `${(v / 3000) * 100}px`, background: v >= GOAL ? W.green : W.water }} title={`${v} ml`} />
                      <span className="text-[9px] text-white/60">{["L", "M", "M", "J", "V", "S", "Hoy"][i]}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[11px] text-white/70">Meta cumplida {[...history, today].filter((v) => v >= GOAL).length} de 7 días</p>
                <button onClick={() => setScreen("home")} className="mt-2 text-xs text-white/60">← Volver</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tile de Wear OS y explicación del cálculo */}
      <div className="grid max-w-xs gap-4">
        <button onClick={() => { setToday((t) => t + 250); setLastMl(250); }} className="rounded-3xl border border-white/10 bg-ink/80 p-5 text-left transition hover:border-brand-light">
          <p className="text-xs text-haze">Tile del reloj · Hidratación de hoy</p>
          <p className="mt-1 text-2xl font-extrabold">{fmt(today)} ml <span className="text-sm font-normal text-haze">de {fmt(GOAL)}</span></p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: W.light }} /></div>
          <span className="mt-3 inline-block rounded-full px-3 py-1 text-sm font-bold" style={{ background: W.water }}>+250 ml</span>
        </button>
        <div className="rounded-3xl border border-white/10 bg-ink/80 p-5 text-sm text-haze">
          <p className="font-bold text-snow">Cómo calcula la toma (NATA 2017)</p>
          <p className="mt-2 font-mono text-xs">ml = tasa × f × 1000 × (intervalo / 60)</p>
          <p className="mt-2">Tasa de sudoración <b className="text-snow">{SWEAT_RATE} L/h</b> · intervalo <b className="text-snow">{INTERVAL_MIN} min</b> · factor <b className="text-snow">f</b> = 1,0 + 0,1 por altitud de Pasto + 0,1 si la FC pasa el 85 % de la máxima.</p>
          <p className="mt-2 text-xs">⏱️ Modo demo: la alerta llega cada {DEMO_SECONDS} s en lugar de {INTERVAL_MIN} min.</p>
        </div>
      </div>
      <style>{`@keyframes wiggle { 0%,100% { transform: translateX(0) } 25% { transform: translateX(-4px) } 75% { transform: translateX(4px) } }`}</style>
    </div>
  );
}

/* Coach IA: en el reloj real responde Gemini (desde el servidor en Render) y,
   sin internet, el coach local con reglas. Aquí se usa el coach local. */
function Coach({ today, onBack }: { today: number; onBack: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const hour = 10;
  const expected = Math.round((GOAL * (hour - 6)) / 16);
  const qs: [string, string][] = [
    ["Consejo para ahora", today >= expected ? `Vas bien: llevas ${fmt(today)} ml y a esta hora lo esperado es ~${fmt(expected)} ml. Sigue con tomas pequeñas cada hora.` : `Vas ${fmt(expected - today)} ml por debajo del ritmo del día. Toma 250 ml ahora y otros 250 ml en una hora.`],
    ["¿Cuánto tomo antes de correr?", "Entre 2 y 3 horas antes toma unos 500 ml, y 250 ml unos 15 minutos antes de salir. Con tu tasa de sudoración (1,0 L/h) el reloj te avisará cada 15 min."],
    ["¿Llevo bien la racha?", "Cumpliste la meta 3 de los últimos 6 días. Si hoy llegas a 2.500 ml, sumas 2 días seguidos 💪"],
  ];
  return (
    <div className="absolute inset-0 overflow-y-auto px-12 pt-10 pb-10 text-center [scrollbar-width:none]">
      <p className="text-sm font-bold" style={{ color: W.aiLight }}>✨ Coach IA</p>
      {answer ? (
        <>
          <p className="mt-2 rounded-xl p-3 text-left text-xs leading-snug" style={{ background: "rgba(126,87,194,.25)", color: "white" }}>{answer}</p>
          <p className="mt-1 text-[9px] text-white/50">Respuesta de la IA local · sin internet</p>
          <button onClick={() => setAnswer(null)} className="mt-2 w-full rounded-full py-2 text-xs font-bold" style={{ background: W.ai }}>Otra pregunta</button>
        </>
      ) : (
        <div className="mt-2 grid gap-2">
          <p className="text-[11px] text-white/70">¿Qué quieres saber?</p>
          {qs.map(([q, a]) => <button key={q} onClick={() => setAnswer(a)} className="rounded-full py-2 text-xs font-bold" style={{ background: W.ai }}>{q}</button>)}
        </div>
      )}
      <button onClick={onBack} className="mt-2 text-xs text-white/60">← Volver</button>
    </div>
  );
}

/* Planear: el modelo del reloj predice cuánta agua llevar */
function Plan({ onBack }: { onBack: () => void }) {
  const [min, setMin] = useState(60);
  const [hot, setHot] = useState(false);
  const f = Math.min(1.3, 1.1 + (hot ? 0.1 : 0));
  const ml = Math.round((SWEAT_RATE * f * 1000 * min) / 60 / 50) * 50;
  return (
    <div className="grid h-full place-content-center gap-2 px-12 text-center">
      <p className="text-sm font-bold">🧭 Cuánta agua llevar</p>
      <div className="flex items-center justify-center gap-2">
        <button onClick={() => setMin((m) => Math.max(15, m - 15))} className="size-9 rounded-full" style={{ background: W.dark }}>−</button>
        <span className="w-20 text-2xl font-extrabold">{min}<small className="text-xs font-normal"> min</small></span>
        <button onClick={() => setMin((m) => Math.min(240, m + 15))} className="size-9 rounded-full" style={{ background: W.dark }}>+</button>
      </div>
      <button onClick={() => setHot(!hot)} className="rounded-full py-1.5 text-xs font-bold" style={{ background: hot ? W.amber : W.dark }}>{hot ? "☀️ Día caluroso" : "🌥️ Clima normal"}</button>
      <p className="mt-1 text-3xl font-extrabold" style={{ color: W.light }}>{fmt(ml)} ml</p>
      <p className="text-[10px] text-white/60">IA en el reloj · sin internet</p>
      <button onClick={onBack} className="text-xs text-white/60">← Volver</button>
    </div>
  );
}
