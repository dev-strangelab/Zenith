import { MOCK_CHATS, type Chat } from '../data/mocks'
import type { BuzonMensaje } from '@/types/database'

// Copias locales mutables
let chatsMock = [...MOCK_CHATS]
let mensajesMock: BuzonMensaje[] = []

export const BuzonService = {
  getChats: async (sedeId?: string, filter: string = 'all'): Promise<Chat[]> => {
    await new Promise(r => setTimeout(r, 300))
    let chats = sedeId ? chatsMock.filter(c => c.sede_id === sedeId) : [...chatsMock]
    if (filter === 'unread') {
      chats = chats.filter(c => c.no_leidos > 0)
    }
    return chats
  },

  /**
   * Agrega un mensaje al chat especificado y actualiza el último mensaje.
   */
  sendMessage: async (chatId: string, mensaje: string): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 250))

    const nuevaMensaje: BuzonMensaje = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      organizacion_id: 'org-1',
      sede_id: chatsMock.find(c => c.id === chatId)?.sede_id ?? '1',
      alumno_id: chatsMock.find(c => c.id === chatId)?.alumnos[0]?.id ?? '',
      remitente_tipo: 'administracion',
      remitente_id: 'admin-current',
      asunto: '',
      mensaje,
      leido_por_admin: true,
      leido_por_familia: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mensajesMock = [...mensajesMock, nuevaMensaje]

    chatsMock = chatsMock.map(c =>
      c.id === chatId
        ? { ...c, ultimo_mensaje: mensaje, fecha_hora: 'Ahora' }
        : c
    )

    return { success: true }
  },

  marcarComoLeido: async (id: string): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 200))
    chatsMock = chatsMock.map(c =>
      c.id === id ? { ...c, no_leidos: 0 } : c
    )
    return { success: true }
  },
}
