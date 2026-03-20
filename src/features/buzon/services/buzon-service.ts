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

  /**
   * Retorna el número de mensajes no leídos en una sede.
   *
   * @param sedeId - ID de la sede
   * @returns Número de chats con mensajes no leídos
   */
  getMensajesNoLeidos: async (sedeId: string): Promise<number> => {
    await new Promise(r => setTimeout(r, 100))
    return chatsMock.filter(c => c.sede_id === sedeId && c.no_leidos > 0).length
  },

  /**
   * Retorna todos los chats de una sede específica.
   *
   * @param sedeId - ID de la sede
   * @returns Chats de la sede
   */
  getChatsPorSede: async (sedeId: string): Promise<Chat[]> => {
    await new Promise(r => setTimeout(r, 200))
    return chatsMock.filter(c => c.sede_id === sedeId)
  },

  /**
   * Busca chats por nombre de alumno o familia.
   *
   * @param sedeId - ID de la sede
   * @param query - Texto a buscar
   * @returns Chats que coinciden con la búsqueda
   */
  buscarChats: async (sedeId: string, query: string): Promise<Chat[]> => {
    await new Promise(r => setTimeout(r, 200))
    const queryLower = query.toLowerCase().trim()

    if (!queryLower) {
      return chatsMock.filter(c => c.sede_id === sedeId)
    }

    return chatsMock.filter(c => {
      if (c.sede_id !== sedeId) return false

      const nombreAlumnoMatch = c.alumnos.some(a =>
        `${a.nombre} ${a.apellido}`.toLowerCase().includes(queryLower)
      )
      const nombreFamiliaMatch = c.nombre_familia.toLowerCase().includes(queryLower)
      const mensajeMatch = c.ultimo_mensaje?.toLowerCase().includes(queryLower)

      return nombreAlumnoMatch || nombreFamiliaMatch || mensajeMatch
    })
  },

  /**
   * Retorna estadísticas de mensajería de una sede.
   *
   * @param sedeId - ID de la sede
   * @returns Estadísticas de mensajería
   */
  getEstadisticas: async (sedeId: string): Promise<{
    totalChats: number
    chatsNoLeidos: number
    totalMensajesNoLeidos: number
    chatsMasRecientes: Chat[]
  }> => {
    await new Promise(r => setTimeout(r, 200))

    const chats = chatsMock.filter(c => c.sede_id === sedeId)
    const chatsNoLeidos = chats.filter(c => c.no_leidos > 0)
    const totalMensajesNoLeidos = chatsNoLeidos.reduce((sum, c) => sum + c.no_leidos, 0)

    // Ordenar por fecha (más recientes primero) - asumiendo que fecha_hora es comparable
    const chatsMasRecientes = [...chats]
      .sort((a, b) => {
        // Si ambos tienen "Ahora", son iguales
        if (a.fecha_hora === 'Ahora' && b.fecha_hora === 'Ahora') return 0
        // "Ahora" siempre va primero
        if (a.fecha_hora === 'Ahora') return -1
        if (b.fecha_hora === 'Ahora') return 1
        // Para otros casos, ordenar alfabéticamente inverso (asumiendo formato de fecha)
        return b.fecha_hora.localeCompare(a.fecha_hora)
      })
      .slice(0, 5)

    return {
      totalChats: chats.length,
      chatsNoLeidos: chatsNoLeidos.length,
      totalMensajesNoLeidos,
      chatsMasRecientes,
    }
  },
}
