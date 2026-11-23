import type { Metadata } from "next";
import DemoShell from "@/components/demos/DemoShell";
import HidraSmartDemo from "@/components/demos/HidraSmartDemo";

export const metadata: Metadata = { title: "Demo · HidraSmart — Leider Cadena" };

/* Demo de HidraSmart: /demos/hidrasmart */
export default function Page() {
  return (
    <DemoShell
      title="HidraSmart"
      subtitle="Hidratación deportiva para Wear OS y Android: avisa cuándo y cuánto tomar agua durante el entrenamiento y personaliza los consejos con IA."
      tags={["Kotlin", "Wear Compose", "Material 3", "Node.js + TypeScript", "Render", "Gemini", "Regresión ridge"]}
      accent="#4FC3F7"
      links={[
        { label: "Código", href: "https://github.com/LeiderCadena2110/App_Smartwatch" },
        { label: "APK reloj y celular", href: "https://github.com/LeiderCadena2110/App_Smartwatch/releases" },
      ]}
      steps={[
        "Presenta el problema: los deportistas se deshidratan porque no saben cuándo ni cuánto tomar.",
        "En el inicio muestra el anillo de progreso del día y registra una toma de +250 ml.",
        "Toca «Entrenar» → «Correr». Explica la cuenta regresiva del borde y la frecuencia cardíaca.",
        "Espera la alerta (20 s en esta demo, 15 min en el reloj) y responde «Ya tomé».",
        "Explica la fórmula NATA 2017 del panel de la derecha y por qué el factor sube en Pasto (altitud).",
        "Termina la sesión: muestra el resumen y el «Análisis IA».",
        "Abre «Coach IA» y «Planear»; cuenta que hay 3 capas de IA: regresión en el reloj, reglas locales y Gemini desde el servidor en Render.",
      ]}
    >
      <HidraSmartDemo />
    </DemoShell>
  );
}
