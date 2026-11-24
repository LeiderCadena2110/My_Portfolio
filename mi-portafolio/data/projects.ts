import type { Project } from "./types";

/* =============================================================================
   ✏️ MIS PROYECTOS
   Agregar un proyecto = agregar un objeto a este arreglo.
   La guía exige en cada proyecto: imagen, título, descripción, tecnologías,
   link a GitHub y link a la demo (se abren en una pestaña nueva).
   Las demos viven en este mismo portafolio: app/demos/<slug>/page.tsx
   ============================================================================= */
export const projects: Project[] = [
  {
    slug: "minga",
    title: "Minga App",
    category: "App móvil · Full-stack · IA",
    year: "2026",
    description:
      "App que conecta a los campesinos de Nariño con compradores de Pasto, sin intermediarios. El comprador arma su canasta por finca y sigue su pedido; el productor publica su cosecha y recibe los pedidos en su panel.",
    highlights: [
      "Campi, un asistente de compras con IA que arma mercados con un presupuesto",
      "API REST con Express 5, Drizzle ORM y PostgreSQL en Neon",
      "Roles de comprador, productor y administrador con JWT",
      "APK generado automáticamente con GitHub Actions",
    ],
    tags: ["Ionic", "Angular", "Capacitor", "Express", "PostgreSQL", "Gemini"],
    github: "https://github.com/LeiderCadena2110/AppMovil_MercadoCampesino",
    demo: "/demos/minga",
    extra: [{ label: "APK", href: "https://github.com/LeiderCadena2110/AppMovil_MercadoCampesino/releases/latest" }],
    cover: { kind: "phone", src: "/demos/minga/03-buyer-home.webp" },
  },
  {
    slug: "stockflow",
    title: "StockFlow",
    category: "Escritorio · Inventario y facturación",
    year: "2026",
    description:
      "Aplicación de escritorio para que un negocio pequeño controle su inventario y facture sus ventas, incluso sin internet. Funciona en Windows, macOS y Linux con un instalador para cada uno.",
    highlights: [
      "Punto de venta con IVA, facturas en PDF y consecutivo propio",
      "Kardex con costo promedio ponderado y alertas de stock bajo",
      "Asistente con IA que lee las facturas de los proveedores",
      "Arquitectura hexagonal y más de 110 pruebas automáticas",
    ],
    tags: ["Java 21", "JavaFX", "Spring Boot", "H2 + Flyway", "PDFBox", "Gemini"],
    github: "https://github.com/LeiderCadena2110/App_Escritorio",
    demo: "/demos/stockflow",
    extra: [{ label: "Instaladores", href: "https://github.com/LeiderCadena2110/App_Escritorio/releases" }],
    cover: { kind: "window", src: "/demos/stockflow/01-dashboard.webp" },
  },
  {
    slug: "hidrasmart",
    title: "HidraSmart",
    category: "Wear OS + Android · IA",
    year: "2026",
    description:
      "App para reloj inteligente y celular que le avisa al deportista cuándo y cuánto tomar agua mientras entrena, según su peso, la altitud y su frecuencia cardíaca.",
    highlights: [
      "Cálculo de hidratación basado en la guía NATA 2017",
      "Interfaz para el reloj con Wear Compose y Material 3",
      "Coach con IA (Gemini) desde un servidor propio en Render",
      "APK del reloj y del celular en cada versión publicada",
    ],
    tags: ["Kotlin", "Wear Compose", "Android", "Node.js", "Render", "Gemini"],
    github: "https://github.com/LeiderCadena2110/App_Smartwatch",
    demo: "/demos/hidrasmart",
    extra: [{ label: "APK", href: "https://github.com/LeiderCadena2110/App_Smartwatch/releases" }],
    cover: { kind: "watch", src: "/demos/hidrasmart/02-home.webp" },
  },
  {
    slug: "nexus",
    title: "Escape Espacial: Nexus-7",
    category: "Videojuego · Unity · Sigilo",
    year: "2026",
    description:
      "Juego de sigilo en primera y tercera persona: despiertas en una nave tomada por robots y tienes que llegar a la cápsula de escape antes de la autodestrucción, escondiéndote, fabricando dispositivos y hackeando sistemas.",
    highlights: [
      "6 fases, cada una con su objetivo, enemigos y cinemáticas",
      "Director con IA que ajusta la dificultad según cómo juegas",
      "Inventario, fabricación, hackeo y red eléctrica de la nave",
      "Más de 1 190 pruebas automáticas que corren sin abrir Unity",
    ],
    tags: ["Unity 6", "C#", "URP", "TextMeshPro", "Pruebas con Mono"],
    github: "https://github.com/moreno-stack/Nexuz-7",
    demo: "/demos/nexus",
    cover: { kind: "window", src: "/demos/nexus/02-main-menu.webp" },
    collaboration: { role: "Colaborador", with: "Samuel Moreno", owner: "moreno-stack" },
  },
];
