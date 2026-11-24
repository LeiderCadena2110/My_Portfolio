import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import GithubActivity from "@/components/GithubActivity";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Effects from "@/components/Effects";

/* =============================================================================
   Página principal: une todas las secciones EN EL ORDEN de la guía.
   1 Menú · 2 Hero + CV · 3 Acerca de mí · 4 Proyectos · 5 Testimonios ·
   6 Experiencia · ⭐ Adicionales (Habilidades y GitHub) · 7 Contactos · 8 Pie de página
   ============================================================================= */
export default function Home() {
  return (
    <>
      <Effects />
      <Navbar /> {/* 1 */}
      <main>
        <Hero /> {/* 2 */}
        <About /> {/* 3 */}
        <Projects /> {/* 4 */}
        <Testimonials /> {/* 5 */}
        <Experience /> {/* 6 */}
        <Skills /> {/* ⭐ sección adicional 1 */}
        <GithubActivity /> {/* ⭐ sección adicional 2 */}
        <Contact /> {/* 7 */}
      </main>
      <Footer /> {/* 8 */}
    </>
  );
}
