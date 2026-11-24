import type { ExperienceItem } from "./types";

/* =============================================================================
   ✏️ EXPERIENCIA — la guía exige académica 🎓 y laboral 💼,
   con fechas de inicio y fin, de lo MÁS RECIENTE a lo más antiguo.
   ⚠️ Cambia los "20XX" por tus fechas reales.
   ============================================================================= */
export const experience: ExperienceItem[] = [
  // ---------- Académica ----------
  {
    type: "academica",
    title: "Ingeniería de Software",
    place: "Universidad Cooperativa de Colombia · Pasto",
    date: "20XX — Actual",
    description:
      "Curso quinto semestre. Aquí aprendí a diseñar antes de programar: arquitectura de software, bases de datos relacionales, patrones de diseño, frameworks backend y cloud. También llevo materias de gestión como ingeniería económica y formulación de proyectos.",
    highlights: ["Arquitectura de software", "Bases de datos", "Patrones de diseño", "Cloud computing"],
  },
  {
    type: "academica",
    title: "Proyecto final · API de emergencias",
    place: "Electiva 1 · Universidad Cooperativa de Colombia",
    date: "2026",
    description:
      "Construí en equipo una API REST para gestionar emergencias. Me encargué de la base del proyecto, la configuración, el manejo de errores y la documentación.",
    highlights: ["Trabajo en equipo con Git", "Manejo global de errores", "Documentación de la API"],
    stack: ["NestJS", "TypeORM", "PostgreSQL"],
  },
  {
    type: "academica",
    title: "Arquitectura cloud de alta disponibilidad",
    place: "Proyecto académico · AWS",
    date: "2026",
    description:
      "Diseñé, monté y sustenté un sistema de matrícula universitaria que sigue funcionando aunque falle un servidor: balanceador de carga, escalado automático y base de datos replicada en dos zonas.",
    highlights: ["Alta disponibilidad", "Escalado automático", "Base de datos Multi-AZ"],
    stack: ["EC2", "ALB", "Auto Scaling", "RDS", "Lambda"],
  },
  // ---------- Laboral ----------
  {
    type: "laboral",
    title: "Desarrollador de proyectos propios",
    place: "Independiente",
    date: "2026 — Actual",
    description:
      "Desarrollé y publiqué tres apps completas, de punta a punta: Minga App (celular), StockFlow (escritorio) y HidraSmart (reloj y celular). También colaboré con Samuel Moreno en el videojuego Escape Espacial: Nexus-7, hecho en Unity.",
    highlights: ["Código en GitHub con pull requests", "Instaladores y APK automáticos", "Servidores en Render y Neon"],
    stack: ["Node.js", "Java", "Kotlin", "C#", "PostgreSQL", "GitHub Actions"],
  },
  {
    type: "laboral",
    title: "Asesor comercial",
    place: "Flaco Sports · Pasto",
    date: "20XX — Actual",
    description:
      "Trabajo en un local de calzado mientras estudio: atiendo clientes, vendo y ayudo con el inventario. Ver de cerca cómo funciona un negocio me sirvió para diseñar StockFlow pensando en lo que de verdad se necesita.",
    highlights: ["Atención al cliente", "Ventas e inventario", "Responsabilidad y puntualidad"],
  },
];
