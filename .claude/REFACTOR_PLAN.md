# 📅 PLAN DE REFACTORIZACIÓN ÓRBITA 2

**Fecha de inicio:** 20 de Marzo, 2026
**Duración estimada:** 14 días laborables (3-4 semanas)
**Objetivo:** Eliminar anti-patrones arquitecturales manteniendo la app funcional

---

## 🎯 ESTADO GENERAL

- [x] Auditoría completa realizada
- [ ] **FASE 1:** Infraestructura Base (Días 1-2)
- [ ] **FASE 2:** Refactorización Crítica (Días 3-5)
- [ ] **FASE 3:** Alta Prioridad (Días 6-8)
- [ ] **FASE 4:** Optimizaciones (Días 9-12)
- [ ] **FASE 5:** Consolidación (Días 13-14)

---

# 📋 FASE 1: INFRAESTRUCTURA BASE

**Objetivo:** Crear herramientas y servicios base sin tocar componentes existentes
**Duración:** 2 días (8-10 horas)
**Riesgo:** 🟢 BAJO

## DÍA 1: Crear Utilidades y Constantes (4-5 horas)

### ✅ Task 1.1: Crear estructura de carpetas
**Tiempo estimado:** 15-30 min

**Crear:**
```
src/lib/
├── constants/
│   └── index.ts
├── utils/
│   └── index.ts
└── exports/
    └── index.ts
```

**Checklist:**
- [ ] Carpeta `src/lib/constants/` creada
- [ ] Carpeta `src/lib/utils/` creada
- [ ] Carpeta `src/lib/exports/` creada
- [ ] Archivo `src/lib/constants/index.ts` con `export {}`
- [ ] Archivo `src/lib/utils/index.ts` con `export {}`
- [ ] Archivo `src/lib/exports/index.ts` con `export {}`
- [ ] Git commit: `chore: create lib folder structure`

---

### ✅ Task 1.2: `lib/constants/estado-configs.ts`
**Tiempo estimado:** 1-1.5 horas

**Crear archivo:** `src/lib/constants/estado-configs.ts`

**Contenido esperado:**
- `ASISTENCIA_ESTADO_CONFIG` - Config para estados de asistencia
- `ALUMNO_ESTADO_CONFIG` - Config para estados de alumno
- `LIQUIDACION_ESTADO_CONFIG` - Config para estados de liquidación
- Tipos TypeScript para cada config

**Checklist:**
- [ ] Archivo creado
- [ ] `ASISTENCIA_ESTADO_CONFIG` implementado
- [ ] `ALUMNO_ESTADO_CONFIG` implementado
- [ ] `LIQUIDACION_ESTADO_CONFIG` implementado
- [ ] Tipos TypeScript correctos
- [ ] JSDoc en cada config
- [ ] Exportado en `constants/index.ts`
- [ ] Prueba de importación en consola funciona
- [ ] Git commit: `feat(lib): add estado-configs constants`

---

### ✅ Task 1.3: `lib/utils/dates.ts`
**Tiempo estimado:** 1.5-2 horas

**Crear archivo:** `src/lib/utils/dates.ts`

**Funciones requeridas:**
- `calcularDiasRestantes(fechaVencimiento: string): number`
- `isCudVencido(fecha: string): boolean`
- `isCudPorVencer(fecha: string, diasAlerta?: number): boolean`
- `formatFecha(fecha: string, formato?: string): string`
- `getDiferenciaEnDias(fecha1: string, fecha2: string): number`

**Checklist:**
- [ ] Archivo creado
- [ ] Todas las funciones implementadas
- [ ] JSDoc completo en cada función
- [ ] Manejo de fechas inválidas
- [ ] Constantes exportadas (ej: `DEFAULT_DIAS_ALERTA`)
- [ ] Exportado en `utils/index.ts`
- [ ] Probado con fechas de ejemplo
- [ ] Git commit: `feat(lib): add date utilities`

