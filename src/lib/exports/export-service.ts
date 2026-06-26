/**
 * ExportService - Servicio de exportación de datos
 *
 * Centraliza toda la lógica de exportación de datos del sistema.
 * Utiliza los generadores de CSV para crear reportes descargables.
 *
 * Este servicio reemplazará las 30+ líneas de código de generación CSV
 * que actualmente están inline en dashboard/index.tsx y otros componentes.
 */

import type { Alumno } from '@/types/database'
import {
  type ReporteData,
  downloadAlumnosCSV,
  downloadLiquidacionesCSV,
  downloadReporteSedeCSV,
} from './csv-generator'
import { AlumnoService } from '@/features/alumnos/services/alumno-service'
import { MOCK_LIQUIDACIONES } from '@/features/liquidaciones/data/mocks'
import { MOCK_DASHBOARD_DATA } from '@/features/dashboard/data/mocks'

/**
 * Exporta todos los alumnos de una sede en formato CSV.
 *
 * @param sedeId - ID de la sede
 * @param sedeNombre - Nombre de la sede para el archivo
 */
export async function exportarAlumnosSede(sedeId: string, sedeNombre: string): Promise<void> {
  try {
    const alumnos = await AlumnoService.getAlumnosBySede(sedeId)
    downloadAlumnosCSV(alumnos, sedeNombre)
  } catch (error) {
    console.error('[ExportService] Error al exportar alumnos:', error)
    throw new Error('No se pudo exportar la lista de alumnos')
  }
}

/**
 * Exporta alumnos filtrados por profesional en formato CSV.
 *
 * @param sedeId - ID de la sede
 * @param profesionalId - ID del profesional
 * @param nombreArchivo - Nombre para el archivo
 */
export async function exportarAlumnosPorProfesional(
  sedeId: string,
  profesionalId: string,
  nombreArchivo: string
): Promise<void> {
  try {
    const alumnos = await AlumnoService.getAlumnosByProfesional(sedeId, profesionalId)
    downloadAlumnosCSV(alumnos, nombreArchivo)
  } catch (error) {
    console.error('[ExportService] Error al exportar alumnos por profesional:', error)
    throw new Error('No se pudo exportar la lista de alumnos')
  }
}

/**
 * Exporta alumnos con CUD próximos a vencer en formato CSV.
 *
 * @param sedeId - ID de la sede (opcional)
 * @param nombreArchivo - Nombre para el archivo
 */
export async function exportarVencimientosCUD(
  sedeId?: string,
  nombreArchivo: string = 'vencimientos_cud'
): Promise<void> {
  try {
    const vencimientos = await AlumnoService.getVencimientosCUD(sedeId)

    // Convertir a formato Alumno para el generador CSV
    const alumnosConVencimiento: Alumno[] = vencimientos.map(v => ({
      ...v,
      // Agregar información del estado de vencimiento en las notas
      notas: v.notas
        ? `${v.notas} | ${v.estadoVencimiento.toUpperCase()}: ${v.diasRestantes} días`
        : `${v.estadoVencimiento.toUpperCase()}: ${v.diasRestantes} días`,
    }))

    downloadAlumnosCSV(alumnosConVencimiento, nombreArchivo)
  } catch (error) {
    console.error('[ExportService] Error al exportar vencimientos CUD:', error)
    throw new Error('No se pudo exportar los vencimientos de CUD')
  }
}

/**
 * Exporta las liquidaciones de una sede en formato CSV.
 *
 * @param sedeId - ID de la sede
 * @param sedeNombre - Nombre de la sede para el archivo
 */
export async function exportarLiquidacionesSede(
  sedeId: string,
  sedeNombre: string
): Promise<void> {
  try {
    // TODO: Cuando se implemente LiquidacionService, usar ese servicio
    const liquidaciones = MOCK_LIQUIDACIONES.filter(l => l.sede_id === sedeId)
    downloadLiquidacionesCSV(liquidaciones as import("@/types/database").Liquidacion[], sedeNombre)
  } catch (error) {
    console.error('[ExportService] Error al exportar liquidaciones:', error)
    throw new Error('No se pudo exportar las liquidaciones')
  }
}

