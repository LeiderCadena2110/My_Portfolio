import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia, type Captions } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · StockFlow — Leider Cadena" };

/* Demo de StockFlow: capturas REALES de la app (docs/screenshots del repositorio)
   + el video del recorrido (00-walkthrough.mp4) en public/demos/stockflow */
const captions: Captions = {
  walkthrough: { title: "Recorrido completo de la app", note: "Video real: venta con cliente nuevo, factura en PDF, inventario y lectura de una factura de proveedor con IA." },
  dashboard: { title: "Inicio", note: "Ventas del día y del mes, ganancia, valor del inventario, ventas de 7 días, más vendidos y stock bajo." },
  "point-of-sale": { title: "Vender", note: "Punto de venta: búsqueda por código o lector, cliente, pago rápido, IVA y cambio. F2 buscar, F12 cobrar." },
  invoices: { title: "Facturas", note: "Consecutivo FV-000001, detalle, PDF y anulación que devuelve las unidades al inventario." },
  products: { title: "Productos", note: "Código, costo, precio, margen, stock y stock mínimo, con filtros y exportación a CSV." },
  inventory: { title: "Inventario", note: "Entradas por compra con costo promedio ponderado, ajustes, pérdidas y kardex." },
  reports: { title: "Reportes", note: "Ventas por periodo, ganancia, ticket promedio, IVA cobrado y más vendidos." },
  "ai-assistant": { title: "Asistente con IA", note: "Gemini calcula qué comprar a cada proveedor y redacta la nota de pedido." },
  "ai-invoice-review": { title: "Factura de proveedor leída con IA", note: "Gemini lee la foto o el PDF de una factura y prepara la compra para revisar." },
  forms: { title: "Formularios", note: "Diálogos de producto, proveedor y categorías con validaciones." },
  settings: { title: "Configuración", note: "Datos del negocio, régimen e IVA, numeración de facturas y tema." },
  "dark-theme": { title: "Tema oscuro", note: "La misma app con el tema oscuro." },
};

export default function Page() {
  return (
    <DemoShell
      slug="stockflow"
      wide
      subtitle="Aplicación de escritorio para controlar el inventario y facturar las ventas de un negocio pequeño. Funciona sin internet en Windows, macOS y Linux."
      steps={[
        "Presenta el problema: los negocios pequeños llevan el inventario en cuadernos o en Excel.",
        "Inicio: ventas, ganancia, valor del inventario y productos con poco stock.",
        "Vender: busca un producto, arma la venta, usa un pago rápido y cobra con F12.",
        "Facturas: el consecutivo FV, el PDF y la anulación que devuelve el stock.",
        "Productos e Inventario: margen, stock mínimo y costo promedio ponderado.",
        "Asistente IA: plan de compras y lectura de una factura de proveedor con Gemini.",
        "Cierra con la arquitectura hexagonal, las +110 pruebas y los instaladores por GitHub Actions.",
      ]}
    >
      <RealDemo device="window" folder="public/demos/stockflow/" media={getMedia("stockflow")} captions={captions} />
    </DemoShell>
  );
}
