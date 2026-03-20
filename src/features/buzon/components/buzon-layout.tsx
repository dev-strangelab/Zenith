import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Search,
  Zap,
  MessageSquare,
  Mail,
  Users,
  Settings,
  Send,
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

// Hooks y Componentes
import { useBuzon } from '../hooks/use-buzon'
import { ChatList } from './chat-list'
import { ChatMessageArea } from './chat-message-area'
import { ChatInput } from './chat-input'
import { ChatProfileSidebar } from './chat-profile-sidebar'
import { BuzonSkeleton } from './buzon-skeleton'

export function BuzonLayout() {
  const {
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
  } = useBuzon()

  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleSendMessage = (msg: string) => {
    sendMessage(msg)
  }

  if (isLoading) {
    return <BuzonSkeleton />
  }

  return (
    <div className='flex flex-1 min-h-0 w-full overflow-hidden bg-background border rounded-xl relative'>
      {/* --- COLUMNA 1: LISTA DE CHATS --- */}
      <div className='w-full max-w-[380px] border-r flex flex-col bg-background'>
        <div className='h-[60px] px-4 bg-muted/30 border-b flex items-center justify-between shrink-0'>
          <h2 className='font-bold text-lg tracking-tight text-foreground'>
            Buzón
          </h2>
          <div className='flex items-center gap-1'>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <MessageSquare className='h-5 w-5 opacity-60' />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon' className='h-9 w-9'>
                  <MoreVertical className='h-5 w-5 opacity-60' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Configurar Envíos</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='p-3 border-b bg-background flex flex-col gap-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Buscar o empezar un nuevo chat'
              className='w-full bg-muted/50 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring outline-none transition-all'
            />
          </div>

          <div className='flex items-center gap-2'>
            <Dialog>
              <DialogTrigger asChild>
                <Button className='w-full text-xs h-8 bg-primary/10 text-primary hover:bg-primary/20'>
                  <MessageSquare className='mr-2 h-4 w-4' /> Nuevo Mensaje Oficial
                </Button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <Mail className='h-5 w-5 text-primary' />
                    Enviar Correo Electrónico
                  </DialogTitle>
                  <DialogDescription>
                    Este mensaje se enviará a la casilla de email de la familia.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='family' className='text-sm font-medium'>
                      Destinatario (Email):
                    </label>
                    <div className='relative'>
                      <Users className='absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
                      <input
                        id='family'
                        className='w-full border rounded-md py-2 pl-9 pr-4 text-sm bg-muted/50'
                        placeholder='Buscar familia...'
                      />
                    </div>
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='subject' className='text-sm font-medium'>
                      Asunto:
                    </label>
                    <input
                      id='subject'
                      className='border rounded-md px-3 py-2 text-sm bg-muted/50'
                    />
                  </div>
                  <div className='flex flex-col gap-2'>
                    <label htmlFor='body' className='text-sm font-medium'>
                      Mensaje:
                    </label>
                    <Textarea id='body' className='resize-none h-32 bg-muted/50' />
                  </div>
                </div>
                <DialogFooter className='flex gap-2 justify-between w-full'>
                  <Button variant='ghost' size='sm'>
                    <Paperclip className='h-4 w-4 mr-2' /> Adjuntar PDF
                  </Button>
                  <div className='flex gap-2'>
                    <Button variant='outline'>Cancelar</Button>
                    <Button className='bg-blue-600'><Send className='h-4 w-4 mr-2' /> Enviar</Button>
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className='flex items-center gap-2 mt-2'>
            <Button
              variant={filter === 'all' ? 'secondary' : 'ghost'}
              size='sm'
              className={cn(
                'text-xs h-7 px-3 rounded-full',
                filter === 'all' && 'bg-muted font-medium'
              )}
              onClick={() => setFilter('all')}
            >
              Todos
            </Button>
            <Button
              variant={filter === 'unread' ? 'secondary' : 'ghost'}
              size='sm'
              className={cn(
                'text-xs h-7 px-3 rounded-full',
                filter === 'unread' &&
                  'bg-primary/10 text-primary font-medium'
              )}
              onClick={() => setFilter('unread')}
            >
              No leídos
            </Button>
            <Button
              variant={filter === 'urgent' ? 'destructive' : 'ghost'}
              size='sm'
              className={cn(
                'text-xs h-7 px-3 rounded-full',
                filter === 'urgent'
                  ? 'bg-destructive/10 text-destructive font-medium hover:bg-destructive/20'
                  : 'hover:text-destructive hover:bg-destructive/5'
              )}
              onClick={() => setFilter('urgent')}
            >
              Urgentes
            </Button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto'>
          <ChatList
            chats={chats}
            selectedChatId={selectedChat?.id}
            onSelectChat={selectChat}
          />
        </div>
      </div>

      {/* --- COLUMNA 2: ÁREA DE CHAT --- */}
      <div className='flex-1 flex flex-col min-w-0 bg-muted/10 relative'>
        {selectedChat ? (
          <>
            <div className='h-[60px] px-5 bg-background border-b flex items-center justify-between shadow-sm z-10 shrink-0'>
              <div
                className='flex flex-col cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors'
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className='flex items-center gap-2'>
                  <h3 className='font-bold text-md text-foreground leading-tight'>
                    {selectedChat.tutor_nombre}
                  </h3>
                  <Badge variant='secondary' className='text-[9px] px-1 py-0 h-4'>
                    {selectedChat.tutor_rol}
                  </Badge>
                </div>
                <p className='text-[10px] text-primary/80 font-medium'>
                  {selectedChat.is_online ? 'En línea' : 'Desconectado'}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Button variant='ghost' size='icon' className='h-10 w-10'>
                  <Phone className='h-5 w-5 opacity-70' />
                </Button>
                <Button variant='ghost' size='icon' className='h-10 w-10'>
                  <Video className='h-5 w-5 opacity-70' />
                </Button>
                <Separator orientation='vertical' className='h-6 mx-1' />
                <Button variant='ghost' size='icon' className='h-10 w-10'>
                  <Search className='h-5 w-5 opacity-70' />
                </Button>
                <Button variant='ghost' size='icon' className='h-10 w-10'>
                  <MoreVertical className='h-5 w-5 opacity-70' />
                </Button>
              </div>
            </div>

            <ChatMessageArea 
              messages={messages} 
              tutorName={selectedChat.tutor_nombre}
            />

            <ChatInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className='flex-1 flex flex-col items-center justify-center bg-slate-50/50 p-20 text-center'>
            <div className='w-40 h-40 bg-slate-100 rounded-full flex items-center justify-center mb-6'>
              <MessageSquare className='h-20 w-20 text-slate-300' />
            </div>
            <h1 className='text-3xl font-light text-slate-400 mb-2'>Iter-softco Chat</h1>
            <p className='text-sm text-slate-400 max-w-md italic'>
              Envía y recibe mensajes de las familias de forma centralizada.
            </p>
            <div className='mt-10 flex items-center gap-2 text-xs text-slate-300 uppercase tracking-widest'>
              <Zap className='h-3 w-3' /> Cifrado de punto a punto
            </div>
          </div>
        )}
      </div>

      {/* --- COLUMNA 3: PERFIL --- */}
      {selectedChat && (
        <ChatProfileSidebar
          chat={selectedChat}
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  )
}

