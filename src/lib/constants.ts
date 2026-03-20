/**
 * Constantes centrales de la aplicación Órbita.
 * Fuente única de verdad para todos los estados y etiquetas del sistema.
 * Importar desde aquí en lugar de usar string literals dispersos.
 */

// ---------------------------------------------------------------------------
// ALUMNO
// ---------------------------------------------------------------------------

export const ALUMNO_ESTADO = {
  ACTIVO: 'activo',
  PAUSADO: 'pausado',
  FINALIZADO: 'finalizado',
  LISTA_ESPERA: 'lista_espera',
} as const

export const ALUMNO_ESTADO_LABEL: Record<string, string> = {
  activo: 'Activo',
  pausado: 'Pausado',
  finalizado: 'Finalizado',
  lista_espera: 'Lista de Espera',
}

// ---------------------------------------------------------------------------
// ASISTENCIA / TURNO
// ---------------------------------------------------------------------------

export const ASISTENCIA_ESTADO = {
  PROGRAMADO: 'programado',
  PRESENTE: 'presente',
  AUSENTE_CON_AVISO: 'ausente_con_aviso',
  AUSENTE_SIN_AVISO: 'ausente_sin_aviso',
  CANCELADO: 'cancelado',
} as const

export const ASISTENCIA_ESTADO_LABEL: Record<string, string> = {
  programado: 'Programado',
  presente: 'Presente',
  ausente_con_aviso: 'Ausente con Aviso',
  ausente_sin_aviso: 'Ausente sin Aviso',
  cancelado: 'Cancelado',
}

export const ASISTENCIA_ESTADO_CLASSES: Record<string, string> = {
  programado: 'bg-muted/50 text-muted-foreground border-border',
  presente: 'bg-green-100 text-green-800 border-green-200',
  ausente_con_aviso: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  ausente_sin_aviso: 'bg-red-100 text-red-800 border-red-200',
  cancelado: 'bg-gray-100 text-gray-500 border-gray-200',
}

// ---------------------------------------------------------------------------
// LIQUIDACION
// ---------------------------------------------------------------------------

export const LIQUIDACION_ESTADO = {
  BORRADOR: 'borrador',
  GENERADA: 'generada',
  PRESENTADA: 'presentada',
  APROBADA: 'aprobada',
  COBRADA: 'cobrada',
  RECHAZADA: 'rechazada',
} as const

export const LIQUIDACION_ESTADO_LABEL: Record<string, string> = {
  borrador: 'Borrador',
  generada: 'Generada',
  presentada: 'Presentada',
  aprobada: 'Aprobada',
  cobrada: 'Cobrada',
  rechazada: 'Rechazada',
}

// ---------------------------------------------------------------------------
// ORDEN DE PAGO (Honorarios)
// ---------------------------------------------------------------------------

export const ORDEN_PAGO_ESTADO = {
  BORRADOR: 'borrador',
  PENDIENTE_FACTURACION: 'pendiente_facturacion',
  PAGO_PENDIENTE: 'pago_pendiente',
  LIQUIDADO: 'liquidado',
} as const

export const ORDEN_PAGO_ESTADO_LABEL: Record<string, string> = {
  borrador: 'En Cálculo (Borrador)',
  pendiente_facturacion: 'Requiere Factura',
  pago_pendiente: 'En Tesorería (Pago Pendiente)',
  liquidado: 'Cobrado y Liquidado',
}

// ---------------------------------------------------------------------------
// CUD
// ---------------------------------------------------------------------------

/** Días antes del vencimiento para alertar al usuario. */
export const CUD_DIAS_ALERTA = 60

// ---------------------------------------------------------------------------
// ROLES
// ---------------------------------------------------------------------------

export const APP_ROL = {
  DIRECTOR_ORGANIZACION: 'director_organizacion',
  DIRECTOR_SEDE: 'director_sede',
  COORDINADOR: 'coordinador',
  PROFESIONAL: 'profesional',
  ADMINISTRATIVO: 'administrativo',
  FAMILIAR: 'familiar',
} as const

export const APP_ROL_LABEL: Record<string, string> = {
  director_organizacion: 'Director de Organización',
  director_sede: 'Director de Sede',
  coordinador: 'Coordinador',
  profesional: 'Profesional',
  administrativo: 'Administrativo',
  familiar: 'Familiar',
}
