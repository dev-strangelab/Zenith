import type { BuzonMensaje } from '@/types/database'

/**
 * Mensajes mock para simular la conversación de un chat.
 * Estos mocks se usan mientras no haya una conexión real con Supabase.
 */
export const MOCK_MESSAGES_BY_CHAT: Record<string, BuzonMensaje[]> = {
  '1': [
    {
      id: 'msg-1',
      organizacion_id: 'org-1',
      sede_id: '1',
      alumno_id: 'alu-1',
      remitente_tipo: 'familia',
      remitente_id: 'tutor-1',
      asunto: 'Consulta',
      mensaje: 'Hola, quería avisar que Lucas amaneció con fiebre y no podrá asistir hoy.',
      leido_por_admin: true,
      leido_por_familia: true,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg-2',
      organizacion_id: 'org-1',
      sede_id: '1',
      alumno_id: 'alu-1',
      remitente_tipo: 'administracion',
      remitente_id: 'admin-1',
      asunto: 'Respuesta',
      mensaje: 'Entendido Mariana. Ya avisamos al equipo. Gracias por avisar.',
      leido_por_admin: true,
      leido_por_familia: true,
      created_at: new Date(Date.now() - 1800000).toISOString(),
      updated_at: new Date(Date.now() - 1800000).toISOString()
    }
  ],
  '2': [
    {
      id: 'msg-3',
      organizacion_id: 'org-1',
      sede_id: '1',
      alumno_id: 'alu-2',
      remitente_tipo: 'familia',
      remitente_id: 'tutor-2',
      asunto: 'Turno',
      mensaje: 'Buenas tardes, ¿me podrían confirmar el horario de mañana?',
      leido_por_admin: true,
      leido_por_familia: true,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString()
    }
  ]
}

/**
 * Función helper para obtener mensajes mock por chat ID.
 * Si no existe el chat en los mocks, retorna un array vacío o mensajes genéricos.
 */
export function getMockMessages(chatId: string, sedeId: string = '1'): BuzonMensaje[] {
  const messages = MOCK_MESSAGES_BY_CHAT[chatId] || []
  
  // Ajustar sede_id si es necesario
  return messages.map(m => ({
    ...m,
    sede_id: sedeId
  }))
}
