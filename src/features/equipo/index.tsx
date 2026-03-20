import { useState } from 'react'
import { Plus, Mail, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { EquipoTable } from './components/equipo-table'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { AppRole } from '@/types/database'

interface Invitacion {
  id: string
  email: string
  nombre: string
  rol: AppRole
  fecha: string
}

const ROL_LABELS: Partial<Record<AppRole, string>> = {
  profesional:    'Profesional',
  coordinador:    'Coordinador',
  director_sede:  'Director de Sede',
  administrativo: 'Administrativo',
}

export function EquipoFeature() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])

  const [email, setEmail]   = useState('')
  const [nombre, setNombre] = useState('')
  const [rol, setRol]       = useState<AppRole>('profesional')

  const handleEnviarInvitacion = () => {
    if (!email || !nombre) {
      toast.error('Completá el nombre y el email antes de enviar.')
      return
    }
    const nueva: Invitacion = {
      id: `inv-${Date.now()}`,
      email,
      nombre,
      rol,
      fecha: new Date().toLocaleDateString('es-AR'),
    }
    setInvitaciones(prev => [nueva, ...prev])
    toast.success(`Invitación enviada a ${email}`, {
      description: `${nombre} recibirá un link para acceder al sistema con rol "${ROL_LABELS[rol]}".`,
    })
    setEmail('')
    setNombre('')
    setRol('profesional')
    setDialogOpen(false)
  }

  const handleRevocar = (id: string) => {
    setInvitaciones(prev => prev.filter(i => i.id !== id))
    toast.info('Invitación revocada.')
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Equipo Profesional</h2>
            <p className='text-muted-foreground'>
              Gestiona los profesionales, sus roles y accesos a esta sede.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className='mr-2 h-4 w-4' /> Invitar Profesional
            </Button>
          </div>
        </div>

        {/* Invitaciones pendientes */}
        {invitaciones.length > 0 && (
          <div className='mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <Clock className='h-4 w-4 text-amber-600' />
              <h3 className='text-sm font-semibold text-amber-800'>
                Invitaciones pendientes de aceptación ({invitaciones.length})
              </h3>
            </div>
            <div className='space-y-2'>
              {invitaciones.map(inv => (
                <div key={inv.id} className='flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-amber-100'>
                  <div className='flex items-center gap-3'>
                    <Mail className='h-4 w-4 text-amber-500 shrink-0' />
                    <div>
                      <p className='text-sm font-medium'>{inv.nombre}</p>
                      <p className='text-xs text-muted-foreground'>{inv.email} · Enviada el {inv.fecha}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Badge variant='outline' className='text-xs border-amber-200 text-amber-700 bg-amber-50'>
                      {ROL_LABELS[inv.rol] ?? inv.rol}
                    </Badge>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6 text-muted-foreground hover:text-destructive'
                      onClick={() => handleRevocar(inv.id)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='flex-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <EquipoTable />
        </div>
      </Main>

      {/* Dialog de invitación */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className='sm:max-w-[460px]'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <Mail className='h-5 w-5 text-primary' />
              Invitar Profesional
            </DialogTitle>
            <DialogDescription>
              Se enviará un email con un link de acceso al sistema. El profesional deberá aceptar la invitación para activar su cuenta.
            </DialogDescription>
          </DialogHeader>

          <div className='grid gap-4 py-2'>
            <div className='grid gap-1.5'>
              <Label htmlFor='inv-nombre'>Nombre completo</Label>
              <Input
                id='inv-nombre'
                placeholder='Ej: Lic. María García'
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>
            <div className='grid gap-1.5'>
              <Label htmlFor='inv-email'>Email institucional</Label>
              <Input
                id='inv-email'
                type='email'
                placeholder='profesional@institución.com'
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-1.5'>
              <Label>Rol asignado</Label>
              <Select value={rol} onValueChange={v => setRol(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ROL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className='gap-2'>
            <Button variant='outline' onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleEnviarInvitacion}>
              <Mail className='mr-2 h-4 w-4' /> Enviar Invitación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
