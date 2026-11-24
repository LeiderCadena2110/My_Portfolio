import fs from "node:fs";
import path from "node:path";

/* =============================================================================
   Lee AUTOMÁTICAMENTE las capturas y videos reales de cada demo.
   Copia tus archivos a public/demos/<project>/ con nombres EN INGLÉS como:
     01-home.webp · 02-sign-in.webp · 03-training.mp4
   El número ordena el recorrido. El título en español se escribe en la página
   de la demo (objeto `captions`), usando el nombre sin número como clave.
   Si el nombre termina en "-phone" o "-watch" se muestra en ese marco.
   Formatos: .png .jpg .jpeg .webp .gif (imágenes) · .mp4 .webm (videos)
   ============================================================================= */
import type { Media } from "./media-shared";
export type { Captions, Media } from "./media-shared";

const IMAGES = [".png", ".jpg", ".jpeg", ".webp", ".gif"];
const VIDEOS = [".mp4", ".webm"];

export function getMedia(project: string): Media[] {
  const dir = path.join(process.cwd(), "public", "demos", project);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => [...IMAGES, ...VIDEOS].includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((f) => {
      const ext = path.extname(f).toLowerCase();
      let key = path.basename(f, ext).replace(/^\d+[-_ ]*/, "");
      let device: Media["device"];
      if (/[-_]phone$/i.test(key)) { device = "phone"; key = key.replace(/[-_]phone$/i, ""); }
      if (/[-_]watch$/i.test(key)) { device = "watch"; key = key.replace(/[-_]watch$/i, ""); }
      return { src: `/demos/${project}/${f}`, type: VIDEOS.includes(ext) ? "video" : "image", key, device };
    });
}

