import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia, type Captions } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · HidraSmart — Leider Cadena" };

/* Demo de HidraSmart: capturas y videos REALES del emulador en public/demos/hidrasmart.
   Nombres en inglés; los que terminan en "-phone" se muestran en marco de celular. */
const captions: Captions = {
  walkthrough: { title: "Recorrido completo en el emulador", note: "Video real de la app en el reloj (Wear OS, API 35), sin sonido." },
  home: { title: "Inicio del reloj", note: "Lo que llevas tomado hoy frente a tu meta y botones de toma rápida." },
  settings: { title: "Perfil y ajustes", note: "Intervalo de alertas, ciudad del clima y altitud habitual." },
  "sweat-rate": { title: "Prueba de sudoración", note: "Con el peso antes y después del entrenamiento calcula cuánto líquido pierdes por hora." },
  "log-drink": { title: "Registrar una toma", note: "Cantidades rápidas u otra cantidad." },
  "custom-amount": { title: "Otra cantidad", note: "Ajusta los mililitros con + y −." },
  training: { title: "Entrenamiento en curso", note: "Tiempo, pulso, lo tomado y cuándo te toca la próxima toma, con clima y altitud." },
  "training-controls": { title: "Controles del entrenamiento", note: "Pausar, terminar o probar la alarma." },
  "ai-coach": { title: "Coach con IA", note: "Respuesta de Gemini con un consejo según cómo vas." },
  "coach-questions": { title: "Preguntas al coach", note: "¿Cómo voy hoy?, agua para entrenar 1 hora, consejo del día o planear un entrenamiento." },
  "drink-alert": { title: "¡Hora de hidratarte!", note: "La notificación en el reloj, con «Ya tomé» o «En 5 min»." },
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
