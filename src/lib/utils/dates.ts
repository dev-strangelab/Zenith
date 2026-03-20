/**
 * Utilidades para manejo de fechas
 *
 * Funciones centralizadas para operaciones con fechas, especialmente
 * para cálculos de vencimientos CUD y formateo de fechas.
 *
 * Usa date-fns internamente para garantizar precisión y compatibilidad.
 */

import { differenceInDays, parseISO, isValid, format, addDays } from 'date-fns'
import { es } from 'date-fns/locale'

// ============================================================================
// CONSTANTES
// ============================================================================

/**
 * Cantidad de días antes del vencimiento para mostrar alerta
 * Por defecto: 30 días
 */
export const DEFAULT_DIAS_ALERTA = 30

/**
 * Cantidad de días para considerar un vencimiento como "crítico"
 * Por defecto: 15 días
 */
export const DIAS_ALERTA_CRITICA = 15

// ============================================================================
// CÁLCULOS DE VENCIMIENTOS
// ============================================================================

/**
 * Calcula los días restantes hasta una fecha de vencimiento
 *
 * @param fechaVencimiento - Fecha en formato ISO string (YYYY-MM-DD)
 * @returns Número de días restantes (negativo si ya venció)
 *
 * @example
 * calcularDiasRestantes('2026-12-31') // 285 (si hoy es 2026-03-20)
 * calcularDiasRestantes('2026-01-01') // -78 (si hoy es 2026-03-20, ya venció)
 */
export function calcularDiasRestantes(fechaVencimiento: string): number {
  try {
    const fecha = parseISO(fechaVencimiento)
    if (!isValid(fecha)) {
      console.warn(`[dates] Fecha inválida: ${fechaVencimiento}`)
      return 0
    }

    const hoy = new Date()
    // Normalizamos a medianoche para comparar solo fechas
    hoy.setHours(0, 0, 0, 0)

    return differenceInDays(fecha, hoy)
  } catch (error) {
    console.error('[dates] Error al calcular días restantes:', error)
    return 0
  }
}

/**
 * Verifica si una fecha de CUD ya venció
 *
 * @param fecha - Fecha en formato ISO string
 * @returns true si la fecha ya pasó
 *
 * @example
 * isCudVencido('2026-01-01') // true (si hoy es después)
 * isCudVencido('2026-12-31') // false
 */
export function isCudVencido(fecha: string): boolean {
  const dias = calcularDiasRestantes(fecha)
  return dias < 0
}

/**
 * Verifica si una fecha de CUD está por vencer (dentro del período de alerta)
 *
 * @param fecha - Fecha en formato ISO string
 * @param diasAlerta - Cantidad de días de anticipación para alertar (default: 30)
 * @returns true si la fecha está dentro del período de alerta
 *
 * @example
 * isCudPorVencer('2026-04-15', 30) // true (si hoy es 2026-03-20, quedan 26 días)
 * isCudPorVencer('2026-06-01', 30) // false (quedan más de 30 días)
 */
export function isCudPorVencer(fecha: string, diasAlerta: number = DEFAULT_DIAS_ALERTA): boolean {
  const dias = calcularDiasRestantes(fecha)
  return dias >= 0 && dias <= diasAlerta
}

/**
 * Verifica si una fecha de CUD está en estado crítico (< 15 días)
 *
 * @param fecha - Fecha en formato ISO string
 * @returns true si quedan menos de 15 días
 */
export function isCudCritico(fecha: string): boolean {
  const dias = calcularDiasRestantes(fecha)
  return dias >= 0 && dias <= DIAS_ALERTA_CRITICA
}

// ============================================================================
// FORMATEO DE FECHAS
// ============================================================================

/**
 * Formatea una fecha a formato legible en español
 *
 * @param fecha - Fecha en formato ISO string o Date
 * @param formato - Formato deseado (default: 'dd/MM/yyyy')
 * @returns Fecha formateada
 *
 * @example
 * formatFecha('2026-03-20') // '20/03/2026'
 * formatFecha('2026-03-20', 'dd MMM yyyy') // '20 mar 2026'
 * formatFecha('2026-03-20', 'EEEE d MMMM') // 'viernes 20 marzo'
 */
