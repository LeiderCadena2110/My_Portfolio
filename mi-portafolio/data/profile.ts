import type { Profile } from "./types";

/* =============================================================================
   ✏️ TUS DATOS PERSONALES — se usan en todo el sitio.
   Los textos están escritos en primera persona, como si me presentara.
   ============================================================================= */
export const profile: Profile = {
  name: "Leider Alexander Cadena Cabrera",
  firstName: "Leider",
  initials: "LC",
  role: "Estudiante de Ingeniería de Software",
  semester: "5.º semestre",
  greeting:
    "Estudio Ingeniería de Software y disfruto construir lo que no se ve: APIs, bases de datos y la arquitectura que hace que una app funcione bien. Mi stack: Node.js, NestJS, Express, Java con Spring Boot, PostgreSQL y Docker.",
  roles: ["Backend Developer", "Arquitectura de Software", "Bases de Datos", "APIs y Cloud"],
  statement:
    "Construyo **sistemas backend** con **APIs claras**, bases de datos bien pensadas y una **arquitectura que aguanta**, para que una idea termine siendo una **app que la gente usa de verdad**.",
  about: [
    "Me encanta programar y ver cómo una idea se convierte en algo que funciona. Empecé por el backend y ahí me quedé: diseñar la base de datos, pensar los servicios y dejar el código ordenado para el siguiente que lo lea.",
    "Hoy curso quinto semestre en la Universidad Cooperativa de Colombia, en Pasto, y trabajo mientras estudio. Esa combinación me enseñó a organizar el tiempo y a entender lo que un negocio real necesita de un sistema.",
  ],
  motto: "Un buen sistema no es el que más cosas hace, sino el que se puede entender, probar y hacer crecer.",
  location: "Pasto, Nariño · Colombia",
  city: "Pasto, CO",
  timeZone: "America/Bogota",
  email: "leidercadena15@gmail.com",
  github: "https://github.com/LeiderCadena2110",
  githubUser: "LeiderCadena2110",
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
