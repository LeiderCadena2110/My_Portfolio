"use client";

import { useEffect, useMemo, useState } from "react";

/* =============================================================================
   DEMO · MINGA APP — mercado campesino de Nariño
   Reproduce los flujos de la app real (Ionic + Angular + Express + Neon):
   Comprador: inicio, buscar, Campi (asistente IA), detalle, carrito, checkout, pedidos.
   Productor: panel, pedidos recibidos (los que hace el comprador en esta demo),
   mis productos y publicar con "Escribir con IA" y "Sugerir precio".
   Los datos son de ejemplo y se guardan en este navegador.
   ============================================================================= */

// Paleta real de Minga App (app/src/theme): páramo, brote, maíz, barro, nube
const C = { paramo: "#1f4d2b", brote: "#2b7f3a", maiz: "#e0a83a", barro: "#6b3f2a", nube: "#f3f5ef", tinta: "#18221b", suave: "#5b665e", borde: "#dfe4da", suelo: "#f1e7d6" };

type Product = { id: number; name: string; farm: string; town: string; category: string; price: number; unit: string; stock: number; emoji: string; desc: string };
type OrderStatus = "NUEVO" | "CONFIRMADO" | "EN_CAMINO" | "ENTREGADO";
type Order = { id: number; farm: string; items: { id: number; name: string; qty: number; price: number; unit: string }[]; total: number; delivery: string; address: string; status: OrderStatus; buyer: string };
type State = { products: Product[]; cart: Record<number, number>; orders: Order[]; nextId: number };

const CATEGORIES = [["Todo", "🧺"], ["Frutas", "🍓"], ["Verduras", "🥬"], ["Tubérculos", "🥔"], ["Granos", "🌽"], ["Lácteos", "🧀"], ["Café", "☕"], ["Hierbas", "🌿"]];
const MY_FARM = "Finca El Encano"; // la finca del productor de prueba (Don Efraín Rosero)

const SEED: State = {
  nextId: 1050,
  cart: {},
  orders: [],
  products: [
    { id: 1, name: "Papa pastusa", farm: MY_FARM, town: "Pasto", category: "Tubérculos", price: 45000, unit: "arroba", stock: 40, emoji: "🥔", desc: "Papa pastusa recién cosechada cerca a la Laguna de La Cocha." },
    { id: 2, name: "Papa amarilla (criolla)", farm: MY_FARM, town: "Pasto", category: "Tubérculos", price: 3500, unit: "libra", stock: 120, emoji: "🥔", desc: "Ideal para locro y papas chorreadas." },
    { id: 3, name: "Cebolla junca", farm: MY_FARM, town: "Pasto", category: "Verduras", price: 2500, unit: "atado", stock: 60, emoji: "🧅", desc: "Atado fresco, sin químicos." },
    { id: 4, name: "Zanahoria", farm: MY_FARM, town: "Pasto", category: "Verduras", price: 2000, unit: "libra", stock: 80, emoji: "🥕", desc: "Zanahoria dulce de clima frío." },
    { id: 5, name: "Queso campesino", farm: MY_FARM, town: "Pasto", category: "Lácteos", price: 14000, unit: "libra", stock: 3, emoji: "🧀", desc: "Queso fresco hecho en la finca." },
    { id: 6, name: "Café especial tostado", farm: "Finca La Palma", town: "Consacá", category: "Café", price: 28000, unit: "libra", stock: 30, emoji: "☕", desc: "Café de altura con notas a panela y cítricos." },
    { id: 7, name: "Fresa", farm: "Finca Los Arrayanes", town: "Sandoná", category: "Frutas", price: 8000, unit: "libra", stock: 25, emoji: "🍓", desc: "Fresa dulce cosechada esta semana." },
    { id: 8, name: "Mora de Castilla", farm: "Finca Los Arrayanes", town: "Sandoná", category: "Frutas", price: 6000, unit: "libra", stock: 30, emoji: "🫐", desc: "Perfecta para jugos y postres." },
    { id: 9, name: "Fríjol cargamanto", farm: "Finca El Mirador", town: "Tangua", category: "Granos", price: 7000, unit: "libra", stock: 40, emoji: "🫘", desc: "Fríjol seco de cosecha nueva." },
    { id: 10, name: "Maíz tierno (choclo)", farm: "Finca El Mirador", town: "Tangua", category: "Granos", price: 1500, unit: "unidad", stock: 100, emoji: "🌽", desc: "Choclo tierno para sopas y envueltos." },
    { id: 11, name: "Leche fresca", farm: "Finca El Mirador", town: "Tangua", category: "Lácteos", price: 2800, unit: "litro", stock: 40, emoji: "🥛", desc: "Leche del ordeño de la mañana." },
    { id: 12, name: "Cilantro", farm: "Finca San Rafael", town: "Pasto", category: "Hierbas", price: 1000, unit: "atado", stock: 50, emoji: "🌿", desc: "Cilantro de huerta, muy aromático." },
  ],
};

const RECIPES: { name: string; items: [number, number][]; text: string }[] = [
  { name: "Locro de papa nariñense", items: [[2, 3], [5, 1], [3, 1], [11, 1], [12, 1]], text: "Sofríe la cebolla, agrega la papa amarilla en cubos y el agua; cuando espese, suma la leche, el queso y el cilantro." },
  { name: "Sopa de choclo", items: [[10, 4], [1, 0], [4, 1], [3, 1], [12, 1]], text: "Cocina el choclo desgranado con zanahoria y cebolla; termina con cilantro picado." },
];

