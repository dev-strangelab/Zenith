import { useEffect, useRef } from 'react'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCheck } from 'lucide-react'
import { BuzonMensaje } from '@/types/database'
import { format } from 'date-fns'

interface ChatMessageAreaProps {
  messages: BuzonMensaje[]
  tutorName: string
}

export function ChatMessageArea({ messages, tutorName }: ChatMessageAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastMessageRef = useRef<string | null>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    // Detectar si el último mensaje fue enviado por el staff (nosotros)
    const lastMsg = messages[messages.length - 1]
    const isSentByMe = lastMsg?.remitente_tipo === 'equipo_clinico' || lastMsg?.remitente_tipo === 'administracion'
    
    // Cálculo de scroll: ¿está el usuario cerca del fondo? (pista: 200px)
    const isAtBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200

    if (isAtBottom || isSentByMe) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      })
    }
    
    lastMessageRef.current = lastMsg?.id || null
  }, [messages])

  return (
    <div 
      ref={scrollRef}
      className='flex-1 overflow-y-auto p-6 bg-muted/20 opacity-95 scroll-smooth'
    >
      <div className='flex flex-col gap-4'>
        {/* Indicador de Fecha (Simulado para el grupo) */}
        <div className='flex justify-center mb-2'>
          <Badge
            variant='secondary'
            className='bg-background text-muted-foreground border-none font-normal text-[11px] py-1 px-4 shadow-sm'
          >
            MENSAJES RECIENTES
          </Badge>
        </div>

        {messages.map((msg) => {
          const isMe = msg.remitente_tipo === 'equipo_clinico' || msg.remitente_tipo === 'administracion'
          
          return (
            <div 
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={cn(
                  'p-3 rounded-2xl shadow-sm border max-w-[80%] relative',
                  isMe 
                    ? 'bg-primary/10 border-primary/20 rounded-tr-none' 
                    : 'bg-background border-border/50 rounded-tl-none'
                )}
              >
                <div className='flex flex-col'>
                  {!isMe && (
                    <span className='text-[10px] font-bold text-primary mb-1'>
                      {tutorName}
                    </span>
                  )}
                  <p className='text-sm text-foreground leading-relaxed whitespace-pre-wrap'>
                    {msg.mensaje}
                  </p>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className='text-[9px] text-muted-foreground'>
                      {format(new Date(msg.created_at), 'hh:mm a')}
                    </span>
                    {isMe && (
                      <CheckCheck className={`h-3 w-3 ${msg.leido_por_familia ? 'text-primary' : 'text-muted-foreground/50'}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Alerta de Sistema Mock (Si aplica a este flujo) */}
        {messages.length > 0 && messages[0].alumno_id === 'alu-1' && (
          <div className='flex justify-center my-2'>
            <div className='bg-destructive/10 text-destructive border border-destructive/20 px-6 py-2 rounded-xl flex items-center gap-3 shadow-sm backdrop-blur-sm'>
              <AlertCircle className='h-5 w-5 shrink-0' />
              <div className='flex flex-col'>
                <span className='text-xs font-bold'>Recordatorio de Documentación</span>
                <p className='text-[10px] leading-tight'>
                  El CUD del paciente está próximo a vencer.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Helper para clases condicionales si no está importado
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
