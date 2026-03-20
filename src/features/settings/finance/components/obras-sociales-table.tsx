import { ObraSocial } from '@/types/database'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Building2, Mail, FileCheck } from 'lucide-react'

const mockOS: ObraSocial[] = [
  {
    id: 'os-1',
    organizacion_id: 'org-1',
    nombre: 'OSDE Servicio de Salud',
    sigla: 'OSDE',
    cuit: '30-54674125-3',
    direccion_facturacion: 'Av. Leandro N. Alem 1067, CABA',
    email_glp: 'facturacion@osde.com.ar',
    requiere_autorizacion: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'os-2',
    organizacion_id: 'org-1',
    nombre: 'Swiss Medical Group',
    sigla: 'SWISS',
    cuit: '30-67897234-1',
    direccion_facturacion: 'Pueyrredón 1400, CABA',
    email_glp: 'prestadores@swissmedical.com.ar',
    requiere_autorizacion: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export function ObrasSocialesTable() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Maestro de Obras Sociales</h3>
        <Button size='sm' variant='outline'>
          <Plus className='mr-2 h-4 w-4' /> Nueva Obra Social
        </Button>
      </div>

      <div className='rounded-md border bg-muted/20'>
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-transparent'>
              <TableHead>Nombre / Sigla</TableHead>
              <TableHead>Datos Fiscales</TableHead>
              <TableHead>Contacto Administrativo</TableHead>
              <TableHead className='text-right'>Admin</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockOS.map((os) => (
              <TableRow key={os.id}>
                <TableCell>
                  <div className='flex flex-col'>
                    <span className='font-bold text-sm'>{os.nombre}</span>
                    <span className='text-xs text-muted-foreground'>{os.sigla}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col text-xs space-y-1'>
                    <span className='flex items-center'>
                      <Building2 className='mr-1 h-3 w-3 opacity-70' /> CUIT: {os.cuit}
                    </span>
                    <span className='opacity-70 truncate max-w-[200px]'>{os.direccion_facturacion}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='flex flex-col text-xs space-y-1'>
                    <span className='flex items-center'>
                      <Mail className='mr-1 h-3 w-3 opacity-70' /> {os.email_glp}
                    </span>
                    {os.requiere_autorizacion && (
                      <span className='flex items-center text-amber-600 font-medium'>
                        <FileCheck className='mr-1 h-3 w-3' /> Requiere Aut.
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-right'>
                  <Button variant='ghost' size='sm'>Configurar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
