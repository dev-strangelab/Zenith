import { parseISO, isValid, isBefore, addDays } from 'date-fns'
import { CUD_DIAS_ALERTA } from '@/lib/constants'

/**
 * Retorna true si el CUD está vencido (fecha menor a hoy).
 * Retorna false si la fecha es null, vacía o no es una fecha válida.
 */
export function isCudVencido(fecha: string | null): boolean {
  if (!fecha) return false
  const d = parseISO(fecha)
  if (!isValid(d)) return false
  return isBefore(d, new Date())
}

/**
 * Retorna true si el CUD vence dentro de los próximos CUD_DIAS_ALERTA días.
 * No retorna true si ya está vencido (para eso usar isCudVencido).
 */
export function isCudPorVencer(fecha: string | null): boolean {
  if (!fecha) return false
  const d = parseISO(fecha)
  if (!isValid(d)) return false
  const now = new Date()
  if (isBefore(d, now)) return false
  return isBefore(d, addDays(now, CUD_DIAS_ALERTA))
}
