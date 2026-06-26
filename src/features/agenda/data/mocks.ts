import { type Turno } from '@/types/database'

export const MOCK_TURNOS: Turno[] = [
  // SEDE 1 - NORTE
  {
    id: 'tur-01',
    sede_id: '1',
    organizacion_id: 'org-1',
    alumno_id: 'alu-01',
    profesional_id: 'prof-1',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '09:00',
    hora_fin: '09:45',
    estado: 'programado',
    notas: 'Evaluación inicial.',
    alumno_nombre: 'Mateo Rossi',
    profesional_nombre: 'Lic. Mariana Costa',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tur-02',
    sede_id: '1',
    organizacion_id: 'org-1',
    alumno_id: 'alu-02',
    profesional_id: 'prof-2',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '10:00',
    hora_fin: '10:45',
    estado: 'presente',
    notas: 'Sesión de fonoaudiología, evolución favorable.',
    alumno_nombre: 'Sofía Ledesma',
    profesional_nombre: 'Lic. Laura Gatti',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tur-03',
    sede_id: '1',
    organizacion_id: 'org-1',
    alumno_id: 'alu-03',
    profesional_id: 'prof-3',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '11:00',
    hora_fin: '11:45',
    estado: 'ausente_con_aviso',
    notas: 'Ausente con aviso previo.',
    alumno_nombre: 'Valentina Gómez',
    profesional_nombre: 'Lic. Pablo Cárdenas',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tur-04',
    sede_id: '1',
    organizacion_id: 'org-1',
    alumno_id: 'alu-01',
    profesional_id: 'prof-2',
    fecha: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0], // Mañana
    hora_inicio: '14:00',
    hora_fin: '14:45',
    estado: 'programado',
    notas: '',
    alumno_nombre: 'Mateo Rossi',
    profesional_nombre: 'Lic. Laura Gatti',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // SEDE 2 - SUR
  {
    id: 'tur-05',
    sede_id: '2',
    organizacion_id: 'org-1',
    alumno_id: 'alu-06',
    profesional_id: 'prof-4',
    fecha: new Date().toISOString().split('T')[0], // Hoy
    hora_inicio: '09:00',
    hora_fin: '09:45',
    estado: 'programado',
    notas: 'Revisión de objetivos.',
    alumno_nombre: 'Emma Navarro',
    profesional_nombre: 'Lic. Roberto Sánchez',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tur-06',
    sede_id: '2',
    organizacion_id: 'org-1',
    alumno_id: 'alu-07',
    profesional_id: 'prof-5',
    fecha: new Date().toISOString().split('T')[0], // Hoy
    hora_inicio: '15:00',
    hora_fin: '15:45',
    estado: 'presente',
    notas: '',
    alumno_nombre: 'Agustín Paz',
    profesional_nombre: 'Lic. Carla Giménez',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'tur-07',
    sede_id: '2',
    organizacion_id: 'org-1',
    alumno_id: 'alu-08',
    profesional_id: 'prof-4',
    fecha: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Pasado Mañana
    hora_inicio: '16:00',
    hora_fin: '16:45',
    estado: 'programado',
    notas: '',
    alumno_nombre: 'Martina Silva',
    profesional_nombre: 'Lic. Roberto Sánchez',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
]
