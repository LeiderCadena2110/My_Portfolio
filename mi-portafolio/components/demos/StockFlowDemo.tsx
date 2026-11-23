"use client";

import { useEffect, useMemo, useRef, useState } from "react";

/* =============================================================================
   DEMO · STOCKFLOW — inventario y facturación (Java 21 + JavaFX + Spring Boot)
   Reproduce la app de escritorio con el catálogo de ejemplo de tienda de calzado
   (el mismo de DataSeeder.java): panel, vender (POS con IVA 19 %), facturas
   (anular devuelve el stock), productos, inventario (costo promedio ponderado),
   reportes y asistente IA (plan de compras y lectura de factura de proveedor).
   ============================================================================= */

// Colores reales de la app (styles/main.css)
const S = { bg: "#f4f6f8", panel: "#ffffff", sidebar: "#14324f", sideText: "#d3deea", sideActive: "#1f5a8f", text: "#1f2933", muted: "#616e7c", border: "#d9e2ec", accent: "#1d6fb8", success: "#1e7b46", successBg: "#e6f4ec", warning: "#a35c00", warningBg: "#fff4e0", danger: "#c0262d", dangerBg: "#fdecec" };
const IVA = 0.19;

type Product = { sku: string; name: string; category: string; supplier: string; cost: number; price: number; stock: number; min: number; unit: string };
type Line = { sku: string; name: string; qty: number; price: number; cost: number };
type Invoice = { number: string; date: string; customer: string; lines: Line[]; subtotal: number; discount: number; tax: number; total: number; payment: string; status: "Pagada" | "Anulada" };
type Move = { date: string; sku: string; type: string; qty: number; note: string };
type Data = { products: Product[]; invoices: Invoice[]; moves: Move[]; next: number };

const SUP = { calzado: "Calzado Andino S.A.S.", deportes: "Distribuidora Deportiva del Sur", insumos: "Insumos y Cuidado Ltda." };
const P = (sku: string, name: string, category: string, supplier: string, cost: number, price: number, stock: number, min: number): Product =>
  ({ sku, name, category, supplier, cost, price, stock, min, unit: category === "Accesorios" ? "UND" : "PAR" });

const today = () => new Date().toISOString().slice(0, 10);
const SEED: Data = {
  next: 51,
  products: [
    P("DEP-001", "Tenis running Ultra 3", "Deportivos", SUP.deportes, 145000, 229900, 18, 5),
    P("DEP-002", "Guayos fútbol Pro FG", "Deportivos", SUP.deportes, 120000, 189900, 9, 4),
    P("DEP-003", "Tenis training Flex", "Deportivos", SUP.deportes, 98000, 159900, 3, 4),
    P("CAS-001", "Tenis urbanos lona blanca", "Casuales", SUP.calzado, 55000, 99900, 25, 8),
    P("CAS-002", "Mocasín casual café", "Casuales", SUP.calzado, 70000, 129900, 12, 4),
    P("CAS-003", "Botín casual cuero negro", "Casuales", SUP.calzado, 110000, 199900, 2, 3),
    P("FOR-001", "Zapato Oxford negro", "Formales", SUP.calzado, 95000, 174900, 10, 3),
    P("FOR-002", "Zapato de tacón 7 cm", "Formales", SUP.calzado, 85000, 159900, 7, 3),
    P("SAN-001", "Sandalia playera unisex", "Sandalias", SUP.calzado, 18000, 34900, 40, 10),
    P("SAN-002", "Sandalia cuero dama", "Sandalias", SUP.calzado, 45000, 84900, 4, 5),
    P("ACC-001", "Medias deportivas x3", "Accesorios", SUP.insumos, 9000, 18900, 60, 15),
    P("ACC-002", "Kit limpieza de calzado", "Accesorios", SUP.insumos, 15000, 29900, 14, 5),
    P("ACC-003", "Plantillas de gel", "Accesorios", SUP.insumos, 12000, 24900, 0, 5),
  ],
  invoices: [],
  moves: [
    { date: "2026-11-02", sku: "DEP-001", type: "Entrada por compra", qty: 20, note: "Factura proveedor DDS-8812" },
    { date: "2026-11-02", sku: "CAS-001", type: "Entrada por compra", qty: 30, note: "Factura proveedor CA-4410" },
  ],
};
// Ventas de los días anteriores (para el gráfico y los totales del mes)
const PAST_DAYS = [115000, 670000, 905000, 182000, 1210000, 1105000];
const PAST_MONTH = { sales: 9190608, profit: 3290000, invoices: 46 };

const cop = (n: number) => "$ " + Math.round(n).toLocaleString("es-CO");
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const calc = (lines: Line[], discount: number) => {
  const subtotal = lines.reduce((a, l) => a + l.qty * l.price, 0);
  const tax = Math.round(Math.max(0, subtotal - discount) * IVA);
  return { subtotal, tax, total: Math.max(0, subtotal - discount) + tax };
};

type View = "inicio" | "vender" | "facturas" | "productos" | "inventario" | "clientes" | "proveedores" | "reportes" | "asistente" | "config";
const MENU: [View, string, string][] = [
  ["inicio", "▦", "Inicio"], ["vender", "🛒", "Vender"], ["facturas", "🧾", "Facturas"], ["productos", "🏷️", "Productos"], ["inventario", "📚", "Inventario"],
  ["clientes", "👥", "Clientes"], ["proveedores", "🚚", "Proveedores"], ["reportes", "📊", "Reportes"], ["asistente", "✨", "Asistente IA"], ["config", "⚙️", "Configuración"],
];

