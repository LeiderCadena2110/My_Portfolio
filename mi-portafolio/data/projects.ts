import type { Project } from "./types";

/* =============================================================================
   ✏️ MIS PROYECTOS
   Agregar un proyecto = agregar un objeto a este arreglo.
   La guía exige en cada proyecto: link a GitHub y link a Demo en vivo.
   Las demos viven en este mismo portafolio: app/demos/<proyecto>/page.tsx
   ============================================================================= */
export const projects: Project[] = [
  {
    title: "Minga App",
    category: "App móvil · Full-stack · IA",
    description:
      "Conecta a campesinos de Nariño con compradores de Pasto: catálogo por finca, carrito, pedidos con seguimiento y Campi, un asistente de compras con IA. Los productores publican con precio sugerido y descripción escrita por IA.",
    tags: ["Ionic", "Angular", "Capacitor", "Express", "PostgreSQL · Neon", "Gemini"],
    github: "https://github.com/LeiderCadena2110/AppMovil_MercadoCampesino",
    demo: "/demos/minga",
    extra: [{ label: "APK", href: "https://github.com/LeiderCadena2110/AppMovil_MercadoCampesino/releases/latest" }],
    mock: "phone",
    theme: "green",
  },
  {
    title: "HidraSmart",
    category: "Wear OS + Android · IA",
    description:
      "Le avisa al deportista cuándo y cuánto tomar agua durante el entrenamiento, con el cálculo de la guía NATA 2017 ajustado por altitud y frecuencia cardíaca, y un coach de IA con Gemini desde un servidor propio en Render.",
    tags: ["Kotlin", "Wear Compose", "Node.js", "Render", "Gemini"],
    github: "https://github.com/LeiderCadena2110/App_Smartwatch",
    demo: "/demos/hidrasmart",
    extra: [{ label: "APK", href: "https://github.com/LeiderCadena2110/App_Smartwatch/releases" }],
    mock: "watch",
    theme: "blue",
  },
  {
    title: "StockFlow",
    category: "Escritorio · Inventario y facturación",
    description:
      "Controla el inventario y factura las ventas de un negocio pequeño sin internet: punto de venta con IVA, facturas en PDF, kardex con costo promedio, reportes y un asistente de IA que lee facturas de proveedor.",
    tags: ["Java 21", "JavaFX", "Spring Boot", "H2 + Flyway", "Gemini"],
    github: "https://github.com/LeiderCadena2110/App_Escritorio",
    demo: "/demos/stockflow",
    extra: [{ label: "Instaladores", href: "https://github.com/LeiderCadena2110/App_Escritorio/releases" }],
    mock: "desktop",
    theme: "slate",
  },
];
