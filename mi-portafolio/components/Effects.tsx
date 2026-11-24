"use client";

import { useEffect, useRef } from "react";

/* =============================================================================
   Efectos globales (un solo componente para no repetir código):
   - Barra de progreso de scroll en la parte superior
   - Scroll reveal: todo elemento con className="reveal" aparece al entrar en pantalla
   - Efecto onda en elementos con className="ripple"
   - Cursor personalizado (solo con mouse)
   ============================================================================= */
export default function Effects() {
  const bar = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // --- Barra de progreso ---
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    // --- Scroll reveal ---
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
          // al terminar, quita el retraso para que el hover responda al instante
          setTimeout(() => ((e.target as HTMLElement).style.transitionDelay = "0s"), 1100);
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // --- Efecto onda ---
    const onDown = (e: PointerEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLElement>(".ripple");
      if (!btn || reduce) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const wave = document.createElement("span");
      wave.className = "ripple-wave";
      Object.assign(wave.style, {
        width: `${size}px`, height: `${size}px`,
        left: `${e.clientX - r.left - size / 2}px`, top: `${e.clientY - r.top - size / 2}px`,
      });
      btn.appendChild(wave);
      wave.addEventListener("animationend", () => wave.remove());
    };
    document.addEventListener("pointerdown", onDown);

    // --- Cursor personalizado ---
    let raf = 0;
    const fine = window.matchMedia("(pointer: fine)").matches;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    const onMove = (e: PointerEvent) => { tx = e.clientX; ty = e.clientY; dot.current?.classList.add("on"); };
    const onOver = (e: PointerEvent) =>
      dot.current?.classList.toggle("hover", !!(e.target as HTMLElement).closest("a, button, input, textarea, .key"));
    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove);
      document.addEventListener("pointerover", onOver);
      const follow = () => {
        cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
        if (dot.current) dot.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
        raf = requestAnimationFrame(follow);
      };
      follow();
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={bar} aria-hidden="true" className="fixed inset-x-0 top-0 z-[200] h-[3px] origin-left scale-x-0 bg-ember" />
      <div ref={dot} aria-hidden="true" className="cursor-dot" />
    </>
  );
}
