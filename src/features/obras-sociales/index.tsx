import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ObrasSocialesList } from './components/obras-sociales-list'

export function ObrasSocialesFeature() {
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
            <h2 className='text-2xl font-bold tracking-tight'>Obras Sociales</h2>
            <p className='text-muted-foreground'>
              Configura los valores de prestaciones, montos de sesión y reglas de facturación de cada Obra Social.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> Nueva Obra Social
            </Button>
          </div>
        </div>
        <div className='flex-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <ObrasSocialesList />
        </div>
      </Main>
    </>
  )
}
