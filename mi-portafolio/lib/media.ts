import fs from "node:fs";
import path from "node:path";

/* =============================================================================
   Lee AUTOMÁTICAMENTE las capturas y videos reales de cada demo.
   Solo copia tus archivos a public/demos/<proyecto>/ con nombres como:
     01-inicio.png · 02-registrar-toma.png · 03-entrenamiento.mp4
   El número ordena el recorrido y el resto del nombre es el título.
   Si el nombre termina en "-celular" o "-reloj" se muestra en ese marco.
   Formatos: .png .jpg .jpeg .webp .gif (imágenes) · .mp4 .webm (videos)
   ============================================================================= */
export type Media = { src: string; type: "image" | "video"; title: string; device?: "phone" | "watch" };

const IMAGES = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const VIDEOS = [".mp4", ".webm"];

export function getMedia(project: string): Media[] {
  const dir = path.join(process.cwd(), "public", "demos", project);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => [...IMAGES, ...VIDEOS].includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "es", { numeric: true }))
    .map((f) => {
      const ext = path.extname(f).toLowerCase();
      let base = path.basename(f, ext).replace(/^\d+[-_ ]*/, "");
      let device: Media["device"];
      if (/[-_](celular|phone)$/i.test(base)) { device = "phone"; base = base.replace(/[-_](celular|phone)$/i, ""); }
      if (/[-_](reloj|watch)$/i.test(base)) { device = "watch"; base = base.replace(/[-_](reloj|watch)$/i, ""); }
      const title = base.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
      return { src: `/demos/${project}/${f}`, type: VIDEOS.includes(ext) ? "video" : "image", title, device };
    });
}
