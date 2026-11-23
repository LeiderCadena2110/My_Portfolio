"use client";

import { useState } from "react";
import { profile } from "@/data/profile";
import Globe from "./Globe";
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

export default function Contact() {
  const [values, setValues] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [status, setStatus] = useState<{ text: string; ok?: boolean }>({ text: "" });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

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
      setStatus({ text: "✅ ¡Mensaje enviado! Te responderé pronto.", ok: true });
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
    { icon: "linkedin" as const, label: "LinkedIn", value: "in/leider-cadena", href: profile.linkedin },
    { icon: "github" as const, label: "GitHub", value: profile.githubUser, href: profile.github },
    ...(profile.whatsapp ? [{ icon: "whatsapp" as const, label: "WhatsApp", value: "Escríbeme", href: profile.whatsapp }] : []),
  ];

  const input = (k: keyof Fields) =>
    `w-full rounded-xl border bg-navy/60 px-4 py-3 text-snow placeholder-haze/60 outline-none transition focus:bg-navy2/60 focus:ring-4 focus:ring-brand-light/20 ${errors[k] ? "border-red-400" : "border-white/15 focus:border-brand-light"}`;

  return (
    <section id="contacto" className="overflow-hidden bg-[radial-gradient(ellipse_50%_60%_at_80%_60%,rgba(37,99,235,.55),transparent_70%),linear-gradient(180deg,#1e3a8a,#172554)] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <p className="reveal font-mono text-sm tracking-widest text-mint uppercase">06 — Contacto</p>
        <h2 className="reveal mt-2 font-display text-[clamp(2.4rem,8vw,6.5rem)] leading-[.95] font-extrabold text-snow uppercase">
          Trabajemos <span className="text-outline text-sun">juntos</span>
        </h2>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
          <div className="reveal grid gap-6">
            {/* Medios directos */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-ink/60 p-4">
              <span className="grid size-11 place-items-center rounded-xl bg-brand/25 text-brand-light"><Icon name="mail" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-haze">Correo electrónico</p>
                <a href={`mailto:${profile.email}`} className="font-semibold break-all text-snow hover:text-brand-light">{profile.email}</a>
              </div>
              <button type="button" onClick={copy} className="ripple rounded-full border border-white/20 px-4 py-2 text-sm font-bold text-snow transition hover:border-mint hover:text-mint">
                {copied ? "¡Copiado!" : "Copiar"}
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {channels.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="lift flex items-center gap-3 rounded-2xl border border-white/15 bg-ink/60 p-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-brand/25 text-brand-light"><Icon name={c.icon} /></span>
                  <span><span className="block text-xs text-haze">{c.label}</span><b className="text-snow">{c.value}</b></span>
                </a>
              ))}
            </div>

            {/* Formulario */}
            <form onSubmit={submit} noValidate className="grid gap-4 rounded-3xl border border-white/15 bg-ink/70 p-6 backdrop-blur sm:p-8">
              <h3 className="font-display text-lg font-bold text-snow">Escríbeme un mensaje</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {(["name", "email"] as const).map((k) => (
                  <label key={k} className="grid min-w-0 gap-1.5 text-sm font-medium text-snow">
                    {k === "name" ? "Nombre" : "Correo"}
                    <input id={k} name={k} type={k === "email" ? "email" : "text"} required autoComplete={k} value={values[k]}
                      onChange={(e) => update(k, e.target.value)} onBlur={(e) => setErrors((s) => ({ ...s, [k]: rules[k](e.target.value) }))}
                      placeholder={k === "name" ? "Tu nombre" : "tu@correo.com"} aria-invalid={!!errors[k]} aria-describedby={`${k}-err`} className={input(k)} />
                    <small id={`${k}-err`} className="min-h-4 text-xs font-normal text-red-300" aria-live="polite">{errors[k]}</small>
                  </label>
                ))}
              </div>
              <label className="grid gap-1.5 text-sm font-medium text-snow">
                Mensaje
                <textarea id="message" name="message" rows={5} required value={values.message}
                  onChange={(e) => update("message", e.target.value)} onBlur={(e) => setErrors((s) => ({ ...s, message: rules.message(e.target.value) }))}
                  placeholder="Cuéntame sobre tu proyecto o vacante…" aria-invalid={!!errors.message} aria-describedby="message-err" className={`${input("message")} resize-y`} />
                <small id="message-err" className="min-h-4 text-xs font-normal text-red-300" aria-live="polite">{errors.message}</small>
              </label>
              <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px]" />
              <button type="submit" disabled={sending} className="ripple inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 font-bold text-snow shadow-[0_10px_30px_-10px_rgba(37,99,235,.9)] transition hover:-translate-y-0.5 hover:bg-brand-dark disabled:opacity-70">
                {sending ? "Enviando…" : "Enviar mensaje"} <Icon name="arrow" className="size-4" />
              </button>
              <p role="status" aria-live="polite" className={`min-h-5 text-center text-sm font-medium ${status.ok === true ? "text-emerald-300" : status.ok === false ? "text-red-300" : "text-haze"}`}>
                {status.text}
              </p>
            </form>
          </div>

          {/* Globo 3D: marca Pasto y sus conexiones */}
          <div className="reveal relative grid place-items-center">
            <Globe />
            <p className="absolute bottom-[4%] flex items-center gap-2 rounded-full border border-white/15 bg-ink/80 px-4 py-2 text-sm text-snow">
              <i className="ping-soft size-2.5 rounded-full bg-sun" /> {profile.location} · Disponible remoto
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
