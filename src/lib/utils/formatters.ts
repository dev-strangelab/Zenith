/**
 * Utilidades de formateo y display
 *
 * Funciones centralizadas para formatear datos antes de mostrarlos en la UI.
 * Mantiene consistencia en cómo se presentan los datos en toda la aplicación.
 */

import type { Alumno, Turno, AlumnoEstado } from '@/types/database'

// ============================================================================
// FORMATEO DE NOMBRES
// ============================================================================

/**
 * Formatea el nombre completo de un alumno
 *
 * @param alumno - Objeto alumno o partial con nombre y apellido
 * @returns Nombre formateado "Apellido, Nombre"
 *
 * @example
 * formatAlumnoNombre({ nombre: 'Juan', apellido: 'Pérez' }) // 'Pérez, Juan'
 */
export function formatAlumnoNombre(alumno: Pick<Alumno, 'nombre' | 'apellido'>): string {
  if (!alumno.nombre || !alumno.apellido) {
    return 'Sin nombre'
  }
  return `${alumno.apellido}, ${alumno.nombre}`
}

/**
 * Formatea nombre completo en orden natural
 *
 * @param nombre - Nombre
 * @param apellido - Apellido
 * @returns "Nombre Apellido"
 *
 * @example
 * formatNombreCompleto('Juan', 'Pérez') // 'Juan Pérez'
 */
export function formatNombreCompleto(nombre: string, apellido: string): string {
  if (!nombre || !apellido) return 'Sin nombre'
  return `${nombre} ${apellido}`
}

/**
 * Formatea iniciales de un nombre
 *
 * @param nombre - Nombre
 * @param apellido - Apellido
 * @returns Iniciales en mayúsculas
 *
 * @example
 * formatIniciales('Juan', 'Pérez') // 'JP'
 * formatIniciales('María Sol', 'García López') // 'MG'
 */
export function formatIniciales(nombre: string, apellido: string): string {
  if (!nombre || !apellido) return '?'

  const inicialNombre = nombre.charAt(0).toUpperCase()
  const inicialApellido = apellido.charAt(0).toUpperCase()

  return `${inicialNombre}${inicialApellido}`
}

// ============================================================================
// FORMATEO DE DOCUMENTOS
// ============================================================================

/**
 * Formatea un DNI con puntos separadores
 *
 * @param dni - DNI sin formato
 * @returns DNI formateado con puntos
 *
 * @example
 * formatDNI('12345678') // '12.345.678'
 * formatDNI('1234567') // '1.234.567'
 */
export function formatDNI(dni: string): string {
  if (!dni) return ''

  // Remover caracteres no numéricos
  const dniLimpio = dni.replace(/\D/g, '')

  if (dniLimpio.length === 0) return ''

  // Formatear con puntos
  return dniLimpio.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/**
 * Formatea un CUIT/CUIL con guiones
 *
 * @param cuit - CUIT sin formato
 * @returns CUIT formateado XX-XXXXXXXX-X
 *
 * @example
 * formatCUIT('20123456789') // '20-12345678-9'
 */
export function formatCUIT(cuit: string): string {
  if (!cuit) return ''

  const cuitLimpio = cuit.replace(/\D/g, '')

  if (cuitLimpio.length !== 11) return cuit

  return `${cuitLimpio.slice(0, 2)}-${cuitLimpio.slice(2, 10)}-${cuitLimpio.slice(10)}`
}

// ============================================================================
// FORMATEO DE ESTADOS (BADGES)
// ============================================================================

/**
 * Obtiene la configuración de badge para un estado de alumno
 *
 * @param estado - Estado del alumno
 * @returns Objeto con label y variant para el Badge component
 *
 * @example
 * formatEstadoBadge('activo') // { label: 'Activo', variant: 'default' }
 */
export function formatEstadoBadge(estado: AlumnoEstado): {
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
} {
  const configs: Record<AlumnoEstado, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    activo: { label: 'Activo', variant: 'default' },
    pausado: { label: 'Pausado', variant: 'outline' },
    finalizado: { label: 'Finalizado', variant: 'secondary' },
    lista_espera: { label: 'Lista de Espera', variant: 'outline' },
    eliminado: { label: 'Eliminado', variant: 'destructive' },
  }

  return configs[estado] ?? { label: estado, variant: 'outline' }
}

// ============================================================================
// FORMATEO DE HORARIOS
// ============================================================================

/**
 * Formatea el rango horario de un turno
 *
 * @param turno - Objeto turno con hora_inicio y hora_fin
 * @returns Rango horario formateado
 *
 * @example
 * formatTurnoHorario({ hora_inicio: '09:00', hora_fin: '10:00' }) // '09:00 - 10:00'
 */
export function formatTurnoHorario(turno: Pick<Turno, 'hora_inicio' | 'hora_fin'>): string {
  if (!turno.hora_inicio || !turno.hora_fin) return 'Sin horario'
  return `${turno.hora_inicio} - ${turno.hora_fin}`
}

/**
 * Formatea una hora desde formato HH:MM:SS a HH:MM
 *
 * @param hora - Hora en formato HH:MM o HH:MM:SS
 * @returns Hora en formato HH:MM
 *
 * @example
 * formatHoraSimple('09:30:00') // '09:30'
 * formatHoraSimple('14:15') // '14:15'
 */
export function formatHoraSimple(hora: string): string {
  if (!hora) return ''
  return hora.substring(0, 5)
}

// ============================================================================
// FORMATEO DE NÚMEROS
// ============================================================================

