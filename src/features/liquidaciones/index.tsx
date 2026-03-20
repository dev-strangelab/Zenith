import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Wand2 } from 'lucide-react'
import { LiquidacionesTable } from './components/liquidaciones-table'

import { useState, useEffect } from 'react'
import { ReportSkeleton } from '@/components/report-skeleton'
import { useOrganization } from '@/hooks/use-organization'
import { MOCK_DASHBOARD_DATA } from '@/features/dashboard/data/mocks'
import { formatCurrency } from '@/lib/utils/finance'

export function LiquidacionesFeature() {
  const [isLoading, setIsLoading] = useState(true)
  const { activeSedeId } = useOrganization()
  
  const dashboardData = activeSedeId ? MOCK_DASHBOARD_DATA[activeSedeId] : null
  const facturado = dashboardData?.stats.facturacion_mensual || 0

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

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
            <h2 className='text-3xl font-bold tracking-tight'>Facturación y Cobros</h2>
            <p className='text-muted-foreground mt-1'>
              Cruza asistencias automáticamente para generar la facturación a cada Obra Social.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105">
              <Wand2 className='mr-2 h-4 w-4' /> Computar Lote de Facturación
            </Button>
          </div>
        </div>

        {isLoading ? (
          <ReportSkeleton />
        ) : (
          <div className="animate-in fade-in duration-500">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Facturado este mes</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(facturado)}</div>
                <p className="text-xs text-muted-foreground">+20.1% que el mes anterior</p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Pendiente de Cobro</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-amber-600"><rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path></svg>
                </div>
                <div className="text-2xl font-bold text-amber-600">$ 840.000</div>
                <p className="text-xs text-muted-foreground">2 Obras sociales adeudadas</p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Prestaciones Brindadas</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                </div>
                <div className="text-2xl font-bold">105</div>
                <p className="text-xs text-muted-foreground">Sesiones computadas y validadas</p>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">Autorizaciones por Vencer</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-red-600"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div className="text-2xl font-bold text-red-600">3</div>
                <p className="text-xs text-muted-foreground">Renovar con los pacientes</p>
              </div>
            </div>

            <div className='flex-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
              <LiquidacionesTable />
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