---

### ✅ Task 1.4: `lib/utils/formatters.ts`
**Tiempo estimado:** 45 min - 1 hora

**Crear archivo:** `src/lib/utils/formatters.ts`

**Funciones requeridas:**
- `formatAlumnoNombre(alumno: Alumno): string`
- `formatDNI(dni: string): string`
- `formatEstadoBadge(estado: AlumnoEstado): { label: string; variant: string }`
- `formatTurnoHorario(turno: Turno): string`

**Checklist:**
- [ ] Archivo creado
- [ ] Todas las funciones implementadas
- [ ] Imports de tipos correctos
- [ ] JSDoc en cada función
- [ ] Exportado en `utils/index.ts`
- [ ] Probado manualmente
- [ ] Git commit: `feat(lib): add formatters utilities`

---

### ✅ Task 1.5: `lib/exports/csv-generator.ts`
**Tiempo estimado:** 1-1.5 horas

**Crear archivo:** `src/lib/exports/csv-generator.ts`

**Funciones requeridas:**
- `generateReporteCSV(data: ReporteData, sedeNombre: string): void`
- `generateAlumnosCSV(alumnos: Alumno[]): void`
- `generateLiquidacionesCSV(liquidaciones: Liquidacion[]): void`
- Helper: `downloadCSV(content: string, filename: string): void`

**Checklist:**
- [ ] Archivo creado
- [ ] Función `generateReporteCSV` implementada
- [ ] Función `generateAlumnosCSV` implementada
- [ ] Función `generateLiquidacionesCSV` implementada
- [ ] Helper `downloadCSV` implementado
- [ ] Generación de nombres con timestamp
- [ ] Manejo de caracteres especiales (UTF-8)
- [ ] Exportado en `exports/index.ts`
- [ ] Probado con datos mock
- [ ] Git commit: `feat(lib): add CSV generator`

---

## ✅ CHECKPOINT DÍA 1

**Antes de continuar, verificar:**

- [ ] Todas las carpetas creadas
- [ ] Todos los archivos de utilities creados
- [ ] Sin errores de TypeScript
- [ ] Sin errores de ESLint
- [ ] Todos los exports funcionan correctamente
- [ ] App sigue corriendo sin errores
- [ ] **Prueba de integración:** Importar una utility en consola del navegador
- [ ] Git: todos los commits hechos
- [ ] Branch sincronizado con main (si aplica)

**Comando de validación:**
```bash
npm run lint
npm run build
```

**Si todo OK → Continuar con Día 2**

---

## DÍA 2: Extender Servicios Existentes (4-5 horas)

### ✅ Task 2.1: Extender `AlumnoService`
**Tiempo estimado:** 1.5-2 horas

**Archivo:** `src/features/alumnos/services/alumno-service.ts`

**Nuevos métodos a agregar:**
1. `getAlumnosBySede(sedeId, opciones?)`
2. `getAlumnosByProfesional(profesionalId, sedeId)`
3. `getVencimientosCUD(sedeId, diasAlerta?)`
4. `getEstadisticas(sedeId)`

**Checklist:**
- [ ] Método `getAlumnosBySede` implementado
- [ ] Método `getAlumnosByProfesional` implementado
- [ ] Método `getVencimientosCUD` implementado
- [ ] Método `getEstadisticas` implementado
- [ ] Todos con tipos TypeScript correctos
- [ ] JSDoc en cada método
- [ ] Usa utilities de dates.ts donde corresponde
- [ ] Probado con llamadas desde consola
- [ ] Git commit: `feat(alumnos): extend alumno-service methods`

---

### ✅ Task 2.2: Extender `BuzonService`
**Tiempo estimado:** 45 min - 1 hora

**Archivo:** `src/features/buzon/services/buzon-service.ts`

**Nuevos métodos:**
1. `getMensajesNoLeidos(sedeId)`
2. `getChatsPorSede(sedeId, filtros?)`
3. `buscarChats(chats, termino)`

