import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import RealDemo from "@/components/demos/RealDemo";
import { getMedia } from "@/lib/media";

export const metadata: Metadata = { title: "Demo · HidraSmart — Leider Cadena" };

/* Demo de HidraSmart: capturas y videos REALES del emulador en public/demos/hidrasmart
   (los archivos que terminan en "-celular" se muestran en marco de celular) */
export default function Page() {
  return (
    <DemoShell
      title="HidraSmart"
      subtitle="Hidratación deportiva para Wear OS y Android: avisa cuándo y cuánto tomar agua durante el entrenamiento y personaliza los consejos con IA."
      tags={["Kotlin", "Wear Compose", "Material 3", "Node.js + TypeScript", "Render", "Gemini"]}
      accent="#4FC3F7"
      links={[
        { label: "Código", href: "https://github.com/LeiderCadena2110/App_Smartwatch" },
        { label: "APK reloj y celular", href: "https://github.com/LeiderCadena2110/App_Smartwatch/releases" },
      ]}
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
      <RealDemo device="watch" folder="public/demos/hidrasmart/" media={getMedia("hidrasmart")} />
    </DemoShell>
  );
}
