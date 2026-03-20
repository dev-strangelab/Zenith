/**
 * Configuraciones centralizadas para estados y badges
 *
 * Este archivo contiene las configuraciones de display para todos los estados
 * utilizados en la aplicación (Asistencia, Alumnos, Liquidaciones, etc.)
 *
 * Centralizar estas configs evita duplicación y mantiene consistencia visual.
 */

import type { AsistenciaEstado, AlumnoEstado } from '@/types/database'

// ============================================================================
// ASISTENCIA / TURNOS
// ============================================================================

export interface EstadoConfig {
  label: string
  classes: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

/**
 * Configuración de estados de asistencia para turnos
 * Usado en: Dashboard, Agenda, Turnos Diarios
 */
export const ASISTENCIA_ESTADO_CONFIG: Record<AsistenciaEstado, EstadoConfig> = {
  programado: {
    label: 'Programado',
    classes: 'bg-muted/50 text-muted-foreground border-border',
    variant: 'outline',
  },
  presente: {
    label: 'Presente',
    classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    variant: 'default',
  },
  ausente_con_aviso: {
    label: 'Ausente c/ Aviso',
    classes: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    variant: 'outline',
  },
  ausente_sin_aviso: {
    label: 'Ausente s/ Aviso',
    classes: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    variant: 'destructive',
  },
  cancelado: {
    label: 'Cancelado',
    classes: 'bg-gray-100 text-gray-500 border-gray-200 line-through dark:bg-gray-800 dark:text-gray-500',
    variant: 'secondary',
  },
}

/**
 * Colores para gráficos de asistencia (Recharts)
 */
export const ASISTENCIA_CHART_COLORS: Record<AsistenciaEstado, string> = {
  presente: 'hsl(var(--primary))',
  programado: 'hsl(var(--muted-foreground))',
  ausente_con_aviso: 'hsl(var(--accent))',
  ausente_sin_aviso: 'hsl(var(--destructive))',
  cancelado: '#94a3b8',
}

// ============================================================================
// ALUMNOS
// ============================================================================

/**
 * Configuración de estados de alumnos
 * Usado en: Tabla de alumnos, Ficha del alumno
 */
export const ALUMNO_ESTADO_CONFIG: Record<AlumnoEstado, EstadoConfig> = {
  activo: {
    label: 'Activo',
    classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    variant: 'default',
  },
  pausado: {
    label: 'Pausado',
    classes: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    variant: 'outline',
  },
  finalizado: {
    label: 'Finalizado',
    classes: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
    variant: 'secondary',
  },
  lista_espera: {
    label: 'Lista de Espera',
    classes: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    variant: 'outline',
  },
  eliminado: {
    label: 'Eliminado',
    classes: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    variant: 'destructive',
  },
}

// ============================================================================
// LIQUIDACIONES
// ============================================================================

export type LiquidacionEstado =
  | 'borrador'
  | 'generada'
  | 'presentada'
  | 'aprobada'
  | 'cobrada'
  | 'rechazada'
  | 'anulada'

/**
 * Configuración de estados de liquidaciones
 * Usado en: Módulo de facturación, Reportes
 */
export const LIQUIDACION_ESTADO_CONFIG: Record<LiquidacionEstado, EstadoConfig> = {
  borrador: {
    label: 'Borrador',
    classes: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
    variant: 'outline',
  },
  generada: {
    label: 'Generada',
    classes: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    variant: 'default',
  },
  presentada: {
    label: 'Presentada',
    classes: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400',
    variant: 'default',
  },
  aprobada: {
    label: 'Aprobada',
    classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    variant: 'default',
  },
  cobrada: {
    label: 'Cobrada',
    classes: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400',
    variant: 'default',
  },
  rechazada: {
    label: 'Rechazada',
    classes: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400',
    variant: 'destructive',
  },
  anulada: {
    label: 'Anulada',
    classes: 'bg-gray-100 text-gray-500 border-gray-200 line-through dark:bg-gray-800 dark:text-gray-500',
    variant: 'secondary',
  },
}

// ============================================================================
// ORDEN DE PAGO (HONORARIOS)
// ============================================================================

export type OrdenPagoEstado =
  | 'borrador'
  | 'pendiente_facturacion'
  | 'pago_pendiente'
  | 'liquidado'

/**
 * Configuración de estados de órdenes de pago
 * Usado en: Mis Honorarios, Gestión de Equipo
 */
export const ORDEN_PAGO_ESTADO_CONFIG: Record<OrdenPagoEstado, EstadoConfig> = {
  borrador: {
    label: 'Borrador',
    classes: 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400',
    variant: 'outline',
  },
  pendiente_facturacion: {
    label: 'Pendiente Facturación',
    classes: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    variant: 'outline',
  },
  pago_pendiente: {
    label: 'Pago Pendiente',
    classes: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400',
    variant: 'default',
  },
  liquidado: {
    label: 'Liquidado',
    classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    variant: 'default',
  },
}

// ============================================================================
// VENCIMIENTOS CUD
// ============================================================================

export type VencimientoEstado = 'vencido' | 'critico' | 'alerta' | 'vigente'

/**
 * Configuración para alertas de vencimiento de CUD
 * Usado en: Dashboard, Alertas, Ficha del alumno
 */
export const VENCIMIENTO_CUD_CONFIG: Record<VencimientoEstado, EstadoConfig> = {
  vencido: {
    label: 'Vencido',
    classes: 'bg-red-100 text-red-800 border-red-200 animate-pulse dark:bg-red-900/30 dark:text-red-400',
    variant: 'destructive',
  },
  critico: {
    label: 'Crítico',
    classes: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400',
    variant: 'destructive',
  },
  alerta: {
    label: 'Alerta',
    classes: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400',
    variant: 'outline',
  },
  vigente: {
    label: 'Vigente',
    classes: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400',
    variant: 'default',
  },
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Obtiene la configuración de un estado de asistencia
 * @param estado - Estado de asistencia
 * @returns Configuración del estado
 */
export function getAsistenciaConfig(estado: AsistenciaEstado): EstadoConfig {
  return ASISTENCIA_ESTADO_CONFIG[estado] ?? {
    label: estado,
    classes: 'bg-gray-100 text-gray-700',
    variant: 'outline',
  }
}

/**
 * Obtiene la configuración de un estado de alumno
 * @param estado - Estado del alumno
 * @returns Configuración del estado
 */
export function getAlumnoConfig(estado: AlumnoEstado): EstadoConfig {
  return ALUMNO_ESTADO_CONFIG[estado] ?? {
    label: estado,
    classes: 'bg-gray-100 text-gray-700',
    variant: 'outline',
  }
}

/**
 * Obtiene la configuración de un estado de liquidación
 * @param estado - Estado de liquidación
 * @returns Configuración del estado
 */
export function getLiquidacionConfig(estado: LiquidacionEstado): EstadoConfig {
  return LIQUIDACION_ESTADO_CONFIG[estado] ?? {
    label: estado,
    classes: 'bg-gray-100 text-gray-700',
    variant: 'outline',
  }
}

/**
 * Obtiene la configuración de un estado de orden de pago
 * @param estado - Estado de orden de pago
 * @returns Configuración del estado
 */
export function getOrdenPagoConfig(estado: OrdenPagoEstado): EstadoConfig {
  return ORDEN_PAGO_ESTADO_CONFIG[estado] ?? {
    label: estado,
    classes: 'bg-gray-100 text-gray-700',
    variant: 'outline',
  }
}

/**
 * Obtiene la configuración de un estado de vencimiento CUD
 * @param diasRestantes - Días restantes hasta el vencimiento (negativo si ya venció)
 * @returns Configuración del estado de vencimiento
 */
export function getVencimientoConfig(diasRestantes: number): EstadoConfig {
  if (diasRestantes < 0) return VENCIMIENTO_CUD_CONFIG.vencido
  if (diasRestantes <= 15) return VENCIMIENTO_CUD_CONFIG.critico
  if (diasRestantes <= 30) return VENCIMIENTO_CUD_CONFIG.alerta
  return VENCIMIENTO_CUD_CONFIG.vigente
}