**Checklist:**
- [ ] Método `getMensajesNoLeidos` implementado
- [ ] Método `getChatsPorSede` implementado
- [ ] Método `buscarChats` implementado
- [ ] Tipos correctos
- [ ] JSDoc
- [ ] Probado manualmente
- [ ] Git commit: `feat(buzon): extend buzon-service methods`

---

### ✅ Task 2.3: Crear `ExportService`
**Tiempo estimado:** 1 hora

**Crear archivo:** `src/lib/services/export-service.ts`

**Métodos:**
1. `generarReporteSede(sedeId, sedeNombre)`
2. `generarReporteAlumnos(sedeId)`
3. `generarReporteLiquidaciones(sedeId, periodo)`

**Checklist:**
- [ ] Archivo creado
- [ ] Importa `csv-generator.ts`
- [ ] Usa `AlumnoService` y `FinanceService`
- [ ] Método `generarReporteSede` implementado
- [ ] Método `generarReporteAlumnos` implementado
- [ ] Método `generarReporteLiquidaciones` implementado
- [ ] Manejo de errores con try/catch
- [ ] Toast notifications en errores
- [ ] Probado con datos reales
- [ ] Git commit: `feat(lib): create export-service`

---

### ✅ Task 2.4: Consolidar `DashboardService`
**Tiempo estimado:** 1-1.5 horas

**Archivo:** `src/features/dashboard/services/dashboard-service.ts`

**Refactorizar y agregar:**
1. Mantener métodos existentes (`computeStats`, `computeSessions`, etc.)
2. Agregar `getKPIs(sedeId)`
3. Agregar `getDataProfesional(profesionalId, sedeId)`

**Checklist:**
- [ ] Métodos existentes intactos
- [ ] Método `getKPIs` implementado
- [ ] Método `getDataProfesional` implementado
- [ ] Usa otros servicios (AlumnoService, BuzonService, TurnoService)
- [ ] Tipos correctos
- [ ] JSDoc
- [ ] Probado
- [ ] Git commit: `refactor(dashboard): consolidate dashboard-service`

---

## ✅ CHECKPOINT DÍA 2 / FIN FASE 1

**Validación completa antes de continuar:**

### Tests Funcionales:
- [ ] Llamar `AlumnoService.getVencimientosCUD()` desde consola → retorna datos
- [ ] Llamar `BuzonService.getMensajesNoLeidos()` → retorna número
- [ ] Llamar `ExportService.generarReporteSede()` → descarga CSV
- [ ] Llamar `DashboardService.getKPIs()` → retorna objeto con stats

### Tests de Integración:
- [ ] App corre sin errores: `npm run dev`
- [ ] Build exitoso: `npm run build`
- [ ] Lint sin errores: `npm run lint`
- [ ] TypeScript sin errores: `tsc --noEmit`

### Revisión de Código:
- [ ] No hay `console.log` olvidados
- [ ] Todos los imports son correctos
- [ ] Ningún componente fue modificado (solo servicios/utils)
- [ ] Commits descriptivos y pequeños
- [ ] README actualizado si corresponde

### Git:
- [ ] Todos los commits pusheados
- [ ] Branch `refactor/infrastructure` creado y actualizado
- [ ] Sin conflictos con main

**Si todo OK → ✅ FASE 1 COMPLETA → Continuar con FASE 2**

---

# 📋 FASE 2: REFACTORIZACIÓN CRÍTICA

**Objetivo:** Refactorizar Dashboard (3 componentes críticos)
**Duración:** 3 días (10-14 horas)
**Riesgo:** 🟡 MEDIO

## DÍA 3: Dashboard Principal (4-6 horas)

### ✅ Task 3.1: Refactor `dashboard/index.tsx` - Parte 1
**Tiempo estimado:** 2-3 horas

**Archivo:** `src/features/dashboard/index.tsx`

