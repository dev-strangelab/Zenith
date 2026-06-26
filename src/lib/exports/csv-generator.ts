/**
 * Generador de archivos CSV para exportación de datos
 *
 * Funciones para generar y descargar reportes en formato CSV.
 * Maneja correctamente UTF-8, caracteres especiales y formato Excel-compatible.
 */

import type { Alumno, Liquidacion } from '@/types/database'
import { formatFecha } from '@/lib/utils/dates'
import { formatDNI, formatCUD, sanitizeFilename } from '@/lib/utils/formatters'

// ============================================================================
// TIPOS
// ============================================================================

export interface ReporteData {
  alumnos: Alumno[]
  liquidaciones: Liquidacion[]
  sede?: { id: string; nombre: string }
  periodo?: { mes: string; anio: number }
  estadisticas?: {
    totalAlumnos: number
    alumnosActivos: number
    facturacionMensual: number
    prestacionesBrindadas: number
    cudVencidos: number
    cudPorVencer: number
  }
  vencimientosCUD?: unknown[]
}

// ============================================================================
// HELPERS PRIVADOS
// ============================================================================

/**
 * Escapa un valor para CSV (maneja comillas, comas, saltos de línea)
 * @private
 */
function escaparValorCSV(valor: unknown): string {
  if (valor === null || valor === undefined) return ''

  const valorStr = String(valor)

  // Si contiene comillas, comas o saltos de línea, envolver en comillas y escapar comillas internas
  if (valorStr.includes('"') || valorStr.includes(',') || valorStr.includes('\n')) {
    return `"${valorStr.replace(/"/g, '""')}"`
  }

  return valorStr
}

/**
 * Convierte un array de objetos a formato CSV
 * @private
 */
function arrayToCSV(headers: string[], rows: string[][]): string {
  const headerLine = headers.map(escaparValorCSV).join(',')
  const dataLines = rows.map(row => row.map(escaparValorCSV).join(',')).join('\n')

  return `${headerLine}\n${dataLines}`
}

/**
 * Genera el nombre de archivo con timestamp
 * @private
 */
function generarNombreArchivo(prefijo: string, extension: string = 'csv'): string {
  const fecha = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const hora = new Date().toTimeString().slice(0, 5).replace(':', '-') // HH-MM
  const nombreSanitizado = sanitizeFilename(prefijo)

  return `${nombreSanitizado}_${fecha}_${hora}.${extension}`
}

/**
 * Descarga un string como archivo CSV
 * @private
 */
