import type { Alumno } from '@/types/database'
import { MOCK_ALUMNOS } from '../data/mocks'
import { AuditService } from '@/features/audit/services/audit-service'
import { useAuthStore } from '@/stores/auth-store'

// Copia local mutable para simular CRUD
let alumnosMock = [...MOCK_ALUMNOS]

function currentUserId(): string {
  return useAuthStore.getState().auth.user?.accountNo ?? 'sistema'
}

function currentSedeId(): string | null {
  return useAuthStore.getState().sede.activeSedeId
}

export const AlumnoService = {
  /**
   * Retorna alumnos filtrados por sede, excluyendo los eliminados.
   * Si se provee `profesionalId`, solo retorna los alumnos asignados a ese profesional.
   */
  getAlumnos: async (sedeId?: string, profesionalId?: string): Promise<Alumno[]> => {
    await new Promise(r => setTimeout(r, 300))
    let result = alumnosMock.filter(a => a.estado !== 'eliminado')

    if (sedeId) {
      result = result.filter(a => a.sede_id === sedeId)
    }
    if (profesionalId) {
      result = result.filter(a => a.profesionales_asignados?.includes(profesionalId))
    }

    return result
  },

  getAlumnoDetail: async (id: string): Promise<Alumno | undefined> => {
    await new Promise(r => setTimeout(r, 200))
    return alumnosMock.find(a => a.id === id && a.estado !== 'eliminado')
  },

  createAlumno: async (data: Omit<Alumno, 'id' | 'created_at' | 'updated_at'>): Promise<Alumno> => {
    await new Promise(r => setTimeout(r, 300))
    const now = new Date().toISOString()
    const nuevo: Alumno = {
      ...data,
      id: `alu-${Date.now()}`,
      profesionales_asignados: data.profesionales_asignados ?? [],
      created_at: now,
      updated_at: now,
    }
    alumnosMock = [...alumnosMock, nuevo]

    await AuditService.log({
      tabla: 'alumnos',
      registro_id: nuevo.id,
      accion: 'crear',
      cambios: { alumno: { anterior: null, nuevo: `${nuevo.nombre} ${nuevo.apellido}` } },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return nuevo
  },

  updateAlumno: async (id: string, data: Partial<Alumno>): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 300))
    const anterior = alumnosMock.find(a => a.id === id)
    alumnosMock = alumnosMock.map(a =>
      a.id === id ? { ...a, ...data, updated_at: new Date().toISOString() } : a
    )

    const cambios: Record<string, { anterior: unknown; nuevo: unknown }> = {}
    if (anterior) {
      for (const key of Object.keys(data) as (keyof Alumno)[]) {
        if (anterior[key] !== data[key]) {
          cambios[key] = { anterior: anterior[key], nuevo: data[key] }
        }
      }
    }

    await AuditService.log({
      tabla: 'alumnos',
      registro_id: id,
      accion: 'actualizar',
      cambios,
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },

  /**
   * Soft delete — marca como 'eliminado'. No borra del array.
   * Los alumnos eliminados no aparecen en getAlumnos ni getAlumnoDetail.
   */
  deleteAlumno: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 300))
    const alumno = alumnosMock.find(a => a.id === id)
    alumnosMock = alumnosMock.map(a =>
      a.id === id
        ? { ...a, estado: 'eliminado' as const, updated_at: new Date().toISOString() }
        : a
    )

    await AuditService.log({
      tabla: 'alumnos',
      registro_id: id,
      accion: 'eliminar',
      cambios: {
        estado: { anterior: alumno?.estado ?? 'activo', nuevo: 'eliminado' },
      },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },

  updateProfesionalesAsignados: async (
    alumnoId: string,
    profesionalId: string,
    accion: 'asignar' | 'desasignar'
  ): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 200))
    const anterior = alumnosMock.find(a => a.id === alumnoId)?.profesionales_asignados ?? []

    alumnosMock = alumnosMock.map(a => {
      if (a.id !== alumnoId) return a
      const nuevos =
        accion === 'asignar'
          ? [...new Set([...anterior, profesionalId])]
          : anterior.filter(p => p !== profesionalId)
      return { ...a, profesionales_asignados: nuevos, updated_at: new Date().toISOString() }
    })

    await AuditService.log({
      tabla: 'alumnos',
      registro_id: alumnoId,
      accion: 'actualizar',
      cambios: {
        profesionales_asignados: { anterior, nuevo: accion === 'asignar' ? [...anterior, profesionalId] : anterior.filter(p => p !== profesionalId) },
      },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },
}