**Cambios:**
1. Eliminar imports de `MOCK_ALUMNOS`, `MOCK_LIQUIDACIONES`
2. Eliminar función `descargarReporteCSV` completa (líneas 31-59)
3. Reemplazar por llamada a `ExportService.generarReporteSede()`

**Checklist:**
- [ ] Backup del archivo original creado
- [ ] Imports de MOCK eliminados
- [ ] Función `descargarReporteCSV` eliminada
- [ ] Import de `ExportService` agregado
- [ ] Botón "Descargar Reporte" actualizado con nueva función
- [ ] Manejo de errores agregado
- [ ] Toast de éxito/error configurado
- [ ] App probada manualmente
- [ ] Descarga de CSV funciona igual que antes
- [ ] Git commit: `refactor(dashboard): move CSV export to service`

---

### ✅ Task 3.2: Refactor `dashboard/index.tsx` - Parte 2
**Tiempo estimado:** 2-3 horas

**Implementar React Query para KPIs**

**Cambios:**
1. Reemplazar `useMemo` con `useQuery`
2. Usar `DashboardService.getKPIs(sedeId)`
3. Actualizar loading states

**Checklist:**
- [ ] Import de `useQuery` de `@tanstack/react-query`
- [ ] `useMemo(() => computeStats(sedeId))` reemplazado por `useQuery`
- [ ] `useMemo(() => computeSessions(sedeId))` reemplazado por `useQuery`
- [ ] `useMemo(() => computeFinancial(sedeId))` reemplazado por `useQuery`
- [ ] Loading states basados en `isLoading` de queries
- [ ] Error handling con `isError` y toast
- [ ] Skeleton actualizado
- [ ] Verificar que datos se muestran correctamente
- [ ] Verificar que cambio de sede recarga datos
- [ ] Git commit: `refactor(dashboard): implement React Query for KPIs`

---

## ✅ CHECKPOINT DÍA 3

**Validación:**
- [ ] Dashboard principal carga sin errores
- [ ] KPIs se muestran correctamente
- [ ] Botón de descarga CSV funciona
- [ ] Cambio de sede recarga datos
- [ ] No hay imports de MOCK_* en el archivo
- [ ] No hay console.errors
- [ ] Build exitoso
- [ ] Git commits hechos

---

## DÍA 4: Upcoming Expirations (3-4 horas)

### ✅ Task 4.1: Refactor `upcoming-expirations.tsx`
**Tiempo estimado:** 3-4 horas

**Archivo:** `src/features/dashboard/components/upcoming-expirations.tsx`

**Cambios:**
1. Eliminar import de `MOCK_ALUMNOS`
2. Eliminar imports de `date-fns` (ahora en utils)
3. Eliminar `useMemo` complejo (líneas 14-34)
4. Implementar `useQuery` con `AlumnoService.getVencimientosCUD()`

**Checklist:**
- [ ] Backup del archivo original
- [ ] Import de `MOCK_ALUMNOS` eliminado
- [ ] Imports de `date-fns` eliminados
- [ ] Import de `AlumnoService` agregado
- [ ] `useMemo` complejo eliminado (toda la lógica de filtrado)
- [ ] `useQuery` implementado correctamente
- [ ] Query key correcto: `['vencimientos-cud', activeSedeId]`
- [ ] Loading state agregado
- [ ] Error handling agregado
- [ ] Componente renderiza datos correctamente
- [ ] Lista de vencimientos funciona igual que antes
- [ ] Badges (Vencido/Crítico/Alerta) se muestran correctamente
- [ ] Archivo reducido de ~90 líneas a ~60 líneas
- [ ] Git commit: `refactor(dashboard): extract CUD expiration logic to service`

---

## ✅ CHECKPOINT DÍA 4

**Validación:**
- [ ] Componente carga sin errores
- [ ] Lista de vencimientos CUD se muestra
- [ ] Alertas (Vencido/Crítico) funcionan correctamente
- [ ] No hay imports de mocks
- [ ] No hay lógica de negocio en el componente
- [ ] Build exitoso

