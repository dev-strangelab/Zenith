/**
 * Utilidades para el manejo de moneda y formateo financiero.
 * Asegura consistencia visual y precisión en los cálculos.
 */

const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/**
 * Formatea un número como moneda ARS.
 * @param amount El monto a formatear (ej: 1250.50)
 */
export const formatCurrency = (amount: number): string => {
  return currencyFormatter.format(amount)
}

/**
 * Formatea un periodo YYYY-MM a Mes YYYY legible.
 * @param period Periodo en formato '2025-10'
 */
export const formatPeriod = (period: string): string => {
  const [year, month] = period.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return new Intl.DateTimeFormat('es-AR', { month: 'long', year: 'numeric' }).format(date)
}

/**
 * Suma dos o más montos financieros de forma segura, evitando pérdida de
 * precisión por aritmética de punto flotante.
 * Opera internamente en centavos (enteros).
 *
 * @example sumarMontos(0.1, 0.2) // 0.3 (no 0.30000000000000004)
 */
export function sumarMontos(...montos: number[]): number {
  return montos.reduce((acc, m) => acc + Math.round(m * 100), 0) / 100
}

/**
 * Aplica un porcentaje a un monto de forma segura.
 * @param monto  Monto base (ej: 580000)
 * @param pct    Porcentaje a aplicar (ej: 85 para 85%, 15 para 15%)
 * @returns      El resultado redondeado a 2 decimales
 */
export function aplicarPorcentaje(monto: number, pct: number): number {
  return Math.round(monto * pct) / 100
}

/**
 * Calcula el monto neto aplicando una retención sobre el bruto.
 * @param bruto        Monto bruto
 * @param retencionPct Porcentaje de retención (ej: 15 para 15%)
 * @returns            Monto neto redondeado a 2 decimales
 */
export function calcularNeto(bruto: number, retencionPct: number): number {
  const retencion = aplicarPorcentaje(bruto, retencionPct)
  return sumarMontos(bruto, -retencion)
}
