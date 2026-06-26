export type AppRole = 'director_organizacion' | 'director_sede' | 'coordinador' | 'profesional' | 'administrativo' | 'familiar';

export interface Organizacion {
  id: string;
  nombre: string;
  cuit: string | null;
  email_contacto: string | null;
  telefono: string | null;
  direccion_legal: string | null;
  logo_url: string | null;
  plan_tipo: 'basico' | 'premium' | 'enterprise';
  configuracion_global: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Sede {
  id: string;
  organizacion_id: string;
  nombre: string;
  direccion: string | null;
  ciudad: string | null;
  telefono: string | null;
  email_contacto: string | null;
  cuit_prestador: string | null;
  matricula_andis: string | null;
  color_identidad: string;
  configuracion: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  organizacion_id: string | null;
  full_name: string | null;
  nombre: string | null;
  apellido: string | null;
  especialidad: string | null;
  matricula: string | null;
  avatar_url: string | null;
  firma_url: string | null;
  phone: string | null;
  preferencias_notificacion: {
    buzon_email: boolean;
  };
  created_at: string;
  updated_at: string;
}

export type AlumnoEstado = 'activo' | 'pausado' | 'finalizado' | 'lista_espera' | 'eliminado';

export type AsistenciaEstado = 'programado' | 'presente' | 'ausente_con_aviso' | 'ausente_sin_aviso' | 'cancelado';

export interface Alumno {
  id: string;
  sede_id: string;
  organizacion_id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento?: string;
  estado: AlumnoEstado;
  obra_social_id?: string;
  numero_afiliado?: string;
  cud_numero?: string;
  cud_vencimiento: string | null;
  diagnostico?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
  // Campos de display (populados por el servicio para uso en UI)
  obra_social_nombre?: string;
  /** IDs de profesionales con acceso asignado a este alumno. */
  profesionales_asignados?: string[];
}

export interface Turno {
  id: string;
  sede_id: string;
  organizacion_id: string;
  alumno_id: string;
  profesional_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  estado: AsistenciaEstado;
  notas?: string;
  cancelado_por?: string;
  motivo_cancelacion?: string;
  created_at: string;
  updated_at: string;
  // Expansiones útiles para UI
  alumno_nombre?: string;
  profesional_nombre?: string;
}

export interface BuzonMensaje {
  id: string;
  organizacion_id: string;
  sede_id: string;
  alumno_id: string;
  remitente_tipo: 'familia' | 'equipo_clinico' | 'administracion';
  remitente_id: string;
  asunto: string;
  mensaje: string;
  leido_por_admin: boolean;
  leido_por_familia: boolean;
  created_at: string;
  updated_at: string;
}

export interface Liquidacion {
  id: string;
  sede_id: string;
  organizacion_id: string;
  obra_social_id: string;
  periodo: string; // 'YYYY-MM'
  estado: 'borrador' | 'generada' | 'presentada' | 'aprobada' | 'cobrada' | 'rechazada' | 'anulada';
  fecha_emision: string | null;
  fecha_presentacion: string | null;
  monto_total: number;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface OrdenPago {
  id: string;
  profesional_id: string;
  organizacion_id: string;
  sede_id: string | null;
  periodo: string; // 'YYYY-MM-DD'
  monto_bruto: number;
  ajustes: number;
  monto_neto: number;
  estado: 'borrador' | 'pendiente_facturacion' | 'pago_pendiente' | 'liquidado';
  factura_archivo_url?: string;
  comprobante_pago_url?: string;
  comentarios?: string;
  updated_at: string;
  // Campos de display (populados por el servicio para uso en UI)
  profesional_nombre?: string;
}

export interface Prestacion {
  id: string;
  organizacion_id: string;
  obra_social_id: string;
  codigo: string;
  descripcion: string;
  valor_sesion: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlantillaEvolucion {
  id: string;
  organizacion_id: string;
  profesional_id: string | null;
  sede_id: string | null;
  titulo: string;
  contenido: string;
  categoria: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface ModalidadPago {
  id: string;
  profesional_id: string;
  organizacion_id: string;
  sede_id: string | null;
  tipo: 'por_hora' | 'mensual' | 'por_sesion';
  valor: number;
  created_at: string;
  updated_at: string;
}

export interface ObraSocial {
  id: string;
  organizacion_id: string;
  nombre: string;
  sigla: string | null;
  cuit: string | null;
  direccion_facturacion: string | null;
  email_glp: string | null;
  requiere_autorizacion: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CuentaBancaria {
  id: string;
  organizacion_id: string;
  sede_id: string | null;
  banco: string;
  titular: string;
  cbu_cvu: string;
  alias: string | null;
  tipo_cuenta: 'corriente' | 'ahorro';
  moneda: 'ARS' | 'USD';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// LIQUIDACION LINE ITEMS
// ---------------------------------------------------------------------------

export interface LiquidacionLineItem {
  id: string;
  liquidacion_id: string;
  alumno_id: string;
  alumno_nombre: string;
  prestacion_codigo: string;
  prestacion_descripcion: string;
  sesiones: number;
  valor_sesion: number;
  subtotal: number;
}

// ---------------------------------------------------------------------------
// OBJETIVOS TERAPÉUTICOS
// ---------------------------------------------------------------------------

export interface Objetivo {
  id: string;
  alumno_id: string;
  disciplina: string;
  descripcion: string;
  completado: boolean;
  /** Progreso del 0 al 100 */
  progreso: number;
  fecha_logro: string | null;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// AUDIT LOG
// ---------------------------------------------------------------------------

export type AuditAccion = 'crear' | 'actualizar' | 'eliminar' | 'cambiar_estado'

export type AuditTabla = 'alumnos' | 'turnos' | 'liquidaciones' | 'ordenes_pago' | 'usuarios'

export interface AuditLog {
  id: string;
  tabla: AuditTabla;
  registro_id: string;
  accion: AuditAccion;
  /** Objeto con las diferencias: { campo: { anterior, nuevo } } */
  cambios: Record<string, { anterior: unknown; nuevo: unknown }>;
  usuario_id: string;
  usuario_nombre?: string;
  sede_id: string | null;
  organizacion_id: string;
  timestamp: string;
}
