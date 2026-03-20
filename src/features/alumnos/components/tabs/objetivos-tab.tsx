import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import type { Objetivo } from '@/types/database'
import { ObjetivoService } from '../../services/objetivo-service'
import { Target } from 'lucide-react'

interface ObjetivosTabProps {
  alumnoId: string
}

export function ObjetivosTab({ alumnoId }: ObjetivosTabProps) {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    ObjetivoService.getByAlumno(alumnoId).then(data => {
      if (!ignore) {
        setObjetivos(data)
        setIsLoading(false)
      }
    })
    return () => { ignore = true }
  }, [alumnoId])

  const handleToggle = async (objetivo: Objetivo) => {
    const nuevoCompletado = !objetivo.completado
    const nuevoProgreso = nuevoCompletado ? 100 : Math.min(objetivo.progreso, 99)

    // Optimistic update
    setObjetivos(prev => prev.map(o =>
      o.id === objetivo.id
        ? { ...o, completado: nuevoCompletado, progreso: nuevoProgreso }
        : o
    ))

    await ObjetivoService.updateProgreso(objetivo.id, nuevoProgreso, nuevoCompletado)

    toast.success(nuevoCompletado ? `Objetivo logrado: "${objetivo.descripcion.slice(0, 40)}..."` : 'Objetivo marcado como en progreso')
  }

  // Agrupar por disciplina
  const disciplinas = Array.from(new Set(objetivos.map(o => o.disciplina)))

  if (isLoading) {
    return (
      <div className='space-y-3 animate-pulse'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-10 bg-muted rounded-md' />
        ))}
      </div>
    )
  }

  return (
    <div className='grow space-y-5 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-bold tracking-tight text-foreground'>
            Plan de Tratamiento Interdisciplinario
          </h3>
          <p className='text-xs text-muted-foreground'>
            Objetivos de trabajo anuales definidos por el equipo.
          </p>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => toast.info('Modo edición habilitado', { description: 'Función disponible en próxima versión.' })}
          className='font-semibold border-muted-foreground/20 hover:bg-muted/50 transition-colors'
        >
          Editar Plan
        </Button>
      </div>

      {objetivos.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12 text-muted-foreground'>
          <Target className='h-8 w-8 mb-2 opacity-30' />
          <p className='text-sm font-medium'>Sin objetivos registrados</p>
          <p className='text-xs'>Presione "Editar Plan" para agregar objetivos terapéuticos.</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {disciplinas.map(disciplina => (
            <div key={disciplina} className='space-y-3'>
              <h3 className='font-bold text-[11px] uppercase tracking-widest text-muted-foreground border-b pb-1.5'>
                {disciplina}
              </h3>

              <div className='space-y-4 px-0.5'>
                {objetivos
                  .filter(o => o.disciplina === disciplina)
                  .map(objetivo => (
                    <div key={objetivo.id} className='flex items-start space-x-3 group'>
                      <Checkbox
                        id={objetivo.id}
                        checked={objetivo.completado}
                        onCheckedChange={() => handleToggle(objetivo)}
                        className='mt-1 border-primary data-[state=checked]:bg-[#7C3AED] h-4 w-4'
                      />
                      <div className='grid gap-1.5 w-full max-w-xl leading-tight'>
                        <label
                          htmlFor={objetivo.id}
                          className={`text-sm font-medium cursor-pointer ${objetivo.completado ? 'line-through text-muted-foreground/60' : ''}`}
                        >
                          {objetivo.descripcion}
                        </label>
                        {objetivo.completado ? (
                          <p className='text-[11px] text-muted-foreground/50'>
                            Logrado{objetivo.fecha_logro ? ` el ${objetivo.fecha_logro}` : ''}.
                          </p>
                        ) : (
                          <div className='space-y-1'>
                            <div className='h-1.5 w-full bg-muted rounded-full overflow-hidden'>
                              <div
                                className='h-full bg-[#7C3AED] transition-all duration-500'
                                style={{ width: `${objetivo.progreso}%` }}
                              />
                            </div>
                            <p className='text-[10px] text-muted-foreground/60'>{objetivo.progreso}% completado</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
