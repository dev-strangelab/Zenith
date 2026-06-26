import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { Timeline, type TimelineItemProps } from '@/components/ui/timeline'

const CLINICAL_TIMELINE: TimelineItemProps[] = [
  {
    date: '11 de Octubre, 2025',
    title: 'Lic. María Favaloro - Psicopedagogía',
    statusColor: 'green',
    badge: (
      <Badge variant='outline' className='text-[10px] font-mono bg-green-50 text-green-700 h-4 border-none'>
        Presente
      </Badge>
    ),
    content: (
      <p>
        Se trabajó sobre la tolerancia a la frustración mediante juegos
        simbólicos. Juan logró armar el rompecabezas de 20 piezas sin
        episodios de llanto. <strong>Objetivo de la sesión alcanzado.</strong>
      </p>
    ),
  },
  {
    date: '04 de Octubre, 2025',
    title: 'Administración',
    statusColor: 'yellow',
    badge: (
      <Badge variant='outline' className='text-[10px] font-mono bg-yellow-50 text-yellow-700 h-4 border-none'>
        Falta con Aviso
      </Badge>
    ),
    content: (
      <p className='italic text-muted-foreground'>
        Avisó la madre (María García) que Juan está con fiebre y reposo
        médico. Adjuntó certificado por el Buzón Familia.
      </p>
    ),
  },
  {
    date: '27 de Septiembre, 2025',
    title: 'Lic. María Favaloro - Psicopedagogía',
    statusColor: 'green',
    badge: (
      <Badge variant='outline' className='text-[10px] font-mono bg-green-50 text-green-700 h-4 border-none'>
        Presente
      </Badge>
    ),
    content: (
      <p>
        Primera sesión del mes. Evaluación inicial de Lecto-Escritura.
        Se observa dificultad en la pronunciación de sílabas trabadas.
        Se enviaron pautas para el hogar.
      </p>
    ),
  },
]

export function HistoriaClinicaTab() {
  return (
    <Card className='shadow-md border-border/50'>
      <CardHeader className='bg-muted/10 border-b pb-4'>
        <div className='flex justify-between items-center'>
          <div>
            <CardTitle className='text-xl'>Línea de Vida Clínica</CardTitle>
            <CardDescription className='mt-1 text-xs'>
              Evoluciones, informes y asistencias ordenadas cronológicamente.
            </CardDescription>
          </div>
          <Badge variant='outline' className='bg-primary/5 text-primary text-[10px]'>
            3 sesiones registradas
          </Badge>
        </div>
      </CardHeader>
      <CardContent className='p-6'>
        <Timeline items={CLINICAL_TIMELINE} />
      </CardContent>
    </Card>
  )
}