function downloadCSV(contenido: string, nombreArchivo: string): void {
  // BOM para UTF-8 (necesario para Excel)
  const BOM = '\uFEFF'
  const contenidoConBOM = BOM + contenido

  // Crear blob con encoding correcto
  const blob = new Blob([contenidoConBOM], {
    type: 'text/csv;charset=utf-8;',
  })

  // Crear URL y descargar
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nombreArchivo
  link.style.display = 'none'

  document.body.appendChild(link)
  link.click()

  // Cleanup
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ============================================================================
// GENERADORES ESPECÍFICOS
// ============================================================================

/**
 * Genera CSV de alumnos
 *
 * @param alumnos - Array de alumnos a exportar
 * @returns String en formato CSV
 *
 * @example
 * const csv = generateAlumnosCSV(alumnos)
 */
export function generateAlumnosCSV(alumnos: Alumno[]): string {
  const headers = [
    'ID',
    'Apellido',
    'Nombre',
    'DNI',
    'Fecha Nacimiento',
    'Estado',
    'Obra Social',
    'Nro. Afiliado',
    'CUD',
    'Vencimiento CUD',
    'Diagnóstico',
    'Notas',
    'Fecha Alta',
  ]

  const rows = alumnos.map(alumno => [
    alumno.id,
    alumno.apellido,
    alumno.nombre,
    formatDNI(alumno.dni),
    alumno.fecha_nacimiento ? formatFecha(alumno.fecha_nacimiento) : '',
    alumno.estado,
    alumno.obra_social_nombre || '',
    alumno.numero_afiliado || '',
    alumno.cud_numero ? formatCUD(alumno.cud_numero) : '',
    alumno.cud_vencimiento ? formatFecha(alumno.cud_vencimiento) : '',
    alumno.diagnostico || '',
    alumno.notas || '',
    formatFecha(alumno.created_at),
  ])

  return arrayToCSV(headers, rows)
}

/**
 * Genera CSV de liquidaciones
 *
 * @param liquidaciones - Array de liquidaciones a exportar
 * @returns String en formato CSV
 */
export function generateLiquidacionesCSV(liquidaciones: Liquidacion[]): string {
  const headers = [
    'ID',
    'Período',
    'Obra Social ID',
    'Estado',
    'Fecha Emisión',
    'Fecha Presentación',
    'Monto Total',
    'Notas',
    'Fecha Creación',
  ]

  const rows = liquidaciones.map(liq => [
    liq.id,
    liq.periodo || '',
    liq.obra_social_id || '',
    liq.estado || '',
    liq.fecha_emision ? formatFecha(liq.fecha_emision) : '',
    liq.fecha_presentacion ? formatFecha(liq.fecha_presentacion) : '',
    liq.monto_total?.toString() || '0',
    liq.notas || '',
    formatFecha(liq.created_at),
  ])

  return arrayToCSV(headers, rows)
}

/**
 * Genera un reporte CSV consolidado de una sede
 *
 * @param data - Datos del reporte (alumnos y liquidaciones)
 * @param sedeNombre - Nombre de la sede
 * @returns String en formato CSV
 */
export function generateReporteCSV(data: ReporteData, sedeNombre: string): string {
  const { alumnos, liquidaciones } = data
  const fechaGeneracion = formatFecha(new Date().toISOString(), 'dd/MM/yyyy HH:mm')

  // Encabezado del reporte
  const lineas: string[] = [
    `REPORTE DE GESTIÓN - ${sedeNombre.toUpperCase()}`,
    `Fecha de generación: ${fechaGeneracion}`,
    '',
    '', // Línea vacía separadora
  ]

  // Sección Alumnos
  lineas.push('ALUMNOS')
  lineas.push('ID,Apellido,Nombre,DNI,Obra Social,Estado,CUD Vencimiento')

  alumnos.forEach(a => {
    const fila = [
      a.id,
      a.apellido,
      a.nombre,
      formatDNI(a.dni),
      a.obra_social_nombre || '',
      a.estado,
      a.cud_vencimiento ? formatFecha(a.cud_vencimiento) : '',
    ]
      .map(escaparValorCSV)
      .join(',')

    lineas.push(fila)
  })

  // Línea vacía separadora
  lineas.push('')
  lineas.push('')

  // Sección Liquidaciones
  lineas.push('LIQUIDACIONES')
  lineas.push('ID,Período,Obra Social,Monto Total,Estado')

  liquidaciones.forEach(l => {
    const fila = [
      l.id,
      l.periodo || '',
      l.obra_social_id || '',
      l.monto_total?.toString() || '0',
      l.estado || '',
    ]
      .map(escaparValorCSV)
      .join(',')

    lineas.push(fila)
  })

  return lineas.join('\n')
}

// ============================================================================
// FUNCIONES DE DESCARGA
// ============================================================================

/**
 * Descarga un CSV de alumnos
 *
 * @param alumnos - Array de alumnos
 * @param nombreBase - Nombre base del archivo (opcional)
 *
 * @example
 * downloadAlumnosCSV(alumnos, 'alumnos_sede_norte')
 */
export function downloadAlumnosCSV(alumnos: Alumno[], nombreBase: string = 'alumnos'): void {
  const csv = generateAlumnosCSV(alumnos)
  const nombreArchivo = generarNombreArchivo(nombreBase)
  downloadCSV(csv, nombreArchivo)
}

/**
 * Descarga un CSV de liquidaciones
 *
 * @param liquidaciones - Array de liquidaciones
 * @param nombreBase - Nombre base del archivo (opcional)
 */
export function downloadLiquidacionesCSV(
  liquidaciones: Liquidacion[],
  nombreBase: string = 'liquidaciones'
): void {
  const csv = generateLiquidacionesCSV(liquidaciones)
  const nombreArchivo = generarNombreArchivo(nombreBase)
  downloadCSV(csv, nombreArchivo)
}

/**
 * Descarga un reporte completo de una sede
 *
 * @param data - Datos del reporte
 * @param sedeNombre - Nombre de la sede
 *
 * @example
 * downloadReporteSedeCSV({ alumnos, liquidaciones }, 'Sede Norte')
 */
export function downloadReporteSedeCSV(data: ReporteData, sedeNombre: string): void {
  const csv = generateReporteCSV(data, sedeNombre)
  const nombreArchivo = generarNombreArchivo(`reporte_${sedeNombre}`)
  downloadCSV(csv, nombreArchivo)
}

// ============================================================================
// GENERADORES GENÉRICOS
// ============================================================================

/**
 * Genera un CSV genérico desde un array de objetos
 *
 * @param data - Array de objetos
 * @param headers - Nombres de las columnas
 * @param nombreArchivo - Nombre del archivo
 *
 * @example
 * generateGenericCSV(
 *   [{ name: 'Juan', age: 30 }, { name: 'María', age: 25 }],
 *   ['Nombre', 'Edad'],
 *   'usuarios'
 * )
 */
export function generateGenericCSV<T extends Record<string, unknown>>(
  data: T[],
  headers: string[],
  nombreArchivo: string
): void {
  if (data.length === 0) {
    console.warn('[csv-generator] No hay datos para exportar')
    return
  }

  // Obtener las keys del primer objeto
  const keys = Object.keys(data[0])

  // Generar filas
  const rows = data.map(item => keys.map(key => item[key])) as string[][]

  const csv = arrayToCSV(headers, rows)
  const nombreFinal = generarNombreArchivo(nombreArchivo)
  downloadCSV(csv, nombreFinal)
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Convierte un array 2D a CSV (para casos especiales)
 *
 * @param data - Array de arrays
 * @returns String en formato CSV
 *
 * @example
 * const csv = arrayToCSVString([
 *   ['Nombre', 'Edad'],
 *   ['Juan', '30'],
 *   ['María', '25']
 * ])
 */
export function arrayToCSVString(data: string[][]): string {
  if (data.length === 0) return ''

  const headers = data[0]
  const rows = data.slice(1)

  return arrayToCSV(headers, rows)
}

/**
 * Verifica si el navegador soporta descarga de archivos
 *
 * @returns true si soporta descarga
 */
export function supportsDownload(): boolean {
  try {
    return typeof document !== 'undefined' && typeof Blob !== 'undefined'
  } catch {
    return false
  }
}