/**
 * Exporta un reporte consolidado de la sede (Dashboard completo).
 * Incluye estadísticas, alumnos, liquidaciones y métricas generales.
 *
 * Este método reemplaza las 30+ líneas de código inline en dashboard/index.tsx
 *
 * @param sedeId - ID de la sede
 * @param sedeNombre - Nombre de la sede para el archivo
 */
export async function exportarReporteSede(sedeId: string, sedeNombre: string): Promise<void> {
  try {
    // Obtener datos del dashboard
    const dashboardData = MOCK_DASHBOARD_DATA[sedeId]
    if (!dashboardData) {
      throw new Error(`No se encontraron datos para la sede ${sedeId}`)
    }

    // Obtener alumnos y estadísticas
    const alumnos = await AlumnoService.getAlumnosBySede(sedeId)
    const estadisticas = await AlumnoService.getEstadisticas(sedeId)
    const vencimientos = await AlumnoService.getVencimientosCUD(sedeId)

    // Obtener liquidaciones
    const liquidaciones = MOCK_LIQUIDACIONES.filter(l => l.sede_id === sedeId)

    // Construir el objeto ReporteData
    const reporteData: ReporteData = {
      sede: {
        id: sedeId,
        nombre: sedeNombre,
      },
      periodo: {
        mes: new Date().toLocaleString('es-AR', { month: 'long' }),
        anio: new Date().getFullYear(),
      },
      estadisticas: {
        totalAlumnos: estadisticas.total,
        alumnosActivos: estadisticas.activos,
        facturacionMensual: dashboardData.stats.facturacion_mensual,
        prestacionesBrindadas: (dashboardData.stats as unknown as Record<string, number>).prestaciones_brindadas ?? 0,
        cudVencidos: estadisticas.cudVencidos,
        cudPorVencer: estadisticas.cudPorVencer,
      },
      alumnos,
      liquidaciones: liquidaciones as import('@/types/database').Liquidacion[],
      vencimientosCUD: vencimientos,
    }

    downloadReporteSedeCSV(reporteData, sedeNombre)
  } catch (error) {
    console.error('[ExportService] Error al exportar reporte de sede:', error)
    throw new Error('No se pudo exportar el reporte de la sede')
  }
}

/**
 * Exporta liquidaciones filtradas por período en formato CSV.
 *
 * @param sedeId - ID de la sede
 * @param mesAnio - Período en formato "YYYY-MM" (ej: "2024-03")
 * @param nombreArchivo - Nombre para el archivo
 */
export async function exportarLiquidacionesPorPeriodo(
  sedeId: string,
  mesAnio: string,
  nombreArchivo: string
): Promise<void> {
  try {
    // TODO: Cuando se implemente LiquidacionService, usar ese servicio con filtro de período
    const [anio, mes] = mesAnio.split('-')
    const liquidaciones = MOCK_LIQUIDACIONES.filter(l => {
      if (l.sede_id !== sedeId) return false
      const fechaLiq = new Date((l as Record<string, unknown>).fecha as string)
      return (
        fechaLiq.getFullYear() === parseInt(anio) &&
        fechaLiq.getMonth() + 1 === parseInt(mes)
      )
    })

    downloadLiquidacionesCSV(liquidaciones as import("@/types/database").Liquidacion[], nombreArchivo)
  } catch (error) {
    console.error('[ExportService] Error al exportar liquidaciones por período:', error)
    throw new Error('No se pudo exportar las liquidaciones del período')
  }
}

/**
 * Exporta liquidaciones filtradas por obra social en formato CSV.
 *
 * @param sedeId - ID de la sede
 * @param obraSocialId - ID de la obra social
 * @param nombreArchivo - Nombre para el archivo
 */
export async function exportarLiquidacionesPorObraSocial(
  sedeId: string,
  obraSocialId: string,
  nombreArchivo: string
): Promise<void> {
  try {
    // TODO: Cuando se implemente LiquidacionService, usar ese servicio
    const liquidaciones = MOCK_LIQUIDACIONES.filter(
      l => l.sede_id === sedeId && l.obra_social_id === obraSocialId
    )

    downloadLiquidacionesCSV(liquidaciones as import("@/types/database").Liquidacion[], nombreArchivo)
  } catch (error) {
    console.error('[ExportService] Error al exportar liquidaciones por obra social:', error)
    throw new Error('No se pudo exportar las liquidaciones de la obra social')
  }
}
