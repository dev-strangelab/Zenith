import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { DownloadCloud } from 'lucide-react'
import { toast } from 'sonner'

// Servicios y datos
import { computeStats, computeSessions, computeFinancial } from './services/dashboard-service'
import { MOCK_LIQUIDACIONES } from '@/features/liquidaciones/data/mocks'
import { MOCK_ALUMNOS } from '@/features/alumnos/data/mocks'

// Componentes
import { StatsCards } from './components/stats-cards'
import { FinancialChart } from './components/financial-chart'
import { SessionStatusChart } from './components/session-status-chart'
import { UpcomingExpirations } from './components/upcoming-expirations'
import { ProfesionalDashboard } from './components/profesional-dashboard'
import { DashboardSkeleton } from './components/dashboard-skeleton'

// Hooks y Contexto
import { useOrganization } from '@/hooks/use-organization'
import { usePermissions } from '@/hooks/use-permissions'
import { sidebarData } from '@/components/layout/data/sidebar-data'

// ─── Helpers ────────────────────────────────────────────────────────────────

function descargarReporteCSV(sedeId: string, sedeNombre: string) {
  const alumnos = MOCK_ALUMNOS.filter(a => a.sede_id === sedeId && a.estado !== 'eliminado')
  const liquidaciones = MOCK_LIQUIDACIONES.filter(l => l.sede_id === sedeId)

  const filas: string[] = [
    '=== REPORTE DE GESTIÓN — ' + sedeNombre + ' ===',
    'Fecha de generación: ' + new Date().toLocaleDateString('es-AR'),
    '',
    'ALUMNOS',
    'ID,Nombre,Apellido,DNI,Obra Social,Estado,CUD Vencimiento',
    ...alumnos.map(a =>
      [a.id, a.nombre, a.apellido, a.dni, a.obra_social_nombre ?? '', a.estado, a.cud_vencimiento ?? ''].join(',')
    ),
    '',
    'LIQUIDACIONES',
    'ID,Período,Obra Social,Monto Total,Estado',
    ...liquidaciones.map(l =>
      [l.id, l.periodo ?? '', l.obra_social_id ?? '', l.monto_total ?? 0, l.estado ?? ''].join(',')
    ),
  ]

  const blob = new Blob([filas.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `reporte_${sedeNombre.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── Componente principal ────────────────────────────────────────────────────

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingSede, setIsChangingSede] = useState(false)
  const { activeSedeId } = useOrganization()
  const { isProfesional } = usePermissions()

  const activeSede = sidebarData.sedes.find(s => s.id === activeSedeId) || sidebarData.sedes[0]
  const sedeId = activeSede.id

  // Carga inicial
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  // Cambio de sede
  useEffect(() => {
    if (!isLoading) {
      setIsChangingSede(true)
      const timer = setTimeout(() => setIsChangingSede(false), 400)
      return () => clearTimeout(timer)
    }
  }, [activeSedeId, isLoading])

  // Datos computados desde mocks reales
  const stats    = useMemo(() => computeStats(sedeId),    [sedeId])
  const sessions = useMemo(() => computeSessions(sedeId), [sedeId])
  const financial = useMemo(() => computeFinancial(sedeId), [sedeId])

  if (isLoading || isChangingSede) {
    return (
      <>
        <Header>
          <Search />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main className='bg-muted/10'>
          <div className='mb-6'>
            <div className='h-8 w-64 bg-muted animate-pulse rounded-md mb-2' />
            <div className='h-4 w-48 bg-muted animate-pulse rounded-md' />
          </div>
          <DashboardSkeleton />
        </Main>
      </>
    )
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='bg-muted/10'>
        <div className='mb-6 flex items-center justify-between'>
          <div className='animate-in slide-in-from-left-4 duration-500'>
            <h1 className='text-3xl font-bold tracking-tight'>
              {isProfesional ? 'Mi Panel' : `Panel de Gestión: ${activeSede.nombre}`}
            </h1>
            <p className='text-muted-foreground text-sm font-medium'>
              {isProfesional
                ? `Tu actividad en ${activeSede.nombre} — ${activeSede.direccion}`
                : `Operaciones activas en ${activeSede.direccion}${activeSede.ciudad ? `, ${activeSede.ciudad}` : ''}`}
            </p>
          </div>
          {!isProfesional && (
            <Button
              className='shadow-lg shadow-primary/20 hover:scale-105 transition-transform'
              onClick={() => {
                descargarReporteCSV(sedeId, activeSede.nombre)
                toast.success('Reporte generado', {
                  description: `CSV descargado para ${activeSede.nombre}.`,
                })
              }}
            >
              <DownloadCloud className='mr-2 h-4 w-4' /> Descargar Reporte
            </Button>
          )}
        </div>

        {/* Vista según rol */}
        {isProfesional ? (
          <ProfesionalDashboard />
        ) : (
          <div className='space-y-6 animate-in fade-in zoom-in-95 duration-500'>
            {/* Tarjetas KPI */}
            <StatsCards stats={stats} />

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
              <FinancialChart data={financial} />
              <SessionStatusChart data={sessions} />
            </div>

            <div className='grid grid-cols-1 gap-6 lg:grid-cols-7'>
              {/* Próximos Vencimientos CUD */}
              <div className='lg:col-span-4'>
                <UpcomingExpirations />
              </div>

              {/* Resumen de auditoría */}
              <div className='lg:col-span-3 bg-primary/5 rounded-xl border border-primary/10 p-6 flex flex-col justify-center'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='h-2 w-2 rounded-full bg-primary animate-pulse' />
                  <h4 className='font-bold text-primary'>Resumen de Auditoría: {activeSede.nombre}</h4>
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed mb-3'>
                  Los datos mostrados corresponden exclusivamente a la gestión de <strong>{activeSede.direccion}</strong>.
                  Los indicadores de asistencia reflejan el cumplimiento del plan terapéutico semanal.
                </p>
                <div className='grid grid-cols-2 gap-3 mt-2'>
                  <div className='bg-background rounded-lg p-3 border'>
                    <p className='text-xs text-muted-foreground'>Alumnos activos</p>
                    <p className='text-xl font-bold text-primary'>{stats.total_alumnos}</p>
                  </div>
                  <div className='bg-background rounded-lg p-3 border'>
                    <p className='text-xs text-muted-foreground'>Asistencia</p>
                    <p className='text-xl font-bold text-emerald-600'>{stats.asistencia_porcentaje}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
