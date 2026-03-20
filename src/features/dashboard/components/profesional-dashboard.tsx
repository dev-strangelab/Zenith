import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CalendarCheck, MessageSquare, Clock } from 'lucide-react'
import { useOrganization } from '@/hooks/use-organization'
import { MOCK_ALUMNOS } from '@/features/alumnos/data/mocks'
import { MOCK_CHATS } from '@/features/buzon/data/mocks'
import { computeTurnosHoy } from '../services/dashboard-service'
import { UpcomingExpirations } from './upcoming-expirations'

const ESTADO_CONFIG = {
  programado:        { label: 'Programado',       classes: 'bg-muted text-muted-foreground' },
  presente:          { label: 'Presente',          classes: 'bg-green-100 text-green-800' },
  ausente_con_aviso: { label: 'Ausente c/ Aviso',  classes: 'bg-amber-100 text-amber-800' },
  ausente_sin_aviso: { label: 'Ausente s/ Aviso',  classes: 'bg-red-100 text-red-800' },
  cancelado:         { label: 'Cancelado',          classes: 'bg-gray-100 text-gray-500 line-through' },
} as const

export function ProfesionalDashboard() {
  const { activeSedeId, user } = useOrganization()

  const profesionalId = user?.accountNo ?? undefined

  const misAlumnos = useMemo(() => {
    if (!activeSedeId) return []
    return MOCK_ALUMNOS.filter(
      a => a.sede_id === activeSedeId &&
           a.estado !== 'eliminado' &&
           a.estado !== 'finalizado' &&
           (profesionalId ? a.profesionales_asignados?.includes(profesionalId) : true)
    )
  }, [activeSedeId, profesionalId])

  const turnosHoy = useMemo(
    () => computeTurnosHoy(activeSedeId ?? '', profesionalId),
    [activeSedeId, profesionalId]
  )

  const mensajesNoLeidos = useMemo(() => {
    return MOCK_CHATS.filter(c => c.sede_id === activeSedeId && c.no_leidos > 0).length
  }, [activeSedeId])

  return (
    <div className='space-y-6 animate-in fade-in zoom-in-95 duration-500'>
      {/* KPIs simplificados */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Mis Alumnos</CardTitle>
            <div className='p-2 bg-primary/10 rounded-lg'><Users className='h-4 w-4 text-primary' /></div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold tracking-tight'>{misAlumnos.length}</div>
            <p className='text-xs text-muted-foreground mt-1'>Asignados en esta sede</p>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Turnos Hoy</CardTitle>
            <div className='p-2 bg-emerald-500/10 rounded-lg'><CalendarCheck className='h-4 w-4 text-emerald-600' /></div>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold tracking-tight'>{turnosHoy.length}</div>
            <p className='text-xs text-muted-foreground mt-1'>
              {turnosHoy.filter(t => t.estado === 'presente').length} presentes confirmados
            </p>
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Buzón</CardTitle>
            <div className={`p-2 rounded-lg ${mensajesNoLeidos > 0 ? 'bg-destructive/10' : 'bg-muted/30'}`}>
              <MessageSquare className={`h-4 w-4 ${mensajesNoLeidos > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold tracking-tight ${mensajesNoLeidos > 0 ? 'text-destructive' : ''}`}>
              {mensajesNoLeidos}
            </div>
            <p className='text-xs text-muted-foreground mt-1'>
              {mensajesNoLeidos === 0 ? 'Sin mensajes pendientes' : 'Sin leer de familias'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agenda de hoy + Vencimientos */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
        {/* Agenda del día */}
        <Card className='lg:col-span-4 shadow-sm border-none bg-background/60 backdrop-blur-md'>
          <CardHeader>
            <CardTitle className='text-lg font-bold flex items-center gap-2'>
              <Clock className='h-5 w-5 text-primary' />
              Mi Agenda de Hoy
            </CardTitle>
          </CardHeader>
          <CardContent>
            {turnosHoy.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-8 text-muted-foreground text-center'>
                <CalendarCheck className='h-8 w-8 mb-2 opacity-30' />
                <p className='text-sm font-medium'>Sin turnos programados para hoy</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {turnosHoy.map(turno => {
                  const cfg = ESTADO_CONFIG[turno.estado as keyof typeof ESTADO_CONFIG] ?? { label: turno.estado, classes: '' }
                  return (
                    <div key={turno.id} className='flex items-center justify-between rounded-lg border p-3 hover:bg-muted/10 transition-colors'>
                      <div className='flex items-center gap-3'>
                        <div className='text-center w-16 shrink-0'>
                          <p className='text-sm font-bold text-primary'>{turno.hora_inicio}</p>
                          <p className='text-xs text-muted-foreground'>{turno.hora_fin}</p>
                        </div>
                        <div>
                          <p className='text-sm font-semibold'>{turno.alumno_nombre}</p>
                          <p className='text-xs text-muted-foreground'>{turno.notas || 'Sin notas'}</p>
                        </div>
                      </div>
                      <Badge variant='outline' className={cfg.classes}>{cfg.label}</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Vencimientos CUD */}
        <div className='lg:col-span-3'>
          <UpcomingExpirations />
        </div>
      </div>
    </div>
  )
}
