import { type LinkProps } from '@tanstack/react-router'
import type { AppRole } from '@/types/database'

type User = {
  name: string
  email: string
  avatar: string
}

type Sede = {
  id: string
  nombre: string
  direccion?: string
  ciudad?: string
  color_identidad?: string
  icon?: React.ElementType
}

type BaseNavItem = {
  title: string
  badge?: string
  icon?: React.ElementType
  /** Si se define, solo usuarios con al menos uno de estos roles ven el item. */
  allowedRoles?: AppRole[]
}

type NavLink = BaseNavItem & {
  url: LinkProps['to'] | (string & {})
  items?: never
}

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: LinkProps['to'] | (string & {}) })[]
  url?: never
}

type NavItem = NavCollapsible | NavLink

type NavGroup = {
  title: string
  items: NavItem[]
}

type SidebarData = {
  user: User
  sedes: Sede[]
  navGroups: NavGroup[]
}

export type { SidebarData, NavGroup, NavItem, NavCollapsible, NavLink, Sede }