/**
 * Formatea un número con separadores de miles
 *
 * @param numero - Número a formatear
 * @returns Número formateado con puntos
 *
 * @example
 * formatNumero(1234567) // '1.234.567'
 * formatNumero(1000) // '1.000'
 */
export function formatNumero(numero: number): string {
  return numero.toLocaleString('es-AR')
}

/**
 * Formatea un porcentaje
 *
 * @param valor - Valor entre 0 y 100
 * @param decimales - Cantidad de decimales (default: 0)
 * @returns Porcentaje formateado
 *
 * @example
 * formatPorcentaje(85.5) // '86%'
 * formatPorcentaje(85.567, 2) // '85.57%'
 */
export function formatPorcentaje(valor: number, decimales: number = 0): string {
  return `${valor.toFixed(decimales)}%`
}

// ============================================================================
// FORMATEO DE TELÉFONOS
// ============================================================================

/**
 * Formatea un número de teléfono argentino
 *
 * @param telefono - Número sin formato
 * @returns Teléfono formateado
 *
 * @example
 * formatTelefono('1234567890') // '(123) 456-7890'
 * formatTelefono('541112345678') // '+54 11 1234-5678'
 */
export function formatTelefono(telefono: string): string {
  if (!telefono) return ''

  // Remover caracteres no numéricos
  const telefonoLimpio = telefono.replace(/\D/g, '')

  if (telefonoLimpio.length === 0) return ''

  // Formato para celular argentino (11 dígitos con código de país)
  if (telefonoLimpio.length === 12 && telefonoLimpio.startsWith('54')) {
    return `+${telefonoLimpio.slice(0, 2)} ${telefonoLimpio.slice(2, 4)} ${telefonoLimpio.slice(4, 8)}-${telefonoLimpio.slice(8)}`
  }

  // Formato para celular (10 dígitos)
  if (telefonoLimpio.length === 10) {
    return `(${telefonoLimpio.slice(0, 3)}) ${telefonoLimpio.slice(3, 7)}-${telefonoLimpio.slice(7)}`
  }

  // Si no matchea ningún formato conocido, devolver con espacios cada 4 dígitos
  return telefonoLimpio.replace(/(\d{4})/g, '$1 ').trim()
}

// ============================================================================
// FORMATEO DE TEXTO
// ============================================================================

/**
 * Trunca un texto largo con ellipsis
 *
 * @param texto - Texto a truncar
 * @param maxLength - Longitud máxima (default: 50)
 * @returns Texto truncado con '...' si excede el límite
 *
 * @example
 * truncarTexto('Este es un texto muy largo que necesita ser truncado', 20)
 * // 'Este es un texto muy...'
 */
export function truncarTexto(texto: string, maxLength: number = 50): string {
  if (!texto) return ''
  if (texto.length <= maxLength) return texto
  return `${texto.substring(0, maxLength)}...`
}

/**
 * Capitaliza la primera letra de un string
 *
 * @param texto - Texto a capitalizar
 * @returns Texto con primera letra en mayúscula
 *
 * @example
 * capitalize('hola mundo') // 'Hola mundo'
 */
export function capitalize(texto: string): string {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

/**
 * Capitaliza cada palabra de un texto
 *
 * @param texto - Texto a capitalizar
 * @returns Texto con cada palabra capitalizada
 *
 * @example
 * capitalizeWords('hola mundo desde argentina') // 'Hola Mundo Desde Argentina'
 */
export function capitalizeWords(texto: string): string {
  if (!texto) return ''
  return texto
    .split(' ')
    .map(palabra => capitalize(palabra))
    .join(' ')
}

// ============================================================================
// FORMATEO DE CÓDIGOS
// ============================================================================

/**
 * Formatea un código de CUD (formato amigable)
 *
 * @param cudNumero - Número de CUD
 * @returns CUD formateado
 *
 * @example
 * formatCUD('123456789') // 'CUD 123-456-789'
 */
export function formatCUD(cudNumero: string): string {
  if (!cudNumero) return 'Sin CUD'

  const cudLimpio = cudNumero.replace(/\D/g, '')

  if (cudLimpio.length === 0) return cudNumero

  // Formato XXX-XXX-XXX
  if (cudLimpio.length === 9) {
    return `CUD ${cudLimpio.slice(0, 3)}-${cudLimpio.slice(3, 6)}-${cudLimpio.slice(6)}`
  }

  return `CUD ${cudNumero}`
}

/**
 * Formatea un número de afiliado (obra social)
 *
 * @param numeroAfiliado - Número de afiliado
 * @returns Número formateado
 *
 * @example
 * formatNumeroAfiliado('1234567890') // '1234/567890'
 */
export function formatNumeroAfiliado(numeroAfiliado: string): string {
  if (!numeroAfiliado) return ''

  // Formato común: XXXX/XXXXXX
  if (numeroAfiliado.length >= 6) {
    const parte1 = numeroAfiliado.slice(0, 4)
    const parte2 = numeroAfiliado.slice(4)
    return `${parte1}/${parte2}`
  }

  return numeroAfiliado
}

// ============================================================================
// SANITIZACIÓN
// ============================================================================

/**
 * Sanitiza un string para usar como filename
 *
 * @param texto - Texto a sanitizar
 * @returns Texto seguro para usar como nombre de archivo
 *
 * @example
 * sanitizeFilename('Reporte Sede Norte 2026-03-20') // 'reporte_sede_norte_2026-03-20'
 */
export function sanitizeFilename(texto: string): string {
  if (!texto) return 'archivo'

  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9]/g, '_') // Reemplazar caracteres especiales con _
    .replace(/_+/g, '_') // Remover _ duplicados
    .replace(/^_|_$/g, '') // Remover _ al inicio/fin
}
