# Portafolio · Leider Alexander Cadena Cabrera

Portafolio personal hecho con **Next.js (App Router) + TypeScript + Tailwind CSS**, listo para publicar en **Vercel**,
siguiendo la guía del curso de Diseño de Interfaces: https://structure-portfolio.vercel.app/

## ✅ Checklist de la guía

| Requisito | Dónde está | Estado |
|---|---|---|
| Proyecto en Next.js + TypeScript | `app/`, `components/*.tsx`, `data/*.ts` | ✅ |
| Estilos con Tailwind CSS | clases en cada componente · tema en `app/globals.css` | ✅ |
| 1. Menú: logo, enlaces a todas las secciones, fijo, hamburguesa, scroll suave | `components/Navbar.tsx` | ✅ |
| 2. Hero: nombre, rol, foto, frase, **Descargar CV**, Ver proyectos | `components/Hero.tsx` + `public/cv.pdf` | ✅ revisa tu CV |
| 3. Acerca de mí: párrafo, foto, habilidades, datos rápidos | `components/About.tsx` | ✅ |
| 4. Proyectos: imagen, título, descripción, etiquetas, **GitHub + Demo** | `components/Projects.tsx` + `data/projects.ts` + demos en `app/demos/` | ✅ |
| 5. Testimonios: **mínimo 3** | `components/Testimonials.tsx` + `data/testimonials.ts` | ⚠️ faltan los textos reales |
| 6. Experiencia **académica y laboral**, con fechas, de lo más reciente a lo más antiguo | `components/Experience.tsx` + `data/experience.ts` | ⚠️ cambia los `20XX` |
| 7. Contactos: correo, LinkedIn, GitHub, formulario con validación y confirmación | `components/Contact.tsx` | ✅ (Formspree opcional) |
| 8. Pie de página: nombre y © año, redes, enlaces, volver arriba, créditos | `components/Footer.tsx` | ✅ |
| ⭐ Sección adicional | `components/Skills.tsx` (teclado 3D de habilidades) | ✅ |
| Responsive (celular, tablet, escritorio) | todas las secciones | ✅ |
| Código en GitHub con commits | ver pasos abajo | ⏳ |
| Publicado en Vercel | ver pasos abajo | ⏳ |

## 📁 Estructura

```
mi-portafolio/
├─ app/
│  ├─ demos/          /demos/minga · /demos/hidrasmart · /demos/stockflow
│  ├─ layout.tsx      ← estructura global, SEO y fuentes
│  ├─ page.tsx        ← une todas las secciones en orden
│  └─ globals.css     ← Tailwind + tema de colores + efectos 3D
├─ components/
│  ├─ Navbar.tsx      1 Menú
│  ├─ Hero.tsx        2 Hero + CV
│  ├─ About.tsx       3 Acerca de mí
│  ├─ Projects.tsx    4 Proyectos
│  ├─ Testimonials.tsx 5 Testimonios
│  ├─ Experience.tsx  6 Experiencia
│  ├─ Skills.tsx      ⭐ Adicional (habilidades)
│  ├─ Contact.tsx     7 Contactos (+ Globe.tsx)
│  ├─ Footer.tsx      8 Pie de página
│  ├─ Effects.tsx     barra de progreso, scroll reveal, efecto onda, cursor
│  ├─ demos/          MingaDemo · HidraSmartDemo · StockFlowDemo · DemoShell
│  └─ Icons.tsx       íconos SVG
├─ data/              ← ✏️ TODO tu contenido, tipado con TypeScript
│  ├─ types.ts · profile.ts · projects.ts · testimonials.ts · experience.ts · skills.ts
└─ public/
   ├─ cv.pdf          ← tu hoja de vida (botón «Descargar CV»)
   └─ images/         ← fotos
```

## ▶️ Ejecutar en tu computador

Necesitas Node.js 18.18 o superior.

```bash
npm install
npm run dev        # abre http://localhost:3000
```

## ✏️ Lo que te falta completar (antes de entregar)

1. **Testimonios (obligatorio, mínimo 3):** pide 2–3 frases reales a un profesor, a un compañero de proyecto y a tu jefe.
   Ponlas en `data/testimonials.ts` y cambia `pending: true` por `pending: false`.
   No inventes testimonios: el profesor puede preguntar por ellos.
2. **Demos:** ya están listas dentro del portafolio (ver la sección «Demos para la sustentación»).
3. **Fechas:** en `data/experience.ts` cambia los `20XX`.
4. **CV:** `public/cv.pdf` es una versión inicial hecha con tus datos. Revísala y reemplázala por tu hoja de vida
   definitiva (mismo nombre `cv.pdf`).
5. **Formulario (opcional):** crea un formulario gratis en https://formspree.io y pega la URL en
   `data/profile.ts` → `formEndpoint`. Sin eso, el botón abre la app de correo del visitante.
6. **WhatsApp (opcional):** descomenta `whatsapp` en `data/profile.ts`.

## 🎤 Demos para la sustentación

Cada proyecto tiene una demo interactiva dentro del mismo portafolio, con su **guion paso a paso** a la izquierda:

| Proyecto | Ruta | Qué muestra |
|---|---|---|
| Minga App | `/demos/minga` | Celular: comprador (inicio, búsqueda sin tildes, Campi con IA, carrito por finca, pedido) y productor (panel, pedidos que llegan del comprador, publicar con «Sugerir precio» y «Escribir con IA») |
| HidraSmart | `/demos/hidrasmart` | Reloj Wear OS: anillo del día, registrar toma, entrenamiento con alertas (cada 20 s en la demo), resumen con análisis IA, coach, planear, historial y el Tile |
| StockFlow | `/demos/stockflow` | Escritorio: panel, punto de venta con IVA 19 % y atajos F2/F12, factura FV-000051, anular factura, kardex con costo promedio, reportes y asistente IA |

- Usan las mismas pantallas, colores, textos, fórmulas y datos de ejemplo de tus repositorios, y funcionan **sin internet**
  (no dependen de Render, que se duerme en el plan gratis).
- Lo que haces queda guardado en ese navegador; el botón **Reiniciar demo** las deja como nuevas antes de presentar.
- Los archivos están en `components/demos/` (un componente por demo) y `app/demos/` (las páginas).

## 🐙 Subir a GitHub

```bash
git init
git add .
git commit -m "feat: portafolio con Next.js, TypeScript y Tailwind"
git branch -M main
git remote add origin https://github.com/LeiderCadena2110/mi-portafolio.git
git push -u origin main
```

Haz un commit por cada cambio (ej. `feat: agrega testimonios`, `fix: fechas de experiencia`).

## ▲ Publicar en Vercel

1. Entra a https://vercel.com con tu cuenta de GitHub.
2. **Add New → Project** → importa `mi-portafolio`.
3. Vercel detecta Next.js solo: clic en **Deploy**.
4. Obtienes tu URL pública (ej. `leider-cadena.vercel.app`). Cada `git push` publica una nueva versión.
5. Agrega esa URL como **Demo** del proyecto «Portafolio» y en tu LinkedIn.

## 🎨 Personalizar colores

En `app/globals.css`, bloque `@theme`: cada `--color-x` genera clases como `bg-x`, `text-x`, `border-x`.
Los fondos son azules y gris azulado (sin negro puro ni blanco puro, como pidió el profesor).
