import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Chat } from '../data/mocks'

interface ChatListItemProps {
  chat: Chat
  isSelected: boolean
  onClick: (id: string) => void
}

export const ChatListItem = React.memo(({ chat, isSelected, onClick }: ChatListItemProps) => {
  return (
    <div
      onClick={() => onClick(chat.id)}
      className={cn(
        'flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-muted/50 relative',
        isSelected ? 'bg-muted/80 border-l-4 border-l-primary' : ''
      )}
    >
      <div className='relative'>
        <Avatar className='h-12 w-12 border shadow-sm'>
          <AvatarImage src={chat.avatar_url} />
          <AvatarFallback className='text-xs font-bold'>
            {chat.tutor_nombre.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        {chat.is_online && (
          <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full' />
        )}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex justify-between items-center mb-0.5'>
          <span className='font-bold text-sm text-foreground truncate'>
            {chat.tutor_nombre}
          </span>
          <span className='text-[10px] text-muted-foreground'>{chat.fecha_hora}</span>
        </div>
        <div className='mb-1'>
          <span className='text-[10px] text-primary/80 font-medium px-1.5 py-0.5 bg-primary/10 rounded-md'>
            {chat.alumnos.map((a) => a.nombre).join(', ')}
          </span>
        </div>
        <div className='flex items-center gap-1.5'>
          {chat.canal === 'whatsapp' && (
            <MessageSquare className='h-3 w-3 text-green-500' />
          )}
          {chat.canal === 'email' && <Mail className='h-3 w-3 text-blue-500' />}
          <p className='text-xs text-muted-foreground truncate'>
            {chat.ultimo_mensaje}
          </p>
        </div>
      </div>

      {chat.no_leidos > 0 && (
        <div className='bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center animate-in zoom-in shrink-0'>
          {chat.no_leidos}
        </div>
      )}
    </div>
  )
})

ChatListItem.displayName = 'ChatListItem'