---

## DÍA 5: Profesional Dashboard (3-4 horas)

### ✅ Task 5.1: Refactor `profesional-dashboard.tsx` - Parte 1
**Tiempo estimado:** 2-3 horas

**Archivo:** `src/features/dashboard/components/profesional-dashboard.tsx`

**Cambios:**
1. Eliminar imports de `MOCK_ALUMNOS`, `MOCK_CHATS`
2. Eliminar `useMemo` con filtros
3. Implementar `useQuery` con `DashboardService.getDataProfesional()`

**Checklist:**
- [ ] Backup del archivo
- [ ] Imports de mocks eliminados
- [ ] `useMemo` para `misAlumnos` eliminado
- [ ] `useMemo` para `mensajesNoLeidos` eliminado
- [ ] Import de `DashboardService` agregado
- [ ] `useQuery` implementado
- [ ] Query key: `['profesional-dashboard', profesionalId, activeSedeId]`
- [ ] Desestructuración de datos correcta
- [ ] Loading state
- [ ] Error handling
- [ ] Todos los KPIs funcionan
- [ ] Git commit: `refactor(dashboard): extract professional dashboard logic`

---

### ✅ Task 5.2: Centralizar Config de Estados
**Tiempo estimado:** 1 hora

**Archivos a modificar:**
- `src/features/dashboard/components/profesional-dashboard.tsx`
- `src/features/agenda/components/turnos-diarios.tsx`

**Cambios:**
1. Eliminar objeto `ESTADO_CONFIG` local
2. Importar `ASISTENCIA_CONFIG` de `lib/constants`

**Checklist:**
- [ ] Config local eliminada de `profesional-dashboard.tsx`
- [ ] Import de `ASISTENCIA_CONFIG` agregado
- [ ] Referencias actualizadas en el código
- [ ] Config local eliminada de `turnos-diarios.tsx`
- [ ] Import agregado en `turnos-diarios.tsx`
- [ ] Referencias actualizadas
- [ ] Badges se muestran con estilos correctos
- [ ] No hay duplicación de configs
- [ ] Git commit: `refactor: centralize estado configs`

---

## ✅ CHECKPOINT DÍA 5 / FIN FASE 2

**Validación Completa:**

### Tests Funcionales del Dashboard:
- [ ] Dashboard principal muestra KPIs correctamente
- [ ] Descarga de CSV funciona
- [ ] Upcoming Expirations muestra vencimientos
- [ ] Profesional Dashboard muestra datos del profesional
- [ ] Cambio de sede actualiza todos los componentes
- [ ] Loading states funcionan
- [ ] Error states manejan fallos correctamente

### Tests Técnicos:
- [ ] Cero imports de `MOCK_*` en componentes de dashboard
- [ ] React Query funciona correctamente
- [ ] No hay lógica de negocio en componentes
- [ ] Configs centralizadas en uso
- [ ] Build exitoso: `npm run build`
- [ ] Lint sin errores: `npm run lint`
- [ ] TypeScript sin errores

### Comparación Antes/Después:
- [ ] UX es idéntico (misma experiencia de usuario)
- [ ] Performance igual o mejor
- [ ] Código más limpio y mantenible

**Si todo OK → ✅ FASE 2 COMPLETA → Continuar con FASE 3**

---

# 📋 FASE 3: ALTA PRIORIDAD

**Objetivo:** Refactorizar hook useBuzon y centralizar validaciones
**Duración:** 3 días (9-12 horas)
**Riesgo:** 🟢 BAJO

## DÍA 6-7: Refactor Hook useBuzon (6-8 horas)

### ✅ Task 6.1: Extraer mocks inline
**Tiempo estimado:** 1 hora

**Archivo:** `src/features/buzon/data/mocks.ts`

