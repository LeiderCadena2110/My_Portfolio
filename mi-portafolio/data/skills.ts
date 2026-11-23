import type { StackKey } from "./types";

/* =============================================================================
   ✏️ HABILIDADES (sección adicional): cada objeto es una tecla del teclado 3D.
   5 teclas por fila; 20 teclas se ven mejor.
   ============================================================================= */
export const stackKeys: StackKey[] = [
  { label: "Nd", name: "Node.js", description: "Mi base para backend en JavaScript: APIs rápidas y livianas.", color: "green" },
  { label: "Ns", name: "NestJS", description: "Backend estructurado con módulos, inyección de dependencias y TypeScript.", color: "blue" },
  { label: "Ex", name: "Express", description: "APIs REST minimalistas con Node.js (Minga App).", color: "slate" },
  { label: "Jv", name: "Java", description: "Lenguaje de StockFlow, mi app de inventario y facturación.", color: "amber" },
  { label: "Sp", name: "Spring Boot", description: "Backend Java con arquitectura en capas.", color: "green" },
  { label: "Py", name: "Python", description: "Scripts, automatización y lógica de backend.", color: "amber" },
  { label: "PG", name: "PostgreSQL", description: "Base de datos relacional; también serverless con Neon.", color: "blue" },
  { label: "SQL", name: "SQL y modelado E-R", description: "Consultas, normalización y diagramas entidad-relación.", color: "light" },
  { label: "TO", name: "TypeORM", description: "ORM para conectar NestJS con la base de datos.", color: "slate" },
  { label: "Dk", name: "Docker", description: "Contenedores para entornos reproducibles.", color: "blue" },
  { label: "Git", name: "Git", description: "Ramas, commits claros y Git Flow.", color: "slate" },
  { label: "GH", name: "GitHub", description: "Repositorios, pull requests y trabajo en equipo.", color: "light" },
  { label: "AWS", name: "AWS", description: "EC2, ALB, Auto Scaling, RDS Multi-AZ y Lambda.", color: "amber" },
  { label: "Rn", name: "Render", description: "Despliegue de servidores (backend de HidraSmart).", color: "green" },
  { label: "TS", name: "TypeScript", description: "Tipado para código más seguro en NestJS, Angular y Next.js.", color: "blue" },
  { label: "Nx", name: "Next.js", description: "Framework de React con el que está hecho este portafolio.", color: "slate" },
  { label: "Tw", name: "Tailwind CSS", description: "Estilos con clases utilitarias y responsive.", color: "green" },
  { label: "Ng", name: "Angular · Ionic", description: "Frontend y apps móviles híbridas (Minga App).", color: "amber" },
  { label: "And", name: "Android Studio", description: "Apps para celular y smartwatch (HidraSmart).", color: "green" },
  { label: "UML", name: "UML y arquitectura", description: "Diagramas de clases, casos de uso y arquitectura antes de programar.", color: "light" },
];
