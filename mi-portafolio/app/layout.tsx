import type { Metadata, Viewport } from "next";
import "./globals.css";

/* SEO: título, descripción y vista previa al compartir el enlace */
export const metadata: Metadata = {
  // En Vercel toma tu dominio automáticamente (para la vista previa al compartir)
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
  ),
  title: "Leider Alexander Cadena Cabrera · Ingeniería de Software",
  description:
    "Portafolio de Leider Alexander Cadena Cabrera, estudiante de Ingeniería de Software (5.º semestre) enfocado en backend, arquitectura de software, bases de datos y cloud.",
  authors: [{ name: "Leider Alexander Cadena Cabrera" }],
  icons: { icon: "/images/leider-avatar.webp" },
  openGraph: {
    title: "Leider Alexander Cadena Cabrera · Ingeniería de Software",
    description: "Backend · Arquitectura de software · Bases de datos · Cloud",
    images: ["/images/leider-avatar.webp"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#172554" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // scroll-smooth: el menú lleva a cada sección con desplazamiento suave
    <html lang="es" className="scroll-smooth">
      <head>
        {/* Tipografías: Unbounded (títulos), DM Sans (texto), JetBrains Mono (detalles) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=JetBrains+Mono:wght@400;500&family=Unbounded:wght@500;700;800&display=swap"
        />
        {/* Activa las animaciones de scroll solo si hay JavaScript */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
