import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Plus, FileText, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'

export function EvaluacionesTab() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleVerPDF = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 800)), {
      loading: 'Generando vista previa del PDF...',
      success: 'PDF generado correctamente. Abriendo...',
      error: 'Error al generar el PDF',
    })
  }

  const handleVerResultados = () => {
    toast.info('Cargando desglose de resultados de la escala Dunn...')
  }

  const handleCreateEvaluacion = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Nueva evaluación registrada correctamente')
    setIsDialogOpen(false)
  }

  return (
    <div className='space-y-5 animate-in fade-in duration-500'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-bold tracking-tight text-foreground'>
            Evaluaciones Clínicas y Escalas
          </h3>
          <p className='text-xs text-muted-foreground'>
            Registro de tests estandarizados y re-evaluaciones del paciente.
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size='sm' className='bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-sm h-8'>
              <Plus className='mr-1.5 h-3.5 w-3.5' /> Nueva Evaluación
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nueva Evaluación</DialogTitle>
              <DialogDescription>
                Complete los datos básicos del test o escala clínica.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateEvaluacion} className='grid gap-4 py-4'>
              <div className='grid gap-2'>
                <Label htmlFor='test-name'>Nombre del Test/Escala</Label>
                <Input id='test-name' placeholder='Ej: ADOS-2, WISC-V' required />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='area'>Área / Especialidad</Label>
                <Input id='area' placeholder='Ej: Psicología, Psicomotricidad' required />
              </div>
              <DialogFooter>
                <Button type='button' variant='outline' onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type='submit' className='bg-[#7C3AED]'>Guardar Evaluación</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
        {/* Card 1: WISC-IV */}
        <Card className='group hover:shadow-md transition-all duration-200 border-primary/5'>
          <CardHeader className='pb-2 flex flex-row items-start justify-between space-y-0'>
            <div className='space-y-0.5'>
              <CardTitle className='text-base font-bold text-[#7C3AED]'>
                Escala WISC-IV
              </CardTitle>
              <CardDescription className='text-[11px] font-medium uppercase tracking-wider'>Psicología</CardDescription>
            </div>
            <Badge
              variant='outline'
              className='bg-emerald-50 text-emerald-700 border-emerald-100 px-2 py-0 text-[10px] font-bold'
            >
              Aprobado
            </Badge>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground leading-snug'>
              Evaluación de inteligencia y capacidades cognitivas generales. CI
              dentro del promedio.
            </p>
            <div className='flex items-center justify-between pt-3 border-t border-muted/30'>
              <span className='text-[11px] font-bold text-muted-foreground'>10/05/2025</span>
              <Button 
                variant='link' 
                onClick={handleVerPDF}
                className='text-[#7C3AED] font-bold h-auto p-0 text-xs hover:no-underline'
              >
                <FileText className='mr-1 h-3 w-3' /> Ver PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Perfil Sensorial */}
        <Card className='group hover:shadow-md transition-all duration-200 border-primary/5'>
          <CardHeader className='pb-2 flex flex-row items-start justify-between space-y-0'>
            <div className='space-y-0.5'>
              <CardTitle className='text-base font-bold text-[#7C3AED]'>
                Perfil Sensorial (Dunn)
              </CardTitle>
              <CardDescription className='text-[11px] font-medium uppercase tracking-wider'>
                Terapia Ocupacional
              </CardDescription>
            </div>
            <Badge
              variant='outline'
              className='bg-amber-50 text-amber-700 border-amber-100 px-2 py-0 text-[10px] font-bold'
            >
              Revisión
            </Badge>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-sm text-muted-foreground leading-snug'>
              Búsqueda sensorial alta. Requiere ajustes en el entorno escolar.
            </p>
            <div className='flex items-center justify-between pt-3 border-t border-muted/30'>
              <span className='text-[11px] font-bold text-muted-foreground'>15/08/2025</span>
              <Button 
                variant='link' 
                onClick={handleVerResultados}
                className='text-[#7C3AED] font-bold h-auto p-0 text-xs hover:no-underline'
              >
                <ExternalLink className='mr-1 h-3 w-3' /> Ver Resultados
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
