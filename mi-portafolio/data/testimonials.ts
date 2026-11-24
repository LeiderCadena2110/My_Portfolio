import type { Testimonial } from "./types";

/* =============================================================================
   ✏️ TESTIMONIOS — la guía exige MÍNIMO 3.
   Deben ser reales: pídele 2 o 3 frases a un profesor, a un compañero de
   proyecto y a tu jefe. Cuando tengas cada uno, reemplaza el texto,
   el nombre y cambia `pending: true` por `pending: false`.
   (Mientras esté en true se muestra como "Pendiente de confirmar".)
   ============================================================================= */
export const testimonials: Testimonial[] = [
  {
    name: "Nombre del profesor/a",
    role: "Profesor/a · Universidad Cooperativa de Colombia",
    text: "Aquí va lo que tu profesor o profesora opina de tu trabajo en clase y en tus proyectos.",
    pending: true,
  },
  {
    name: "Samuel Moreno",
    role: "Compañero · Nexus-7 y API de emergencias",
    // ✏️ Borrador: envíaselo a Samuel. Cuando te diga que está de acuerdo (o lo corrija), pon pending: false
    text: "Trabajar con Leider es fácil: se organiza con ramas y pull requests, cumple lo que le toca y siempre está dispuesto a ayudar cuando algo se traba. En Nexus-7 y en la API de emergencias fue clave para sacar el proyecto a tiempo.",
    pending: true,
  },
  {
    name: "Jhon Ceballos Valencia",
    role: "Propietario · Flaco Sports",
    // ✏️ Borrador: envíaselo a tu jefe. Cuando te diga que está de acuerdo (o lo corrija), pon pending: false
    text: "Leider es responsable y puntual, y trata a los clientes con mucha amabilidad. Combina el trabajo con la universidad sin descuidar ninguno de los dos, y siempre está pendiente del inventario y de que todo esté en orden.",
    pending: true,
  },
];
