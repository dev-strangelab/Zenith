import { useState, useMemo, useEffect, useCallback } from 'react'
import { BuzonService } from '../services/buzon-service'
import { toast } from 'sonner'
import type { Chat } from '../data/mocks'
import { useOrganization } from '@/hooks/use-organization'

import type { BuzonMensaje } from '@/types/database'

export type BuzonFilter = 'all' | 'unread' | 'urgent'

export function useBuzon() {
  const [allChats, setAllChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<BuzonMensaje[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [filter, setFilter] = useState<BuzonFilter>('all')
  const [search, setSearch] = useState('')
  const { activeSedeId, role } = useOrganization()

  // Simulación de carga de mensajes cuando cambia el chat seleccionado
  useEffect(() => {
    if (!selectedChatId) return

    const loadMessages = async () => {
      // Mock de mensajes para el chat seleccionado
      const mockMessages: BuzonMensaje[] = [
        {
          id: 'msg-1',
          organizacion_id: 'org-1',
          sede_id: activeSedeId || '1',
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
          sede_id: activeSedeId || '1',
          alumno_id: 'alu-1',
          remitente_tipo: 'administracion',
          remitente_id: 'admin-1',
          asunto: 'Respuesta',
          mensaje: 'Entendido Mariana. Ya avisamos al equipo. Gracias por avisar.',
          leido_por_admin: true,
          leido_por_familia: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setMessages(mockMessages)
    }
    loadMessages()
  }, [selectedChatId, activeSedeId])


  useEffect(() => {
    let ignore = false

    const loadChats = async () => {
      setIsLoading(true)
      try {
        const data = await BuzonService.getChats()
        if (!ignore) {
          setAllChats(data as Chat[])
          // Solo auto-seleccionamos el primer chat en la carga inicial
          setSelectedChatId(prev => (prev === null && data.length > 0 ? data[0].id : prev))
        }
      } catch (error) {
        if (!ignore) {
          // eslint-disable-next-line no-console
          console.error('Error al cargar chats:', error)
          toast.error('No se pudieron cargar los mensajes.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }
    loadChats()

    return () => {
      ignore = true
    }
  // Carga inicial: no incluir selectedChatId para evitar re-fetch en cada selección
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const markAsRead = useCallback((id: string) => {
    setAllChats(prev => prev.map(chat => 
      chat.id === id ? { ...chat, no_leidos: 0 } : chat
    ))
  }, [])

  const selectChat = (id: string) => {
    setSelectedChatId(id)
    markAsRead(id)
  }

  const sendMessage = async (messageText: string) => {
    if (!selectedChatId) return

    try {
      await BuzonService.sendMessage(selectedChatId, messageText)
      
      const nuevoMensaje: BuzonMensaje = {
        id: Math.random().toString(36).substr(2, 9),
        organizacion_id: 'org-1',
        sede_id: activeSedeId || '1',
        alumno_id: 'alu-1',
        remitente_tipo: 'administracion',
        remitente_id: 'admin-1',
        asunto: 'Respuesta',
        mensaje: messageText,
        leido_por_admin: true,
        leido_por_familia: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setMessages(prev => [...prev, nuevoMensaje])

      setAllChats(prev => prev.map(chat => 
        chat.id === selectedChatId 
          ? { ...chat, ultimo_mensaje: messageText, fecha_hora: 'Ahora' } 
          : chat
      ))
      
      toast.success('Mensaje enviado correctamente')
    } catch (_error) {
      toast.error('Error al enviar el mensaje. Intente de nuevo.')
    }
  }

  const chats = useMemo(() => {
    return allChats.filter(chat => {
      // 1. Filtro por Sede (Aislamiento)
      // Directores ven todo, otros solo su sede activa
      const isDirector = role.includes('director_organizacion')
      const matchesSede = isDirector || chat.sede_id === activeSedeId

      if (!matchesSede) return false

      // 2. Filtro por categoría (Leídos/Urgentes)
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'unread' && chat.no_leidos > 0) || 
        (filter === 'urgent' && chat.is_urgente)
      
      // 3. Filtro por Búsqueda
      const searchLower = search.toLowerCase()
      const matchesSearch = 
        chat.tutor_nombre.toLowerCase().includes(searchLower) ||
        chat.alumnos.some(alumno => 
          `${alumno.nombre} ${alumno.apellido}`.toLowerCase().includes(searchLower)
        )

      return matchesFilter && matchesSearch
    })
  }, [allChats, filter, search, activeSedeId, role])

  // Resetear el chat seleccionado si cambiamos de sede/filtro y el actual deja de ser visible
  useEffect(() => {
    if (chats.length > 0) {
      const isVisible = chats.some(c => c.id === selectedChatId)
      if (!isVisible) {
        setSelectedChatId(chats[0].id)
      }
    } else if (!isLoading) {
      setSelectedChatId(null)
    }
  }, [chats, selectedChatId, isLoading])

  const selectedChat = useMemo(() => 
    allChats.find(c => c.id === selectedChatId), 
  [allChats, selectedChatId])

  return {
    chats,
    messages,
    selectedChat,
    filter,
    setFilter,
    search,
    setSearch,
    selectChat,
    sendMessage,
    isLoading,
  }
}
