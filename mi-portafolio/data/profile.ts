import type { Profile } from "./types";

/* ✏️ TUS DATOS PERSONALES — se usan en todo el sitio */
export const profile: Profile = {
  name: "Leider Alexander Cadena Cabrera",
  firstName: "Leider",
  initials: "LC",
  role: "Estudiante de Ingeniería de Software",
  semester: "5.º semestre",
  tagline:
    "Me apasiona el backend y la arquitectura de sistemas: diseño APIs, bases de datos y soluciones robustas que escalan.",
  roles: ["Backend Dev", "Arquitectura", "Bases de Datos", "APIs & Cloud"],
  location: "Pasto, Nariño · Colombia",
  email: "leidercadena15@gmail.com",
  github: "https://github.com/LeiderCadena2110",
  githubUser: "@LeiderCadena2110",
  linkedin: "https://www.linkedin.com/in/leider-cadena-459425449/",
  // whatsapp: "https://wa.me/57XXXXXXXXXX", // ← opcional: descomenta y pon tu número
  cvUrl: "/cv.pdf",
  formEndpoint: "", // ← pega aquí tu URL de Formspree (https://formspree.io)
};

/* Enlaces del menú: el href debe coincidir con el id de cada sección */
export const navLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#testimonios", label: "Testimonios" },
  { href: "#experiencia", label: "Experiencia" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#contacto", label: "Contacto" },
];
