import type { ReactNode } from 'react'
import type { AppRole } from '@/types/database'
import { usePermissions } from '@/hooks/use-permissions'
import { ForbiddenError } from '@/features/errors/forbidden'

interface RequireRoleProps {
  /** Roles que tienen acceso. Con tener UNO alcanza. */
  roles: AppRole[]
  children: ReactNode
  /**
   * Si se provee, se muestra este componente en lugar del error de Forbidden.
   * Útil para ocultar secciones dentro de una página sin redirigir.
   */
  fallback?: ReactNode
}

/**
 * Guard de permisos.
 * Renderiza `children` si el usuario tiene al menos uno de los `roles`.
 * De lo contrario muestra la pantalla de acceso prohibido (o el `fallback`).
 *
 * @example
 * // Proteger una ruta completa
 * <RequireRole roles={['director_organizacion', 'director_sede']}>
 *   <ConfiguracionFeature />
 * </RequireRole>
 *
 * @example
 * // Ocultar un botón para un rol específico
 * <RequireRole roles={['director_organizacion']} fallback={null}>
 *   <Button>Eliminar organización</Button>
 * </RequireRole>
 */
export function RequireRole({ roles, children, fallback }: RequireRoleProps) {
  const { hasRole } = usePermissions()

  if (!hasRole(roles)) {
    if (fallback !== undefined) return <>{fallback}</>
    return <ForbiddenError minimal />
  }

  return <>{children}</>
}