export function formatFecha(
  fecha: string | Date,
  formato: string = 'dd/MM/yyyy'
): string {
  try {
    const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha

    if (!isValid(fechaObj)) {
      console.warn(`[dates] Fecha inválida para formatear: ${fecha}`)
      return 'Fecha inválida'
    }

    return format(fechaObj, formato, { locale: es })
  } catch (error) {
    console.error('[dates] Error al formatear fecha:', error)
    return 'Error'
  }
}

/**
 * Formatea una fecha de forma relativa (ej: "hace 3 días", "en 5 días")
 *
 * @param fecha - Fecha en formato ISO string
 * @returns Texto descriptivo de la fecha
 *
 * @example
 * formatFechaRelativa('2026-03-18') // 'hace 2 días'
 * formatFechaRelativa('2026-03-25') // 'en 5 días'
 */
export function formatFechaRelativa(fecha: string): string {
  const dias = calcularDiasRestantes(fecha)

  if (dias === 0) return 'Hoy'
  if (dias === 1) return 'Mañana'
  if (dias === -1) return 'Ayer'
  if (dias > 0) return `En ${dias} días`
  return `Hace ${Math.abs(dias)} días`
}

/**
 * Formatea fecha con hora (para logs, mensajes, etc.)
 *
 * @param fecha - Fecha en formato ISO string o Date
 * @returns Fecha formateada con hora (ej: '20/03/2026 14:30')
 *
 * @example
 * formatFechaHora('2026-03-20T14:30:00') // '20/03/2026 14:30'
 */
export function formatFechaHora(fecha: string | Date): string {
  return formatFecha(fecha, 'dd/MM/yyyy HH:mm')
}

/**
 * Formatea solo la hora
 *
 * @param fecha - Fecha en formato ISO string o Date
 * @returns Hora formateada (ej: '14:30')
 *
 * @example
 * formatHora('2026-03-20T14:30:00') // '14:30'
 */
export function formatHora(fecha: string | Date): string {
  return formatFecha(fecha, 'HH:mm')
}

// ============================================================================
// DIFERENCIAS Y COMPARACIONES
// ============================================================================

/**
 * Calcula la diferencia en días entre dos fechas
 *
 * @param fecha1 - Primera fecha (ISO string)
 * @param fecha2 - Segunda fecha (ISO string)
 * @returns Diferencia en días (positivo si fecha2 > fecha1)
 *
 * @example
 * getDiferenciaEnDias('2026-03-20', '2026-03-25') // 5
 * getDiferenciaEnDias('2026-03-25', '2026-03-20') // -5
 */
export function getDiferenciaEnDias(fecha1: string, fecha2: string): number {
  try {
    const f1 = parseISO(fecha1)
    const f2 = parseISO(fecha2)

    if (!isValid(f1) || !isValid(f2)) {
      console.warn('[dates] Una o ambas fechas son inválidas')
      return 0
    }

    return differenceInDays(f2, f1)
  } catch (error) {
    console.error('[dates] Error al calcular diferencia:', error)
    return 0
  }
}

/**
 * Verifica si una fecha es hoy
 *
 * @param fecha - Fecha en formato ISO string
 * @returns true si la fecha es hoy
 */
export function esHoy(fecha: string): boolean {
  return calcularDiasRestantes(fecha) === 0
}

/**
 * Verifica si una fecha está en el pasado
 *
 * @param fecha - Fecha en formato ISO string
 * @returns true si la fecha ya pasó
 */
export function esPasado(fecha: string): boolean {
  return calcularDiasRestantes(fecha) < 0
}

/**
 * Verifica si una fecha está en el futuro
 *
 * @param fecha - Fecha en formato ISO string
 * @returns true si la fecha aún no llega
 */
