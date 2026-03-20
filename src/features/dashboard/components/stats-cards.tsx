import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, MessageSquare, DollarSign, Activity } from 'lucide-react'
import type { DashboardStats } from '../data/mocks'
import { formatCurrency } from '@/lib/utils/finance'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
      <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Total Alumnos
          </CardTitle>
          <div className='p-2 bg-primary/10 rounded-lg'>
            <Users className='h-4 w-4 text-primary' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold tracking-tight'>{stats.total_alumnos.toLocaleString()}</div>
          <p className='text-xs text-green-600 mt-1 font-medium'>
            {stats.nuevos_mes != null
              ? stats.nuevos_mes > 0
                ? `+${stats.nuevos_mes} incorporación${stats.nuevos_mes !== 1 ? 'es' : ''} este mes`
                : 'Sin nuevas incorporaciones este mes'
              : 'Activos en esta sede'}
          </p>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Buzón Crítico
          </CardTitle>
          <div className='p-2 bg-destructive/10 rounded-lg'>
            <MessageSquare className='h-4 w-4 text-destructive' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold tracking-tight text-destructive'>{stats.mensajeria_urgente}</div>
          <p className='text-xs text-muted-foreground mt-1'>
            {stats.mensajeria_urgente === 0
              ? 'Sin mensajes urgentes pendientes'
              : `Mensaje${stats.mensajeria_urgente !== 1 ? 's' : ''} urgente${stats.mensajeria_urgente !== 1 ? 's' : ''} sin responder`}
          </p>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Facturación del Mes
          </CardTitle>
          <div className='p-2 bg-blue-500/10 rounded-lg'>
            <DollarSign className='h-4 w-4 text-blue-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold tracking-tight'>
            {formatCurrency(stats.facturacion_mensual)}
          </div>
          <p className='text-xs text-blue-600 mt-1 font-medium'>
            {stats.mes_actual ?? 'Mes en curso'}
          </p>
        </CardContent>
      </Card>

      <Card className='shadow-sm border-none bg-background/60 backdrop-blur-md'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>
            Asistencia Semanal
          </CardTitle>
          <div className='p-2 bg-emerald-500/10 rounded-lg'>
            <Activity className='h-4 w-4 text-emerald-600' />
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-3xl font-bold tracking-tight'>{stats.asistencia_porcentaje}%</div>
          <div className='mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden'>
            <div
              className='h-full bg-emerald-500 transition-all duration-500'
              style={{ width: `${stats.asistencia_porcentaje}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
