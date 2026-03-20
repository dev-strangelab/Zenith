import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { SedeSwitcher } from './sede-switcher'
import { useOrganization } from '@/hooks/use-organization'
import type { NavItem, NavGroup as NavGroupType } from './types'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { role } = useOrganization()

  /**
   * Filtra los grupos y sus items según el rol del usuario.
   * Un item sin `allowedRoles` es visible para todos.
   */
  const filteredNavGroups = useMemo((): NavGroupType[] => {
    // Si no hay usuario cargado aún, no mostrar nada
    if (role.length === 0) return []

    return sidebarData.navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item: NavItem) => {
          if (!item.allowedRoles || item.allowedRoles.length === 0) return true
          return item.allowedRoles.some((r) => role.includes(r))
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [role])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <SedeSwitcher sedes={sidebarData.sedes} />
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
