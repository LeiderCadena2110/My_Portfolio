/* =============================================================================
   Tipos de TypeScript: definen la forma de cada dato del portafolio.
   Si agregas un campo aquí, TypeScript te avisará dónde falta.
   ============================================================================= */

export type Profile = {
  name: string;
  firstName: string;
  initials: string;
  role: string;
  semester: string;
  tagline: string;
  roles: string[]; // palabras que cambian en el Hero
  location: string;
  email: string;
  github: string;
  githubUser: string;
  linkedin: string;
  whatsapp?: string; // opcional: "https://wa.me/57XXXXXXXXXX"
  cvUrl: string; // archivo en /public
  formEndpoint: string; // URL de Formspree; vacío = abre la app de correo
};

export type ProjectMock = "phone" | "watch" | "infra" | "desktop" | "api" | "web";
export type Theme = "blue" | "green" | "amber" | "slate";

export type Project = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  github: string; // Link GitHub (obligatorio según la guía)
  demo: string; // Link Vercel / Demo en vivo (obligatorio según la guía)
  extra?: { label: string; href: string }[]; // otros enlaces: APK, instaladores, versión web
  image?: string; // captura real en /public/images (opcional)
  mock: ProjectMock; // ilustración ligera si no hay captura
  theme: Theme;
};

export type Testimonial = {
  name: string;
  role: string; // relación contigo: Profesor, Compañero, Jefe…
  text: string;
  avatar?: string; // foto en /public/images (opcional)
  pending?: boolean; // true = aún no tienes el testimonio real
};

export type ExperienceItem = {
  type: "academica" | "laboral";
  title: string;
  place: string;
  date: string;
  description: string;
};

export type StackKey = {
  label: string; // texto corto en la tecla
  name: string;
  description: string;
  color: "blue" | "green" | "amber" | "slate" | "light";
};
