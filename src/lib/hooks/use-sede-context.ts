/**
 * useSedeContext - Hook para acceder a la sede activa
 *
 * Proporciona acceso simplificado a la sede activa del usuario y funciones
 * relacionadas. Centraliza la lógica de obtención de sede que actualmente
 * está duplicada en múltiples componentes.
 *
 * Reemplaza patrones como:
 * ```tsx
 * const activeSedeId = useAuthStore(state => state.sede.activeSedeId)
 * if (!activeSedeId) return null
 * ```
 */

import { useAuthStore } from '@/stores/auth-store'

export interface SedeContext {
  /** ID de la sede activa (null si no hay sede seleccionada) */
  activeSedeId: string | null

  /** Si hay una sede activa seleccionada */
  hasActiveSede: boolean

  /** Función para cambiar la sede activa */
  setActiveSedeId: (sedeId: string | null) => void

  /**
   * ID de la sede activa o lanza error si no hay sede.
   * Útil para componentes que requieren sede obligatoriamente.
   * @throws Error si no hay sede activa
   */
  requireSedeId: () => string
}

/**
 * Hook para acceder al contexto de la sede activa.
 *
 * @example
 * ```tsx
 * // Uso básico
 * function MyComponent() {
 *   const { activeSedeId, hasActiveSede } = useSedeContext()
 *
 *   if (!hasActiveSede) {
 *     return <div>Selecciona una sede</div>
 *   }
 *
 *   return <div>Sede activa: {activeSedeId}</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Con requireSedeId() para componentes que requieren sede
 * function DashboardComponent() {
 *   const { requireSedeId } = useSedeContext()
 *
 *   const { data } = useQuery({
 *     queryKey: ['dashboard', requireSedeId()],
 *     queryFn: () => fetchDashboard(requireSedeId())
 *   })
 *
 *   // Si no hay sede, requireSedeId() lanza error y el componente no renderiza
 *   return <Dashboard data={data} />
 * }
 * ```
 *
 * @returns Objeto con información y funciones de la sede activa
 */
export function useSedeContext(): SedeContext {
  const activeSedeId = useAuthStore(state => state.sede.activeSedeId)
  const setActiveSedeId = useAuthStore(state => state.sede.setActiveSedeId)

  const hasActiveSede = activeSedeId !== null

  const requireSedeId = (): string => {
    if (!activeSedeId) {
      throw new Error(
        '[useSedeContext] Se requiere una sede activa pero no hay ninguna seleccionada. ' +
        'Verifica que el usuario haya seleccionado una sede antes de acceder a este componente.'
      )
    }
    return activeSedeId
  }

  return {
    activeSedeId,
    hasActiveSede,
    setActiveSedeId,
    requireSedeId,
  }
}

/**
 * Hook simplificado que solo retorna el ID de la sede activa.
 * Útil cuando solo necesitas el ID y no las funciones adicionales.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const sedeId = useActiveSedeId()
 *
 *   if (!sedeId) return <NoSedeSelected />
 *
 *   return <SedeContent sedeId={sedeId} />
 * }
 * ```
 *
 * @returns ID de la sede activa o null
 */
export function useActiveSedeId(): string | null {
  return useAuthStore(state => state.sede.activeSedeId)
}

/**
 * Hook que retorna el ID de la sede activa y lanza error si no hay sede.
 * Útil para componentes que siempre requieren una sede.
 *
 * @example
 * ```tsx
 * function DashboardPage() {
 *   const sedeId = useRequiredSedeId()
 *
 *   // Si llegamos aquí, sedeId está garantizado
 *   const { data } = useQuery(['dashboard', sedeId], ...)
 *
 *   return <Dashboard data={data} />
 * }
 * ```
 *
 * @throws Error si no hay sede activa
 * @returns ID de la sede activa (nunca null)
 */
export function useRequiredSedeId(): string {
  const activeSedeId = useAuthStore(state => state.sede.activeSedeId)

  if (!activeSedeId) {
    throw new Error(
      '[useRequiredSedeId] Este componente requiere una sede activa. ' +
      'Asegúrate de que el usuario haya seleccionado una sede antes de acceder a esta ruta.'
    )
  }

  return activeSedeId
}
