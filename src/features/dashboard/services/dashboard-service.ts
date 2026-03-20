/**
 * Dashboard Service — calcula KPIs y datos de gráficos desde los mocks.
 * Reemplaza MOCK_DASHBOARD_DATA estático; listo para conectar a Supabase.
 */
import { format, subMonths } from 'date-fns'
import { es } from 'date-fns/locale'

import { MOCK_ALUMNOS } from '@/features/alumnos/data/mocks'
import { MOCK_TURNOS } from '@/features/agenda/data/mocks'
import { MOCK_LIQUIDACIONES } from '@/features/liquidaciones/data/mocks'
import { MOCK_CHATS } from '@/features/buzon/data/mocks'
import { calcularDiasRestantes, isCudVencido, isCudPorVencer } from '@/lib/utils/dates'
import { ASISTENCIA_ESTADO_CONFIG } from '@/lib/constants/estado-configs'

// ─── KPIs ────────────────────────────────────────────────────────────────────

export function computeStats(sedeId: string) {
  const hoy = new Date()
  const periodoActual = format(hoy, 'yyyy-MM')
  const mesNombre = format(hoy, 'MMMM yyyy', { locale: es })
  const mesActual = mesNombre.charAt(0).toUpperCase() + mesNombre.slice(1)

  const alumnosSede = MOCK_ALUMNOS.filter(
    a => a.sede_id === sedeId && a.estado !== 'eliminado' && a.estado !== 'finalizado'
  )

  const mensajeria_urgente = MOCK_CHATS.filter(
    c => c.sede_id === sedeId && c.is_urgente && c.no_leidos > 0
  ).length

  // Suma todas las liquidaciones del mes actual (cualquier estado excepto anulada)
  const facturacion_mensual = MOCK_LIQUIDACIONES
    .filter(l => l.sede_id === sedeId && l.periodo === periodoActual && l.estado !== 'anulada')
    .reduce((sum, l) => sum + (l.monto_total ?? 0), 0)

  // Asistencia: % presente de todos los turnos de la sede
  const turnosSede = MOCK_TURNOS.filter(t => t.sede_id === sedeId)
  const presentes = turnosSede.filter(t => t.estado === 'presente').length
  const asistencia_porcentaje =
    turnosSede.length > 0 ? Math.round((presentes / turnosSede.length) * 100) : 0

  // Nuevos alumnos creados este mes
  const nuevos_mes = MOCK_ALUMNOS.filter(
    a => a.sede_id === sedeId && a.created_at?.startsWith(periodoActual)
  ).length

  return {
    total_alumnos: alumnosSede.length,
    mensajeria_urgente,
    facturacion_mensual,
    asistencia_porcentaje,
    nuevos_mes,
    mes_actual: mesActual,
  }
}

// ─── Distribución de sesiones ─────────────────────────────────────────────────

const ESTADO_LABEL: Record<string, string> = {
  programado:        'Programado',
  presente:          'Presente',
  ausente_con_aviso: 'Ausente c/ Aviso',
  ausente_sin_aviso: 'Ausente s/ Aviso',
  cancelado:         'Cancelado',
}

const ESTADO_FILL: Record<string, string> = {
  presente:          'hsl(var(--primary))',
  programado:        'hsl(var(--muted-foreground))',
  ausente_con_aviso: 'hsl(var(--accent))',
  ausente_sin_aviso: 'hsl(var(--destructive))',
  cancelado:         '#94a3b8',
}

/**
 * Computa la distribución de sesiones por estado.
 * DEPRECADO: Usar ASISTENCIA_ESTADO_CONFIG de @/lib/constants en su lugar.
 *
 * @deprecated Use ASISTENCIA_ESTADO_CONFIG directly
 * @param sedeId - ID de la sede
 * @returns Array de estados con cantidad y color
 */
export function computeSessions(sedeId: string) {
  const turnos = MOCK_TURNOS.filter(t => t.sede_id === sedeId)
  const counts: Record<string, number> = {}
  for (const t of turnos) {
    counts[t.estado] = (counts[t.estado] ?? 0) + 1
  }
  return Object.entries(counts).map(([estado, cantidad]) => ({
    estado: ESTADO_LABEL[estado] ?? estado,
    cantidad,
    fill: ESTADO_FILL[estado] ?? '#94a3b8',
  }))
}

/**
 * Computa la distribución de sesiones usando las constantes centralizadas.
 * Reemplaza a computeSessions().
 *
 * @param sedeId - ID de la sede
 * @returns Array de estados con cantidad y configuración de badge
 */
export function computeSessionsV2(sedeId: string) {
  const turnos = MOCK_TURNOS.filter(t => t.sede_id === sedeId)
  const counts: Record<string, number> = {}

  for (const t of turnos) {
    counts[t.estado] = (counts[t.estado] ?? 0) + 1
  }

  return Object.entries(counts).map(([estado, cantidad]) => {
    const config = ASISTENCIA_ESTADO_CONFIG[estado as keyof typeof ASISTENCIA_ESTADO_CONFIG]
    return {
      estado: config?.label ?? estado,
      cantidad,
      fill: ESTADO_FILL[estado] ?? '#94a3b8',
      config, // Incluir configuración completa para badges
    }
  })
}

