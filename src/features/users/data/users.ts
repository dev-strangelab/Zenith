import { faker } from '@faker-js/faker'
import type { AppRole } from '@/types/database'

// Seed fijo para datos consistentes
faker.seed(67890)

// ---------------------------------------------------------------------------
// Usuarios del sistema para la tabla de gestión (shadcn-admin demo)
// ---------------------------------------------------------------------------
export const users = Array.from({ length: 500 }, () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    id: faker.string.uuid(),
    firstName,
    lastName,
    username: faker.internet
      .username({ firstName, lastName })
      .toLocaleLowerCase(),
    email: faker.internet.email({ firstName }).toLocaleLowerCase(),
    phoneNumber: faker.phone.number({ style: 'international' }),
    status: faker.helpers.arrayElement([
      'active',
      'inactive',
      'invited',
      'suspended',
    ] as const),
    role: faker.helpers.arrayElement([
      'director_organizacion',
      'director_sede',
      'coordinador',
      'profesional',
      'administrativo',
    ] as AppRole[]),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})

// ---------------------------------------------------------------------------
// Usuarios mock de Órbita con roles reales — para testing de permisos
// ---------------------------------------------------------------------------
export interface MockOrbitaUser {
  id: string
  nombre: string
  email: string
  role: AppRole[]
  organizacion_id: string
  sede_id: string | null
  /** Nombre del escenario para testing */
  descripcion: string
}

export const MOCK_ORBITA_USERS: MockOrbitaUser[] = [
  {
    id: 'user-super',
    nombre: 'Karina López',
    email: 'karina@orbita.app',
    role: ['director_organizacion'],
    organizacion_id: 'org-1',
    sede_id: null, // Ve todas las sedes
    descripcion: 'Directora de Organización — acceso total',
  },
  {
    id: 'user-dir-norte',
    nombre: 'Valentina Ríos',
    email: 'valentina@orbita.app',
    role: ['director_sede'],
    organizacion_id: 'org-1',
    sede_id: '1',
    descripcion: 'Directora Sede Norte — gestión completa de Sede 1',
  },
  {
    id: 'user-coord-norte',
    nombre: 'Lic. Mariana Costa',
    email: 'mariana@orbita.app',
    role: ['coordinador'],
    organizacion_id: 'org-1',
    sede_id: '1',
    descripcion: 'Coordinadora Sede Norte — ve alumnos, equipo y agenda',
  },
  {
    id: 'user-prof-norte',
    nombre: 'Lic. Laura Gatti',
    email: 'laura@orbita.app',
    role: ['profesional'],
    organizacion_id: 'org-1',
    sede_id: '1',
    descripcion: 'Profesional Sede Norte — solo sus alumnos asignados',
  },
  {
    id: 'user-admin-norte',
    nombre: 'Tomás Vargas',
    email: 'tomas@orbita.app',
    role: ['administrativo'],
    organizacion_id: 'org-1',
    sede_id: '1',
    descripcion: 'Administrativo Sede Norte — alumnos, liquidaciones, sin clínica',
  },
  {
    id: 'user-coord-sur',
    nombre: 'Lic. Roberto Sánchez',
    email: 'roberto@orbita.app',
    role: ['coordinador'],
    organizacion_id: 'org-1',
    sede_id: '2',
    descripcion: 'Coordinador Sede Sur',
  },
  {
    id: 'user-prof-sur',
    nombre: 'Lic. Carla Giménez',
    email: 'carla@orbita.app',
    role: ['profesional'],
    organizacion_id: 'org-1',
    sede_id: '2',
    descripcion: 'Profesional Sede Sur — solo sus alumnos asignados',
  },
]
