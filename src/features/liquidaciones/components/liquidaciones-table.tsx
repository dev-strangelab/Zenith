import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DownloadCloud, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatCurrency, formatPeriod } from '@/lib/utils/finance'
import { getPageNumbers } from '@/lib/utils'
import { useOrganization } from '@/hooks/use-organization'
import { FinanceService } from '../services/finance-service'
import type { Liquidacion, LiquidacionLineItem } from '@/types/database'

const PAGE_SIZE = 8

const ESTADO_COLORS: Record<NonNullable<Liquidacion['estado']>, string> = {
  borrador:   'bg-gray-100 text-gray-800 border-gray-200',
  generada:   'bg-blue-100 text-blue-800 border-blue-200',
  presentada: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  aprobada:   'bg-green-100 text-green-800 border-green-200',
  cobrada:    'bg-emerald-100 text-emerald-800 border-emerald-200',
  rechazada:  'bg-red-100 text-red-800 border-red-200',
  anulada:    'bg-gray-100 text-gray-500 border-gray-200 line-through',
}

const ESTADO_LABEL: Record<NonNullable<Liquidacion['estado']>, string> = {
  borrador:   'Borrador',
  generada:   'Generada',
  presentada: 'Presentada',
  aprobada:   'Aprobada',
  cobrada:    'Cobrada',
  rechazada:  'Rechazada',
  anulada:    'Anulada',
}

// Mock line items para detalle
const MOCK_LINE_ITEMS: LiquidacionLineItem[] = [
  { id: 'li-1', liquidacion_id: 'liq-01', alumno_id: 'alu-01', alumno_nombre: 'Mateo Rossi',        prestacion_codigo: 'AT-001', prestacion_descripcion: 'Sesión de Fonoaudiología',       sesiones: 8,  valor_sesion: 120000, subtotal: 960000  },
  { id: 'li-2', liquidacion_id: 'liq-01', alumno_id: 'alu-02', alumno_nombre: 'Sofía Ledesma',      prestacion_codigo: 'AT-002', prestacion_descripcion: 'Sesión de Psicología',            sesiones: 6,  valor_sesion: 110000, subtotal: 660000  },
  { id: 'li-3', liquidacion_id: 'liq-01', alumno_id: 'alu-03', alumno_nombre: 'Valentina Gómez',    prestacion_codigo: 'AT-003', prestacion_descripcion: 'Sesión de Terapia Ocupacional',   sesiones: 10, valor_sesion: 115000, subtotal: 1150000 },
  { id: 'li-4', liquidacion_id: 'liq-02', alumno_id: 'alu-04', alumno_nombre: 'Tomás Herrera',      prestacion_codigo: 'AT-001', prestacion_descripcion: 'Sesión de Fonoaudiología',       sesiones: 4,  valor_sesion: 120000, subtotal: 480000  },
  { id: 'li-5', liquidacion_id: 'liq-03', alumno_id: 'alu-01', alumno_nombre: 'Mateo Rossi',        prestacion_codigo: 'AT-001', prestacion_descripcion: 'Sesión de Fonoaudiología',       sesiones: 8,  valor_sesion: 115000, subtotal: 920000  },
  { id: 'li-6', liquidacion_id: 'liq-03', alumno_id: 'alu-02', alumno_nombre: 'Sofía Ledesma',      prestacion_codigo: 'AT-002', prestacion_descripcion: 'Sesión de Psicología',            sesiones: 6,  valor_sesion: 105000, subtotal: 630000  },
  { id: 'li-7', liquidacion_id: 'liq-06', alumno_id: 'alu-06', alumno_nombre: 'Emma Navarro',       prestacion_codigo: 'AT-002', prestacion_descripcion: 'Sesión de Psicología',            sesiones: 5,  valor_sesion: 110000, subtotal: 550000  },
  { id: 'li-8', liquidacion_id: 'liq-06', alumno_id: 'alu-08', alumno_nombre: 'Martina Silva',      prestacion_codigo: 'AT-003', prestacion_descripcion: 'Sesión de Terapia Ocupacional',   sesiones: 7,  valor_sesion: 115000, subtotal: 805000  },
]

