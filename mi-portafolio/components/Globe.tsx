"use client";

import { useEffect, useRef } from "react";

/* =============================================================================
   Globo 3D dibujado en <canvas> (sin librerías).
   Puntos sobre la esfera + arcos animados desde Pasto. Se puede arrastrar.
   ✏️ Cambia HOME (tu ciudad) y CITIES (ciudades conectadas) en [lat, lon].
   ============================================================================= */
const HOME: [number, number] = [1.21, -77.28]; // Pasto
const CITIES: [number, number][] = [[4.71, -74.07], [19.43, -99.13], [40.71, -74.0], [40.42, -3.7], [-23.55, -46.63], [47.6, -122.33], [51.5, -0.12]];

type V3 = [number, number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const toVec = ([lat, lon]: [number, number]): V3 => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))];
const slerp = (a: V3, b: V3, t: number): V3 => {
  const d = Math.acos(Math.min(Math.max(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1), 1));
  const s = Math.sin(d) || 1, k1 = Math.sin((1 - t) * d) / s, k2 = Math.sin(t * d) / s;
  return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
};

export default function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = 560 * DPR;
    const S = canvas.width, R = S * 0.4, C = S / 2;

    // Puntos uniformes sobre la esfera (espiral de Fibonacci)
    const dots: V3[] = Array.from({ length: 900 }, (_, i) => {
      const y = 1 - (i / 899) * 2, r = Math.sqrt(1 - y * y), th = i * 2.39996323;
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    const home = toVec(HOME), cities = CITIES.map(toVec);

    let rotY = rad(77), tilt = rad(-12), visible = false, raf = 0;
    let drag: { x: number; y: number } | null = null;

    const project = ([x, y, z]: V3, lift = 1): V3 => {
      const cy = Math.cos(rotY), sy = Math.sin(rotY);
      const X = x * cy + z * sy; let Z = -x * sy + z * cy;
      const ct = Math.cos(tilt), st = Math.sin(tilt);
      const Y = y * ct - Z * st; Z = y * st + Z * ct;
      return [C + X * R * lift, C - Y * R * lift, Z];
    };

    const draw = (time: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      if (!drag && !reduce) rotY += 0.0025;
      ctx.clearRect(0, 0, S, S);

      const atm = ctx.createRadialGradient(C, C, R * 0.9, C, C, R * 1.25);
      atm.addColorStop(0, "rgba(96,165,250,.45)"); atm.addColorStop(1, "rgba(96,165,250,0)");
      ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(C, C, R * 1.25, 0, Math.PI * 2); ctx.fill();
      const sphere = ctx.createRadialGradient(C - R * 0.35, C - R * 0.4, R * 0.1, C, C, R);
      sphere.addColorStop(0, "#3B82F6"); sphere.addColorStop(0.55, "#1E3A8A"); sphere.addColorStop(1, "#172554");
      ctx.fillStyle = sphere; ctx.beginPath(); ctx.arc(C, C, R, 0, Math.PI * 2); ctx.fill();

      for (const d of dots) {
        const [x, y, z] = project(d);
        if (z < 0) continue;
        ctx.fillStyle = `rgba(219,234,254,${0.15 + z * 0.55})`;
        ctx.fillRect(x, y, 1.6 * DPR, 1.6 * DPR);
      }

      const t = (time / 2400) % 1;
      cities.forEach((city, ci) => {
        ctx.beginPath();
        let started = false;
        for (let s = 0; s <= 1.0001; s += 0.04) {
          const [x, y, z] = project(slerp(home, city, s), 1 + Math.sin(Math.PI * s) * 0.22);
          if (z < -0.15) { started = false; continue; }
          if (started) ctx.lineTo(x, y); else { ctx.moveTo(x, y); started = true; }
        }
        ctx.strokeStyle = "rgba(16,185,129,.55)"; ctx.lineWidth = 1.4 * DPR; ctx.stroke();
        const head = (t + ci * 0.13) % 1;
        const [px, py, pz] = project(slerp(home, city, head), 1 + Math.sin(Math.PI * head) * 0.22);
        if (pz > -0.15) { ctx.fillStyle = "#FBBF24"; ctx.beginPath(); ctx.arc(px, py, 3 * DPR, 0, Math.PI * 2); ctx.fill(); }
      });

      const [hx, hy, hz] = project(home);
      if (hz > 0) {
        const p = (time / 1400) % 1;
        ctx.strokeStyle = `rgba(245,158,11,${1 - p})`; ctx.lineWidth = 2 * DPR;
        ctx.beginPath(); ctx.arc(hx, hy, (6 + p * 22) * DPR, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = "#F59E0B"; ctx.beginPath(); ctx.arc(hx, hy, 5 * DPR, 0, Math.PI * 2); ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    // Solo se anima mientras está en pantalla (ahorra batería)
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const down = (e: PointerEvent) => { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (!drag) return;
      rotY += (e.clientX - drag.x) * 0.008;
      tilt = Math.min(Math.max(tilt + (e.clientY - drag.y) * 0.004, -1), 1);
      drag = { x: e.clientX, y: e.clientY };
    };
    const up = () => (drag = null);
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => { cancelAnimationFrame(raf); io.disconnect(); canvas.removeEventListener("pointerdown", down); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerup", up); canvas.removeEventListener("pointercancel", up); };
  }, []);

  return <canvas ref={ref} role="img" aria-label="Globo terráqueo animado que marca Pasto, Colombia" className="aspect-square w-[min(520px,100%)] cursor-grab touch-pan-y active:cursor-grabbing" />;
}
