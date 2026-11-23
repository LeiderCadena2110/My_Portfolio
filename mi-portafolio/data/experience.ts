import type { ExperienceItem } from "./types";

/* =============================================================================
   ✏️ EXPERIENCIA — la guía exige académica 🎓 y laboral 💼,
   con fechas de inicio y fin, de lo MÁS RECIENTE a lo más antiguo.
   Cambia los "20XX" por tus fechas reales.
   ============================================================================= */
export const experience: ExperienceItem[] = [
  // ---------- Académica ----------
  {
    type: "academica",
    title: "Ingeniería de Software · 5.º semestre",
    place: "Universidad Cooperativa de Colombia · Pasto",
    date: "20XX – Hoy",
    description:
      "Arquitectura de software, bases de datos, frameworks backend, cloud computing, ingeniería económica y formulación de proyectos.",
  },
  {
    type: "academica",
    title: "Proyecto final Electiva 1 · API con NestJS",
    place: "Universidad Cooperativa de Colombia",
    date: "2026",
    description:
      "API REST en equipo con NestJS y TypeORM: base del proyecto, configuración, manejo de errores y documentación.",
  },
  {
    type: "academica",
    title: "Arquitectura cloud de alta disponibilidad",
    place: "Proyecto académico · AWS",
    date: "2026",
    description: "Diseño, despliegue y sustentación de un sistema de matrícula con EC2, ALB, Auto Scaling, RDS Multi-AZ y Lambda.",
  },
  // ---------- Laboral ----------
  {
    type: "laboral",
    title: "Asesor comercial",
    place: "Flaco Sports · Pasto",
    date: "20XX – Hoy",
    description:
      "Atención al cliente, ventas e inventario mientras estudio. Comunicación, responsabilidad y entender lo que necesita un negocio real.",
  },
  {
    type: "laboral",
    title: "Desarrollo de proyectos propios",
    place: "Independiente",
    date: "2026",
    description:
      "Minga App (móvil), HidraSmart (reloj y celular) y StockFlow (escritorio): código en GitHub, APK e instaladores automáticos y servidores en Render y Neon.",
  },
];
