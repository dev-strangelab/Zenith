import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Mail, Calendar } from 'lucide-react'

export function FamiliaresTab() {
  return (
    <div className='grid gap-4 md:grid-cols-2 animate-in fade-in duration-500'>
      <Card className='group hover:shadow-sm transition-all duration-200'>
        <CardHeader>
          <CardTitle className='text-base font-bold'>Contactos Registrados</CardTitle>
          <CardDescription className='text-xs'>
            Padres, tutores y transportistas autorizados.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between p-4 border rounded-xl bg-muted/10 border-muted-foreground/10 group-hover:bg-primary/5 transition-colors'>
            <div>
              <h4 className='font-bold text-sm'>Mariana López (Madre)</h4>
              <p className='text-xs text-muted-foreground mt-1'>
                mariana.lopez@gmail.com
              </p>
              <p className='text-xs text-muted-foreground'>
                +54 9 11 1234-5678
              </p>
            </div>
            <Badge
              variant='outline'
              className='bg-primary/10 text-primary border-none text-[10px] px-2 py-0 h-5'
            >
              Principal
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className='group hover:shadow-sm transition-all duration-200'>
        <CardHeader>
          <CardTitle className='text-base font-bold'>Historial de Comunicaciones</CardTitle>
          <CardDescription className='text-xs'>Emails oficiales enviados y recibidos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex flex-col p-4 border rounded-xl bg-blue-50/20 border-blue-100/50 hover:bg-blue-50/40 transition-colors'>
              <div className='flex justify-between items-start mb-2'>
                <Badge
                  variant='outline'
                  className='bg-blue-100/50 text-blue-700 border-none text-[9px] px-2 h-4 font-bold'
                >
                  Email Enviado
                </Badge>
                <span className='text-[10px] text-muted-foreground font-medium flex items-center gap-1'>
                  <Calendar className='h-3 w-3' /> Hace 2 horas
                </span>
              </div>
              <h4 className='font-bold text-sm text-foreground/90'>
                Renovación de Autorización - Centro Kari
              </h4>
              <p className='text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed'>
                Estimada familia, les escribimos para recordarles que el CUD de
                Juan está próximo a vencer. Por favor, enviar la documentación
                actualizada...
              </p>
              <div className='mt-3 flex items-center justify-between'>
                <span className='text-[10px] text-muted-foreground/70'>
                  Enviado por: Administración
                </span>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <span className='text-[10px] text-[#7C3AED] font-bold cursor-pointer hover:underline'>
                      Leer correo completo
                    </span>
                  </DialogTrigger>
                  <DialogContent className='sm:max-w-2xl'>
                    <DialogHeader>
                      <div className='flex items-center gap-2 mb-2'>
                        <div className='p-2 bg-blue-100 text-blue-600 rounded-full'>
                          <Mail className='h-4 w-4' />
                        </div>
                        <DialogTitle>Detalle del Correo Electrónico</DialogTitle>
                      </div>
                      <DialogDescription className='text-xs'>
                        Enviado el 13 de Marzo de 2026 a las 11:45 AM
                      </DialogDescription>
                    </DialogHeader>
                    <div className='space-y-4 pt-4 border-t'>
                      <div className='grid grid-cols-[80px_1fr] text-sm gap-y-1.5'>
                        <span className='font-bold text-muted-foreground'>De:</span>
                        <span className='font-medium'>Administración Centro Kari (admin@centro-kari.com)</span>
                        <span className='font-bold text-muted-foreground'>Para:</span>
                        <span className='font-medium'>Mariana López (mariana.lopez@gmail.com)</span>
                        <span className='font-bold text-muted-foreground'>Asunto:</span>
                        <span className='font-medium text-[#7C3AED]'>Renovación de Autorización - Centro Kari</span>
                      </div>
                      <Separator />
                      <div className='text-sm text-foreground/80 leading-relaxed space-y-3 bg-muted/20 p-4 rounded-xl'>
                        <p>Estimada Mariana,</p>
                        <p>Le escribimos para informarle que la autorización vigente de la obra social de Juan está por expirar el próximo 30 de abril.</p>
                        <p>Para garantizar la continuidad de las terapias, necesitamos que nos envíe el nuevo CUD actualizado y la orden médica correspondiente lo antes posible.</p>
                        <p>Quedamos a su disposición para cualquier duda.</p>
                        <p className='pt-2'>Atentamente,<br /><span className='font-bold'>Equipo de Administración</span></p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Separator() {
  return <div className='h-[1px] w-full bg-border/40 my-2' />
}
