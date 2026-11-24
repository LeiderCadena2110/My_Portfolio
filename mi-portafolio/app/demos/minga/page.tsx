import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia, type Captions } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · Minga App — Leider Cadena" };

/* Demo de Minga App: capturas REALES de la app (public/demos/minga)
   + la versión web en vivo publicada en GitHub Pages */
const captions: Captions = {
  welcome: { title: "Bienvenida", note: "La primera pantalla: crear cuenta o entrar." },
  "sign-in": { title: "Iniciar sesión", note: "Cada rol (comprador, productor, admin) entra con su cuenta." },
  "buyer-home": { title: "Inicio del comprador", note: "«¿Qué llevas hoy?»: buscador, Campi, categorías y lo recién cosechado." },
  catalog: { title: "Catálogo", note: "Productos de las fincas con su precio, unidad y disponibilidad." },
  "product-detail": { title: "Detalle del producto", note: "De qué finca viene, cómo se entrega y el botón para agregarlo." },
  "farm-profile": { title: "Perfil de la finca", note: "Finca verificada, ubicación aproximada y lo que tiene a la venta." },
  "campi-assistant": { title: "Campi, el asistente con IA", note: "Arma un mercado con un presupuesto o sugiere una receta con lo que hay hoy." },
  basket: { title: "Canasta", note: "Los productos se agrupan por finca: cada finca recibe su propio pedido." },
  checkout: { title: "Confirmar pedido", note: "Entrega a domicilio o recogida en la finca, y forma de pago." },
  "producer-dashboard": { title: "Panel del productor", note: "Pedidos por atender, ventas de la semana y productos publicados." },
  "my-products": { title: "Mis productos", note: "El productor edita, pausa o elimina lo que publicó." },
  "publish-product": { title: "Publicar producto", note: "Foto obligatoria y dictado por voz para llenar los datos." },
};

export default function Page() {
  return (
    <DemoShell
      slug="minga"
      subtitle="App Android que conecta a campesinos de Nariño con compradores de Pasto, sin intermediarios. Incluye a Campi, un asistente de compras con IA."
      links={[{ label: "Versión web", href: "https://leidercadena2110.github.io/AppMovil_MercadoCampesino/" }]}
      steps={[
        "Presenta el problema: el campesino vende barato a intermediarios y el comprador paga caro.",
        "Bienvenida e inicio de sesión: cada rol tiene su propia app.",
        "Inicio del comprador: buscador, categorías y lo recién cosechado.",
        "Abre Campi y pide armar un mercado con un presupuesto.",
        "Detalle de un producto y perfil de la finca verificada.",
        "Canasta por finca y confirmación del pedido.",
        "Cambia al productor: panel, mis productos y publicar con foto y voz.",
        "Cierra con la arquitectura: API Express + PostgreSQL en Neon, app Ionic y APK automático. Si quieres, muéstrala «En vivo» (ábrela 1 minuto antes para despertar el servidor de Render).",
      ]}
    >
      <RealDemo
        device="phone"
        folder="public/demos/minga/"
        media={getMedia("minga")}
        captions={captions}
        live={{
          url: "https://leidercadena2110.github.io/AppMovil_MercadoCampesino/",
          label: "Minga App en vivo",
          hint: "Es la app real publicada. Si tarda en cargar los productos, el servidor gratuito de Render se está despertando: espera un minuto.",
        }}
      />
    </DemoShell>
  );
}
