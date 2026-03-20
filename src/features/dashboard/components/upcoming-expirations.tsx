import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react'
import { differenceInDays, parseISO, isValid } from 'date-fns'
import { useOrganization } from '@/hooks/use-organization'
import { MOCK_ALUMNOS } from '@/features/alumnos/data/mocks'
import { CUD_DIAS_ALERTA } from '@/lib/constants'

export function UpcomingExpirations() {
  const { activeSedeId } = useOrganization()
  const today = new Date()

  const expirationData = useMemo(() => {
    return MOCK_ALUMNOS
      .filter(a =>
        a.sede_id === activeSedeId &&
        a.cud_vencimiento &&
        a.estado !== 'eliminado' &&
        a.estado !== 'finalizado'
      )
      .flatMap(a => {
        const fecha = parseISO(a.cud_vencimiento!)
        if (!isValid(fecha)) return []
        const dias = differenceInDays(fecha, today)
        if (dias > CUD_DIAS_ALERTA) return []
        return [{
          id: a.id,
          nombre: `${a.nombre} ${a.apellido}`,
          dias_restantes: dias,
        }]
      })
      .sort((a, b) => a.dias_restantes - b.dias_restantes)
  }, [activeSedeId, today])

  return (
    <Card className='col-span-1 lg:col-span-3 shadow-sm border-none bg-background/60 backdrop-blur-md'>
      <CardHeader>
        <CardTitle className='text-lg font-bold'>Próximos Vencimientos CUD</CardTitle>
        <CardDescription>
          Pacientes con CUD próximo a vencer o vencido en esta sede.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {expirationData.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
            <CheckCircle2 className='h-8 w-8 mb-2 text-green-500 opacity-60' />
            <p className='text-sm font-medium'>Sin vencimientos próximos</p>
            <p className='text-xs'>Todos los CUD de esta sede están al día.</p>
          </div>
        ) : (
          <div className='space-y-6'>
            {expirationData.map((item) => {
              const vencido = item.dias_restantes < 0
              const critico = item.dias_restantes >= 0 && item.dias_restantes <= 15

              return (
                <div key={item.id} className='flex items-center justify-between group'>
                  <div className='flex items-center gap-3'>
                    <div className={`p-2 rounded-full ${vencido ? 'bg-destructive/10' : critico ? 'bg-destructive/10' : 'bg-amber-100'}`}>
                      <AlertCircle className={`h-4 w-4 ${vencido || critico ? 'text-destructive' : 'text-amber-600'}`} />
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold leading-none group-hover:text-primary transition-colors'>
                        {item.nombre}
                      </p>
                      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                        <Clock className='h-3 w-3' />
                        <span>
                          {vencido
                            ? `Venció hace ${Math.abs(item.dias_restantes)} días`
                            : `Expira en ${item.dias_restantes} días`}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={vencido || critico ? 'destructive' : 'outline'}
                    className={!vencido && !critico ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                  >
                    {vencido ? 'Vencido' : critico ? 'Crítico' : 'Alerta'}
                  </Badge>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
