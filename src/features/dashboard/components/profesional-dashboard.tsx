import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, CalendarCheck, MessageSquare, Clock, Loader2 } from 'lucide-react'
import { useOrganization } from '@/hooks/use-organization'
import { AlumnoService } from '@/features/alumnos/services/alumno-service'
import { BuzonService } from '@/features/buzon/services/buzon-service'
import { computeTurnosHoy } from '../services/dashboard-service'
import { ASISTENCIA_ESTADO_CONFIG } from '@/lib/constants/estado-configs'
import type { AsistenciaEstado } from '@/types/database'
import { UpcomingExpirations } from './upcoming-expirations'

export function ProfesionalDashboard() {
  const { activeSedeId, user } = useOrganization()

  const profesionalId = user?.accountNo ?? undefined
  const sedeId = activeSedeId ?? ''

  // Mis alumnos asignados
  const alumnosQuery = useQuery({
    queryKey: ['profesional-alumnos', sedeId, profesionalId],
    queryFn: () => AlumnoService.getAlumnosByProfesional(sedeId, profesionalId ?? ''),
    staleTime: 5 * 60 * 1000,
    enabled: !!sedeId && !!profesionalId,
  })

  // Turnos del día
  const turnosQuery = useQuery({
    queryKey: ['profesional-turnos-hoy', sedeId, profesionalId],
    queryFn: () => computeTurnosHoy(sedeId, profesionalId),
    staleTime: 2 * 60 * 1000, // 2 min - turnos cambian más frecuentemente
    enabled: !!sedeId,
  })

  // Mensajes no leídos
  const mensajesQuery = useQuery({
    queryKey: ['profesional-mensajes', sedeId],
    queryFn: () => BuzonService.getMensajesNoLeidos(sedeId),
    staleTime: 1 * 60 * 1000, // 1 min - mensajes son más dinámicos
    enabled: !!sedeId,
  })

  const misAlumnos = alumnosQuery.data ?? []
  const turnosHoy = turnosQuery.data ?? []
  const mensajesNoLeidos = mensajesQuery.data ?? 0
  const isLoading = alumnosQuery.isLoading || turnosQuery.isLoading || mensajesQuery.isLoading

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
            {isLoading ? (
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            ) : (
              <>
                <div className='text-3xl font-bold tracking-tight'>{misAlumnos.length}</div>
                <p className='text-xs text-muted-foreground mt-1'>Asignados en esta sede</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Turnos Hoy</CardTitle>
            <div className='p-2 bg-emerald-500/10 rounded-lg'><CalendarCheck className='h-4 w-4 text-emerald-600' /></div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            ) : (
              <>
                <div className='text-3xl font-bold tracking-tight'>{turnosHoy.length}</div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {turnosHoy.filter(t => t.estado === 'presente').length} presentes confirmados
                </p>
              </>
            )}
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
            {isLoading ? (
              <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
            ) : (
              <>
                <div className={`text-3xl font-bold tracking-tight ${mensajesNoLeidos > 0 ? 'text-destructive' : ''}`}>
                  {mensajesNoLeidos}
                </div>
                <p className='text-xs text-muted-foreground mt-1'>
                  {mensajesNoLeidos === 0 ? 'Sin mensajes pendientes' : 'Sin leer de familias'}
                </p>
              </>
            )}
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
            {turnosQuery.isLoading ? (
              <div className='flex flex-col items-center justify-center py-8 text-muted-foreground text-center'>
                <Loader2 className='h-8 w-8 mb-2 animate-spin opacity-60' />
                <p className='text-sm font-medium'>Cargando agenda...</p>
              </div>
            ) : turnosHoy.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-8 text-muted-foreground text-center'>
                <CalendarCheck className='h-8 w-8 mb-2 opacity-30' />
                <p className='text-sm font-medium'>Sin turnos programados para hoy</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {turnosHoy.map(turno => {
                  const cfg = ASISTENCIA_ESTADO_CONFIG[turno.estado as AsistenciaEstado] ?? { label: turno.estado, classes: '' }
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
