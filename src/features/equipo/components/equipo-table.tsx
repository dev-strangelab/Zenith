import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useOrganization } from '@/hooks/use-organization'
import { useMemo } from 'react'

interface Profesional {
  id: string
  nombre: string
  rol: string
  especialidad: string
  estado: 'activo' | 'inactivo'
  sede_id: string
}

const mockEquipo: Profesional[] = [
  // SEDE 1 - NORTE
  {
    id: 'prof-1',
    nombre: 'Lic. Mariana Costa',
    rol: 'Coordinador',
    especialidad: 'Psicopedagogía',
    estado: 'activo',
    sede_id: '1'
  },
  {
    id: 'prof-2',
    nombre: 'Lic. Laura Gatti',
    rol: 'Profesional',
    especialidad: 'Fonoaudiología',
    estado: 'activo',
    sede_id: '1'
  },
  {
    id: 'prof-3',
    nombre: 'Lic. Pablo Cárdenas',
    rol: 'Profesional',
    especialidad: 'Terapia Ocupacional',
    estado: 'activo',
    sede_id: '1'
  },
  {
    id: 'prof-6',
    nombre: 'Dra. Cecilia Fernández',
    rol: 'Profesional',
    especialidad: 'Psicología',
    estado: 'activo',
    sede_id: '1'
  },
  {
    id: 'prof-7',
    nombre: 'Prof. Daniel Muñoz',
    rol: 'Profesional',
    especialidad: 'Educación Física Adaptada',
    estado: 'inactivo',
    sede_id: '1'
  },
  // SEDE 2 - SUR
  {
    id: 'prof-4',
    nombre: 'Lic. Roberto Sánchez',
    rol: 'Coordinador',
    especialidad: 'Kinesiología',
    estado: 'activo',
    sede_id: '2'
  },
  {
    id: 'prof-5',
    nombre: 'Lic. Carla Giménez',
    rol: 'Profesional',
    especialidad: 'Musicoterapia',
    estado: 'activo',
    sede_id: '2'
  },
  {
    id: 'prof-8',
    nombre: 'Lic. Natalia Rivas',
    rol: 'Profesional',
    especialidad: 'Psicología',
    estado: 'activo',
    sede_id: '2'
  },
]

export function EquipoTable() {
  const { activeSedeId } = useOrganization()

  const filteredEquipo = useMemo(() => {
    return mockEquipo.filter(p => p.sede_id === activeSedeId)
  }, [activeSedeId])

  return (
    <div className='rounded-md border bg-background shadow-sm'>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/30'>
            <TableHead>Profesional</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Rol en esta Sede</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEquipo.length > 0 ? (
            filteredEquipo.map((prof) => (
              <TableRow key={prof.id} className='hover:bg-muted/10 transition-colors'>
                <TableCell className='font-medium'>{prof.nombre}</TableCell>
                <TableCell>{prof.especialidad}</TableCell>
                <TableCell>
                  <Badge variant='outline'>{prof.rol}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={prof.estado === 'activo' ? 'outline' : 'secondary'}
                    className={prof.estado === 'activo' ? 'border-green-200 bg-green-50 text-green-700' : ''}
                  >
                    {prof.estado.charAt(0).toUpperCase() + prof.estado.slice(1)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                No hay profesionales asignados a esta sede todavía.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
