import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia, type Captions } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · HidraSmart — Leider Cadena" };

/* Demo de HidraSmart: capturas y videos REALES del emulador en public/demos/hidrasmart.
   Nombres en inglés; los que terminan en "-phone" se muestran en marco de celular. */
const captions: Captions = {
  home: { title: "Inicio del reloj", note: "Progreso de hidratación del día y toma rápida." },
  "log-drink": { title: "Registrar una toma" },
  training: { title: "Entrenamiento", note: "Cuenta regresiva en el borde y frecuencia cardíaca." },
  "drink-alert": { title: "¡Hora de hidratarte!" },
  summary: { title: "Resumen del entrenamiento" },
  "ai-coach": { title: "Coach con IA" },
};

export default function Page() {
  return (
    <DemoShell
      slug="hidrasmart"
      subtitle="Hidratación deportiva para Wear OS y Android: avisa cuándo y cuánto tomar agua durante el entrenamiento y personaliza los consejos con IA."
      steps={[
        "Presenta el problema: los deportistas se deshidratan porque no saben cuándo ni cuánto tomar.",
        "Muestra el inicio del reloj con el progreso del día y registra una toma rápida.",
        "Inicia un entrenamiento: la cuenta regresiva del borde y la frecuencia cardíaca.",
        "Muestra la alerta «¡Hora de hidratarte!» y la respuesta «Ya tomé».",
        "Explica el cálculo NATA 2017 ajustado por altitud, calor, humedad y frecuencia cardíaca.",
        "Muestra el resumen, el Coach IA y «Planear».",
        "Cierra con la arquitectura: reloj, celular y servidor en Render con Gemini.",
      ]}
    >
      <RealDemo device="watch" folder="public/demos/hidrasmart/" media={getMedia("hidrasmart")} captions={captions} />
    </DemoShell>
  );
}
