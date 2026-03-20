import type { AuditLog, AuditAccion, AuditTabla } from '@/types/database'

// Almacén en memoria — se reemplaza por tabla Supabase en Fase Supabase
let auditLogs: AuditLog[] = []

interface LogParams {
  tabla: AuditTabla
  registro_id: string
  accion: AuditAccion
  cambios: Record<string, { anterior: unknown; nuevo: unknown }>
  usuario_id: string
  usuario_nombre?: string
  sede_id: string | null
  organizacion_id?: string
}

interface GetLogsFilters {
  tabla?: AuditTabla
  usuario_id?: string
  sede_id?: string
  desde?: string   // ISO date
  hasta?: string   // ISO date
  limit?: number
}

export const AuditService = {
  /**
   * Registra una acción en el log de auditoría.
   * Llamar desde cualquier service que mute datos críticos.
   */
  log: async (params: LogParams): Promise<void> => {
    const entry: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      tabla: params.tabla,
      registro_id: params.registro_id,
      accion: params.accion,
      cambios: params.cambios,
      usuario_id: params.usuario_id,
      usuario_nombre: params.usuario_nombre,
      sede_id: params.sede_id,
      organizacion_id: params.organizacion_id ?? 'org-1',
      timestamp: new Date().toISOString(),
    }
    auditLogs = [entry, ...auditLogs] // más reciente primero
  },

  /**
   * Retorna logs con filtros opcionales.
   */
  getLogs: async (filters: GetLogsFilters = {}): Promise<AuditLog[]> => {
    await new Promise(r => setTimeout(r, 200))

    let result = [...auditLogs]

    if (filters.tabla) {
      result = result.filter(l => l.tabla === filters.tabla)
    }
    if (filters.usuario_id) {
      result = result.filter(l => l.usuario_id === filters.usuario_id)
    }
    if (filters.sede_id) {
      result = result.filter(l => l.sede_id === filters.sede_id)
    }
    if (filters.desde) {
      result = result.filter(l => l.timestamp >= filters.desde!)
    }
    if (filters.hasta) {
      result = result.filter(l => l.timestamp <= filters.hasta!)
    }

    return result.slice(0, filters.limit ?? 200)
  },

  /** Para testing — pre-carga entradas de ejemplo */
  seed: (entries: AuditLog[]) => {
    auditLogs = [...entries, ...auditLogs]
  },

  /** Limpia el log (solo para tests) */
  clear: () => {
    auditLogs = []
  },
}
