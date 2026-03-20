import type { Objetivo } from '@/types/database'

const MOCK_OBJETIVOS: Objetivo[] = [
  // alu-01
  {
    id: 'obj-01-1', alumno_id: 'alu-01', disciplina: 'Fonoaudiología',
    descripcion: 'Mejorar articulación del fonema /r/', completado: true, progreso: 100,
    fecha_logro: '2025-11-01', created_at: '2025-01-15T00:00:00Z', updated_at: '2025-11-01T00:00:00Z',
  },
  {
    id: 'obj-01-2', alumno_id: 'alu-01', disciplina: 'Fonoaudiología',
    descripcion: 'Aumentar vocabulario expresivo (Categorías semánticas)', completado: false, progreso: 65,
    fecha_logro: null, created_at: '2025-01-15T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'obj-01-3', alumno_id: 'alu-01', disciplina: 'Psicología',
    descripcion: 'Manejo de la frustración ante la pérdida en juegos reglados', completado: false, progreso: 30,
    fecha_logro: null, created_at: '2025-01-15T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
  },
  {
    id: 'obj-01-4', alumno_id: 'alu-01', disciplina: 'Terapia Ocupacional',
    descripcion: 'Mejorar motricidad fina para toma de lápiz', completado: false, progreso: 50,
    fecha_logro: null, created_at: '2025-03-01T00:00:00Z', updated_at: '2026-02-01T00:00:00Z',
  },
  // alu-02
  {
    id: 'obj-02-1', alumno_id: 'alu-02', disciplina: 'Psicología',
    descripcion: 'Regulación emocional ante cambios de rutina', completado: false, progreso: 45,
    fecha_logro: null, created_at: '2025-02-10T00:00:00Z', updated_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'obj-02-2', alumno_id: 'alu-02', disciplina: 'Fonoaudiología',
    descripcion: 'Comprensión de instrucciones de tres pasos', completado: true, progreso: 100,
    fecha_logro: '2025-12-01', created_at: '2025-02-10T00:00:00Z', updated_at: '2025-12-01T00:00:00Z',
  },
]

let objetivosMock = [...MOCK_OBJETIVOS]

export const ObjetivoService = {
  getByAlumno: async (alumnoId: string): Promise<Objetivo[]> => {
    await new Promise(r => setTimeout(r, 150))
    return objetivosMock.filter(o => o.alumno_id === alumnoId)
  },

  updateProgreso: async (id: string, progreso: number, completado: boolean): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 200))
    objetivosMock = objetivosMock.map(o =>
      o.id === id
        ? {
            ...o,
            progreso,
            completado,
            fecha_logro: completado ? new Date().toISOString().slice(0, 10) : o.fecha_logro,
            updated_at: new Date().toISOString(),
          }
        : o
    )
    return { success: true }
  },
}
