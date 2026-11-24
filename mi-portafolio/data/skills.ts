import type { StackKey } from "./types";

/* =============================================================================
   ✏️ HABILIDADES (sección adicional): cada objeto es una tecla del teclado 3D.
   6 teclas por fila; 18 teclas se ven mejor.
   ============================================================================= */
export const stackKeys: StackKey[] = [
  { label: "Nd", name: "Node.js", description: "Mi base para backend en JavaScript: APIs rápidas y livianas.", color: "sapphire" },
  { label: "Ns", name: "NestJS", description: "Backend estructurado con módulos, inyección de dependencias y TypeScript.", color: "sapphire" },
  { label: "Ex", name: "Express", description: "APIs REST minimalistas con Node.js (Minga App).", color: "deep" },
  { label: "Jv", name: "Java", description: "Lenguaje de StockFlow, mi app de inventario y facturación.", color: "ember" },
  { label: "Sp", name: "Spring Boot", description: "Backend Java con arquitectura en capas.", color: "sapphire" },
  { label: "Py", name: "Python", description: "Scripts, automatización y lógica de backend.", color: "sapphire" },
  { label: "PG", name: "PostgreSQL", description: "Base de datos relacional; también serverless con Neon.", color: "ember" },
  { label: "SQL", name: "SQL y modelado E-R", description: "Consultas, normalización y diagramas entidad-relación.", color: "pearl" },
  { label: "TO", name: "TypeORM", description: "ORM para conectar NestJS con la base de datos.", color: "deep" },
  { label: "Dk", name: "Docker", description: "Contenedores para entornos reproducibles.", color: "deep" },
  { label: "Git", name: "Git", description: "Ramas, commits claros y Git Flow.", color: "deep" },
  { label: "GH", name: "GitHub", description: "Repositorios, pull requests y trabajo en equipo.", color: "pearl" },
  { label: "AWS", name: "AWS", description: "EC2, ALB, Auto Scaling, RDS Multi-AZ y Lambda.", color: "ember" },
  { label: "Rn", name: "Render", description: "Despliegue de servidores (backend de HidraSmart).", color: "deep" },
  { label: "TS", name: "TypeScript", description: "Tipado para código más seguro en NestJS y Next.js.", color: "sapphire" },
  { label: "Nx", name: "Next.js", description: "Framework de React con el que está hecho este portafolio.", color: "pearl" },
  { label: "Tw", name: "Tailwind CSS", description: "Estilos con clases utilitarias y responsive.", color: "deep" },
  { label: "And", name: "Android Studio", description: "Apps para celular y smartwatch (HidraSmart).", color: "sapphire" },
];