export function LiquidacionesTable() {
  const { activeSedeId } = useOrganization()
  const [liquidaciones, setLiquidaciones] = useState<Liquidacion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [detailLiq, setDetailLiq] = useState<Liquidacion | null>(null)

  const loadData = useCallback(async () => {
    if (!activeSedeId) return
    setIsLoading(true)
    const data = await FinanceService.getLiquidaciones(activeSedeId)
    setLiquidaciones(data)
    setCurrentPage(1)
    setIsLoading(false)
  }, [activeSedeId])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadData() }, [loadData])

  const totalPages = Math.max(1, Math.ceil(liquidaciones.length / PAGE_SIZE))
  const paginated = liquidaciones.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const lineItems = detailLiq
    ? MOCK_LINE_ITEMS.filter(li => li.liquidacion_id === detailLiq.id)
    : []

  if (isLoading) {
    return (
      <div className='space-y-2 animate-pulse'>
        {[1,2,3].map(i => <div key={i} className='h-12 bg-muted rounded-md' />)}
      </div>
    )
  }

  return (
    <>
      <div className='space-y-3'>
        <div className='rounded-md border bg-background shadow-sm'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/30'>
                <TableHead>Período</TableHead>
                <TableHead>Obra Social</TableHead>
                <TableHead className='text-right'>Monto Estimado</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className='text-center'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length > 0 ? (
                paginated.map((liq) => (
                  <TableRow key={liq.id} className='hover:bg-muted/10 transition-colors'>
                    <TableCell className='font-medium capitalize'>
                      {liq.periodo ? formatPeriod(liq.periodo) : '-'}
                    </TableCell>
                    <TableCell>{liq.obra_social_id}</TableCell>
                    <TableCell className='text-right font-mono font-bold text-primary'>
                      {liq.monto_total !== undefined ? formatCurrency(liq.monto_total) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant='outline' className={liq.estado ? ESTADO_COLORS[liq.estado] : ''}>
                        {liq.estado ? ESTADO_LABEL[liq.estado] : '-'}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-center'>
                      <div className='flex justify-center gap-2'>
                        <Button
                          variant='ghost'
                          size='icon'
                          title='Ver Detalle'
                          onClick={() => setDetailLiq(liq)}
                        >
                          <Info className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='icon' title='Descargar PDF Facturación'>
                          <DownloadCloud className='h-4 w-4 text-primary' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className='text-center py-12 text-muted-foreground italic'>
                    No hay liquidaciones generadas para esta sede en el período actual.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className='flex items-center justify-between px-1'>
            <p className='text-xs text-muted-foreground'>
              Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, liquidaciones.length)} de {liquidaciones.length}
            </p>
            <div className='flex items-center gap-1'>
              <Button variant='outline' size='icon' className='h-7 w-7' disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                <ChevronLeft className='h-3 w-3' />
              </Button>
              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className='px-2 text-xs text-muted-foreground'>…</span>
                ) : (
                  <Button key={p} variant={p === currentPage ? 'default' : 'outline'} size='icon' className='h-7 w-7 text-xs' onClick={() => setCurrentPage(p as number)}>
                    {p}
                  </Button>
                )
              )}
              <Button variant='outline' size='icon' className='h-7 w-7' disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                <ChevronRight className='h-3 w-3' />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de detalle de liquidación */}
      <Dialog open={!!detailLiq} onOpenChange={(open) => !open && setDetailLiq(null)}>
        <DialogContent className='sm:max-w-[640px]'>
          <DialogHeader>
            <DialogTitle>
              Detalle: {detailLiq?.obra_social_id} — {detailLiq?.periodo ? formatPeriod(detailLiq.periodo) : ''}
            </DialogTitle>
            <DialogDescription>
              Líneas de prestación incluidas en esta liquidación.
            </DialogDescription>
          </DialogHeader>

          {lineItems.length === 0 ? (
            <p className='text-sm text-muted-foreground text-center py-6 italic'>
              Sin líneas de detalle registradas para esta liquidación.
            </p>
          ) : (
            <div className='rounded-md border overflow-hidden'>
              <Table>
                <TableHeader className='bg-muted/30'>
                  <TableRow>
                    <TableHead>Alumno</TableHead>
                    <TableHead>Prestación</TableHead>
                    <TableHead className='text-center'>Sesiones</TableHead>
                    <TableHead className='text-right'>Valor</TableHead>
                    <TableHead className='text-right'>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map(li => (
                    <TableRow key={li.id}>
                      <TableCell className='text-sm font-medium'>{li.alumno_nombre}</TableCell>
                      <TableCell className='text-xs text-muted-foreground'>
                        <span className='font-mono text-[10px] bg-muted px-1 rounded mr-1'>{li.prestacion_codigo}</span>
                        {li.prestacion_descripcion}
                      </TableCell>
                      <TableCell className='text-center text-sm'>{li.sesiones}</TableCell>
                      <TableCell className='text-right text-sm font-mono'>{formatCurrency(li.valor_sesion)}</TableCell>
                      <TableCell className='text-right text-sm font-mono font-bold text-primary'>{formatCurrency(li.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className='bg-muted/20 font-bold'>
                    <TableCell colSpan={4} className='text-right text-sm'>Total</TableCell>
                    <TableCell className='text-right text-sm font-mono text-primary'>
                      {formatCurrency(lineItems.reduce((acc, li) => acc + li.subtotal, 0))}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
