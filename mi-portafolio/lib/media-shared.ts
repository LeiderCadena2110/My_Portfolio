/* Tipos y utilidades de las demos que también usa el navegador (sin node:fs) */
export type Media = { src: string; type: "image" | "video"; key: string; device?: "phone" | "watch" };
export type Captions = Record<string, { title: string; note?: string }>;

/* Título por defecto si la captura no tiene uno en `captions`: "my-products" → "My products" */
export const humanize = (key: string) => key.replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
