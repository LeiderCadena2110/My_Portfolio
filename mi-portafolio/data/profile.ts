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
    "Estudiante de Ingeniería de Software enfocado en el backend: APIs, bases de datos y arquitectura. Fuera del código me gustan los deportes, y en los proyectos lo que más disfruto es trabajar en equipo.",
  interests: ["Deportes", "Trabajo en equipo", "Backend"],
  roles: ["Backend Developer", "Arquitectura de Software", "Bases de Datos", "APIs y Cloud"],
  statement:
    "Construyo **sistemas backend** con **APIs claras**, bases de datos bien pensadas y una **arquitectura que aguanta**, para que una idea termine siendo una **app que la gente usa de verdad**.",
  about: [
    "Curso quinto semestre en la Universidad Cooperativa de Colombia, en Pasto. Lo que más me atrae del software es lo que no se ve: cómo se guardan los datos, cómo se comunican los servicios y cómo se organiza el código para que otro lo entienda.",
    "Trabajo mientras estudio y practico deporte, y de las dos cosas saqué lo mismo: disciplina y saber jugar en equipo. Por eso me siento cómodo en proyectos grupales, con ramas, pull requests y tareas repartidas.",
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
