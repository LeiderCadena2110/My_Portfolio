import type { Metadata, Viewport } from "next";
import "./globals.css";

/* SEO: título, descripción y vista previa al compartir el enlace */
export const metadata: Metadata = {
  // En Vercel toma tu dominio automáticamente (para la vista previa al compartir)
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
  ),
  title: "Leider Cadena · Ingeniería de Software",
  description:
    "Portafolio de Leider Alexander Cadena Cabrera, estudiante de Ingeniería de Software (5.º semestre) en Pasto, enfocado en backend, arquitectura de software y bases de datos.",
  authors: [{ name: "Leider Alexander Cadena Cabrera" }],
  icons: { icon: "/images/leider-avatar.webp" },
  openGraph: {
    title: "Leider Cadena · Ingeniería de Software",
    description: "Backend · Arquitectura de software · Bases de datos",
    images: ["/images/leider-about.webp"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0b1d47" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // scroll-smooth: el menú lleva a cada sección con desplazamiento suave
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Tipografías: Inter Tight (títulos y texto), Instrument Serif (nombre en cursiva), JetBrains Mono (etiquetas) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        {/* Activa las animaciones de scroll solo si hay JavaScript */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
