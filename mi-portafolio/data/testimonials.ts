import type { Testimonial } from "./types";

/* =============================================================================
   ✏️ TESTIMONIOS — la guía exige MÍNIMO 3.
   Deben ser reales: pídele 2 o 3 frases a un profesor, a un compañero de
   proyecto y a tu jefe. Cuando tengas cada uno, reemplaza el texto,
   el nombre y cambia `pending: true` por `pending: false`.
   (Mientras esté en true se muestra como "Testimonio pendiente".)
   ============================================================================= */
export const testimonials: Testimonial[] = [
  {
    name: "Nombre del profesor/a",
    role: "Profesor/a · Universidad Cooperativa de Colombia",
    text: "Aquí va lo que tu profesor o profesora opina de tu trabajo en clase y en tus proyectos.",
    pending: true,
  },
  {
    name: "Nombre del compañero/a",
    role: "Compañero · Proyecto final Electiva 1",
    text: "Aquí va lo que opina un compañero con quien trabajaste en equipo (por ejemplo en la API de emergencias).",
    pending: true,
  },
  {
    name: "Nombre de tu jefe",
    role: "Jefe · Experiencia laboral",
    text: "Aquí va lo que opina tu jefe sobre tu responsabilidad, puntualidad y trato con los clientes.",
    pending: true,
  },
];