**Cambios:**
1. Mover mensajes mock del hook a archivo dedicado
2. Actualizar imports en hook

**Checklist:**
- [ ] Archivo `src/features/buzon/data/mock-messages.ts` creado
- [ ] Mocks movidos desde hook (líneas 26-55)
- [ ] Export correcto en el archivo
- [ ] Hook importa desde nuevo archivo
- [ ] Funcionalidad intacta
- [ ] Git commit: `refactor(buzon): extract inline mocks`

---

### ✅ Task 6.2: Simplificar lógica del hook - Parte 1
**Tiempo estimado:** 2-3 horas

**Archivo:** `src/features/buzon/hooks/use-buzon.ts`

**Cambios:**
1. Extraer lógica de filtrado complejo (líneas 141-166)
2. Usar métodos de `BuzonService`

**Checklist:**
- [ ] Métodos de filtrado implementados en `BuzonService`
- [ ] `useMemo` simplificado usando servicios
- [ ] Lógica de permisos movida a servicio
- [ ] Lógica de búsqueda movida a servicio
- [ ] Hook más legible
- [ ] Funcionalidad idéntica
- [ ] Git commit: `refactor(buzon): extract filtering logic to service`

---

### ✅ Task 6.3: Simplificar lógica del hook - Parte 2
**Tiempo estimado:** 2-3 horas

**Mejoras generales del hook**

**Cambios:**
1. Mejorar generación de IDs
2. Simplificar estado
3. Optimizar re-renders

**Checklist:**
- [ ] Utility `id-generator.ts` creado
- [ ] Hook usa utility para IDs
- [ ] Estado optimizado (evitar estados redundantes)
- [ ] useCallback en funciones pasadas como props
- [ ] Comentarios explicativos agregados
- [ ] Git commit: `refactor(buzon): optimize hook performance`

---

## ✅ CHECKPOINT DÍA 6-7

**Validación:**
- [ ] Buzón funciona correctamente
- [ ] Filtros (all/unread/urgent) funcionan
- [ ] Búsqueda funciona
- [ ] Envío de mensajes funciona
- [ ] No hay lógica de negocio en el hook
- [ ] Hook es testeable
- [ ] Build exitoso

---

## DÍA 8: Centralizar Validaciones CUD (3-4 horas)

### ✅ Task 7.1: Unificar validaciones
**Tiempo estimado:** 3-4 horas

**Archivos afectados:**
- `src/features/alumnos/utils/cud-logic.ts` (existe)
- `src/lib/utils/validators.ts` (crear/mover)

**Cambios:**
1. Mover validaciones CUD a `lib/utils/validators.ts`
2. Actualizar todos los imports

**Checklist:**
- [ ] Archivo `lib/utils/validators.ts` creado
- [ ] Funciones de `cud-logic.ts` movidas a validators
- [ ] Funciones adicionales agregadas si hace falta
- [ ] `cud-logic.ts` deprecado o eliminado
- [ ] Imports actualizados en `upcoming-expirations.tsx`
- [ ] Imports actualizados en `alumnos-table.tsx`
- [ ] Imports actualizados en otros componentes que las usen
- [ ] Exportado en `utils/index.ts`
- [ ] Funcionalidad verificada
- [ ] Git commit: `refactor: unify CUD validation logic`

---

## ✅ CHECKPOINT DÍA 8 / FIN FASE 3

**Validación:**
- [ ] Hook useBuzon limpio y mantenible
- [ ] Validaciones CUD centralizadas
- [ ] Sin duplicación de código
- [ ] Todos los componentes funcionan
- [ ] Build exitoso
- [ ] Lint sin errores

**Si todo OK → ✅ FASE 3 COMPLETA → Continuar con FASE 4**

---

# 📋 FASE 4: OPTIMIZACIONES

**Objetivo:** Crear hooks compartidos y auditar componentes
**Duración:** 4 días (14-18 horas)
**Riesgo:** 🟢 BAJO