export default function StockFlowDemo() {
  const [data, setData] = useState<Data>(SEED);
  const [view, setView] = useState<View>("inicio");
  const [toast, setToast] = useState("");

  useEffect(() => { try { const s = localStorage.getItem("stockflow-demo"); if (s) setData(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("stockflow-demo", JSON.stringify(data)); } catch {} }, [data]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);

  const reset = () => { setData(SEED); setView("inicio"); try { localStorage.removeItem("stockflow-demo"); } catch {} };

  return (
    <div className="grid w-full gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className="text-haze">💻 Mejor en computador. En celular desliza la ventana hacia los lados.</p>
        <button onClick={reset} className="rounded-full bg-white/10 px-4 py-2 font-bold">↺ Reiniciar demo</button>
      </div>
      <div className="w-full overflow-x-auto rounded-xl">
        <div className="relative min-w-[1100px] overflow-hidden rounded-xl border border-white/20 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)]" style={{ background: S.bg, color: S.text, fontFamily: "system-ui, sans-serif", fontSize: 13 }}>
          {/* Barra de título y menú */}
          <div className="flex h-8 items-center gap-2 bg-[#e8edf2] px-3">
            <span className="size-3 rounded-full bg-red-400" /><span className="size-3 rounded-full bg-amber-400" /><span className="size-3 rounded-full bg-green-500" />
            <span className="flex-1 text-center text-xs" style={{ color: S.muted }}>StockFlow · Calzado Demo</span>
          </div>
          <div className="flex h-7 items-center gap-5 border-b px-4 text-[13px]" style={{ borderColor: S.border, background: "#f7f9fb" }}>
            <span>Archivo</span><span>Ir a</span><span>Ayuda</span>
          </div>

          <div className="flex h-[680px]">
            <aside className="flex w-[200px] shrink-0 flex-col px-2.5 py-4" style={{ background: S.sidebar, color: S.sideText }}>
              <p className="px-2 text-xl font-bold text-white">StockFlow</p>
              <p className="mb-4 px-2 text-[11px]">Inventario y facturación</p>
              {MENU.map(([id, icon, label]) => (
                <button key={id} onClick={() => setView(id)} className="mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-left text-[14px] transition hover:bg-white/10" style={{ background: view === id ? S.sideActive : undefined, color: view === id ? "white" : undefined, fontWeight: view === id ? 700 : 400 }}>
                  <span className="w-5 text-center">{icon}</span>{label}
                </button>
              ))}
              <p className="mt-auto px-2 text-[11px] opacity-70">Ctrl + 1…9 y 0 para cambiar de sección</p>
            </aside>

            <main className="min-w-0 flex-1 overflow-y-auto p-6">
              {view === "inicio" && <Dashboard data={data} go={setView} />}
              {view === "vender" && <PointOfSale data={data} setData={setData} toast={setToast} />}
              {view === "facturas" && <Invoices data={data} setData={setData} toast={setToast} />}
              {view === "productos" && <Products data={data} setData={setData} toast={setToast} />}
              {view === "inventario" && <Inventory data={data} setData={setData} toast={setToast} />}
              {view === "clientes" && <SimpleTable title="Clientes" head={["Documento", "Nombre", "Teléfono", "Correo"]} rows={[["—", "Consumidor final", "—", "—"], ["CC 1085123456", "Ana María Benavides", "300 123 4567", "ana.benavides@correo.com"], ["CC 1086987654", "Juan Pablo Ortiz", "310 987 6543", "—"], ["NIT 900777888-2", "Colegio San Felipe", "602 720 1010", "compras@sanfelipe.edu.co"]]} />}
              {view === "proveedores" && <SimpleTable title="Proveedores" head={["NIT", "Proveedor", "Contacto", "Teléfono"]} rows={[["900123456-1", SUP.calzado, "Marta Rosero", "602 731 1234"], ["901987654-3", SUP.deportes, "Carlos Muñoz", "310 456 7890"], ["800555222-7", SUP.insumos, "Laura Pérez", "315 222 3344"]]} />}
              {view === "reportes" && <Reports data={data} />}
              {view === "asistente" && <Assistant data={data} setData={setData} toast={setToast} />}
              {view === "config" && <SimpleTable title="Configuración" head={["Ajuste", "Valor"]} rows={[["Negocio", "Calzado Demo · NIT 1085000000-1"], ["Régimen", "Responsable de IVA"], ["IVA por defecto", "19 %"], ["Numeración de facturas", `FV-${String(data.next).padStart(6, "0")} (prefijo FV)`], ["Tema", "Claro (también hay oscuro)"], ["Datos", "Archivo local H2 en ~/.stockflow (sin internet)"]]} />}
            </main>
          </div>
          {toast && <div className="absolute right-6 bottom-6 rounded-lg px-4 py-3 font-semibold text-white shadow-lg" style={{ background: S.success }}>{toast}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- utilidades de interfaz ---------------------------------- */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg border p-4 ${className}`} style={{ background: S.panel, borderColor: S.border }}>{children}</div>
);
const Btn = ({ children, onClick, primary, danger, disabled, className = "" }: { children: React.ReactNode; onClick?: () => void; primary?: boolean; danger?: boolean; disabled?: boolean; className?: string }) => (
  <button disabled={disabled} onClick={onClick} className={`rounded-md border px-3.5 py-1.5 font-semibold transition hover:brightness-95 disabled:opacity-50 ${className}`}
    style={{ background: primary ? S.accent : "white", color: primary ? "white" : danger ? S.danger : S.text, borderColor: primary ? S.accent : S.border }}>{children}</button>
);
const Input = (props: React.ComponentProps<"input">) => <input {...props} className={`rounded-md border px-2.5 py-1.5 outline-none focus:border-[#1d6fb8] ${props.className ?? ""}`} style={{ borderColor: S.border }} />;
function Table({ head, rows, onRow, highlight }: { head: string[]; rows: (string | number | React.ReactNode)[][]; onRow?: (i: number) => void; highlight?: (i: number) => string | undefined }) {
  return (
    <div className="overflow-hidden rounded-md border" style={{ borderColor: S.border }}>
      <table className="w-full border-collapse">
        <thead><tr style={{ background: "#e9eef3" }}>{head.map((h) => <th key={h} className="border-r px-2.5 py-1.5 text-center font-bold" style={{ borderColor: S.border }}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} onClick={() => onRow?.(i)} className={onRow ? "cursor-pointer hover:bg-[#eef5fc]" : ""} style={{ background: highlight?.(i) ?? (i % 2 ? "#fafbfc" : "white") }}>
              {r.map((c, j) => <td key={j} className={`px-2.5 py-1.5 ${typeof c === "number" || (typeof c === "string" && c.startsWith("$")) ? "text-right" : ""}`}>{c}</td>)}
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={head.length} className="px-3 py-6 text-center" style={{ color: S.muted }}>Sin datos</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
function Title({ title, sub, children }: { title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div><h2 className="text-[26px] font-bold">{title}</h2>{sub && <p style={{ color: S.muted }}>{sub}</p>}</div>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}
function SimpleTable({ title, head, rows }: { title: string; head: string[]; rows: string[][] }) {
  return <><Title title={title} /><Table head={head} rows={rows} /></>;
}

/* ---------------------------------- INICIO ---------------------------------- */
function useStats(data: Data) {
  return useMemo(() => {
    const valid = data.invoices.filter((i) => i.status === "Pagada");
    const todaySales = valid.reduce((a, i) => a + i.total, 0);
    const todayProfit = valid.reduce((a, i) => a + i.lines.reduce((b, l) => b + l.qty * (l.price - l.cost), 0) - i.discount, 0);
    const units = valid.reduce((a, i) => a + i.lines.reduce((b, l) => b + l.qty, 0), 0);
    const monthSales = PAST_MONTH.sales + todaySales;
    const monthInvoices = PAST_MONTH.invoices + valid.length;
    const sold = new Map<string, { name: string; qty: number; total: number }>([
      ["ACC-001", { name: "Medias deportivas x3", qty: 25, total: 472500 }], ["CAS-001", { name: "Tenis urbanos lona blanca", qty: 15, total: 1498500 }],
      ["SAN-001", { name: "Sandalia playera unisex", qty: 9, total: 314100 }], ["DEP-001", { name: "Tenis running Ultra 3", qty: 8, total: 1839200 }], ["DEP-002", { name: "Guayos fútbol Pro FG", qty: 8, total: 1519200 }],
    ]);
    valid.forEach((i) => i.lines.forEach((l) => { const s = sold.get(l.sku) ?? { name: l.name, qty: 0, total: 0 }; sold.set(l.sku, { ...s, qty: s.qty + l.qty, total: s.total + l.qty * l.price }); }));
    return {
      todaySales, todayCount: valid.length, units, monthSales, monthInvoices,
      monthProfit: PAST_MONTH.profit + todayProfit, ticket: monthSales / Math.max(1, monthInvoices),
      inventoryValue: data.products.reduce((a, p) => a + p.stock * p.cost, 0), inventoryUnits: data.products.reduce((a, p) => a + p.stock, 0),
      low: data.products.filter((p) => p.stock <= p.min), top: [...sold.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
      days: [...PAST_DAYS, todaySales], tax: valid.reduce((a, i) => a + i.tax, 0),
    };
  }, [data]);
}

function Bars({ values, labels }: { values: number[]; labels: string[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex h-52 items-end gap-4 border-b border-l px-3 pt-4" style={{ borderColor: S.border }}>
      {values.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px]" style={{ color: S.muted }}>{v >= 1e6 ? `${(v / 1e6).toFixed(1)} M` : `${Math.round(v / 1000)} mil`}</span>
          <div className="w-full rounded-t transition-all" style={{ height: `${(v / max) * 150}px`, background: S.accent }} />
          <span className="text-[11px]" style={{ color: S.muted }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}
const lastDays = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric" }); });

function Dashboard({ data, go }: { data: Data; go: (v: View) => void }) {
  const s = useStats(data);
  const h = new Date().getHours();
  return (
    <>
      <Title title={`${h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches"}, Calzado Demo`} sub={new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
        <Btn onClick={() => go("inicio")}>Actualizar</Btn><Btn primary onClick={() => go("vender")}>Nueva venta</Btn>
      </Title>
      <div className="grid grid-cols-5 gap-3">
        {[["Ventas de hoy", cop(s.todaySales), `${s.todayCount} facturas · ${s.units} unidades`, S.accent], ["Ventas del mes", cop(s.monthSales), `${s.monthInvoices} facturas`, S.text],
          ["Ganancia del mes", cop(s.monthProfit), `Ticket promedio ${cop(s.ticket)}`, S.text], ["Valor del inventario", cop(s.inventoryValue), `${data.products.length} productos · ${s.inventoryUnits} unidades`, S.text],
          ["Stock bajo", String(s.low.length), "productos por reponer", S.warning]].map(([l, v, sub, c]) => (
          <Card key={l}><p style={{ color: S.muted }}>{l}</p><p className="mt-1 text-[24px] font-bold" style={{ color: c }}>{v}</p><p className="text-[11px]" style={{ color: S.muted }}>{sub}</p></Card>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-[1.1fr_1fr] gap-4">
        <Card><p className="mb-2 text-[15px] font-bold">Ventas de los últimos 7 días</p><Bars values={s.days} labels={lastDays()} /></Card>
        <Card><p className="mb-2 text-[15px] font-bold">Más vendidos del mes</p><Table head={["Producto", "Unid.", "Ventas"]} rows={s.top.map((t) => [t.name, t.qty, cop(t.total)])} /></Card>
      </div>
      <Card className="mt-4">
        <div className="mb-2 flex justify-between"><p className="text-[15px] font-bold">Productos con poco stock</p><button onClick={() => go("asistente")} className="underline" style={{ color: S.accent }}>Planear compra con IA</button></div>
        <Table head={["Código", "Producto", "Categoría", "Stock", "Mínimo", "Proveedor"]} rows={s.low.map((p) => [p.sku, p.name, p.category, p.stock, p.min, p.supplier])} />
      </Card>
    </>
  );
}

/* ---------------------------------- VENDER (punto de venta) ---------------------------------- */
function PointOfSale({ data, setData, toast }: { data: Data; setData: React.Dispatch<React.SetStateAction<Data>>; toast: (t: string) => void }) {
  const [q, setQ] = useState("");
  const [lines, setLines] = useState<Line[]>([]);
  const [customer, setCustomer] = useState("Consumidor final");
  const [payment, setPayment] = useState("Efectivo");
  const [discount, setDiscount] = useState(0);
  const [received, setReceived] = useState(0);
  const [done, setDone] = useState<Invoice | null>(null);
  const search = useRef<HTMLInputElement>(null);

  const results = q.trim() ? data.products.filter((p) => norm(`${p.sku} ${p.name} ${p.category}`).includes(norm(q))) : data.products;
  const { subtotal, tax, total } = calc(lines, discount);
  const change = payment === "Efectivo" ? received - total : 0;
  const number = `FV-${String(data.next).padStart(6, "0")}`;

  const add = (p: Product) => {
    const inCart = lines.find((l) => l.sku === p.sku)?.qty ?? 0;
    if (inCart + 1 > p.stock) return toast(`⚠️ Sin stock suficiente de ${p.name} (quedan ${p.stock})`);
    setLines((ls) => (inCart ? ls.map((l) => (l.sku === p.sku ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { sku: p.sku, name: p.name, qty: 1, price: p.price, cost: p.cost }]));
  };
  const change1 = (sku: string, d: number) => setLines((ls) => ls.flatMap((l) => {
    if (l.sku !== sku) return [l];
    const stock = data.products.find((p) => p.sku === sku)!.stock;
    const qty = Math.min(stock, l.qty + d);
    return qty > 0 ? [{ ...l, qty }] : [];
  }));

  const charge = () => {
    if (!lines.length) return toast("Agregue productos a la venta");
    if (payment === "Efectivo" && received < total) return toast("⚠️ El valor recibido es menor que el total");
    const inv: Invoice = { number, date: today(), customer, lines, subtotal, discount, tax, total, payment, status: "Pagada" };
    setData((d) => ({
      ...d, next: d.next + 1, invoices: [inv, ...d.invoices],
      products: d.products.map((p) => { const l = lines.find((x) => x.sku === p.sku); return l ? { ...p, stock: p.stock - l.qty } : p; }),
      moves: [...lines.map((l) => ({ date: today(), sku: l.sku, type: "Salida por venta", qty: -l.qty, note: number })), ...d.moves],
    }));
    setDone(inv); setLines([]); setDiscount(0); setReceived(0); setQ("");
  };

  // Atajos del teclado de la app real: F2 buscar, F12 cobrar
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "F2") { e.preventDefault(); search.current?.focus(); } if (e.key === "F12") { e.preventDefault(); charge(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const quick = [total, Math.ceil(total / 10000) * 10000, Math.ceil(total / 50000) * 50000].filter((v, i, a) => v > 0 && a.indexOf(v) === i);

  return (
    <div className="grid h-full grid-cols-[1fr_330px] gap-5">
      <div className="flex min-w-0 flex-col">
        <Title title="Vender" sub={`Próxima factura: ${number}`} />
        <Input ref={search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por código, nombre o lector de barras (F2)…" autoFocus
          onKeyDown={(e) => { if (e.key === "Enter" && q.trim() && results[0]) { add(results[0]); setQ(""); } }} className="mb-3 w-full" />
        <div className="max-h-[200px] overflow-y-auto">
          <Table head={["Código", "Producto", "Categoría", "Precio", "Stock"]} onRow={(i) => add(results[i])}
            highlight={(i) => (results[i].stock <= results[i].min ? S.warningBg : undefined)}
            rows={results.map((p) => [p.sku, p.name, p.category, cop(p.price), p.stock])} />
        </div>
        <div className="mt-4 mb-2 flex justify-between"><b className="text-[15px]">Productos de la venta</b><span style={{ color: S.muted }}>{lines.length} productos · {lines.reduce((a, l) => a + l.qty, 0)} unidades</span></div>
        <div className="flex-1 overflow-y-auto">
          <Table head={["Código", "Producto", "Cant.", "Precio", "Total", ""]} rows={lines.map((l) => [l.sku, l.name, l.qty, cop(l.price), cop(l.qty * l.price),
            <span key="a" className="flex justify-end gap-1"><Btn onClick={() => change1(l.sku, 1)}>+1</Btn><Btn onClick={() => change1(l.sku, -1)}>−1</Btn><Btn danger onClick={() => change1(l.sku, -999)}>Quitar</Btn></span>])} />
        </div>
        <p className="mt-2 text-xs" style={{ color: S.muted }}>Clic en un producto (o Enter en la búsqueda) para agregarlo. Las filas en naranja tienen poco stock.</p>
      </div>

      <Card className="flex flex-col">
        <p className="mb-2 text-[15px] font-bold">Cliente</p>
        <select value={customer} onChange={(e) => setCustomer(e.target.value)} className="rounded-md border px-2 py-1.5" style={{ borderColor: S.border }}>
          {["Consumidor final", "Ana María Benavides", "Juan Pablo Ortiz", "Colegio San Felipe"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <div className="mt-4 grid grid-cols-[110px_minmax(0,1fr)] items-center gap-2 [&_input]:w-full [&_select]:w-full">
          <span>Forma de pago</span>
          <select value={payment} onChange={(e) => setPayment(e.target.value)} className="rounded-md border px-2 py-1.5" style={{ borderColor: S.border }}>
            {["Efectivo", "Tarjeta", "Transferencia", "Nequi"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <span>Descuento ($)</span><Input inputMode="numeric" value={discount || ""} onChange={(e) => setDiscount(+e.target.value.replace(/\D/g, ""))} placeholder="0" />
          {payment === "Efectivo" && (<><span>Recibido ($)</span><Input inputMode="numeric" value={received || ""} onChange={(e) => setReceived(+e.target.value.replace(/\D/g, ""))} placeholder="0" /></>)}
        </div>
        {payment === "Efectivo" && total > 0 && (
          <div className="mt-2 flex flex-wrap justify-end gap-1.5">
            {quick.map((v, i) => <button key={v} onClick={() => setReceived(v)} className="rounded-md px-2 py-1 text-xs font-bold" style={{ background: S.successBg, color: S.success }}>{i === 0 ? "Exacto" : cop(v)}</button>)}
          </div>
        )}
        <div className="mt-4 grid gap-1.5 rounded-lg p-4" style={{ background: "#f1f4f7" }}>
          <div className="flex justify-between"><span>Subtotal</span><b>{cop(subtotal)}</b></div>
          <div className="flex justify-between"><span>Descuento</span><b>{cop(discount)}</b></div>
          <div className="flex justify-between"><span>IVA (19 %)</span><b>{cop(tax)}</b></div>
          <div className="flex items-center justify-between"><b className="text-lg">TOTAL</b><b className="text-[28px]" style={{ color: S.accent }}>{cop(total)}</b></div>
          {payment === "Efectivo" && <div className="flex justify-between"><span>Cambio</span><b style={{ color: change < 0 ? S.danger : S.text }}>{cop(Math.max(0, change))}</b></div>}
        </div>
        <button onClick={charge} className="mt-auto rounded-md py-3 text-[16px] font-bold text-white" style={{ background: S.accent }}>✔ Cobrar y facturar (F12)</button>
      </Card>

      {done && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#14324f]/50" onClick={() => setDone(null)}>
          <div className="w-[440px] rounded-lg bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-center text-3xl">✅</p>
            <h3 className="text-center text-xl font-bold">Venta registrada · {done.number}</h3>
            <div className="mt-4 rounded-md border p-4 font-mono text-xs" style={{ borderColor: S.border }}>
              <p className="text-center font-bold">CALZADO DEMO · NIT 1085000000-1</p>
              <p className="text-center">Factura de venta {done.number} · {done.date}</p>
              <p className="mt-2">Cliente: {done.customer} · Pago: {done.payment}</p>
              <hr className="my-2" />
              {done.lines.map((l) => <p key={l.sku} className="flex justify-between"><span>{l.qty} × {l.name}</span><span>{cop(l.qty * l.price)}</span></p>)}
              <hr className="my-2" />
              <p className="flex justify-between"><span>Subtotal</span><span>{cop(done.subtotal)}</span></p>
              <p className="flex justify-between"><span>IVA 19 %</span><span>{cop(done.tax)}</span></p>
              <p className="flex justify-between font-bold"><span>TOTAL</span><span>{cop(done.total)}</span></p>
            </div>
            <p className="mt-3 text-center text-xs" style={{ color: S.muted }}>En la app real se exporta a PDF con Apache PDFBox. El stock ya se descontó.</p>
            <div className="mt-4 flex justify-center"><Btn primary onClick={() => setDone(null)}>Nueva venta</Btn></div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- FACTURAS ---------------------------------- */
function Invoices({ data, setData, toast }: { data: Data; setData: React.Dispatch<React.SetStateAction<Data>>; toast: (t: string) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const inv = sel !== null ? data.invoices[sel] : null;
  const annul = (i: Invoice) => {
    setData((d) => ({
      ...d, invoices: d.invoices.map((x) => (x.number === i.number ? { ...x, status: "Anulada" } : x)),
      products: d.products.map((p) => { const l = i.lines.find((x) => x.sku === p.sku); return l ? { ...p, stock: p.stock + l.qty } : p; }),
      moves: [...i.lines.map((l) => ({ date: today(), sku: l.sku, type: "Devolución por anulación", qty: l.qty, note: i.number })), ...d.moves],
    }));
    toast(`${i.number} anulada: las unidades volvieron al inventario`);
  };
  return (
    <div className="grid grid-cols-[1.2fr_1fr] gap-5">
      <div>
        <Title title="Facturas" sub="Consecutivo con prefijo FV" />
        <Table head={["Número", "Fecha", "Cliente", "Total", "Estado"]} onRow={setSel}
          rows={data.invoices.map((i) => [i.number, i.date, i.customer, cop(i.total), <span key="s" className="rounded px-2 py-0.5 text-xs font-bold" style={{ background: i.status === "Pagada" ? S.successBg : S.dangerBg, color: i.status === "Pagada" ? S.success : S.danger }}>{i.status}</span>])} />
        {!data.invoices.length && <p className="mt-3" style={{ color: S.muted }}>Haga una venta en <b>Vender</b> y aparecerá aquí.</p>}
      </div>
      {inv && (
        <Card>
          <p className="text-lg font-bold">{inv.number}</p>
          <p style={{ color: S.muted }}>{inv.date} · {inv.customer} · {inv.payment}</p>
          <div className="mt-3"><Table head={["Producto", "Cant.", "Total"]} rows={inv.lines.map((l) => [l.name, l.qty, cop(l.qty * l.price)])} /></div>
          <p className="mt-3 flex justify-between"><span>IVA</span><b>{cop(inv.tax)}</b></p>
          <p className="flex justify-between text-lg"><span>Total</span><b style={{ color: S.accent }}>{cop(inv.total)}</b></p>
          <div className="mt-4 flex gap-2">
            <Btn onClick={() => toast("📄 PDF generado (en la app real se guarda en su equipo)")}>Exportar PDF</Btn>
            <Btn danger disabled={inv.status === "Anulada"} onClick={() => annul(inv)}>Anular factura</Btn>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ---------------------------------- PRODUCTOS ---------------------------------- */
function Products({ data, setData, toast }: { data: Data; setData: React.Dispatch<React.SetStateAction<Data>>; toast: (t: string) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todas");
  const [form, setForm] = useState<Product | null>(null);
  const list = data.products.filter((p) => (cat === "Todas" || p.category === cat) && norm(`${p.sku} ${p.name}`).includes(norm(q)));
  const cats = ["Todas", ...new Set(data.products.map((p) => p.category))];
  const save = () => {
    if (!form) return;
    if (!form.sku.trim() || !form.name.trim()) return toast("⚠️ Código y nombre son obligatorios");
    if (data.products.some((p) => p.sku === form.sku)) return toast("⚠️ Ya existe un producto con ese código");
    if (form.price < form.cost) return toast("⚠️ El precio de venta no puede ser menor que el costo");
    setData((d) => ({ ...d, products: [...d.products, form] })); setForm(null); toast(`Producto ${form.sku} creado`);
  };
  return (
    <>
      <Title title="Productos" sub={`${data.products.length} productos`}>
        <Btn onClick={() => toast("📄 products-export.csv generado")}>Exportar CSV</Btn>
        <Btn primary onClick={() => setForm(P("NEW-001", "", "Deportivos", SUP.deportes, 0, 0, 0, 3))}>Nuevo producto</Btn>
      </Title>
      <div className="mb-3 flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por código o nombre…" className="flex-1" />
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-md border px-2" style={{ borderColor: S.border }}>{cats.map((c) => <option key={c}>{c}</option>)}</select>
      </div>
      <Table head={["Código", "Producto", "Categoría", "Costo", "Precio", "Margen", "Stock", "Mín."]}
        highlight={(i) => (list[i].stock === 0 ? S.dangerBg : list[i].stock <= list[i].min ? S.warningBg : undefined)}
        rows={list.map((p) => [p.sku, p.name, p.category, cop(p.cost), cop(p.price), `${Math.round(((p.price - p.cost) / p.price) * 100)} %`, p.stock, p.min])} />
      {form && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-[#14324f]/50">
          <div className="grid w-[460px] grid-cols-2 gap-3 rounded-lg bg-white p-6 shadow-2xl">
            <h3 className="col-span-2 text-lg font-bold">Nuevo producto</h3>
            {(["sku", "name"] as const).map((k) => <label key={k} className="grid gap-1">{k === "sku" ? "Código (SKU)" : "Nombre"}<Input value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} /></label>)}
            <label className="grid gap-1">Categoría<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, unit: e.target.value === "Accesorios" ? "UND" : "PAR" })} className="rounded-md border px-2 py-1.5" style={{ borderColor: S.border }}>{cats.slice(1).map((c) => <option key={c}>{c}</option>)}</select></label>
            <label className="grid gap-1">Proveedor<select value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} className="rounded-md border px-2 py-1.5" style={{ borderColor: S.border }}>{Object.values(SUP).map((c) => <option key={c}>{c}</option>)}</select></label>
            {(["cost", "price", "stock", "min"] as const).map((k) => <label key={k} className="grid gap-1">{{ cost: "Precio de costo", price: "Precio de venta", stock: "Stock inicial", min: "Stock mínimo" }[k]}<Input inputMode="numeric" value={form[k] || ""} onChange={(e) => setForm({ ...form, [k]: +e.target.value.replace(/\D/g, "") })} /></label>)}
            <div className="col-span-2 mt-2 flex justify-end gap-2"><Btn onClick={() => setForm(null)}>Cancelar</Btn><Btn primary onClick={save}>Guardar</Btn></div>
          </div>
        </div>
      )}
    </>
  );
}

/* ---------------------------------- INVENTARIO ---------------------------------- */
function Inventory({ data, setData, toast }: { data: Data; setData: React.Dispatch<React.SetStateAction<Data>>; toast: (t: string) => void }) {
  const [sku, setSku] = useState(data.products[2].sku);
  const [type, setType] = useState("Entrada por compra");
  const [qty, setQty] = useState(10);
  const [cost, setCost] = useState(100000);
  const p = data.products.find((x) => x.sku === sku)!;
  const avg = type === "Entrada por compra" && qty > 0 ? Math.round((p.stock * p.cost + qty * cost) / (p.stock + qty)) : p.cost;
  const apply = () => {
    const sign = type === "Entrada por compra" || type === "Devolución de cliente" ? 1 : -1;
    if (qty <= 0) return toast("⚠️ La cantidad debe ser mayor que cero");
    if (sign < 0 && qty > p.stock) return toast(`⚠️ Stock insuficiente: quedan ${p.stock}`);
    setData((d) => ({
      ...d, products: d.products.map((x) => (x.sku === sku ? { ...x, stock: x.stock + sign * qty, cost: type === "Entrada por compra" ? avg : x.cost } : x)),
      moves: [{ date: today(), sku, type, qty: sign * qty, note: type === "Entrada por compra" ? `Costo ${cop(cost)} → promedio ${cop(avg)}` : "Registrado en la demo" }, ...d.moves],
    }));
    toast(`${type} registrada para ${sku}`);
  };
  return (
    <div className="grid grid-cols-[360px_1fr] gap-5">
      <Card>
        <p className="mb-3 text-[15px] font-bold">Registrar movimiento</p>
        <div className="grid gap-2.5">
          <label className="grid gap-1">Producto<select value={sku} onChange={(e) => setSku(e.target.value)} className="rounded-md border px-2 py-1.5" style={{ borderColor: S.border }}>{data.products.map((x) => <option key={x.sku} value={x.sku}>{x.sku} · {x.name}</option>)}</select></label>
          <label className="grid gap-1">Tipo<select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border px-2 py-1.5" style={{ borderColor: S.border }}>{["Entrada por compra", "Ajuste (salida)", "Pérdida", "Devolución de cliente"].map((t) => <option key={t}>{t}</option>)}</select></label>
          <label className="grid gap-1">Cantidad<Input inputMode="numeric" value={qty || ""} onChange={(e) => setQty(+e.target.value.replace(/\D/g, ""))} /></label>
          {type === "Entrada por compra" && <label className="grid gap-1">Costo unitario<Input inputMode="numeric" value={cost || ""} onChange={(e) => setCost(+e.target.value.replace(/\D/g, ""))} /></label>}
        </div>
        <div className="mt-3 rounded-md p-3 text-xs" style={{ background: "#f1f4f7" }}>
          Stock actual <b>{p.stock}</b> · costo actual <b>{cop(p.cost)}</b>
          {type === "Entrada por compra" && <><br />Costo promedio ponderado nuevo: <b style={{ color: S.accent }}>{cop(avg)}</b><br /><span style={{ color: S.muted }}>= ({p.stock} × {cop(p.cost)} + {qty} × {cop(cost)}) / {p.stock + qty}</span></>}
        </div>
        <Btn primary className="mt-3 w-full" onClick={apply}>Registrar</Btn>
      </Card>
      <div>
        <Title title="Inventario" sub={`Kardex de ${p.name}`} />
        <Table head={["Fecha", "Movimiento", "Cantidad", "Detalle"]} rows={data.moves.filter((m) => m.sku === sku).map((m) => [m.date, m.type, <b key="q" style={{ color: m.qty > 0 ? S.success : S.danger }}>{m.qty > 0 ? `+${m.qty}` : m.qty}</b>, m.note])} />
      </div>
    </div>
  );
}

/* ---------------------------------- REPORTES ---------------------------------- */
function Reports({ data }: { data: Data }) {
  const s = useStats(data);
  const [period, setPeriod] = useState<"hoy" | "7" | "mes">("mes");
  const sales = period === "hoy" ? s.todaySales : period === "7" ? s.days.reduce((a, b) => a + b, 0) : s.monthSales;
  const count = period === "hoy" ? s.todayCount : period === "7" ? 14 + s.todayCount : s.monthInvoices;
  return (
    <>
      <Title title="Reportes" sub="Ventas, ganancia e IVA por periodo">
        {([["hoy", "Hoy"], ["7", "Últimos 7 días"], ["mes", "Este mes"]] as const).map(([k, l]) => <Btn key={k} primary={period === k} onClick={() => setPeriod(k)}>{l}</Btn>)}
      </Title>
      <div className="grid grid-cols-4 gap-3">
        {[["Ventas", cop(sales)], ["Facturas", String(count)], ["Ticket promedio", cop(sales / Math.max(1, count))], ["IVA cobrado", cop(period === "hoy" ? s.tax : Math.round((sales / 1.19) * 0.19))]].map(([l, v]) => (
          <Card key={l}><p style={{ color: S.muted }}>{l}</p><p className="mt-1 text-[24px] font-bold">{v}</p></Card>
        ))}
      </div>
      <Card className="mt-4"><p className="mb-2 text-[15px] font-bold">Ventas por día</p><Bars values={s.days} labels={lastDays()} /></Card>
    </>
  );
}

/* ---------------------------------- ASISTENTE IA ---------------------------------- */
/* En la app real usa Google Gemini con salida JSON. Aquí se muestran sus dos
   funciones con la misma lógica: plan de compras y lectura de factura de proveedor. */
function Assistant({ data, setData, toast }: { data: Data; setData: React.Dispatch<React.SetStateAction<Data>>; toast: (t: string) => void }) {
  const [tab, setTab] = useState<"plan" | "factura">("plan");
  const [read, setRead] = useState(false);
  const plan = data.products.filter((p) => p.stock <= p.min).map((p) => ({ ...p, buy: Math.max(p.min * 2 - p.stock, p.min) }));
  const bySupplier = [...new Set(plan.map((p) => p.supplier))];
  const invoiceLines = [{ sku: "DEP-003", qty: 12, cost: 96000 }, { sku: "ACC-003", qty: 20, cost: 11500 }, { sku: "SAN-002", qty: 8, cost: 44000 }];
  const register = () => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => { const l = invoiceLines.find((x) => x.sku === p.sku); return l ? { ...p, stock: p.stock + l.qty, cost: Math.round((p.stock * p.cost + l.qty * l.cost) / (p.stock + l.qty)) } : p; }),
      moves: [...invoiceLines.map((l) => ({ date: today(), sku: l.sku, type: "Entrada por compra", qty: l.qty, note: "Factura DDS-9021 leída con IA" })), ...d.moves],
    }));
    setRead(false); toast("Compra registrada: el inventario y el costo promedio se actualizaron");
  };
  return (
    <>
      <Title title="Asistente IA" sub="Con Google Gemini · revisa siempre antes de guardar">
        <Btn primary={tab === "plan"} onClick={() => setTab("plan")}>Plan de compras</Btn>
        <Btn primary={tab === "factura"} onClick={() => setTab("factura")}>Leer factura de proveedor</Btn>
      </Title>
      {tab === "plan" ? (
        <div className="grid gap-4">
          <Card>
            <p className="font-bold">✨ ¿Qué debo comprar y cuánto?</p>
            <p style={{ color: S.muted }}>{plan.length ? `${plan.length} productos están en su stock mínimo o por debajo. Propuesta para cubrir dos veces el mínimo:` : "Todo el inventario está por encima del mínimo. 🎉"}</p>
          </Card>
          {bySupplier.map((sup) => (
            <Card key={sup}>
              <div className="mb-2 flex items-center justify-between"><b>🚚 {sup}</b><Btn onClick={() => toast(`📝 Nota de pedido para ${sup} copiada`)}>Redactar nota de pedido</Btn></div>
              <Table head={["Código", "Producto", "Stock", "Mínimo", "Comprar", "Costo estimado"]} rows={plan.filter((p) => p.supplier === sup).map((p) => [p.sku, p.name, p.stock, p.min, <b key="b" style={{ color: S.accent }}>{p.buy}</b>, cop(p.buy * p.cost)])} />
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          {!read ? (
            <div className="grid place-items-center gap-3 py-10 text-center">
              <p className="text-4xl">📄</p>
              <p className="font-bold">Suba la foto o el PDF de una factura de proveedor</p>
              <p style={{ color: S.muted }}>Gemini extrae proveedor, productos, cantidades y costos y prepara la compra para que usted la revise.</p>
              <Btn primary onClick={() => setRead(true)}>Usar factura de ejemplo (DDS-9021)</Btn>
            </div>
          ) : (
            <>
              <p className="font-bold">Factura DDS-9021 · {SUP.deportes}</p>
              <p className="mb-3" style={{ color: S.muted }}>Revisión: los productos se reconocieron por código. Confirme antes de registrar.</p>
              <Table head={["Código", "Producto", "Cantidad", "Costo unitario", "Total"]} rows={invoiceLines.map((l) => { const p = data.products.find((x) => x.sku === l.sku)!; return [l.sku, p.name, l.qty, cop(l.cost), cop(l.qty * l.cost)]; })} />
              <div className="mt-3 flex justify-end gap-2"><Btn onClick={() => setRead(false)}>Descartar</Btn><Btn primary onClick={register}>Registrar compra</Btn></div>
            </>
          )}
        </Card>
      )}
    </>
  );
}
