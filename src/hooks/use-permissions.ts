import { useOrganization } from './use-organization'
import { APP_ROL } from '@/lib/constants'
import type { AppRole } from '@/types/database'

/**
 * Hook central de permisos de Órbita.
 * Basado en el array `role[]` del usuario autenticado.
 *
 * Uso:
 *   const { isDirector, canAccessFinanzas } = usePermissions()
 */
export function usePermissions() {
  const { role } = useOrganization()

  /** Retorna true si el usuario tiene al menos uno de los roles indicados. */
  const hasRole = (r: AppRole | AppRole[]): boolean => {
    const roles = Array.isArray(r) ? r : [r]
    return roles.some((required) => role.includes(required))
  }

  // -------------------------------------------------------------------------
  // Checks de identidad de rol
  // -------------------------------------------------------------------------
  const isDirectorOrganizacion = hasRole(APP_ROL.DIRECTOR_ORGANIZACION)
  const isDirectorSede = hasRole(APP_ROL.DIRECTOR_SEDE)
  const isDirector = isDirectorOrganizacion || isDirectorSede
  const isCoordinador = hasRole(APP_ROL.COORDINADOR)
  const isProfesional = hasRole(APP_ROL.PROFESIONAL)
  const isAdministrativo = hasRole(APP_ROL.ADMINISTRATIVO)
  const isFamiliar = hasRole(APP_ROL.FAMILIAR)

  // -------------------------------------------------------------------------
  // Permisos funcionales
  // -------------------------------------------------------------------------

  /** Acceso a módulo de Liquidaciones, Obras Sociales y datos financieros. */
  const canAccessFinanzas = hasRole([
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
    APP_ROL.ADMINISTRATIVO,
  ])

  /** Acceso a Configuración (organización, sedes, usuarios). */
  const canAccessConfiguracion = hasRole([
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
  ])

  /** Acceso a Equipo Profesional. */
  const canAccessEquipo = hasRole([
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
    APP_ROL.COORDINADOR,
  ])

  /** Puede ver TODOS los alumnos de la sede (sin filtro por asignación). */
  const canViewAllAlumnos = hasRole([
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
    APP_ROL.COORDINADOR,
    APP_ROL.ADMINISTRATIVO,
  ])

  /** Puede crear, editar y cambiar estado de alumnos. */
  const canEditAlumnos = hasRole([
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
    APP_ROL.COORDINADOR,
  ])

  /** Puede ver tabs sensibles del alumno (Familiares, Documentación). */
  const canViewDatosSensiblesAlumno = hasRole([
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
    APP_ROL.COORDINADOR,
    APP_ROL.ADMINISTRATIVO,
  ])

  /** Puede ver sus propias órdenes de pago / honorarios. */
  const canAccessMisHonorarios = hasRole([
    APP_ROL.PROFESIONAL,
    APP_ROL.DIRECTOR_ORGANIZACION,
    APP_ROL.DIRECTOR_SEDE,
  ])

  /** Puede ver y gestionar el Buzón Familia. */
  const canAccessBuzon = !isFamiliar

  return {
    // Identidad
    isDirectorOrganizacion,
    isDirectorSede,
    isDirector,
    isCoordinador,
    isProfesional,
    isAdministrativo,
    isFamiliar,
    // Permisos
    canAccessFinanzas,
    canAccessConfiguracion,
    canAccessEquipo,
    canViewAllAlumnos,
    canEditAlumnos,
    canViewDatosSensiblesAlumno,
    canAccessMisHonorarios,
    canAccessBuzon,
    // Genérico
    hasRole,
    roles: role,
  }
}
