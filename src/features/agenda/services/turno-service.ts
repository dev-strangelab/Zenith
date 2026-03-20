import type { AsistenciaEstado, Turno } from '@/types/database'
import { MOCK_TURNOS } from '../data/mocks'
import { AuditService } from '@/features/audit/services/audit-service'
import { useAuthStore } from '@/stores/auth-store'

// Copia local mutable para simular CRUD
let turnosMock = [...MOCK_TURNOS]

function currentUserId(): string {
  return useAuthStore.getState().auth.user?.accountNo ?? 'sistema'
}

function currentSedeId(): string | null {
  return useAuthStore.getState().sede.activeSedeId
}

export const TurnoService = {
  /**
   * Retorna turnos del día para una sede, ordenados por hora.
   * Incluye cancelados (se muestran en UI con estilo diferente).
   */
  getTurnos: async (sedeId: string, fecha: string): Promise<Turno[]> => {
    await new Promise(r => setTimeout(r, 300))
    return turnosMock
      .filter(t => t.sede_id === sedeId && t.fecha === fecha)
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  },

  updateEstado: async (
    id: string,
    estado: AsistenciaEstado,
    notas?: string
  ): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 200))
    const anterior = turnosMock.find(t => t.id === id)
    turnosMock = turnosMock.map(t =>
      t.id === id
        ? { ...t, estado, ...(notas !== undefined ? { notas } : {}), updated_at: new Date().toISOString() }
        : t
    )

    await AuditService.log({
      tabla: 'turnos',
      registro_id: id,
      accion: 'cambiar_estado',
      cambios: { estado: { anterior: anterior?.estado ?? 'programado', nuevo: estado } },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },

  /**
   * Cancela un turno con soft delete: establece estado 'cancelado'
   * y registra quién canceló y el motivo.
   */
  cancelTurno: async (
    id: string,
    motivo: string
  ): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 200))
    const usuarioId = currentUserId()
    const anterior = turnosMock.find(t => t.id === id)

    turnosMock = turnosMock.map(t =>
      t.id === id
        ? {
            ...t,
            estado: 'cancelado' as const,
            cancelado_por: usuarioId,
            motivo_cancelacion: motivo,
            updated_at: new Date().toISOString(),
          }
        : t
    )

    await AuditService.log({
      tabla: 'turnos',
      registro_id: id,
      accion: 'eliminar',
      cambios: {
        estado: { anterior: anterior?.estado ?? 'programado', nuevo: 'cancelado' },
        motivo_cancelacion: { anterior: null, nuevo: motivo },
        cancelado_por: { anterior: null, nuevo: usuarioId },
      },
      usuario_id: usuarioId,
      sede_id: currentSedeId(),
    })

    return { success: true }
  },

  createEvolucion: async (turnoId: string, contenido: string): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 300))
    const anterior = turnosMock.find(t => t.id === turnoId)
    turnosMock = turnosMock.map(t =>
      t.id === turnoId
        ? { ...t, notas: contenido, updated_at: new Date().toISOString() }
        : t
    )

    await AuditService.log({
      tabla: 'turnos',
      registro_id: turnoId,
      accion: 'actualizar',
      cambios: {
        notas: { anterior: anterior?.notas ?? null, nuevo: contenido },
      },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },
}
