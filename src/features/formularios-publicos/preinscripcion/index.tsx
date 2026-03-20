import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PreinscripcionFeature() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/50 p-4 md:p-8'>
      <Card className='mx-auto w-full max-w-2xl shadow-lg'>
        <CardHeader className='space-y-1 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
            <span className='text-3xl font-bold text-primary'>O</span>
          </div>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Preinscripción
          </CardTitle>
          <CardDescription className='text-base'>
            Completá este formulario para iniciar el proceso de admisión en
            nuestro centro de rehabilitación.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>1. Datos del Paciente</h3>
              <p className='text-sm text-muted-foreground'>
                Información básica de la persona que recibirá el servicio.
              </p>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='nombrePaciente'>Nombre completo</Label>
                <Input id='nombrePaciente' placeholder='Ej: Juan Pérez' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dniPaciente'>DNI</Label>
                <Input id='dniPaciente' placeholder='Sin puntos' type='number' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='fechaNacimiento'>Fecha de nacimiento</Label>
              <Input id='fechaNacimiento' type='date' />
            </div>
          </div>

          <div className='space-y-4 pt-4 border-t'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>2. Cobertura Médica</h3>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='obraSocial'>Obra Social / Prepaga</Label>
                <Input id='obraSocial' placeholder='Ej: OSDE, IOMA...' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='numeroAfiliado'>Número de afiliado</Label>
                <Input id='numeroAfiliado' />
              </div>
            </div>
          </div>

          <div className='space-y-4 pt-4 border-t'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>3. Datos de Contacto (Familiar / Tutor)</h3>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='nombreTutor'>Nombre del tutor</Label>
                <Input id='nombreTutor' placeholder='Ej: María García' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='telefono'>Teléfono (Celular)</Label>
                <Input id='telefono' placeholder='Ej: 11 1234 5678' type='tel' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Correo electrónico</Label>
              <Input id='email' type='email' placeholder='correo@ejemplo.com' />
            </div>
          </div>

          <Button className='w-full text-lg mt-6' size='lg'>
            Enviar Preinscripción
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
