import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UploadCloud, FileCheck, Info } from 'lucide-react'

import { OrdenPago } from '@/types/database'
import { formatCurrency, formatPeriod } from '@/lib/utils/finance'
import { useOrganization } from '@/hooks/use-organization'
import { useMemo } from 'react'

const mockOrdenes: (Partial<OrdenPago> & { sede_id: string })[] = [
  // SEDE 1 - NORTE (Histórico y Pendientes)
  {
    id: 'op-01',
    periodo: '2026-03-01',
    monto_neto: 580000.00,
    estado: 'borrador',
    factura_archivo_url: undefined,
    sede_id: '1'
  },
  {
    id: 'op-02',
    periodo: '2026-02-01',
    monto_neto: 550000.00,
    estado: 'pendiente_facturacion',
    factura_archivo_url: undefined,
    sede_id: '1'
  },
  {
    id: 'op-03',
    periodo: '2026-01-01',
    monto_neto: 520000.00,
    estado: 'pago_pendiente',
    factura_archivo_url: 'factura-enero-2026.pdf',
    sede_id: '1'
  },
  {
    id: 'op-04',
    periodo: '2025-12-01',
    monto_neto: 490000.00,
    estado: 'liquidado',
    factura_archivo_url: 'factura-dic-2025.pdf',
    sede_id: '1'
  },
  // SEDE 2 - SUR
  {
    id: 'op-05',
    periodo: '2026-03-01',
    monto_neto: 380000.00,
    estado: 'pendiente_facturacion',
    factura_archivo_url: undefined,
    sede_id: '2'
  },
  {
    id: 'op-06',
    periodo: '2026-02-01',
    monto_neto: 360000.00,
    estado: 'liquidado',
    factura_archivo_url: 'factura-feb-2026-mult.pdf',
    sede_id: '2'
  },
]

export function MisHonorariosTable() {
  const { activeSedeId } = useOrganization()

  const estadoColors = {
    borrador: 'bg-muted text-muted-foreground border-border',
    pendiente_facturacion: 'bg-red-100 text-red-800 border-red-200 animate-pulse',
    pago_pendiente: 'bg-amber-100 text-amber-800 border-amber-200',
    liquidado: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  }

  const estadoLabels = {
    borrador: 'En Cálculo (Borrador)',
    pendiente_facturacion: 'Requiere Factura',
    pago_pendiente: 'En Tesorería (Pago Pendiente)',
    liquidado: 'Cobrado y Liquidado',
  }

  const filteredOrdenes = useMemo(() => {
    return mockOrdenes.filter(o => o.sede_id === activeSedeId)
  }, [activeSedeId])

  return (
    <div className='rounded-xl border bg-card shadow-sm'>
      <div className="p-6 pb-2 border-b">
        <h3 className="text-lg font-semibold leading-none tracking-tight">Mis Órdenes de Pago Generadas</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Sube tu factura fiscal en las liquidaciones que estén marcadas en rojo para habilitar tu cobro.
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/10'>
            <TableHead className="pl-6">Período de Liquidación</TableHead>
            <TableHead>Monto Neto a Cobrar</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right pr-6">Acción Requerida</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrdenes.length > 0 ? (
            filteredOrdenes.map((orden) => (
              <TableRow key={orden.id}>
                <TableCell className='font-medium pl-6 capitalize'>
                  {orden.periodo ? formatPeriod(orden.periodo.substring(0, 7)) : '-'}
                </TableCell>
                <TableCell className="font-mono text-lg font-semibold">
                  {orden.monto_neto !== undefined ? formatCurrency(orden.monto_neto) : '-'}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <Badge variant="outline" className={orden.estado ? estadoColors[orden.estado] : ''}>
                      {orden.estado ? estadoLabels[orden.estado] : '-'}
                    </Badge>
                    {orden.factura_archivo_url && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium italic mt-1">
                        <FileCheck className="w-3 h-3 text-emerald-600" /> Factura AFIP adjunta
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  {orden.estado === 'pendiente_facturacion' ? (
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 group">
                      <UploadCloud className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" /> Subir Factura
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      <Info className="mr-2 h-4 w-4" /> Detalle
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-muted-foreground italic">
                Aún no posees órdenes de pago procesadas para esta sede.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
