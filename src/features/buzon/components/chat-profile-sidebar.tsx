import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { X, Users, FileText, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Chat } from '../data/mocks'

interface ChatProfileSidebarProps {
  chat: Chat
  isOpen: boolean
  onClose: () => void
}

export function ChatProfileSidebar({ chat, isOpen, onClose }: ChatProfileSidebarProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[320px] bg-background border-l h-full absolute right-0 top-0 transition-transform duration-300 ease-in-out z-20 shadow-[-10px_0_20px_rgba(0,0,0,0.02)]',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
    >
      <div className='flex flex-col h-full'>
        <div className='h-[60px] px-5 bg-muted/30 border-b flex items-center gap-4 shrink-0'>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-muted-foreground hover:text-foreground'
            onClick={onClose}
          >
            <X className='h-5 w-5' />
          </Button>
          <span className='font-bold text-foreground uppercase tracking-wider text-xs'>
            Perfil del Tutor
          </span>
        </div>

        <div className='flex-1 overflow-y-auto w-full'>
          <div className='p-6 flex flex-col w-full'>
            <div className='flex items-center gap-4 mb-6'>
              <Avatar className='h-16 w-16 border shadow-sm'>
                <AvatarImage src={chat.avatar_url} />
                <AvatarFallback className='text-lg'>
                  {chat.tutor_nombre.substring(0, 2)}
                </AvatarFallback>
              </Avatar>

              <div className='flex flex-col items-start'>
                <h2 className='text-xl font-bold text-foreground tracking-tight leading-none mb-1.5'>
                  {chat.tutor_nombre}
                </h2>
                <Badge variant='outline' className='font-normal'>
                  {chat.tutor_rol}
                </Badge>
              </div>
            </div>

            <div className='w-full space-y-6 text-left'>
              <div>
                <h4 className='text-[10px] font-bold text-muted-foreground uppercase mb-3 tracking-widest flex items-center gap-2'>
                  <Users className='h-3 w-3' /> Pacientes Vinculados
                </h4>

                <div className='space-y-3'>
                  {chat.alumnos.map((alumno) => (
                    <div
                      key={alumno.id}
                      className='flex flex-col bg-muted/20 border border-border/50 p-3 rounded-lg relative overflow-hidden'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <span className='text-sm font-semibold text-foreground tracking-tight block'>
                            {alumno.nombre} {alumno.apellido}
                          </span>
                        </div>
                        <Button variant='ghost' size='icon' className='h-6 w-6 rounded-full'>
                          <FileText className='h-3 w-3' />
                        </Button>
                      </div>

                      <div className='grid grid-cols-2 gap-2 mt-1'>
                        <div className='flex flex-col gap-1'>
                          <span className='text-[9px] text-muted-foreground uppercase'>
                            CUD
                          </span>
                          <Badge
                            variant='outline'
                            className='text-[9px] w-fit px-1.5 py-0 h-4 border-none bg-green-500/10 text-green-600'
                          >
                            VIGENTE
                          </Badge>
                        </div>
                        <div className='flex flex-col gap-1'>
                          <span className='text-[9px] text-muted-foreground uppercase'>
                            Autorización
                          </span>
                          <Badge
                            variant='outline'
                            className='text-[9px] w-fit px-1.5 py-0 h-4 border-none bg-blue-500/10 text-blue-600'
                          >
                            AUTORIZADO
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className='grid grid-cols-2 gap-2'>
                <Button variant='outline' className='text-[10px] h-10 flex items-center justify-center gap-2'>
                  <Phone className='h-3 w-3' /> Llamar
                </Button>
                <Button variant='outline' className='text-[10px] h-10 flex items-center justify-center gap-2'>
                  <Mail className='h-3 w-3' /> Email
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