## DÍA 9-10: Crear Hooks Compartidos (6-8 horas)

### ✅ Task 8.1: `usePagination` hook
**Tiempo estimado:** 2-3 horas

**Checklist:**
- [ ] Archivo `src/hooks/use-pagination.ts` creado
- [ ] Hook implementado con toda la lógica de paginación
- [ ] Tipos TypeScript correctos
- [ ] JSDoc completo
- [ ] Exportado en `src/hooks/index.ts`
- [ ] Git commit: `feat: add usePagination hook`

---

### ✅ Task 8.2: Reemplazar paginación manual
**Tiempo estimado:** 2-3 horas

**Checklist:**
- [ ] `alumnos-table.tsx` usa `usePagination`
- [ ] Otros componentes con paginación actualizados
- [ ] Lógica duplicada eliminada
- [ ] Funcionalidad verificada
- [ ] Git commit: `refactor: use usePagination in tables`

---

### ✅ Task 8.3: `useDebounce` para búsquedas
**Tiempo estimado:** 2 horas

**Checklist:**
- [ ] Archivo `src/hooks/use-debounce.ts` creado
- [ ] Hook implementado
- [ ] Usado en búsquedas de tablas
- [ ] Performance mejorada
- [ ] Git commit: `feat: add useDebounce hook`

---

## ✅ CHECKPOINT DÍA 9-10

**Validación:**
- [ ] Hooks compartidos creados
- [ ] Paginación optimizada
- [ ] Búsquedas optimizadas
- [ ] Sin regresiones

---

## DÍA 11-12: Auditar Componentes Restantes (8-10 horas)

### ✅ Task 9.1: Revisar 43 componentes
**Tiempo estimado:** 4-6 horas

**Checklist:**
- [ ] Lista de 43 componentes obtenida
- [ ] Cada componente categorizado (✅ Aprobar / 🟡 Menor / 🔴 Mayor)
- [ ] Issues creados en GitHub para refactors necesarios
- [ ] Documento de decisiones creado
- [ ] Priorización definida

---

### ✅ Task 9.2: Refactorizar top 10 componentes
**Tiempo estimado:** 4-6 horas

**Checklist:**
- [ ] Top 10 componentes críticos identificados
- [ ] Componente 1 refactorizado y commiteado
- [ ] Componente 2 refactorizado y commiteado
- [ ] Componente 3 refactorizado y commiteado
- [ ] Componente 4 refactorizado y commiteado
- [ ] Componente 5 refactorizado y commiteado
- [ ] Componente 6 refactorizado y commiteado
- [ ] Componente 7 refactorizado y commiteado
- [ ] Componente 8 refactorizado y commiteado
- [ ] Componente 9 refactorizado y commiteado
- [ ] Componente 10 refactorizado y commiteado
- [ ] Git commit final: `refactor: optimize remaining components`

---

## ✅ CHECKPOINT DÍA 11-12 / FIN FASE 4

**Validación:**
- [ ] 43 componentes auditados
- [ ] Top 10 componentes refactorizados
- [ ] Hooks reutilizables en uso
- [ ] App funcionando perfectamente
- [ ] Build exitoso

**Si todo OK → ✅ FASE 4 COMPLETA → Continuar con FASE 5**

---

# 📋 FASE 5: CONSOLIDACIÓN Y DOCUMENTACIÓN

**Objetivo:** Documentar, testear y validar todo
**Duración:** 2 días (8-12 horas)
**Riesgo:** 🟢 BAJO

## DÍA 13: Documentación y Testing (4-6 horas)

### ✅ Task 10.1: Actualizar documentación
**Tiempo estimado:** 2-3 horas

**Checklist:**
- [ ] Archivo `docs/ARCHITECTURE.md` creado
- [ ] Archivo `docs/REFACTOR_GUIDE.md` creado
- [ ] README.md actualizado
- [ ] READMEs en features principales actualizados
- [ ] Diagramas creados (opcional)
- [ ] Git commit: `docs: add architecture documentation`

