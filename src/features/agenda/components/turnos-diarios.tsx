import { useState, useEffect } from 'react'
import type { Turno, AsistenciaEstado } from '@/types/database'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { 
  CheckCircle2, 
  XOctagon, 
  AlertCircle, 
  PenLine,
  FileText,
} from 'lucide-react'
import { useOrganization } from '@/hooks/use-organization'
import { TurnoService } from '../services/turno-service'
import { toast } from 'sonner'
import { ASISTENCIA_ESTADO_CONFIG } from '@/lib/constants/estado-configs'

interface TurnosDiariosProps {
  date: Date | undefined
}

export function TurnosDiarios({ date }: TurnosDiariosProps) {
  const [turnos, setTurnos] = useState<Turno[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTurnoId, setSelectedTurnoId] = useState<string | null>(null)
  const [evolucionText, setEvolucionText] = useState('')
  const { activeSedeId } = useOrganization()

  useEffect(() => {
    async function loadTurnos() {
      if (!activeSedeId || !date) return
      setIsLoading(true)
      try {
        const fechaStr = format(date, 'yyyy-MM-dd')
        const data = await TurnoService.getTurnos(activeSedeId, fechaStr)
        setTurnos(data || [])
      } catch (_error) {
        toast.error('Error al cargar la agenda.')
      } finally {
        setIsLoading(false)
      }
    }
    loadTurnos()
  }, [activeSedeId, date])

  const handleEstadoChange = async (id: string, nuevoEstado: AsistenciaEstado) => {
    try {
      await TurnoService.updateEstado(id, nuevoEstado)
      setTurnos(turnos.map(t => t.id === id ? { ...t, estado: nuevoEstado } : t))
      if (nuevoEstado === 'presente' || nuevoEstado === 'ausente_con_aviso') {
        setSelectedTurnoId(id)
      }
      toast.success('Estado actualizado.')
    } catch (_error) {
      toast.error('Error al actualizar el estado.')
    }
  }

  const handleSaveEvolucion = async (id: string) => {
    try {
      await TurnoService.createEvolucion(id, evolucionText)
      setSelectedTurnoId(null)
      setEvolucionText('')
      toast.success('Evolución guardada.')
    } catch (_error) {
      toast.error('Error al guardar la evolución.')
    }
  }



  return (
    <Card className="h-full border-border/50 shadow-md">
      <CardHeader className="border-b bg-card pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">
              Asistencia y Evoluciones
            </CardTitle>
            <CardDescription className="mt-1">
              {date ? format(date, "EEEE d 'de' MMMM", { locale: es }) : 'Selecciona una fecha'}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="px-3 py-1 font-semibold">
            {turnos.filter(t => t.estado !== 'programado').length} / {turnos.length} Procesados
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {date ? (
          <div className="divide-y">
            {isLoading ? (
              <div className="p-12 text-center text-muted-foreground animate-pulse">
                Cargando agenda...
              </div>
            ) : turnos.length > 0 ? (
              turnos.map((turno) => (
                <div
                  key={turno.id}
                  className={`p-4 transition-colors hover:bg-muted/20 ${turno.estado === 'presente' ? 'bg-green-50/10' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Info del Paciente */}
                    <div className="flex items-center space-x-4">
                      <div className="flex h-14 w-16 flex-col items-center justify-center rounded-md bg-primary/10 text-primary font-mono font-bold shadow-inner">
                        <span>{turno.hora_inicio}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold leading-none mb-1">{turno.alumno_nombre}</h4>
                        <p className="text-sm text-muted-foreground font-medium">{turno.profesional_nombre}</p>
                      </div>
                    </div>

                    {/* Acciones de Asistencia */}
                    <div className="flex items-center gap-2">
                      {turno.estado === 'programado' ? (
                        <div className="flex items-center gap-2 bg-muted/30 p-1.5 rounded-lg border">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-100 font-semibold"
                            onClick={() => handleEstadoChange(turno.id, 'presente')}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" /> Presente
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                            onClick={() => handleEstadoChange(turno.id, 'ausente_con_aviso')}
                          >
                            <AlertCircle className="mr-1 h-4 w-4" /> Aviso
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-100"
                            onClick={() => handleEstadoChange(turno.id, 'ausente_sin_aviso')}
                          >
                            <XOctagon className="mr-1 h-4 w-4" /> Faltó
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={`px-3 py-1 ${ASISTENCIA_ESTADO_CONFIG[turno.estado].classes}`}>
                            {ASISTENCIA_ESTADO_CONFIG[turno.estado].label}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTurnoId(turno.id)
                              setEvolucionText(turno.notas || '')
                            }}
                          >
                            {turno.notas ? (
                              <><FileText className="mr-2 h-4 w-4 text-primary" /> Ver Informe</>
                            ) : (
                              <><PenLine className="mr-2 h-4 w-4 text-primary" /> Cargar Informe</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Caja de Evolución Dropdown */}
                  {selectedTurnoId === turno.id && (
                    <div className="mt-4 ml-20 mr-4 rounded-lg border bg-muted/10 p-4 shadow-inner animate-in slide-in-from-top-2">
                      <label className="text-sm font-semibold text-foreground mb-2 block">
                        {turno.estado === 'presente' ? 'Evolución Clínica de la Sesión' : 'Motivo u Observaciones de la Ausencia'}
                      </label>
                      <Textarea 
                        placeholder="Escribe el informe o lo trabajado con el paciente hoy..."
                        className="min-h-[100px] mb-3 bg-background"
                        value={evolucionText}
                        onChange={(e) => setEvolucionText(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setSelectedTurnoId(null)}>Cancelar</Button>
                        <Button onClick={() => handleSaveEvolucion(turno.id)}>Guardar Registro</Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-muted-foreground italic">
                No hay turnos programados para esta sede en la fecha seleccionada.
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <CheckCircle2 className="h-8 w-8 text-primary opacity-50" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              Haz clic en el calendario para gestionar la asistencia
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
