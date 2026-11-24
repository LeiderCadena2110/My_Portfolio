import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · Minga App — Leider Cadena" };

/* Demo de Minga App: la versión web REAL (GitHub Pages) + capturas en public/demos/minga */
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
        { label: "Versión web", href: "https://leidercadena2110.github.io/AppMovil_MercadoCampesino/" },
      ]}
      steps={[
        "1–2 minutos antes: abre la app para despertar el servidor gratuito de Render.",
        "Presenta el problema: el campesino vende barato a intermediarios y el comprador paga caro.",
        "«Ya tengo cuenta» → comprador@demo.co / Clave1234. Muestra el inicio «¿Qué llevas hoy?» y las categorías.",
        "Abre «Pregúntale a Campi» y pide armar un mercado con un presupuesto.",
        "Agrega productos, muestra el carrito por finca y confirma el pedido.",
        "Cierra sesión y entra con productor@demo.co: muestra el panel, el pedido recibido y publica un producto con IA.",
        "Cierra con la arquitectura: API Express + PostgreSQL en Neon, app Ionic y APK automático con GitHub Actions.",
      ]}
    >
      <RealDemo
        device="phone"
        folder="public/demos/minga/"
        media={getMedia("minga")}
        live={{
          url: "https://leidercadena2110.github.io/AppMovil_MercadoCampesino/",
          label: "Minga App en vivo",
          hint: "Es tu app real. Usuarios de prueba: comprador@demo.co y productor@demo.co (contraseña Clave1234). Si tarda, el servidor de Render se está despertando: espera un minuto.",
        }}
      />
    </DemoShell>
  );
}
