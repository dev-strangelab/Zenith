import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Smile, Paperclip, Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
}

export function ChatInput({ onSend }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSend = () => {
    if (message.trim()) {
      onSend(message)
      setMessage('')
    }
  }

  return (
    <div className='p-3 bg-background border-t flex items-end gap-2 px-4 z-10'>
      <div className='flex items-center gap-1 pb-1 text-muted-foreground'>
        <Button variant='ghost' size='icon' className='h-10 w-10 shrink-0'>
          <Smile className='h-5 w-5' />
        </Button>
        <Button variant='ghost' size='icon' className='h-10 w-10 shrink-0'>
          <Paperclip className='h-5 w-5 rotate-45' />
        </Button>
      </div>

      <div className='flex-1'>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='Escribe un mensaje aquí...'
          className='min-h-[44px] max-h-[120px] bg-muted/50 border-none rounded-xl py-3 px-4 resize-none'
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSend()
            }
          }}
        />
      </div>

      <div className='pb-1 pl-1 shrink-0'>
        <Button
          size='icon'
          className='h-11 w-11 rounded-full shrink-0 group'
          onClick={handleSend}
        >
          <Send className='h-5 w-5 ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1' />
        </Button>
      </div>
    </div>
  )
}
