import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import StockFlowDemo from "@/components/demos/StockFlowDemo";

export const metadata: Metadata = { title: "Demo · StockFlow — Leider Cadena" };

/* Demo de StockFlow: /demos/stockflow */
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
        "Muestra el Inicio: ventas, ganancia, valor del inventario y productos con poco stock.",
        "Ve a «Vender», busca «tenis», agrega productos y usa el botón «Exacto» o un billete rápido.",
        "Cobra con F12: se genera la factura FV-000051 con IVA del 19 % y se descuenta el stock.",
        "En «Facturas» anula la venta y muestra que las unidades vuelven al inventario.",
        "En «Inventario» registra una entrada por compra y explica el costo promedio ponderado.",
        "En «Asistente IA» muestra el plan de compras por proveedor y lee la factura de ejemplo.",
        "Cierra con la arquitectura: monolito modular hexagonal, +110 pruebas y los instaladores por GitHub Actions.",
      ]}
    >
      <StockFlowDemo />
    </DemoShell>
  );
}
