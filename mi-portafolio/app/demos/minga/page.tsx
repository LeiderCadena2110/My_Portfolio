import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import MingaDemo from "@/components/demos/MingaDemo";

export const metadata: Metadata = { title: "Demo · Minga App — Leider Cadena" };

/* Demo de Minga App: /demos/minga */
export default function Page() {
  return (
    <DemoShell
      title="Minga App"
      subtitle="App Android que conecta a campesinos de Nariño con compradores de Pasto, sin intermediarios. Incluye a Campi, un asistente de compras con IA."
      tags={["Ionic 9", "Angular 21", "Capacitor", "Express 5", "Drizzle ORM", "PostgreSQL · Neon", "Gemini"]}
      accent="#e0a83a"
      links={[
        { label: "Código", href: "https://github.com/LeiderCadena2110/AppMovil_MercadoCampesino" },
        { label: "APK", href: "https://github.com/LeiderCadena2110/AppMovil_MercadoCampesino/releases/latest" },
        { label: "Versión web real", href: "https://leidercadena2110.github.io/AppMovil_MercadoCampesino/" },
      ]}
      steps={[
        "Presenta el problema: el campesino vende barato a intermediarios y el comprador paga caro.",
        "Entra como comprador: muestra el inicio, las categorías y busca «cafe» (encuentra «Café» sin tilde).",
        "Abre «Pregúntale a Campi» y pide «Mercado con $50.000»; agrega todo al carrito.",
        "En el carrito muestra que se agrupa por finca y confirma el pedido a domicilio.",
        "Cambia a «Ver como productor»: el pedido le llegó a Don Efraín. Confírmalo y márcalo en camino.",
        "Publica un producto con «Sugerir precio» y «Escribir con IA»; vuelve al comprador y búscalo en el catálogo.",
        "Cierra con la arquitectura: API REST en Express + PostgreSQL en Neon, app Ionic con APK por GitHub Actions.",
      ]}
    >
      <MingaDemo />
    </DemoShell>
  );
}
