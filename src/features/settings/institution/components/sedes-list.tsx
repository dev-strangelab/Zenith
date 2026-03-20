import { Sede } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, MapPin, Phone, Mail } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const mockSedes: Sede[] = [
  {
    id: 'sede-1',
    organizacion_id: 'org-1',
    nombre: 'Sede Norte',
    direccion: 'Belgrano 1234',
    ciudad: 'CABA',
    telefono: '11 4444-5555',
    email_contacto: 'norte@itersoftco.com',
    cuit_prestador: '30-11111111-1',
    matricula_andis: 'ANDIS-123',
    color_identidad: '#3b82f6',
    configuracion: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sede-2',
    organizacion_id: 'org-1',
    nombre: 'Sede Sur',
    direccion: 'Mitre 567',
    ciudad: 'Avellaneda',
    telefono: '11 6666-7777',
    email_contacto: 'sur@itersoftco.com',
    cuit_prestador: '30-22222222-2',
    matricula_andis: 'ANDIS-456',
    color_identidad: '#ec4899',
    configuracion: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function SedesList() {
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Sedes del Centro</h3>
        <Button size='sm' variant='outline'>
          <Plus className='mr-2 h-4 w-4' /> Añadir Sede
        </Button>
      </div>

      <div className='grid gap-4'>
        {mockSedes.map((sede) => (
          <Card key={sede.id} className='overflow-hidden border-none shadow-sm bg-muted/30'>
            <div 
              className='h-1.5 w-full' 
              style={{ backgroundColor: sede.color_identidad }} 
            />
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='space-y-1'>
                <CardTitle className='text-base'>{sede.nombre}</CardTitle>
                <CardDescription>ID: {sede.id}</CardDescription>
              </div>
              <Badge variant={sede.is_active ? 'default' : 'secondary'} className='bg-primary/10 text-primary border-none'>
                {sede.is_active ? 'Activa' : 'Inactiva'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground'>
                <div className='flex items-center'>
                  <MapPin className='mr-2 h-4 w-4 text-primary' />
                  {sede.direccion}
                </div>
                <div className='flex items-center'>
                  <Phone className='mr-2 h-4 w-4 text-primary' />
                  {sede.telefono}
                </div>
                <div className='flex items-center'>
                  <Mail className='mr-2 h-4 w-4 text-primary' />
                  {sede.email_contacto}
                </div>
              </div>
              <div className='mt-4 flex justify-end space-x-2'>
                <Button variant='ghost' size='sm'>Configurar</Button>
                <Button variant='ghost' size='sm'>Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