// ─── Comparativa financiera (6 meses) ────────────────────────────────────────

export function computeFinancial(sedeId: string) {
  const hoy = new Date()
  const meses = Array.from({ length: 6 }, (_, i) => subMonths(hoy, 5 - i))

  return meses.map(mes => {
    const periodo = format(mes, 'yyyy-MM')
    const label = format(mes, 'MMM', { locale: es })
    const mesLabel = label.charAt(0).toUpperCase() + label.slice(1)

    const ingresos = MOCK_LIQUIDACIONES
      .filter(l => l.sede_id === sedeId && l.periodo === periodo && l.estado !== 'anulada')
      .reduce((sum, l) => sum + (l.monto_total ?? 0), 0)

    // Honorarios: 70 % de los ingresos como aproximación (ver OrdenPago reales)
    const honorarios = Math.round(ingresos * 0.70)

    return { mes: mesLabel, ingresos, honorarios }
  })
}

// ─── Vista profesional — turnos del día ───────────────────────────────────────

export function computeTurnosHoy(sedeId: string, profesionalId?: string) {
  const hoy = new Date().toISOString().split('T')[0]
  return MOCK_TURNOS.filter(t => {
    if (t.sede_id !== sedeId || t.fecha !== hoy) return false
    if (profesionalId) return t.profesional_id === profesionalId
    return true
  })
}

// ─── Alertas y Notificaciones ─────────────────────────────────────────────────

/**
 * Computa alertas de CUD próximos a vencer o vencidos.
 *
 * @param sedeId - ID de la sede
 * @returns Contadores de alertas CUD
 */
export function computeAlertasCUD(sedeId: string): {
  vencidos: number
  criticos: number // < 15 días
  alertas: number  // < 30 días
  total: number
} {
  const alumnos = MOCK_ALUMNOS.filter(
    a => a.sede_id === sedeId &&
         a.estado !== 'eliminado' &&
         a.estado !== 'finalizado' &&
         a.cud_vencimiento
  )

  let vencidos = 0
  let criticos = 0
  let alertas = 0

  alumnos.forEach(alumno => {
    if (!alumno.cud_vencimiento) return

    if (isCudVencido(alumno.cud_vencimiento)) {
      vencidos++
    } else {
      const dias = calcularDiasRestantes(alumno.cud_vencimiento)
      if (dias <= 15) {
        criticos++
      } else if (dias <= 30) {
        alertas++
      }
    }
  })

  return {
    vencidos,
    criticos,
    alertas,
    total: vencidos + criticos + alertas,
  }
}

/**
 * Computa estadísticas completas del dashboard.
 * Combina múltiples fuentes de datos en un solo objeto.
 *
 * @param sedeId - ID de la sede
 * @returns Objeto con todas las estadísticas del dashboard
 */
export function computeDashboardCompleto(sedeId: string) {
  const stats = computeStats(sedeId)
  const sessions = computeSessionsV2(sedeId)
  const financial = computeFinancial(sedeId)
  const alertasCUD = computeAlertasCUD(sedeId)

  const mensajesUrgentes = MOCK_CHATS.filter(
    c => c.sede_id === sedeId && c.is_urgente && c.no_leidos > 0
  ).length

  const mensajesNoLeidos = MOCK_CHATS.filter(
    c => c.sede_id === sedeId && c.no_leidos > 0
  ).length

  return {
    stats,
    sessions,
    financial,
    alertas: {
      cud: alertasCUD,
      mensajesUrgentes,
      mensajesNoLeidos,
    },
    periodo: {
      mes: stats.mes_actual,
      anio: new Date().getFullYear(),
    },
  }
}

/**
 * Computa liquidaciones pendientes por obra social.
 *
 * @param sedeId - ID de la sede
 * @returns Array de obras sociales con monto pendiente
 */
export function computeLiquidacionesPendientes(sedeId: string) {
  const liquidacionesPendientes = MOCK_LIQUIDACIONES.filter(
    l => l.sede_id === sedeId &&
         (l.estado === 'pendiente' || l.estado === 'presentada')
  )

  // Agrupar por obra social
  const porObraSocial: Record<string, { nombre: string; monto: number; cantidad: number }> = {}

  liquidacionesPendientes.forEach(liq => {
    const key = liq.obra_social_id
    if (!porObraSocial[key]) {
      porObraSocial[key] = {
        nombre: liq.obra_social_nombre ?? 'Sin nombre',
        monto: 0,
        cantidad: 0,
      }
    }
    porObraSocial[key].monto += liq.monto_total ?? 0
    porObraSocial[key].cantidad++
  })

  return Object.values(porObraSocial).sort((a, b) => b.monto - a.monto)
}

/**
 * Computa prestaciones brindadas en el período actual.
 *
 * @param sedeId - ID de la sede
 * @returns Número de prestaciones brindadas (turnos con estado 'presente')
 */
export function computePrestacionesBrindadas(sedeId: string): number {
  const hoy = new Date()
  const periodoActual = format(hoy, 'yyyy-MM')

  return MOCK_TURNOS.filter(
    t => t.sede_id === sedeId &&
         t.estado === 'presente' &&
         t.fecha.startsWith(periodoActual)
  ).length
}
