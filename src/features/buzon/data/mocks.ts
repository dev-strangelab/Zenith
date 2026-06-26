import { type Alumno } from '@/types/database'

export interface Chat {
  id: string 
  tutor_nombre: string
  tutor_rol: string
  avatar_url?: string
  alumnos: Partial<Alumno>[] 
  ultimo_mensaje: string
  fecha_hora: string
  no_leidos: number
  is_online: boolean
  canal: 'whatsapp' | 'sistema' | 'email'
  is_urgente?: boolean
  sede_id: string // Campo obligatorio para aislamiento
}

export const MOCK_CHATS: Chat[] = [
  // SEDE 1 - NORTE
  { 
    id: 'chat-mateo', 
    tutor_nombre: 'Carolina Rossi', 
    tutor_rol: 'Madre',
    avatar_url: '/avatars/03.png', 
    alumnos: [
      { id: 'alu-01', nombre: 'Mateo', apellido: 'Rossi', estado: 'activo' }
    ],
    ultimo_mensaje: 'Hola, Mateo llegará 10 min tarde hoy.', 
    fecha_hora: '10:30 AM', 
    no_leidos: 2, 
    is_online: true, 
    canal: 'whatsapp',
    is_urgente: false,
    sede_id: '1'
  },
  { 
    id: 'chat-sofia', 
    tutor_nombre: 'Roberto Ledesma', 
    tutor_rol: 'Padre',
    avatar_url: '/avatars/04.png', 
    alumnos: [
      { id: 'alu-02', nombre: 'Sofía', apellido: 'Ledesma', estado: 'activo' }
    ],
    ultimo_mensaje: 'Gracias por la evolución de ayer. ¿Podemos agendar una reunión?', 
    fecha_hora: '09:15 AM', 
    no_leidos: 0, 
    is_online: false, 
    canal: 'whatsapp',
    sede_id: '1'
  },
  { 
    id: 'chat-valentina', 
    tutor_nombre: 'María Laura Gómez', 
    tutor_rol: 'Madre',
    avatar_url: '/avatars/01.png', 
    alumnos: [
      { id: 'alu-03', nombre: 'Valentina', apellido: 'Gómez', estado: 'activo' }
    ],
    ultimo_mensaje: '⚠️ Necesito que me envíen urgente el informe para la obra social.', 
    fecha_hora: '08:00 AM', 
    no_leidos: 3, 
    is_online: true, 
    canal: 'sistema',
    is_urgente: true,
    sede_id: '1'
  },

  // SEDE 2 - SUR
  { 
    id: 'chat-emma', 
    tutor_nombre: 'Lucía Navarro', 
    tutor_rol: 'Madre',
    avatar_url: '/avatars/02.png', 
    alumnos: [
      { id: 'alu-06', nombre: 'Emma', apellido: 'Navarro', estado: 'activo' }
    ],
    ultimo_mensaje: '¿Me confirman el turno de mañana?', 
    fecha_hora: '11:45 AM', 
    no_leidos: 1, 
    is_online: true, 
    canal: 'whatsapp',
    is_urgente: true,
    sede_id: '2'
  },
  { 
    id: 'chat-martina', 
    tutor_nombre: 'Javier Silva', 
    tutor_rol: 'Padre',
    avatar_url: '/avatars/05.png', 
    alumnos: [
      { id: 'alu-08', nombre: 'Martina', apellido: 'Silva', estado: 'activo' }
    ],
    ultimo_mensaje: 'Adjunto el CUD renovado. Por favor confirmen recepción.', 
    fecha_hora: '08:00 AM', 
    no_leidos: 0, 
    is_online: false, 
    canal: 'whatsapp',
    sede_id: '2'
  }
]
