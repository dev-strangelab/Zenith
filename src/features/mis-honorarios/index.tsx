import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { MisHonorariosTable } from './components/mis-honorarios-table'
import { Button } from '@/components/ui/button'
import { Download, WalletCards } from 'lucide-react'

import { useState, useEffect, useMemo } from 'react'
import { ReportSkeleton } from '@/components/report-skeleton'
import { useOrganization } from '@/hooks/use-organization'
import { formatCurrency } from '@/lib/utils/finance'

export function MisHonorariosFeature() {
  const [isLoading, setIsLoading] = useState(true)
  const { activeSedeId } = useOrganization()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [activeSedeId])

  // Lógica de totales reactiva a la sede (Simulada para visualización)
  const stats = useMemo(() => {
    if (activeSedeId === '1') {
      return { estimado: 450000, pendiente: 410000, historico: 3120000 }
    }
    return { estimado: 0, pendiente: 380000, historico: 850000 }
  }, [activeSedeId])

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
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>Mis Honorarios</h2>
            <p className='text-muted-foreground mt-1'>
              Portal de autogestión. Visualiza tus liquidaciones, sube tus facturas y da seguimiento a tus pagos.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant="outline" className="text-muted-foreground">
              <Download className='mr-2 h-4 w-4' /> Descargar Reporte Anual
            </Button>
          </div>
        </div>

        {isLoading ? (
          <ReportSkeleton />
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full -z-10 transition-transform hover:scale-110"></div>
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">A Liquidar Este Mes (Estimado)</h3>
                  <WalletCards className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary">{formatCurrency(stats.estimado)}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Basado en sesiones firmadas en esta sede
                </p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Pendiente de Pago</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-amber-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div className="text-3xl font-bold text-amber-600">{formatCurrency(stats.pendiente)}</div>
                <p className="text-xs text-muted-foreground mt-1">Facturas subidas, en proceso de tesorería</p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Histórico en esta Sede</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-emerald-500"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div className="text-3xl font-bold text-emerald-600">{formatCurrency(stats.historico)}</div>
                <p className="text-xs text-muted-foreground mt-1">Total abonado acumulado</p>
              </div>
            </div>

            <div className='flex-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <MisHonorariosTable />
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
