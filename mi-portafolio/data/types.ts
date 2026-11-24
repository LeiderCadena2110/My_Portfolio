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
  greeting: string; // frase corta del Hero
  interests: string[]; // gustos que se muestran en el Hero
  roles: string[]; // palabras que se escriben solas en el Hero
  statement: string; // frase grande de "Sobre mí"; las palabras entre **asteriscos** se resaltan
  about: string[]; // párrafos de "Sobre mí"
  motto: string; // frase con la que cierras "Sobre mí"
  location: string;
  city: string;
  timeZone: string; // para el reloj de la sección de contacto
  email: string;
  github: string;
  githubUser: string; // usuario de GitHub, sin @
  linkedin: string;
  whatsapp?: string; // opcional: "https://wa.me/57XXXXXXXXXX"
  cvUrl: string; // archivo en /public
  formEndpoint: string; // URL de Formspree; vacío = abre la app de correo
};

export type ProjectCover =
  | { kind: "phone"; src: string }
  | { kind: "window"; src: string }
  | { kind: "watch"; src: string }; // captura redonda del reloj

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  highlights: string[];
  tags: string[];
  github: string; // Link GitHub (obligatorio según la guía)
  demo: string; // Link a la demo (obligatorio según la guía)
  extra?: { label: string; href: string }[]; // otros enlaces: APK, instaladores, versión web
  cover: ProjectCover;
  collaboration?: { role: string; with: string; owner: string }; // proyecto hecho en equipo
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
  highlights: string[];
  stack?: string[];
  image?: string; // foto o captura opcional para la tarjeta
};

export type StackKey = {
  label: string; // texto corto en la tecla
  name: string;
  description: string;
  color: "sapphire" | "deep" | "pearl" | "ember";
};
