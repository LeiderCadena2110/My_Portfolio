"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import Icon from "./Icons";

/* =============================================================================
   7. CONTACTOS
   Correo · LinkedIn · GitHub · (WhatsApp opcional) · formulario con
   validación y mensaje de confirmación. Envía con Formspree si configuras
   profile.formEndpoint; si no, abre la app de correo con el mensaje listo.
   ============================================================================= */
type Fields = { name: string; email: string; message: string };
const empty: Fields = { name: "", email: "", message: "" };

const rules: Record<keyof Fields, (v: string) => string> = {
  name: (v) => (v.trim().length < 2 ? "Escribe tu nombre (mínimo 2 letras)." : ""),
  email: (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Escribe un correo válido (ej. nombre@dominio.com)." : ""),
  message: (v) => (v.trim().length < 10 ? "Cuéntame un poco más (mínimo 10 caracteres)." : ""),
};

/* Hora local de Pasto, se actualiza cada minuto */
function useLocalTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("es-CO", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: profile.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Contact() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<{ text: string; ok?: boolean }>({ text: "" });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const time = useLocalTime();

  const update = (k: keyof Fields, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: rules[k](v) }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = Object.fromEntries((Object.keys(rules) as (keyof Fields)[]).map((k) => [k, rules[k](values[k])])) as Fields;
    setErrors(found);
    const first = (Object.keys(found) as (keyof Fields)[]).find((k) => found[k]);
    if (first) { document.getElementById(first)?.focus(); return setStatus({ text: "Revisa los campos marcados.", ok: false }); }
    if ((e.currentTarget.elements.namedItem("_gotcha") as HTMLInputElement).value) return; // anti-spam

    if (!profile.formEndpoint) {
      const body = `${values.message}\n\n— ${values.name} (${values.email})`;
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Contacto desde tu portafolio")}&body=${encodeURIComponent(body)}`;
      return setStatus({ text: "✅ Se abrió tu app de correo con el mensaje listo.", ok: true });
    }
    setSending(true);
    setStatus({ text: "Enviando…" });
    try {
      const res = await fetch(profile.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(values) });
      if (!res.ok) throw new Error(String(res.status));
      setValues(empty);
      setStatus({ text: "✅ ¡Mensaje enviado! Te responderé lo antes posible.", ok: true });
    } catch {
      setStatus({ text: `No se pudo enviar. Escríbeme a ${profile.email}`, ok: false });
    } finally {
      setSending(false);
    }
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* el navegador no permite copiar */ }
  };

  const channels = [
    { icon: "linkedin" as const, label: "LinkedIn", href: profile.linkedin },
    { icon: "github" as const, label: "GitHub", href: profile.github },
    ...(profile.whatsapp ? [{ icon: "whatsapp" as const, label: "WhatsApp", href: profile.whatsapp }] : []),
  ];

  const input = (k: keyof Fields) =>
    `w-full rounded-xl border bg-sapphire-950/60 px-4 py-3 text-pearl placeholder-sapphire-300/60 outline-none transition focus:ring-4 focus:ring-ember/20 ${errors[k] ? "border-[#ff8a8a]" : "border-sapphire-700 focus:border-ember"}`;

  return (
    <section id="contacto" data-theme="dark" className="relative overflow-hidden bg-sapphire-900 pt-28 pb-20 text-pearl sm:pt-36">
      <p aria-hidden="true" className="text-ghost pointer-events-none absolute top-[14%] left-1/2 -translate-x-1/2 font-display text-[20vw] leading-none font-bold whitespace-nowrap uppercase">
        Contacto
      </p>

      <div className="relative mx-auto max-w-7xl px-5">
        {/* Encabezado grande, centrado */}
        <div className="text-center">
          <p className="reveal kicker text-sapphire-300">¿Hablamos?</p>
          <p className="reveal mt-2 kicker text-sapphire-300" suppressHydrationWarning>
            {profile.city} <span className="text-ember">/</span> {time || "--:--"} COT
          </p>
          <h2 className="reveal mt-6 font-display text-[clamp(3rem,10vw,8rem)] leading-[.9] font-bold tracking-tight uppercase">
            Trabajemos
            <br />
            <span className="font-serif font-normal tracking-normal text-ember normal-case italic">juntos</span>
          </h2>
          <p className="reveal mx-auto mt-8 max-w-xl text-sapphire-200">
            Estoy buscando prácticas y proyectos donde aprender con un equipo. Si tienes una idea, una vacante o
            una pregunta sobre alguno de mis proyectos, escríbeme.
          </p>
          <div className="reveal mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${profile.email}`} className="arrow-link inline-flex items-center gap-2 border-b border-ember pb-1 text-lg font-medium break-all hover:text-ember sm:text-xl">
              {profile.email} <Icon name="external" className="size-4" />
            </a>
            <button type="button" onClick={copy} className="ripple rounded-full border border-sapphire-700 px-3.5 py-1.5 kicker transition hover:border-ember hover:text-ember">
              {copied ? "¡Copiado!" : "Copiar"}
            </button>
          </div>
        </div>

        <div className="mt-20 grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]">
          {/* Datos y redes */}
          <div className="reveal grid gap-8">
            <div>
              <p className="kicker text-sapphire-300">Dónde estoy</p>
              <p className="mt-2 flex items-center gap-2 text-lg"><Icon name="pin" className="size-5 text-ember" /> {profile.location}</p>
            </div>
            <div>
              <p className="kicker text-sapphire-300">Redes</p>
              <ul className="mt-3 grid gap-2">
                {channels.map((c) => (
                  <li key={c.label}>
                    <a href={c.href} target="_blank" rel="noopener noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-sapphire-800 px-5 py-4 transition hover:border-ember hover:bg-sapphire-800">
                      <span className="flex items-center gap-3"><Icon name={c.icon} /> {c.label}</span>
                      <Icon name="external" className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={submit} noValidate className="reveal grid gap-4 rounded-[28px] bg-sapphire-800/60 p-6 ring-1 ring-sapphire-700 backdrop-blur sm:p-9">
            <h3 className="font-display text-2xl font-semibold">Envíame un mensaje</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(["name", "email"] as const).map((k) => (
                <label key={k} className="grid min-w-0 gap-1.5 text-sm font-medium">
                  {k === "name" ? "Nombre" : "Correo"}
                  <input id={k} name={k} type={k === "email" ? "email" : "text"} required autoComplete={k} value={values[k]}
                    onChange={(e) => update(k, e.target.value)} onBlur={(e) => setErrors((s) => ({ ...s, [k]: rules[k](e.target.value) }))}
                    placeholder={k === "name" ? "Tu nombre" : "tu@correo.com"} aria-invalid={!!errors[k]} aria-describedby={`${k}-err`} className={input(k)} />
                  <small id={`${k}-err`} className="min-h-4 text-xs font-normal text-[#ffb0b0]" aria-live="polite">{errors[k]}</small>
                </label>
              ))}
            </div>
            <label className="grid gap-1.5 text-sm font-medium">
              Mensaje
              <textarea id="message" name="message" rows={5} required value={values.message}
                onChange={(e) => update("message", e.target.value)} onBlur={(e) => setErrors((s) => ({ ...s, message: rules.message(e.target.value) }))}
                placeholder="Cuéntame sobre tu proyecto o vacante…" aria-invalid={!!errors.message} aria-describedby="message-err" className={`${input("message")} resize-y`} />
              <small id="message-err" className="min-h-4 text-xs font-normal text-[#ffb0b0]" aria-live="polite">{errors.message}</small>
            </label>
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
            <button type="submit" disabled={sending}
              className="ripple inline-flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 font-bold text-sapphire-950 transition hover:-translate-y-0.5 hover:bg-ember-600 disabled:opacity-70">
              {sending ? "Enviando…" : "Enviar mensaje"} <Icon name="arrow" className="size-4" />
            </button>
            <p role="status" aria-live="polite" className={`min-h-5 text-center text-sm font-medium ${status.ok === true ? "text-[#7ee2a8]" : status.ok === false ? "text-[#ffb0b0]" : "text-sapphire-300"}`}>
              {status.text}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
