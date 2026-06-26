import { type Prestacion } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Plus, BadgeDollarSign, Activity } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const mockPrestaciones: Prestacion[] = [
  {
    id: 'pre-1',
    organizacion_id: 'org-1',
    obra_social_id: 'os-1',
    codigo: '42.01',
    descripcion: 'Módulo de Integración Escolar (Mes)',
    valor_sesion: 125000.00,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'pre-2',
    organizacion_id: 'org-1',
    obra_social_id: 'os-1',
    codigo: '42.02',
    descripcion: 'Estimulación Temprana',
    valor_sesion: 8500.50,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export function PrestacionesTable() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Catálogo de Prestaciones</h3>
        <Button size='sm' variant='outline'>
          <Plus className='mr-2 h-4 w-4' /> Nueva Prestación
        </Button>
      </div>

      <div className='rounded-md border bg-muted/20'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead className='w-[100px]'>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Valor Sugerido</TableHead>
              <TableHead className='text-right'>Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPrestaciones.map((pre) => (
              <TableRow key={pre.id}>
                <TableCell className='font-medium'>{pre.codigo}</TableCell>
                <TableCell>
                  <div className='flex flex-col'>
                    <span>{pre.descripcion}</span>
                    <span className='text-[10px] text-muted-foreground uppercase flex items-center mt-1'>
                      <Activity className='mr-1 h-3 w-3' /> Clínica General
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex items-center font-bold'>
                    <BadgeDollarSign className='mr-1 h-4 w-4 text-green-600' />
                    {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(pre.valor_sesion)}
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
                    Vigente
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