export function esFuturo(fecha: string): boolean {
  return calcularDiasRestantes(fecha) > 0
}

// ============================================================================
// GENERACIÓN DE FECHAS
// ============================================================================

/**
 * Obtiene la fecha de hoy en formato ISO (YYYY-MM-DD)
 *
 * @returns Fecha de hoy
 *
 * @example
 * getHoy() // '2026-03-20'
 */
export function getHoy(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

/**
 * Agrega días a una fecha
 *
 * @param fecha - Fecha base (ISO string)
 * @param dias - Cantidad de días a agregar (puede ser negativo)
 * @returns Nueva fecha en formato ISO
 *
 * @example
 * agregarDias('2026-03-20', 7) // '2026-03-27'
 * agregarDias('2026-03-20', -5) // '2026-03-15'
 */
export function agregarDias(fecha: string, dias: number): string {
  try {
    const fechaObj = parseISO(fecha)
    if (!isValid(fechaObj)) {
      console.warn(`[dates] Fecha inválida: ${fecha}`)
      return fecha
    }

    const nuevaFecha = addDays(fechaObj, dias)
    return format(nuevaFecha, 'yyyy-MM-dd')
  } catch (error) {
    console.error('[dates] Error al agregar días:', error)
    return fecha
  }
}

// ============================================================================
// VALIDACIONES
// ============================================================================

/**
 * Verifica si un string es una fecha válida
 *
 * @param fecha - String a validar
 * @returns true si es una fecha válida
 *
 * @example
 * esFechaValida('2026-03-20') // true
 * esFechaValida('2026-13-40') // false
 * esFechaValida('no es una fecha') // false
 */
export function esFechaValida(fecha: string): boolean {
  try {
    const fechaObj = parseISO(fecha)
    return isValid(fechaObj)
  } catch {
    return false
  }
}

/**
 * Normaliza una fecha a formato ISO (YYYY-MM-DD)
 *
 * @param fecha - Fecha en cualquier formato
 * @returns Fecha en formato ISO o null si es inválida
 *
 * @example
 * normalizarFecha('20/03/2026') // Depende del parser
 * normalizarFecha('2026-03-20') // '2026-03-20'
 */
export function normalizarFecha(fecha: string | Date): string | null {
  try {
    const fechaObj = typeof fecha === 'string' ? parseISO(fecha) : fecha
    if (!isValid(fechaObj)) return null
    return format(fechaObj, 'yyyy-MM-dd')
  } catch {
    return null
  }
}

// ============================================================================
// HELPERS PARA VENCIMIENTOS CUD
// ============================================================================

/**
 * Obtiene el estado de vencimiento de un CUD
 *
 * @param fecha - Fecha de vencimiento del CUD
 * @returns Objeto con información del estado
 *
 * @example
 * getEstadoVencimientoCUD('2026-03-15')
 * // { estado: 'critico', diasRestantes: -5, mensaje: 'Venció hace 5 días' }
 */
export function getEstadoVencimientoCUD(fecha: string): {
  estado: 'vencido' | 'critico' | 'alerta' | 'vigente'
  diasRestantes: number
  mensaje: string
} {
  const dias = calcularDiasRestantes(fecha)

  if (dias < 0) {
    return {
      estado: 'vencido',
      diasRestantes: dias,
      mensaje: `Venció hace ${Math.abs(dias)} días`,
    }
  }

  if (dias <= DIAS_ALERTA_CRITICA) {
    return {
      estado: 'critico',
      diasRestantes: dias,
      mensaje: dias === 0 ? 'Vence hoy' : `Vence en ${dias} días`,
    }
  }

  if (dias <= DEFAULT_DIAS_ALERTA) {
    return {
      estado: 'alerta',
      diasRestantes: dias,
      mensaje: `Vence en ${dias} días`,
    }
  }

  return {
    estado: 'vigente',
    diasRestantes: dias,
    mensaje: `Vigente (${dias} días restantes)`,
  }
}
