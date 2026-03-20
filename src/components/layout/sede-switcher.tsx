import { ChevronsUpDown, Building2 } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

interface Sede {
  id: string
  nombre: string
  direccion?: string
  color_identidad?: string
  icon?: React.ElementType
}

interface SedeSwitcherProps {
  sedes: Sede[]
}

export function SedeSwitcher({ sedes }: SedeSwitcherProps) {
  const { isMobile } = useSidebar()
  const { sede: sedeState } = useAuthStore()

  const activeSede =
    sedes.find((s) => s.id === sedeState.activeSedeId) || sedes[0]

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div
                className='flex aspect-square size-8 items-center justify-center rounded-lg'
                style={{
                  backgroundColor: activeSede?.color_identidad ? `${activeSede.color_identidad}20` : 'var(--primary-foreground)',
                  color: activeSede?.color_identidad || 'var(--primary)',
                }}
              >
                {activeSede?.icon ? (
                  <activeSede.icon className='size-6' />
                ) : (
                  <Building2 className='size-6' />
                )}
              </div>
              <div className='grid flex-1 text-start text-sm leading-tight'>
                <span className='truncate font-semibold'>
                  {activeSede?.nombre || 'Seleccionar Sede'}
                </span>
                <span className='truncate text-xs'>
                  {activeSede?.direccion || 'Centro de Rehabilitación'}
                </span>
              </div>
              <ChevronsUpDown className='ms-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>
              Sedes Disponibles
            </DropdownMenuLabel>
            {sedes.map((sede) => (
              <DropdownMenuItem
                key={sede.id}
                onClick={() => sedeState.setActiveSedeId(sede.id)}
                className='gap-2 p-2'
              >
                <div
                  className='flex size-6 items-center justify-center rounded-sm'
                  style={{
                    color: sede.color_identidad || 'var(--primary)',
                  }}
                >
                  {sede.icon ? (
                    <sede.icon className='size-4 shrink-0' />
                  ) : (
                    <Building2 className='size-4 shrink-0' />
                  )}
                </div>
                {sede.nombre}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
