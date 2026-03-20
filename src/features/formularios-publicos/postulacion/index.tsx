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

export default function PostulacionFeature() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/50 p-4 md:p-8'>
      <Card className='mx-auto w-full max-w-2xl shadow-lg'>
        <CardHeader className='space-y-1 text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
            <span className='text-3xl font-bold text-primary'>O</span>
          </div>
          <CardTitle className='text-3xl font-bold tracking-tight'>
            Sumate a Nuestro Equipo
          </CardTitle>
          <CardDescription className='text-base'>
            Buscamos profesionales apasionados por la rehabilitación y el
            acompañamiento integral. Dejanos tus datos.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='space-y-4'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>1. Datos Personales</h3>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='nombreProf'>Nombre completo</Label>
                <Input id='nombreProf' placeholder='Ej: Camila López' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='dniProf'>DNI / CUIL</Label>
                <Input id='dniProf' placeholder='Sin puntos ni guiones' type='number' />
              </div>
            </div>
          </div>

          <div className='space-y-4 pt-4 border-t'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>2. Perfil Profesional</h3>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='titulo'>Título o Profesión</Label>
                <Input id='titulo' placeholder='Psicólogo, Terapista...' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='matricula'>Matrícula (opcional)</Label>
                <Input id='matricula' placeholder='Ej: MN 12345' />
              </div>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='zona'>Zona de cobertura / residencia</Label>
              <Input id='zona' placeholder='Ej: CABA, Vicente López, Almagro...' />
            </div>
          </div>

          <div className='space-y-4 pt-4 border-t'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>3. Datos de Contacto</h3>
            </div>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='emailProf'>Correo electrónico</Label>
                <Input id='emailProf' type='email' placeholder='correo@ejemplo.com' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='telefonoProf'>Teléfono Celular</Label>
                <Input id='telefonoProf' type='tel' placeholder='Ej: 11 9876 5432' />
              </div>
            </div>
          </div>

          <div className='space-y-4 pt-4 border-t'>
            <div className='space-y-2 pb-2'>
              <h3 className='text-lg font-medium'>4. Currículum Vitae</h3>
            </div>
            <div className='space-y-2 p-6 border-2 border-dashed rounded-lg text-center hover:bg-muted/50 cursor-pointer transition-colors'>
              <div className='text-sm text-muted-foreground'>
                <p>Haz clic para subir o arrastra tu archivo PDF aquí</p>
                <p className='text-xs mt-1'>(Máx 5MB)</p>
              </div>
              <Input id='cv' type='file' className='hidden' accept='.pdf,.doc,.docx' />
            </div>
          </div>

          <Button className='w-full text-lg mt-6' size='lg'>
            Enviar Postulación
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
