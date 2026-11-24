import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia, type Captions } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · Escape Espacial: Nexus-7 — Leider Cadena" };

/* Demo de Nexus-7 (proyecto en equipo con Samuel Moreno, repo moreno-stack/Nexuz-7):
   video y capturas de docs/media del repositorio, en public/demos/nexus */
const captions: Captions = {
  "gameplay-phase-6": { title: "Fase 6 · Evacuación", note: "Maqueta de la última fase: 5 minutos para lanzar la cápsula B, hackeo y alertas." },
  "main-menu": { title: "Menú principal", note: "Nueva partida, dificultad (Fácil, Normal, Difícil) y el récord guardado." },
  "victory-screen": { title: "Pantalla de victoria", note: "Evaluación de sigilo, recursos, tiempo y creatividad, con rango final." },
  "defeat-screen": { title: "Pantalla de derrota", note: "Si la cuenta atrás llega a cero, la nave te arrastra consigo." },
};

export default function Page() {
  return (
    <DemoShell
      slug="nexus"
      wide
      subtitle="Videojuego de sigilo en Unity: escapa de una nave tomada por robots rebeldes antes de la autodestrucción, sin pelear, escondiéndote, fabricando dispositivos y hackeando sistemas. Lo hicimos en equipo con Samuel Moreno."
      steps={[
        "Aclara que es un proyecto en equipo: el repositorio es de Samuel Moreno y yo soy colaborador.",
        "Presenta la idea: un juego de sigilo con 6 fases y una cápsula de escape como meta.",
        "Reproduce el video de la Fase 6: objetivo, cuenta regresiva, hackeo y alertas.",
        "Menú principal: dificultad y récord.",
        "Explica el director con IA que ajusta la dificultad según cómo juegas.",
        "Muestra las pantallas de victoria y derrota con su evaluación.",
        "Cierra con lo técnico: Unity 6 + C#, escenas generadas por código y más de 1 190 pruebas que corren sin abrir Unity.",
      ]}
    >
      <RealDemo device="window" folder="public/demos/nexus/" media={getMedia("nexus")} captions={captions} />
    </DemoShell>
  );
}