const plural = (u: string, n: number) => (n > 1 && !u.endsWith("s") ? u + (u === "unidad" ? "es" : "s") : u);
const cop = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);
const STATUS: Record<OrderStatus, { label: string; color: string }> = {
  NUEVO: { label: "Nuevo", color: C.maiz }, CONFIRMADO: { label: "Confirmado", color: C.brote },
  EN_CAMINO: { label: "En camino", color: "#2563eb" }, ENTREGADO: { label: "Entregado", color: C.suave },
};

export default function MingaDemo() {
  const [state, setState] = useState<State>(SEED);
  const [role, setRole] = useState<"comprador" | "productor" | null>(null);
  const [tab, setTab] = useState("inicio");
  const [page, setPage] = useState<{ name: string; id?: number } | null>(null);
  const [toast, setToast] = useState("");

  // Guarda la demo en el navegador (si se recarga la página no se pierde)
  useEffect(() => { try { const s = localStorage.getItem("minga-demo"); if (s) setState(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("minga-demo", JSON.stringify(state)); } catch {} }, [state]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2200); return () => clearTimeout(t); }, [toast]);

  const cartCount = Object.values(state.cart).reduce((a, b) => a + b, 0);
  const addToCart = (id: number, qty = 1) => {
    const p = state.products.find((x) => x.id === id);
    if (!p || qty <= 0) return;
    setState((s) => ({ ...s, cart: { ...s.cart, [id]: Math.min(p.stock, (s.cart[id] ?? 0) + qty) } }));
    setToast(`${p.emoji} ${p.name} agregado al carrito`);
  };
  const setQty = (id: number, qty: number) =>
    setState((s) => { const cart = { ...s.cart }; if (qty <= 0) delete cart[id]; else cart[id] = qty; return { ...s, cart }; });

  const reset = () => { setState(SEED); setRole(null); setPage(null); setTab("inicio"); try { localStorage.removeItem("minga-demo"); } catch {} };
  const go = (r: "comprador" | "productor") => { setRole(r); setTab(r === "comprador" ? "inicio" : "panel"); setPage(null); };

  return (
    <div className="grid w-full place-items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2 text-sm">
        <button onClick={() => go("comprador")} className={`rounded-full px-4 py-2 font-bold ${role === "comprador" ? "bg-mint text-ink" : "bg-white/10"}`}>🛒 Ver como comprador</button>
        <button onClick={() => go("productor")} className={`rounded-full px-4 py-2 font-bold ${role === "productor" ? "bg-mint text-ink" : "bg-white/10"}`}>🧑‍🌾 Ver como productor</button>
        <button onClick={reset} className="rounded-full bg-white/10 px-4 py-2 font-bold">↺ Reiniciar demo</button>
      </div>

      {/* Marco del celular */}
      <div className="relative h-[760px] w-[370px] max-w-full overflow-hidden rounded-[46px] border-[10px] border-[#0f2a44] shadow-[0_40px_80px_-30px_rgba(0,0,0,.7)]" style={{ background: C.nube, color: C.tinta, fontFamily: "system-ui, sans-serif" }}>
        <div className="flex h-7 items-center justify-between px-6 text-[11px] font-semibold" style={{ background: role ? "white" : C.paramo, color: role ? C.tinta : "white" }}>
          <span>9:41</span><span className="h-4 w-20 rounded-full bg-[#0f2a44]" /><span>📶 🔋</span>
        </div>
        <div className="relative h-[calc(100%-28px)] overflow-hidden">
          {!role && <Welcome onPick={go} />}
          {role === "comprador" && (
            <Buyer state={state} tab={tab} setTab={setTab} page={page} setPage={setPage} addToCart={addToCart} setQty={setQty} cartCount={cartCount}
              placeOrder={(delivery, address) => {
                const groups = new Map<string, Order["items"]>();
                Object.entries(state.cart).forEach(([id, qty]) => {
                  const p = state.products.find((x) => x.id === +id)!;
                  groups.set(p.farm, [...(groups.get(p.farm) ?? []), { id: p.id, name: p.name, qty, price: p.price, unit: p.unit }]);
                });
                let next = state.nextId;
                const orders: Order[] = [...groups.entries()].map(([farm, items]) => ({ id: next++, farm, items, total: items.reduce((a, i) => a + i.qty * i.price, 0), delivery, address, status: "NUEVO", buyer: "Laura Compradora" }));
                setState((s) => ({
                  ...s, nextId: next, cart: {}, orders: [...orders, ...s.orders],
                  products: s.products.map((p) => (s.cart[p.id] ? { ...p, stock: p.stock - s.cart[p.id] } : p)),
                }));
                setPage({ name: "ok", id: orders.length });
              }} />
          )}
          {role === "productor" && (
            <Producer state={state} setState={setState} tab={tab} setTab={setTab} page={page} setPage={setPage} toast={setToast} />
          )}
          {toast && <div className="absolute inset-x-4 bottom-24 z-30 rounded-xl px-4 py-3 text-center text-sm font-semibold text-white shadow-lg" style={{ background: C.paramo }}>{toast}</div>}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- Bienvenida ---------------------------------- */
function Welcome({ onPick }: { onPick: (r: "comprador" | "productor") => void }) {
  return (
    <div className="flex h-full flex-col justify-between p-7 text-white" style={{ background: `linear-gradient(180deg, ${C.paramo}, #2f6b3d 60%, ${C.brote})` }}>
      <div className="pt-10">
        <div className="grid size-16 place-items-center rounded-2xl text-3xl" style={{ background: C.maiz }}>🌽</div>
        <h2 className="mt-6 text-4xl font-extrabold">Minga</h2>
        <p className="mt-2 text-lg text-white/85">Del campo nariñense a tu mesa, sin intermediarios.</p>
      </div>
      <div className="grid gap-3">
        <p className="text-sm text-white/80">Usuarios de prueba (contraseña Clave1234):</p>
        <button onClick={() => onPick("comprador")} className="rounded-2xl bg-white p-4 text-left font-bold" style={{ color: C.paramo }}>🛒 Entrar como comprador<br /><small className="font-normal" style={{ color: C.suave }}>comprador@demo.co · Laura</small></button>
        <button onClick={() => onPick("productor")} className="rounded-2xl p-4 text-left font-bold" style={{ background: C.maiz, color: "#1f2a12" }}>🧑‍🌾 Entrar como productor<br /><small className="font-normal">productor@demo.co · Don Efraín</small></button>
      </div>
    </div>
  );
}

/* ---------------------------------- Componentes pequeños ---------------------------------- */
function TopBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div className="flex h-14 items-center gap-3 px-4 text-white" style={{ background: C.brote }}>
      {onBack && <button onClick={onBack} aria-label="Volver" className="text-xl">←</button>}
      <h3 className="font-bold">{title}</h3>
    </div>
  );
}

