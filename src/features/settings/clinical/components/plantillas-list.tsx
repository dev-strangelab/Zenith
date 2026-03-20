import { useState } from 'react'
import { PlantillaEvolucion } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Quote, Share2, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const mockPlantillas: PlantillaEvolucion[] = [
  {
    id: 'plan-1',
    organizacion_id: 'org-1',
    profesional_id: 'prof-1',
    sede_id: '1',
    titulo: 'Evolución Psicológica Estándar',
    contenido: 'Se trabaja mediante el juego la tolerancia a la frustración. El alumno se muestra participativo y logra completar las consignas con mediación verbal.',
    categoria: 'psicologia',
    is_shared: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'plan-2',
    organizacion_id: 'org-1',
    profesional_id: null,
    sede_id: null, // Plantilla global de la organización
    titulo: 'Ausencia sin aviso',
    contenido: 'El alumno no asiste a la sesión programada. No se registra aviso previo por parte de la familia.',
    categoria: 'administrativo',
    is_shared: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export function PlantillasList() {
  const [plantillas, setPlantillas] = useState(mockPlantillas)

  const handleDelete = (id: string) => {
    setPlantillas(prev => prev.filter(p => p.id !== id))
    toast.success('Plantilla eliminada correctamente.')
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Plantillas de Evolución</h3>
        <Button size='sm' variant='outline'>
          <Plus className='mr-2 h-4 w-4' /> Nueva Plantilla
        </Button>
      </div>

      <div className='grid gap-4'>
        {plantillas.map((plan) => (
          <Card key={plan.id} className='border-none shadow-sm bg-muted/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <CardTitle className='text-base'>{plan.titulo}</CardTitle>
                  {plan.is_shared && (
                    <Badge variant='secondary' className='text-[10px] h-4 bg-primary/10 text-primary border-none'>
                      <Share2 className='mr-1 h-3 w-3' /> Compartida
                    </Badge>
                  )}
                </div>
                <CardDescription className='capitalize'>{plan.categoria}</CardDescription>
              </div>
              <Button 
                variant='ghost' 
                size='icon' 
                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                onClick={() => handleDelete(plan.id)}
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </CardHeader>
            <CardContent>
              <div className='relative rounded-md bg-background/50 p-3 text-sm text-muted-foreground italic leading-relaxed'>
                <Quote className='absolute -left-1 -top-1 h-3 w-3 opacity-20' />
                {plan.contenido}
              </div>
              <div className='mt-4 flex justify-end space-x-2'>
                <Button variant='ghost' size='sm'>Editar</Button>
                <Button variant='link' size='sm' className='text-primary'>Usar como base</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
