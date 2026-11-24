import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · StockFlow — Leider Cadena" };

/* Demo de StockFlow: capturas REALES de la app (docs/screenshots del repositorio)
   en public/demos/stockflow. Puedes agregar un video, por ejemplo 00-recorrido.mp4 */
const notes: Record<string, string> = {
  Inicio: "Ventas del día y del mes, ganancia, valor del inventario, ventas de 7 días, más vendidos y stock bajo.",
  Vender: "Punto de venta: búsqueda por código o lector, cliente, pago rápido en efectivo, IVA y cambio. F2 buscar, F12 cobrar.",
  Facturas: "Consecutivo FV-000001, detalle, PDF y anulación que devuelve las unidades al inventario.",
  Productos: "Código, costo, precio, margen, stock y stock mínimo, con filtros y exportación a CSV.",
  Inventario: "Entradas por compra con costo promedio ponderado, ajustes, pérdidas y kardex.",
  Reportes: "Ventas por periodo, ganancia, ticket promedio, IVA cobrado y más vendidos.",
  "Asistente ia": "Gemini calcula qué comprar a cada proveedor y redacta la nota de pedido.",
  "Factura de proveedor leida con ia": "Gemini lee la foto o el PDF de una factura de proveedor y prepara la compra para revisar.",
  Formularios: "Diálogos de producto, proveedor y categorías con validaciones.",
  Configuracion: "Datos del negocio, régimen e IVA, numeración de facturas y tema.",
  "Tema oscuro": "La misma app con el tema oscuro.",
};

export default function Page() {
  return (
    <DemoShell
      title="StockFlow"
      subtitle="Aplicación de escritorio para controlar el inventario y facturar las ventas de un negocio pequeño. Funciona sin internet en Windows, macOS y Linux."
      tags={["Java 21", "JavaFX 21", "Spring Boot 3", "H2 + Flyway", "PDFBox", "Gemini", "Arquitectura hexagonal"]}
      accent="#1d6fb8"
      wide
      links={[
        { label: "Código", href: "https://github.com/LeiderCadena2110/App_Escritorio" },
        { label: "Instaladores", href: "https://github.com/LeiderCadena2110/App_Escritorio/releases" },
      ]}
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
      <RealDemo device="window" folder="public/demos/stockflow/" media={getMedia("stockflow")} notes={notes} />
    </DemoShell>
  );
}