---

### ✅ Task 10.2: Tests de integración
**Tiempo estimado:** 2-3 horas

**Checklist:**
- [ ] Tests para `AlumnoService` escritos
- [ ] Tests para `DashboardService` escritos
- [ ] Tests para utilities escritos
- [ ] Tests para hooks compartidos escritos
- [ ] Coverage > 60% en archivos críticos
- [ ] Todos los tests pasan
- [ ] Git commit: `test: add integration tests`

---

## DÍA 14: Code Review y Mejoras Finales (4-6 horas)

### ✅ Task 11.1: Code review completo
**Tiempo estimado:** 2-3 horas

**Checklist:**
- [ ] No hay imports de MOCK en componentes ✅
- [ ] Servicios usan interfaces claras ✅
- [ ] Configuraciones centralizadas ✅
- [ ] Sin lógica de negocio en componentes ✅
- [ ] React Query correcto ✅
- [ ] Error handling consistente ✅
- [ ] Loading states en todos los queries ✅
- [ ] Sin `any` en TypeScript ✅
- [ ] Sin `console.log` olvidados ✅

---

### ✅ Task 11.2: Performance audit
**Tiempo estimado:** 1-2 horas

**Checklist:**
- [ ] React DevTools Profiler usado
- [ ] No hay re-renders innecesarios
- [ ] useMemo usado correctamente
- [ ] useCallback en callbacks
- [ ] Keys correctas en listas
- [ ] Code splitting verificado
- [ ] Lighthouse score > 90
- [ ] Git commit (si aplica): `perf: optimize renders`

---

### ✅ Task 11.3: Security audit
**Tiempo estimado:** 1 hora

**Checklist:**
- [ ] No hay datos sensibles en logs
- [ ] Validaciones en forms
- [ ] Sanitización de inputs
- [ ] XSS prevention verificado
- [ ] Dependencies sin vulnerabilidades críticas
- [ ] Git commit (si aplica): `security: fix vulnerabilities`

---

## ✅ CHECKPOINT FINAL / FIN FASE 5

**Validación Final Completa:**

### Funcionalidad:
- [ ] Todas las features funcionan igual que antes
- [ ] No hay regresiones
- [ ] Performance igual o mejor
- [ ] UX idéntico

### Código:
- [ ] 0 imports de MOCK en componentes
- [ ] 0 lógica de negocio en componentes
- [ ] 0 duplicación de configs
- [ ] 100% de servicios usan interfaces claras
- [ ] Tests con coverage > 60%

### Documentación:
- [ ] ARCHITECTURE.md completo
- [ ] REFACTOR_GUIDE.md completo
- [ ] READMEs actualizados

### Git:
- [ ] Todos los commits hechos
- [ ] Branch sincronizado
- [ ] Tag creado: `v2.0.0-refactor-complete`
- [ ] Pull Request creado (si aplica)
- [ ] Release notes escritas

**Si todo OK → 🎉 REFACTOR COMPLETO 🎉**

---

# 📊 MÉTRICAS DE ÉXITO

## Antes vs Después

| Métrica | Antes | Después | Estado |
|---------|-------|---------|--------|
| Componentes con MOCK imports | 5 | 0 | [ ] |
| Líneas de lógica en componentes | ~500 | ~100 | [ ] |
| Duplicación de código | 4+ patrones | 0 | [ ] |
| Coverage de tests | 0% | 60%+ | [ ] |
| Utilities reutilizables | 2 | 10+ | [ ] |
| Componentes auditados | 0 | 43 | [ ] |

---

# 🎯 NOTAS FINALES

**Última actualización:** [FECHA]
**Completado por:** [NOMBRE]
**Estado final:** [ ] EN PROGRESO / [ ] COMPLETADO

**Lecciones aprendidas:**
-
-
-

**Mejoras futuras:**
-
-
-
