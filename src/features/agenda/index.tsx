import * as React from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { TurnosDiarios } from './components/turnos-diarios'
import { es } from 'date-fns/locale'

import { AgendaSkeleton } from './components/agenda-skeleton'

export function AgendaFeature() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300)
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
        <div className='mb-4 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Agenda y Turnos</h2>
            <p className='text-muted-foreground'>
              Visualiza y gestiona las citas y asistencias de la sede activa.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Nuevo Turno
            </Button>
          </div>
        </div>

        {isLoading ? (
          <AgendaSkeleton />
        ) : (
          <div className='grid gap-4 md:grid-cols-[auto_1fr] animate-in fade-in duration-500'>
            <div className="rounded-md border p-2 bg-card">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                locale={es}
              />
            </div>
            <div>
              <TurnosDiarios date={date} />
            </div>
          </div>
        )}
      </Main>
    </>
  )
}
