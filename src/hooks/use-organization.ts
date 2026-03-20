import { useAuthStore } from '@/stores/auth-store'
import { APP_ROL } from '@/lib/constants'

export function useOrganization() {
  const { auth, sede } = useAuthStore()

  const user = auth.user
  const organizacion_id = user?.organizacion_id
  const activeSedeId = sede.activeSedeId
  const role = user?.role ?? []

  // Helpers de rol
  const isDirectorOrganizacion = role.includes(APP_ROL.DIRECTOR_ORGANIZACION)
  const isDirectorSede = role.includes(APP_ROL.DIRECTOR_SEDE)
  const isDirector = isDirectorOrganizacion || isDirectorSede
  const isProfesional = role.includes(APP_ROL.PROFESIONAL)

  return {
    user,
    organizacion_id,
    activeSedeId,
    role,
    hasOrganization: !!organizacion_id,
    hasActiveSede: !!activeSedeId,
    // Helpers de rol (acceso rápido sin importar usePermissions)
    isDirectorOrganizacion,
    isDirectorSede,
    isDirector,
    isProfesional,
  }
}
