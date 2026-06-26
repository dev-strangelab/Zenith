# Órbita 2

Sistema de gestión clínica para instituciones terapéuticas y de rehabilitación, desarrollado para Argentina.

SaaS multi-sede y multi-rol orientado a profesionales de la salud, coordinadores y administradores de centros de rehabilitación e integración.

---

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![TanStack Router](https://img.shields.io/badge/TanStack_Router-v1-FF4154?logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4154?logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-scaffolded-3ECF8E?logo=supabase&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-5-000?logoColor=white)

---

## Características

- **Dashboard** con KPIs en tiempo real: asistencia, evoluciones pendientes, estado CUD y resumen financiero
- **Gestión de alumnos** con seguimiento de CUD (vencimiento, alertas), obras sociales y objetivos terapéuticos
- **Agenda** de turnos por profesional y sede, con estados de asistencia detallados
- **Liquidaciones y finanzas** — liquidaciones mensuales por obra social, honorarios por profesional
- **Obras sociales** — configuración de valores y modalidades de cobro
- **Gestión de equipo** — profesionales por sede con roles y especialidades
- **Buzón familiar** — mensajería interna entre el equipo y las familias de los alumnos
- **Auditoría e integridad** — log de historial clínico por alumno
- **Multi-sede** — aislamiento completo de datos por sede, selector en el header
- **Formularios públicos** — preinscripción y postulación de profesionales
- **Exportación CSV** con BOM UTF-8 (compatible con Excel en español)
- **Modo claro / oscuro** con persistencia de preferencia
- **Accesibilidad** — componentes Radix UI + navegación por teclado

---

## Roles disponibles

| Rol | Descripción |
|-----|-------------|
| `director_organizacion` | Acceso total a todas las sedes y configuración global |
| `director_sede` | Gestión completa de su sede |
| `coordinador` | Coordinación de agenda y equipo |
| `profesional` | Vista de sus alumnos, agenda personal y honorarios |
| `administrativo` | Gestión administrativa y liquidaciones |
| `familiar` | Acceso al buzón y datos de su alumno |

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| UI | React 19 + TypeScript 5.9 |
| Estilos | TailwindCSS 4 + shadcn/ui + Radix UI |
| Bundler | Vite 7 |
| Routing | TanStack Router v1 (file-based) |
| Data fetching | TanStack Query v5 |
| Estado global | Zustand v5 |
| Formularios | React Hook Form + Zod 4 |
| Gráficos | Recharts |
| Backend (BaaS) | Supabase (PostgreSQL + RLS + Storage) |
| Fechas | date-fns |
| Linting | ESLint + Prettier |

---

## Instalación y uso local

### Requisitos

- Node.js 20+
- pnpm 9+

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/korostudio/Orbita.git
cd Orbita

# Instalar dependencias
pnpm install

# Copiar el archivo de variables de entorno
cp .env.example .env.local

# Editar .env.local con tus credenciales de Supabase
# (en desarrollo funciona sin Supabase usando datos mock)

# Iniciar el servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`.

---

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá los valores:

```env
# Supabase (requerido en producción, opcional en desarrollo)
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key

# Nombre de la cookie de sesión (opcional — tiene default)
VITE_COOKIE_TOKEN_NAME=orbita_access_token
```

> En modo desarrollo, si Supabase no está configurado, el sistema usa datos mock automáticamente.

---

## Base de datos

Las migraciones están en `/supabase/migrations/`. El diseño incluye:

- Multi-tenancy por `organizacion_id` y `sede_id`
- Row Level Security (RLS) en todas las tablas
- Roles y permisos a nivel de base de datos
- Tablas: alumnos, sedes, usuarios, turnos, asistencias, evoluciones, liquidaciones, obras sociales, buzón, formularios públicos

---

## Estructura del proyecto

```
src/
├── components/        # Componentes compartidos (layout, UI, data-table)
├── features/          # Módulos por funcionalidad
│   ├── agenda/
│   ├── alumnos/
│   ├── buzon/
│   ├── dashboard/
│   ├── liquidaciones/
│   └── ...
├── lib/
│   ├── constants/     # Configuraciones centralizadas (estados, enums)
│   ├── exports/       # Generación de CSV
│   ├── hooks/         # Hooks reutilizables (paginación, sede, debounce)
│   └── utils/         # Fechas, formateo, finanzas
├── routes/            # Rutas TanStack Router (file-based)
├── stores/            # Estado global Zustand (auth, sede)
├── types/             # Interfaces TypeScript — database.ts como fuente de verdad
└── styles/            # CSS global y tema
```

---

## Estado del proyecto

> Desarrollo activo. Sin deploy en producción por el momento.

| Área | Estado |
|------|--------|
| UI / Pantallas | ~75% |
| Funcionalidades de negocio | ~55% |
| Autenticación real | En desarrollo |
| Conexión a Supabase | Pendiente |
| Guards de roles en UI | Pendiente |
| Seguridad / RLS | ~25% |

---

## Scripts disponibles

```bash
pnpm dev           # Servidor de desarrollo
pnpm build         # Build de producción
pnpm preview       # Preview del build
pnpm lint          # ESLint
pnpm format        # Prettier (formatear)
pnpm format:check  # Prettier (verificar sin modificar)
pnpm knip          # Detectar código muerto
```

---

## Licencia

MIT — ver [LICENSE](./LICENSE).

Basado en [shadcn-admin](https://github.com/satnaing/shadcn-admin) por Sat Naing.