function Tabs({ items, tab, setTab }: { items: [string, string, string, number?][]; tab: string; setTab: (t: string) => void }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex h-16 border-t bg-white" style={{ borderColor: C.borde }}>
      {items.map(([id, icon, label, badge]) => (
        <button key={id} onClick={() => setTab(id)} className="relative flex flex-1 flex-col items-center justify-center text-[11px] font-semibold" style={{ color: tab === id ? C.brote : C.suave }}>
          <span className="text-xl">{icon}</span>{label}
          {!!badge && <span className="absolute top-1.5 right-[22%] grid size-4 place-items-center rounded-full text-[10px] text-white" style={{ background: "#b3261e" }}>{badge}</span>}
        </button>
      ))}
    </nav>
  );
}

function ProductCard({ p, onOpen }: { p: Product; onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="overflow-hidden rounded-2xl border bg-white text-left transition active:scale-95" style={{ borderColor: C.borde }}>
      <div className="grid h-24 place-items-center text-5xl" style={{ background: C.suelo }}>{p.emoji}</div>
      <div className="p-2.5">
        <p className="line-clamp-1 text-sm font-bold">{p.name}</p>
        <p className="line-clamp-1 text-[11px]" style={{ color: C.barro }}>{p.farm} · {p.town}</p>
        <p className="mt-1 text-sm font-extrabold" style={{ color: C.brote }}>{cop(p.price)} <small className="font-normal" style={{ color: C.suave }}>/ {p.unit}</small></p>
        {p.stock === 0 && <p className="text-[11px] font-bold text-red-700">Agotado</p>}
      </div>
    </button>
  );
}

/* ---------------------------------- COMPRADOR ---------------------------------- */
type BuyerProps = {
  state: State; tab: string; setTab: (t: string) => void; page: { name: string; id?: number } | null; setPage: (p: { name: string; id?: number } | null) => void;
  addToCart: (id: number, qty?: number) => void; setQty: (id: number, q: number) => void; cartCount: number; placeOrder: (delivery: string, address: string) => void;
};

