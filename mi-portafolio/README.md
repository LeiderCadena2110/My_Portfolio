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
| Paleta 60·30·10 (zafiro, perla y naranja brasa) | `app/globals.css` | ✅ |
| Responsive (celular, tablet, escritorio) | todas las secciones | ✅ |
| Código en GitHub con commits | ver pasos abajo | ⏳ |
| Publicado en Vercel | ver pasos abajo | ⏳ |

## 📁 Estructura

```
mi-portafolio/
├─ app/
│  ├─ demos/          /demos/minga · /demos/stockflow · /demos/hidrasmart · /demos/nexus
│  ├─ layout.tsx      ← estructura global, SEO y fuentes
│  ├─ page.tsx        ← une todas las secciones en orden
│  └─ globals.css     ← Tailwind + paleta 60·30·10 + animaciones
├─ components/
│  ├─ Navbar.tsx      1 Menú
│  ├─ Hero.tsx        2 Hero + CV
│  ├─ About.tsx       3 Acerca de mí
│  ├─ Projects.tsx    4 Proyectos
│  ├─ Testimonials.tsx 5 Testimonios
│  ├─ Experience.tsx  6 Experiencia
│  ├─ Skills.tsx      ⭐ Adicional (habilidades)
│  ├─ Contact.tsx     7 Contactos
│  ├─ Footer.tsx      8 Pie de página
│  ├─ Effects.tsx     barra de progreso, scroll reveal, efecto onda, cursor
│  ├─ demos/          RealDemo (marcos y recorrido) · DemoShell (página y guion)
│  └─ Icons.tsx       íconos SVG
├─ lib/               ← media.ts (lee las capturas de las demos) · media-shared.ts
├─ data/              ← ✏️ TODO tu contenido, tipado con TypeScript
│  ├─ types.ts · profile.ts · projects.ts · testimonials.ts · experience.ts · skills.ts
└─ public/
   ├─ cv.pdf          ← tu hoja de vida (botón «Descargar CV»)
   ├─ demos/          ← capturas y videos reales de cada app
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

## 🎤 Demos para la sustentación (tus apps reales)

Cada proyecto tiene su página de demo con un **guion paso a paso**. Todo lo que se ve es la app real:

| Proyecto | Ruta | Qué muestra |
|---|---|---|
| Minga App | `/demos/minga` | 12 **capturas reales** de la app (comprador y productor) + pestaña con la **versión web en vivo** |
| StockFlow | `/demos/stockflow` | **Video del recorrido** (sin sonido) + las 11 **capturas reales** de `docs/screenshots` |
| HidraSmart | `/demos/hidrasmart` | **Video del emulador** del reloj (sin sonido) + 10 capturas sacadas de ese video |
| Nexus-7 (colaborador) | `/demos/nexus` | El **video de la Fase 6** y las capturas de `docs/media` del repo `moreno-stack/Nexuz-7` |

### Cómo agregar capturas o videos

1. Copia los archivos en `public/demos/<proyecto>/` (por ejemplo `public/demos/hidrasmart/`).
2. Nómbralos **en inglés** con número: `01-home-watch.png`, `02-log-drink-watch.png`, `03-training.mp4`.
   El número ordena el recorrido.
3. Si el nombre termina en `-phone` se muestra en marco de celular; `-watch`, en marco de reloj.
4. Escribe el título en español en la página de la demo (`app/demos/<proyecto>/page.tsx`, objeto `captions`),
   usando el nombre sin número como clave: `"log-drink": { title: "Registrar una toma" }`.
5. Recarga la página (con `npm run dev` aparecen al instante; en Vercel, después del `git push`).

Formatos: `.png .jpg .webp .gif` y videos `.mp4 .webm` (cortos, de menos de 20 MB).

### Cómo sacar capturas y videos

- **Android Studio (HidraSmart y Minga):** en el emulador, el ícono de cámara 📷 toma captura;
  en *Running Devices* el botón *Record screen* graba video. También: `adb shell screenrecord /sdcard/demo.mp4`.
- **StockFlow (Windows):** `Win + Shift + S` para capturas y `Win + Alt + R` (Xbox Game Bar) para grabar video.
- **Minga:** la versión web ya está en vivo; el servidor gratis de Render se duerme, ábrela 1–2 minutos antes.

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
2. **Add New → Project** → importa `My_Portfolio`.
3. En **Root Directory** elige `mi-portafolio` y clic en **Deploy**.
4. Obtienes tu URL pública (ej. `leider-cadena.vercel.app`). Cada `git push` publica una nueva versión.
5. Agrega esa URL como **Demo** del proyecto «Portafolio» y en tu LinkedIn.

## 🎨 Personalizar colores

En `app/globals.css`, bloque `@theme`: cada `--color-x` genera clases como `bg-x`, `text-x`, `border-x`.
La paleta sigue la regla **60 · 30 · 10**: zafiro profundo (60 %, fondos oscuros y textos),
blanco perla (30 %, fondos claros) y naranja brasa `#FF5A12` (10 %, acentos). Sin negro ni blanco puro,
como pidió el profesor.
