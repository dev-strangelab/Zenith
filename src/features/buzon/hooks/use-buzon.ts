import { useState, useMemo, useEffect, useCallback } from 'react'
import { BuzonService } from '../services/buzon-service'
import { toast } from 'sonner'
import type { Chat } from '../data/mocks'
import { useOrganization } from '@/hooks/use-organization'

import type { BuzonMensaje } from '@/types/database'

import { getMockMessages } from '../data/mock-messages'

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
      // Usar mockMessages desde archivo dedicado
      const mockMessages = getMockMessages(selectedChatId, activeSedeId || '1')
      setMessages(mockMessages)
    }
    loadMessages()
  }, [selectedChatId, activeSedeId])


  // Carga y recarga de chats cuando cambian filtros o sede
  useEffect(() => {
    let ignore = false
    const loadChats = async () => {
      // Solo mostramos loading en la carga inicial o cambio de sede profunda
      // Para filtros de búsqueda o categoría, dejamos el estado anterior para mejor UX
      const isInitialOrSedeChange = !allChats.length || activeSedeId
      if (isInitialOrSedeChange) setIsLoading(true)

      try {
        const data = await BuzonService.getChats({ 
          sedeId: activeSedeId || undefined, 
          role,
          filter,
          search
        })
        if (!ignore) {
          setAllChats(data)
          // Auto-seleccionamos el primer chat si no hay ninguno seleccionado
          if (selectedChatId === null && data.length > 0) {
            setSelectedChatId(data[0].id)
          }
        }
      } catch (error) {
        if (!ignore) {
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
    return () => { ignore = true }
  }, [activeSedeId, role, filter, search])

  const markAsRead = useCallback((id: string) => {
    setAllChats(prev => prev.map(chat => 
      chat.id === id ? { ...chat, no_leidos: 0 } : chat
    ))
    BuzonService.marcarComoLeido(id)
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
        id: crypto.randomUUID(),
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

  const chats = useMemo(() => allChats, [allChats])

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
