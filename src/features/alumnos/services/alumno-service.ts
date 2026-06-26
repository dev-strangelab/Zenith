import type { Alumno } from '@/types/database'
import { MOCK_ALUMNOS } from '../data/mocks'
import { AuditService } from '@/features/audit/services/audit-service'
import { useAuthStore } from '@/stores/auth-store'
import { calcularDiasRestantes, isCudVencido, isCudPorVencer, isCudCritico } from '@/lib/utils/dates'

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

  /**
   * Retorna alumnos activos de una sede específica.
   * Excluye alumnos eliminados y finalizados.
   *
   * @param sedeId - ID de la sede
   * @returns Alumnos activos de la sede
   */
  getAlumnosBySede: async (sedeId: string): Promise<Alumno[]> => {
    await new Promise(r => setTimeout(r, 200))
    return alumnosMock.filter(
      a => a.sede_id === sedeId &&
           a.estado !== 'eliminado' &&
           a.estado !== 'finalizado'
    )
  },

  /**
   * Retorna alumnos asignados a un profesional en una sede específica.
   * Excluye alumnos eliminados y finalizados.
   *
   * @param sedeId - ID de la sede
   * @param profesionalId - ID del profesional
   * @returns Alumnos asignados al profesional en la sede
   */
  getAlumnosByProfesional: async (sedeId: string, profesionalId: string): Promise<Alumno[]> => {
    await new Promise(r => setTimeout(r, 200))
    return alumnosMock.filter(
      a => a.sede_id === sedeId &&
           a.estado !== 'eliminado' &&
           a.estado !== 'finalizado' &&
           a.profesionales_asignados?.includes(profesionalId)
    )
  },

  /**
   * Retorna alumnos con CUD próximos a vencer o vencidos.
   * Incluye información de días restantes y estado del vencimiento.
   *
   * @param sedeId - ID de la sede (opcional)
   * @param diasAlerta - Días de anticipación para la alerta (default: 30)
   * @returns Alumnos con CUD próximos a vencer ordenados por urgencia
   */
  getVencimientosCUD: async (
    sedeId?: string,
    diasAlerta: number = 30
  ): Promise<Array<Alumno & { diasRestantes: number; estadoVencimiento: 'vencido' | 'critico' | 'alerta' | 'vigente' }>> => {
    await new Promise(r => setTimeout(r, 200))

    let alumnos = alumnosMock.filter(
      a => a.estado !== 'eliminado' &&
           a.estado !== 'finalizado' &&
           a.cud_vencimiento
    )

    if (sedeId) {
      alumnos = alumnos.filter(a => a.sede_id === sedeId)
    }

    // Agregar información de vencimiento
    const conVencimiento = alumnos
      .map(alumno => {
        const diasRestantes = calcularDiasRestantes(alumno.cud_vencimiento!)
        let estadoVencimiento: 'vencido' | 'critico' | 'alerta' | 'vigente'

        if (isCudVencido(alumno.cud_vencimiento!)) {
          estadoVencimiento = 'vencido'
        } else if (isCudCritico(alumno.cud_vencimiento!)) {
          estadoVencimiento = 'critico'
        } else if (isCudPorVencer(alumno.cud_vencimiento!, diasAlerta)) {
          estadoVencimiento = 'alerta'
        } else {
          estadoVencimiento = 'vigente'
        }

        return {
          ...alumno,
          diasRestantes,
          estadoVencimiento,
        }
      })
      // Filtrar solo los que están en alerta, crítico o vencido
      .filter(a => a.estadoVencimiento !== 'vigente')
      // Ordenar por urgencia: vencidos primero, luego críticos, luego alertas
      .sort((a, b) => {
        const ordenUrgencia = { vencido: 0, critico: 1, alerta: 2, vigente: 3 }
        const urgenciaA = ordenUrgencia[a.estadoVencimiento]
        const urgenciaB = ordenUrgencia[b.estadoVencimiento]

        if (urgenciaA !== urgenciaB) {
          return urgenciaA - urgenciaB
        }
        // Si tienen la misma urgencia, ordenar por días restantes (más urgente primero)
        return a.diasRestantes - b.diasRestantes
      })

    return conVencimiento
  },

  /**
   * Retorna estadísticas generales de alumnos de una sede.
   *
   * @param sedeId - ID de la sede
   * @returns Estadísticas de alumnos
   */
  getEstadisticas: async (sedeId: string): Promise<{
    total: number
    activos: number
    enEspera: number
    finalizados: number
    porEstado: Record<string, number>
    cudVencidos: number
    cudPorVencer: number
  }> => {
    await new Promise(r => setTimeout(r, 200))

    const alumnos = alumnosMock.filter(
      a => a.sede_id === sedeId && a.estado !== 'eliminado'
    )

    const activos = alumnos.filter(a => a.estado === 'activo')
    const enEspera = alumnos.filter(a => a.estado === 'lista_espera')
    const finalizados = alumnos.filter(a => a.estado === 'finalizado')

    // Contar por estado
    const porEstado: Record<string, number> = {}
    alumnos.forEach(a => {
      porEstado[a.estado] = (porEstado[a.estado] || 0) + 1
    })

    // CUD vencidos y por vencer
    const cudVencidos = alumnos.filter(
      a => a.cud_vencimiento && isCudVencido(a.cud_vencimiento)
    ).length

    const cudPorVencer = alumnos.filter(
      a => a.cud_vencimiento &&
           !isCudVencido(a.cud_vencimiento) &&
           isCudPorVencer(a.cud_vencimiento, 30)
    ).length

    return {
      total: alumnos.length,
      activos: activos.length,
      enEspera: enEspera.length,
      finalizados: finalizados.length,
      porEstado,
      cudVencidos,
      cudPorVencer,
    }
  },
}
