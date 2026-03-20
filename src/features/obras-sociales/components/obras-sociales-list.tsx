import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface ObraSocial {
  id: string
  nombre: string
  sigla: string
  requiereAutorizacion: boolean
  prestacionesActivas: number
  estado: 'activo' | 'inactivo'
}

const mockObrasSociales: ObraSocial[] = [
  {
    id: 'os-osde',
    nombre: 'Organización de Servicios Directos Empresarios',
    sigla: 'OSDE',
    requiereAutorizacion: true,
    prestacionesActivas: 8,
    estado: 'activo',
  },
  {
    id: 'os-swiss',
    nombre: 'Swiss Medical Group',
    sigla: 'Swiss Medical',
    requiereAutorizacion: true,
    prestacionesActivas: 6,
    estado: 'activo',
  },
  {
    id: 'os-galeno',
    nombre: 'Galeno Argentina S.A.',
    sigla: 'Galeno',
    requiereAutorizacion: false,
    prestacionesActivas: 5,
    estado: 'activo',
  },
  {
    id: 'os-sancor',
    nombre: 'Sancor Salud',
    sigla: 'Sancor',
    requiereAutorizacion: true,
    prestacionesActivas: 4,
    estado: 'activo',
  },
  {
    id: 'os-ioma',
    nombre: 'Instituto de Obra Médico Asistencial',
    sigla: 'IOMA',
    requiereAutorizacion: false,
    prestacionesActivas: 7,
    estado: 'activo',
  },
]

export function ObrasSocialesList() {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sigla</TableHead>
            <TableHead>Razón Social</TableHead>
            <TableHead className='text-center'>Autorización Previa</TableHead>
            <TableHead className='text-right'>Prestaciones (Tarifario)</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockObrasSociales.map((os) => (
            <TableRow key={os.id}>
              <TableCell className='font-bold'>{os.sigla}</TableCell>
              <TableCell>{os.nombre}</TableCell>
              <TableCell className='text-center'>
                {os.requiereAutorizacion ? (
                  <Badge variant='outline' className='bg-amber-100 text-amber-800 border-amber-200'>Referenciada</Badge>
                ) : (
                  <Badge variant='outline' className='bg-slate-100 text-slate-800 border-slate-200'>Directa</Badge>
                )}
              </TableCell>
              <TableCell className='text-right'>
                <Badge variant='secondary'>{os.prestacionesActivas} config.</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={os.estado === 'activo' ? 'default' : 'secondary'}>
                  {os.estado}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