function Buyer(props: BuyerProps) {
  const { state, tab, setTab, page, setPage, cartCount } = props;
  const myOrders = state.orders.length;
  return (
    <>
      <div className="h-full overflow-y-auto pb-20">
        {tab === "inicio" && <BuyerHome {...props} />}
        {tab === "buscar" && <BuyerSearch {...props} />}
        {tab === "carrito" && <Cart {...props} />}
        {tab === "pedidos" && <Orders orders={state.orders} />}
        {tab === "perfil" && <Profile name="Laura Compradora" email="comprador@demo.co" role="Comprador" />}
      </div>
      <Tabs tab={tab} setTab={(t) => { setTab(t); setPage(null); }} items={[["inicio", "🏠", "Inicio"], ["buscar", "🔍", "Buscar"], ["carrito", "🛒", "Carrito", cartCount], ["pedidos", "📦", "Pedidos", myOrders], ["perfil", "👤", "Perfil"]]} />
      {page && (
        <div className="absolute inset-0 z-20 overflow-y-auto" style={{ background: C.nube }}>
          {page.name === "detalle" && <Detail {...props} id={page.id!} />}
          {page.name === "campi" && <Campi {...props} />}
          {page.name === "checkout" && <Checkout {...props} />}
          {page.name === "ok" && (
            <div className="grid h-full place-content-center gap-4 p-8 text-center">
              <div className="mx-auto grid size-20 place-items-center rounded-full text-4xl text-white" style={{ background: C.brote }}>✓</div>
              <h3 className="text-2xl font-extrabold" style={{ color: C.paramo }}>¡Pedido enviado!</h3>
              <p style={{ color: C.suave }}>{page.id! > 1 ? `Tu compra se dividió en ${page.id} pedidos, uno por finca.` : "El productor te confirmará por WhatsApp o llamada."}</p>
              <p className="rounded-xl p-3 text-sm" style={{ background: C.suelo, color: C.barro }}>💡 Cambia a <b>Ver como productor</b> para ver cómo le llega el pedido a Don Efraín.</p>
              <button onClick={() => { setPage(null); setTab("pedidos"); }} className="rounded-xl py-3 font-bold text-white" style={{ background: C.brote }}>Ver mis pedidos</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function BuyerHome({ state, setPage }: BuyerProps) {
  const [cat, setCat] = useState("Todo");
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Buenos días" : hour < 19 ? "Buenas tardes" : "Buenas noches";
  const list = state.products.filter((p) => cat === "Todo" || p.category === cat);
  return (
    <div>
      <div className="bg-white px-4 pt-3 pb-3">
        <p className="text-sm" style={{ color: C.barro }}>{greet}, Laura</p>
        <h2 className="text-2xl font-extrabold">¿Qué llevas hoy?</h2>
        <div className="mt-3 flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-xl border px-3 py-2.5 text-sm" style={{ borderColor: C.borde, color: C.suave }}>🔍 Papa, queso, café…</div>
          <span className="grid place-items-center rounded-xl border px-3" style={{ borderColor: C.borde }} title="Mapa de fincas">🗺️</span>
        </div>
      </div>
      {cat === "Todo" && (
        <div className="flex snap-x gap-3 overflow-x-auto px-4 pt-4 pb-1">
          <button onClick={() => setPage({ name: "campi" })} className="w-[80%] shrink-0 snap-start rounded-2xl p-4 text-left text-white" style={{ background: `linear-gradient(135deg, ${C.paramo}, ${C.brote})` }}>
            <span className="rounded-full px-2 py-0.5 text-[11px] font-bold" style={{ background: C.maiz, color: "#1f2a12" }}>✨ Asistente</span>
            <p className="mt-3 text-lg font-extrabold">Pregúntale a Campi</p>
            <p className="text-sm text-white/85">Arma tu mercado o una receta con lo que hay hoy</p>
          </button>
          {state.products.slice(5, 8).map((p) => (
            <button key={p.id} onClick={() => setPage({ name: "detalle", id: p.id })} className="w-[80%] shrink-0 snap-start rounded-2xl p-4 text-left" style={{ background: C.suelo }}>
              <span className="text-[11px] font-bold" style={{ color: C.barro }}>Cosecha de la semana</span>
              <p className="mt-1 text-lg font-extrabold">{p.emoji} {p.name}</p>
              <p className="text-sm" style={{ color: C.suave }}>{p.farm} · {p.town}</p>
              <p className="font-extrabold" style={{ color: C.brote }}>{cop(p.price)} / {p.unit}</p>
            </button>
          ))}
        </div>
      )}
      <div className="flex gap-2 overflow-x-auto px-4 py-4">
        {CATEGORIES.map(([name, icon]) => (
          <button key={name} onClick={() => setCat(name)} className="flex shrink-0 flex-col items-center gap-1 text-[11px] font-semibold">
            <span className="grid size-12 place-items-center rounded-2xl border text-2xl" style={{ background: cat === name ? C.maiz : "white", borderColor: C.borde }}>{icon}</span>{name}
          </button>
        ))}
      </div>
      <h3 className="px-4 pb-2 font-extrabold">{cat === "Todo" ? "Todo el catálogo" : cat}</h3>
      <div className="grid grid-cols-2 gap-3 px-4">
        {list.map((p) => <ProductCard key={p.id} p={p} onOpen={() => setPage({ name: "detalle", id: p.id })} />)}
      </div>
    </div>
  );
}

function BuyerSearch({ state, setPage }: BuyerProps) {
  const [q, setQ] = useState("");
  // Búsqueda sin importar tildes (igual que en la app real)
  const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const res = state.products.filter((p) => norm(`${p.name} ${p.category} ${p.farm} ${p.town}`).includes(norm(q)));
  return (
    <div className="p-4">
      <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca papa, cafe, Sandona…" className="w-full rounded-xl border bg-white px-4 py-3 outline-none" style={{ borderColor: C.borde }} />
      <p className="my-3 text-sm" style={{ color: C.suave }}>{res.length} resultados</p>
      <div className="grid grid-cols-2 gap-3">{res.map((p) => <ProductCard key={p.id} p={p} onOpen={() => setPage({ name: "detalle", id: p.id })} />)}</div>
    </div>
  );
}

function Detail({ state, id, setPage, addToCart }: BuyerProps & { id: number }) {
  const p = state.products.find((x) => x.id === id)!;
  const [qty, setQty] = useState(1);
  return (
    <div className="pb-24">
      <TopBar title={p.name} onBack={() => setPage(null)} />
      <div className="grid h-52 place-items-center text-8xl" style={{ background: C.suelo }}>{p.emoji}</div>
      <div className="p-5">
        <h3 className="text-2xl font-extrabold">{p.name}</h3>
        <p className="mt-1 text-2xl font-extrabold" style={{ color: C.brote }}>{cop(p.price)} <small className="text-sm font-normal" style={{ color: C.suave }}>/ {p.unit}</small></p>
        <p className="mt-3" style={{ color: C.suave }}>{p.desc}</p>
        <div className="mt-4 rounded-2xl p-4" style={{ background: C.suelo }}>
          <p className="text-sm font-bold" style={{ color: C.barro }}>🌱 Procedencia</p>
          <p className="font-bold">{p.farm} {p.farm === MY_FARM && "✅"}</p>
          <p className="text-sm" style={{ color: C.suave }}>{p.town}, Nariño · {p.stock} {p.unit}(s) disponibles</p>
        </div>
        <div className="mt-5 flex items-center gap-3">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="size-11 rounded-xl border bg-white text-xl" style={{ borderColor: C.borde }}>−</button>
          <span className="w-8 text-center text-xl font-bold">{qty}</span>
          <button onClick={() => setQty(Math.min(p.stock, qty + 1))} className="size-11 rounded-xl border bg-white text-xl" style={{ borderColor: C.borde }}>+</button>
          <button disabled={p.stock === 0} onClick={() => { addToCart(p.id, qty); setPage(null); }} className="flex-1 rounded-xl py-3 font-bold text-white disabled:opacity-50" style={{ background: C.brote }}>
            {p.stock === 0 ? "Agotado" : `Agregar · ${cop(qty * p.price)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

function Cart({ state, setQty, setPage }: BuyerProps) {
  const lines = Object.entries(state.cart).map(([id, qty]) => ({ p: state.products.find((x) => x.id === +id)!, qty }));
  const total = lines.reduce((a, l) => a + l.qty * l.p.price, 0);
  const farms = [...new Set(lines.map((l) => l.p.farm))];
  if (!lines.length) return <div className="grid h-full place-content-center p-8 text-center"><p className="text-5xl">🧺</p><p className="mt-3 font-bold">Tu carrito está vacío</p><p className="text-sm" style={{ color: C.suave }}>Agrega productos del catálogo o pídele a Campi que arme tu mercado.</p></div>;
  return (
    <div className="p-4">
      <h2 className="text-2xl font-extrabold">Tu carrito</h2>
      {farms.map((f) => (
        <div key={f} className="mt-4 rounded-2xl border bg-white p-3" style={{ borderColor: C.borde }}>
          <p className="mb-2 text-sm font-bold" style={{ color: C.barro }}>🏡 {f}</p>
          {lines.filter((l) => l.p.farm === f).map(({ p, qty }) => (
            <div key={p.id} className="flex items-center gap-2 py-1.5">
              <span className="text-2xl">{p.emoji}</span>
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{p.name}</p><p className="text-xs" style={{ color: C.suave }}>{cop(p.price)} / {p.unit}</p></div>
              <button onClick={() => setQty(p.id, qty - 1)} className="size-8 rounded-lg border" style={{ borderColor: C.borde }}>−</button>
              <span className="w-5 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(p.id, Math.min(p.stock, qty + 1))} className="size-8 rounded-lg border" style={{ borderColor: C.borde }}>+</button>
            </div>
          ))}
        </div>
      ))}
      <div className="mt-4 flex justify-between text-lg font-extrabold"><span>Total</span><span style={{ color: C.brote }}>{cop(total)}</span></div>
      <button onClick={() => setPage({ name: "checkout" })} className="mt-3 w-full rounded-xl py-3.5 font-bold text-white" style={{ background: C.brote }}>Continuar con el pedido</button>
    </div>
  );
}

function Checkout({ state, setPage, placeOrder }: BuyerProps) {
  const [delivery, setDelivery] = useState("Domicilio (pago contra entrega)");
  const [address, setAddress] = useState("Calle 18 # 25-30, barrio Las Cuadras, Pasto");
  const total = Object.entries(state.cart).reduce((a, [id, q]) => a + q * state.products.find((p) => p.id === +id)!.price, 0);
  return (
    <div>
      <TopBar title="Confirmar pedido" onBack={() => setPage(null)} />
      <div className="grid gap-4 p-4">
        <fieldset className="rounded-2xl border bg-white p-4" style={{ borderColor: C.borde }}>
          <legend className="px-1 text-sm font-bold">¿Cómo recibes el pedido?</legend>
          {["Domicilio (pago contra entrega)", "Lo recojo en la finca"].map((o) => (
            <label key={o} className="flex items-center gap-2 py-1.5"><input type="radio" checked={delivery === o} onChange={() => setDelivery(o)} style={{ accentColor: C.brote }} />{o}</label>
          ))}
        </fieldset>
        <label className="grid gap-1 text-sm font-bold">Dirección y referencias
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }} />
        </label>
        <p className="text-sm" style={{ color: C.suave }}>Pagas al recibir. El envío lo acuerdas con el productor cuando confirme el pedido.</p>
        <button disabled={!address.trim()} onClick={() => placeOrder(delivery, address)} className="rounded-xl py-3.5 font-bold text-white disabled:opacity-50" style={{ background: C.brote }}>Hacer pedido · {cop(total)}</button>
      </div>
    </div>
  );
}

/* Campi: asistente de compras. En la app real usa Google Gemini y, sin clave,
   un "modo local" con reglas. Esta demo usa ese modo local. */
function Campi({ state, setPage, addToCart }: BuyerProps) {
  type Msg = { from: "yo" | "campi"; text: string; items?: [number, number][] };
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "campi", text: "¡Hola! Soy Campi 🌽. Te ayudo a armar el mercado con un presupuesto o a cocinar algo nariñense con lo que hay hoy." }]);
  const [input, setInput] = useState("");

  const answer = (q: string): Msg => {
    const text = q.toLowerCase();
    const budget = Number((text.match(/\$?\s?(\d[\d.]*)/)?.[1] ?? "").replace(/\./g, ""));
    const recipe = RECIPES.find((r) => text.includes(r.name.split(" ")[0].toLowerCase()) || (text.includes("receta") && r === RECIPES[0]));
    if (recipe) {
      const items = recipe.items.filter(([, q]) => q > 0);
      return { from: "campi", text: `🍲 ${recipe.name}: ${recipe.text} Esto lo tienen hoy nuestros campesinos:`, items };
    }
    if (budget >= 1000) {
      // Arma el mercado priorizando lo básico y sin pasarse del presupuesto
      const order = [2, 3, 4, 12, 10, 11, 9, 5, 7, 8, 6, 1];
      let left = budget; const items: [number, number][] = [];
      for (const id of order) {
        const p = state.products.find((x) => x.id === id);
        if (!p || p.stock === 0) continue;
        const qty = Math.min(id === 10 ? 4 : 2, Math.floor(left / p.price), p.stock);
        if (qty > 0) { items.push([id, qty]); left -= qty * p.price; }
      }
      return { from: "campi", text: `Con ${cop(budget)} te propongo este mercado (te sobran ${cop(left)}):`, items };
    }
    if (text.includes("temporada") || text.includes("hoy") || text.includes("hay")) {
      return { from: "campi", text: "Esta semana está muy buena la fresa de Sandoná, el choclo de Tangua y la papa criolla de La Cocha:", items: [[7, 1], [10, 4], [2, 2]] };
    }
    return { from: "campi", text: "Puedo armar tu mercado con un presupuesto (ej. «mercado con $50.000») o darte una receta (ej. «receta de locro»)." };
  };

  const send = (q: string) => { if (!q.trim()) return; setMsgs((m) => [...m, { from: "yo", text: q }, answer(q)]); setInput(""); };

  return (
    <div className="flex h-full flex-col">
      <TopBar title="✨ Campi · asistente" onBack={() => setPage(null)} />
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[88%] rounded-2xl p-3 text-sm ${m.from === "yo" ? "ml-auto text-white" : "bg-white"}`} style={{ background: m.from === "yo" ? C.brote : undefined }}>
            {m.text}
            {m.items && (
              <div className="mt-2 grid gap-1.5">
                {m.items.map(([id, q]) => { const p = state.products.find((x) => x.id === id)!; return (
                  <div key={id} className="flex items-center justify-between rounded-lg px-2 py-1.5" style={{ background: C.suelo }}>
                    <span>{p.emoji} {q} {plural(p.unit, q)} de {p.name.toLowerCase()}</span><b>{cop(q * p.price)}</b>
                  </div>); })}
                <button onClick={() => m.items!.forEach(([id, q]) => addToCart(id, q))} className="mt-1 rounded-lg py-2 font-bold text-white" style={{ background: C.brote }}>Agregar todo al carrito</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto px-3 pb-2 text-xs">
        {["Mercado con $50.000", "Receta de locro", "¿Qué hay de temporada?"].map((s) => (
          <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border bg-white px-3 py-1.5 font-semibold" style={{ borderColor: C.borde, color: C.paramo }}>{s}</button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2 border-t bg-white p-3" style={{ borderColor: C.borde }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escríbele a Campi…" className="flex-1 rounded-xl border px-3 py-2 outline-none" style={{ borderColor: C.borde }} />
        <button className="rounded-xl px-4 font-bold text-white" style={{ background: C.brote }}>➤</button>
      </form>
    </div>
  );
}

function Orders({ orders, producer, onAdvance }: { orders: Order[]; producer?: boolean; onAdvance?: (id: number) => void }) {
  if (!orders.length) return <div className="grid h-full place-content-center p-8 text-center"><p className="text-5xl">📦</p><p className="mt-3 font-bold">{producer ? "Aún no tienes pedidos" : "Aún no has hecho pedidos"}</p><p className="text-sm" style={{ color: C.suave }}>{producer ? "Cuando alguien compre tus productos, aparecerán aquí." : "Tus pedidos y su estado aparecerán aquí."}</p></div>;
  const next: Record<OrderStatus, string> = { NUEVO: "Confirmar", CONFIRMADO: "Marcar en camino", EN_CAMINO: "Marcar entregado", ENTREGADO: "" };
  return (
    <div className="grid gap-3 p-4">
      <h2 className="text-2xl font-extrabold">{producer ? "Pedidos recibidos" : "Mis pedidos"}</h2>
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border bg-white p-4" style={{ borderColor: C.borde }}>
          <div className="flex items-center justify-between">
            <b>Pedido #{o.id}</b>
            <span className="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: STATUS[o.status].color }}>{STATUS[o.status].label}</span>
          </div>
          <p className="text-sm" style={{ color: C.barro }}>{producer ? `👤 ${o.buyer}` : `🏡 ${o.farm}`} · {o.delivery}</p>
          <ul className="mt-2 text-sm" style={{ color: C.suave }}>{o.items.map((i) => <li key={i.id}>{i.qty} × {i.name}</li>)}</ul>
          <p className="mt-2 font-extrabold" style={{ color: C.brote }}>{cop(o.total)}</p>
          {producer && o.status !== "ENTREGADO" && <button onClick={() => onAdvance?.(o.id)} className="mt-2 w-full rounded-xl py-2.5 font-bold text-white" style={{ background: C.brote }}>{next[o.status]}</button>}
        </div>
      ))}
    </div>
  );
}

function Profile({ name, email, role }: { name: string; email: string; role: string }) {
  return (
    <div className="p-5">
      <div className="grid size-20 place-items-center rounded-full text-3xl text-white" style={{ background: C.paramo }}>{name[0]}</div>
      <h2 className="mt-3 text-2xl font-extrabold">{name}</h2>
      <p style={{ color: C.suave }}>{email} · {role}</p>
      <ul className="mt-5 grid gap-2 text-sm">
        {["🔒 Sesión cifrada en el teléfono (Android Keystore)", "📴 Funciona sin conexión con los productos guardados", "🔔 Notificaciones de pedidos y pagos"].map((t) => <li key={t} className="rounded-xl bg-white p-3">{t}</li>)}
      </ul>
    </div>
  );
}

/* ---------------------------------- PRODUCTOR ---------------------------------- */
function Producer({ state, setState, tab, setTab, page, setPage, toast }: {
  state: State; setState: React.Dispatch<React.SetStateAction<State>>; tab: string; setTab: (t: string) => void;
  page: { name: string; id?: number } | null; setPage: (p: { name: string; id?: number } | null) => void; toast: (t: string) => void;
}) {
  const mine = state.products.filter((p) => p.farm === MY_FARM);
  const myOrders = state.orders.filter((o) => o.farm === MY_FARM);
  const pending = myOrders.filter((o) => o.status !== "ENTREGADO");
  const delivered = myOrders.filter((o) => o.status === "ENTREGADO").reduce((a, o) => a + o.total, 0);
  const low = mine.filter((p) => p.stock <= 5);
  const advance = (id: number) => {
    const flow: OrderStatus[] = ["NUEVO", "CONFIRMADO", "EN_CAMINO", "ENTREGADO"];
    setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, status: flow[flow.indexOf(o.status) + 1] } : o)) }));
    toast("Estado actualizado: el comprador ya lo ve");
  };

  return (
    <>
      <div className="h-full overflow-y-auto pb-20">
        {tab === "panel" && (
          <div className="p-4">
            <p className="text-sm" style={{ color: C.barro }}>{MY_FARM} ✅</p>
            <h2 className="text-2xl font-extrabold">Hola, Don Efraín</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[[pending.length, "Pedidos por atender", pending.length > 0], [cop(delivered), "Entregado hoy", false], [mine.filter((p) => p.stock > 0).length, "Productos a la venta", false], [mine.filter((p) => p.stock === 0).length, "Sin cosecha disponible", false]].map(([v, l, alert]) => (
                <div key={String(l)} className="rounded-2xl border bg-white p-3" style={{ borderColor: alert ? C.maiz : C.borde, background: alert ? "#fff8e8" : "white" }}>
                  <p className="text-xl font-extrabold">{v}</p><p className="text-xs" style={{ color: C.suave }}>{l}</p>
                </div>
              ))}
            </div>
            {low.length > 0 && (
              <div className="mt-4">
                <h3 className="font-extrabold">⚠️ Se están acabando</h3>
                {low.map((p) => (
                  <div key={p.id} className="mt-2 flex items-center gap-3 rounded-2xl bg-white p-3">
                    <span className="text-2xl">{p.emoji}</span>
                    <div className="flex-1"><b className="text-sm">{p.name}</b><p className="text-xs" style={{ color: C.suave }}>Quedan {p.stock} {p.unit}</p></div>
                    <button onClick={() => setState((s) => ({ ...s, products: s.products.map((x) => (x.id === p.id ? { ...x, stock: x.stock + 20 } : x)) }))} className="text-sm font-bold" style={{ color: C.brote }}>+20</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setPage({ name: "form" })} className="mt-4 w-full rounded-xl py-3.5 font-bold text-white" style={{ background: C.brote }}>＋ Publicar producto</button>
            {pending.length > 0 ? (
              <button onClick={() => setTab("pedidos")} className="mt-3 w-full rounded-xl border bg-white py-3 font-bold" style={{ borderColor: C.borde, color: C.paramo }}>Ver {pending.length} pedido(s) por atender →</button>
            ) : <p className="mt-4 text-center text-sm" style={{ color: C.suave }}>No tienes pedidos pendientes. Cuando alguien compre, aparecerá aquí.</p>}
          </div>
        )}
        {tab === "productos" && (
          <div className="grid gap-2 p-4">
            <h2 className="text-2xl font-extrabold">Mis productos</h2>
            {mine.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                <span className="text-3xl">{p.emoji}</span>
                <div className="flex-1"><b className="text-sm">{p.name}</b><p className="text-xs" style={{ color: C.suave }}>{cop(p.price)} / {p.unit} · stock {p.stock}</p></div>
              </div>
            ))}
            <button onClick={() => setPage({ name: "form" })} className="mt-2 rounded-xl py-3 font-bold text-white" style={{ background: C.brote }}>＋ Publicar producto</button>
          </div>
        )}
        {tab === "pedidos" && <Orders orders={myOrders} producer onAdvance={advance} />}
        {tab === "perfil" && <Profile name="Don Efraín Rosero" email="productor@demo.co" role={`Productor · ${MY_FARM}`} />}
      </div>
      <Tabs tab={tab} setTab={(t) => { setTab(t); setPage(null); }} items={[["panel", "📊", "Panel"], ["productos", "🧺", "Mis productos"], ["pedidos", "📦", "Pedidos", pending.length], ["perfil", "👤", "Perfil"]]} />
      {page?.name === "form" && (
        <div className="absolute inset-0 z-20 overflow-y-auto" style={{ background: C.nube }}>
          <ProductForm products={state.products} onBack={() => setPage(null)} onSave={(p) => {
            setState((s) => ({ ...s, products: [...s.products, { ...p, id: s.nextId, farm: MY_FARM, town: "Pasto" }], nextId: s.nextId + 1 }));
            setPage(null); setTab("productos"); toast("¡Publicado! Ya aparece en el catálogo del comprador");
          }} />
        </div>
      )}
    </>
  );
}

function ProductForm({ products, onBack, onSave }: { products: Product[]; onBack: () => void; onSave: (p: Omit<Product, "id" | "farm" | "town">) => void }) {
  const [f, setF] = useState({ name: "Haba verde", category: "Granos", price: "", unit: "libra", stock: "30", emoji: "🫛", desc: "" });
  const [hint, setHint] = useState("");
  const set = (k: keyof typeof f, v: string) => setF((s) => ({ ...s, [k]: v }));

  // "Sugerir precio": rango según productos parecidos publicados (misma categoría)
  const suggestion = useMemo(() => {
    const same = products.filter((p) => p.category === f.category && p.unit === f.unit);
    const pool = same.length ? same : products.filter((p) => p.category === f.category);
    if (!pool.length) return null;
    const avg = pool.reduce((a, p) => a + p.price, 0) / pool.length;
    return { min: Math.round((avg * 0.85) / 100) * 100, max: Math.round((avg * 1.15) / 100) * 100, avg: Math.round(avg / 100) * 100, n: pool.length };
  }, [products, f.category, f.unit]);

  const valid = f.name.trim().length > 2 && +f.price > 0 && +f.stock >= 0;
  return (
    <div className="pb-6">
      <TopBar title="Publicar producto" onBack={onBack} />
      <div className="grid gap-3 p-4 text-sm">
        <label className="grid gap-1 font-bold">Nombre<input value={f.name} onChange={(e) => set("name", e.target.value)} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 font-bold">Categoría
            <select value={f.category} onChange={(e) => set("category", e.target.value)} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }}>
              {CATEGORIES.slice(1).map(([c]) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label className="grid gap-1 font-bold">Unidad
            <select value={f.unit} onChange={(e) => set("unit", e.target.value)} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }}>
              {["libra", "arroba", "atado", "unidad", "litro"].map((u) => <option key={u}>{u}</option>)}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 font-bold">Precio (COP)<input inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }} placeholder="0" /></label>
          <label className="grid gap-1 font-bold">Cantidad<input inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }} /></label>
        </div>
        <button type="button" disabled={!suggestion} onClick={() => { if (!suggestion) return; set("price", String(suggestion.avg)); setHint(`💡 Precio sugerido ${cop(suggestion.avg)} (rango ${cop(suggestion.min)} – ${cop(suggestion.max)}, según ${suggestion.n} producto(s) parecidos).`); }}
          className="rounded-xl border-2 py-2.5 font-bold" style={{ borderColor: C.maiz, color: C.barro, background: "#fff8e8" }}>💰 Sugerir precio</button>
        {hint && <p className="rounded-xl p-3" style={{ background: C.suelo, color: C.barro }}>{hint}</p>}
        <label className="grid gap-1 font-bold">Descripción<textarea rows={3} value={f.desc} onChange={(e) => set("desc", e.target.value)} className="rounded-xl border bg-white p-3 font-normal" style={{ borderColor: C.borde }} /></label>
        <button type="button" onClick={() => set("desc", `${f.name} de ${MY_FARM}, cultivado cerca a la Laguna de La Cocha sin químicos. Cosecha fresca de esta semana, ideal para la cocina nariñense. Se vende por ${f.unit}.`)}
          className="rounded-xl border-2 py-2.5 font-bold" style={{ borderColor: C.brote, color: C.brote, background: "white" }}>✨ Escribir con IA</button>
        <button disabled={!valid} onClick={() => onSave({ name: f.name.trim(), category: f.category, price: +f.price, unit: f.unit, stock: +f.stock, emoji: f.emoji, desc: f.desc || "Producto fresco del campo nariñense." })}
          className="mt-2 rounded-xl py-3.5 font-bold text-white disabled:opacity-50" style={{ background: C.brote }}>Publicar</button>
        {!valid && <p className="text-xs" style={{ color: C.suave }}>Completa nombre y precio para publicar.</p>}
      </div>
    </div>
  );
}
