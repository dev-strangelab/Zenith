import {
  LayoutDashboard,
  ListTodo,
  HelpCircle,
  Settings,
  Users,
  ShieldCheck,
  Building,
  Mail,
  Wallet,
  Orbit,
  Brain,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Kari',
    email: 'Kari@itersoftco.com',
    avatar: '/avatars/shadcn.jpg',
  },
  sedes: [
    {
      id: '1',
      nombre: 'Sede Norte',
      direccion: 'Belgrano',
      ciudad: 'CABA',
      color_identidad: '#7c3aed',
      icon: Orbit,
    },
    {
      id: '2',
      nombre: 'Sede Sur',
      direccion: 'Avellaneda',
      ciudad: 'GBA',
      color_identidad: '#ec4899',
      icon: Brain,
    },
  ],
  navGroups: [
    {
      title: 'Gestión Operativa',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
          // Todos los roles (sin restricción)
        },
        {
          title: 'Alumnos',
          url: '/alumnos',
          icon: Users,
          allowedRoles: [
            'director_organizacion',
            'director_sede',
            'coordinador',
            'profesional',
            'administrativo',
          ],
        },
        {
          title: 'Buzón Familia',
          url: '/buzon',
          icon: Mail,
          allowedRoles: [
            'director_organizacion',
            'director_sede',
            'coordinador',
            'profesional',
            'administrativo',
          ],
        },
        {
          title: 'Agenda y Turnos',
          url: '/agenda',
          icon: ListTodo,
          allowedRoles: [
            'director_organizacion',
            'director_sede',
            'coordinador',
            'profesional',
            'administrativo',
          ],
        },
      ],
    },
    {
      title: 'Facturación y Equipo',
      items: [
        {
          title: 'Obras Sociales',
          url: '/obras-sociales',
          icon: Building,
          allowedRoles: [
            'director_organizacion',
            'director_sede',
            'coordinador',
            'administrativo',
          ],
        },
        {
          title: 'Liquidaciones',
          url: '/liquidaciones',
          icon: ShieldCheck,
          allowedRoles: [
            'director_organizacion',
            'director_sede',
            'administrativo',
          ],
        },
        {
          title: 'Equipo Profesional',
          url: '/equipo',
          icon: Users,
          allowedRoles: [
            'director_organizacion',
            'director_sede',
            'coordinador',
          ],
        },
        {
          title: 'Mis Honorarios',
          url: '/mis-honorarios',
          icon: Wallet,
          allowedRoles: ['profesional'],
        },
      ],
    },
    {
      title: 'Sistema',
      items: [
        {
          title: 'Configuración',
          icon: Settings,
          allowedRoles: ['director_organizacion', 'director_sede'],
          items: [
            {
              title: 'Organización',
              url: '/settings/organizacion',
            },
            {
              title: 'Sedes',
              url: '/settings/sedes',
            },
            {
              title: 'Usuarios',
              url: '/settings/usuarios',
            },
            {
              title: 'Auditoría de Datos',
              url: '/audit/integrity',
            },
          ],
        },
        {
          title: 'Ayuda',
          url: '/help',
          icon: HelpCircle,
          // Todos los roles
        },
      ],
    },
  ],
}
