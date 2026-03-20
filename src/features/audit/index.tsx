import { useState, useEffect, useCallback } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { AuditService } from './services/audit-service'
import type { AuditLog, AuditTabla } from '@/types/database'
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShieldCheck, RefreshCw, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

// ─── Configuración visual por acción ────────────────────────────────────────
const ACCION_CONFIG: Record<string, { label: string; classes: string }> = {
  crear:          { label: 'Crear',          classes: 'bg-green-100 text-green-800 border-green-200' },
  actualizar:     { label: 'Actualizar',     classes: 'bg-blue-100 text-blue-800 border-blue-200' },
  eliminar:       { label: 'Eliminar',       classes: 'bg-red-100 text-red-800 border-red-200' },
  cambiar_estado: { label: 'Cambio Estado',  classes: 'bg-amber-100 text-amber-800 border-amber-200' },
}

const TABLA_LABEL: Record<string, string> = {
  alumnos:       'Alumnos',
  turnos:        'Turnos',
  liquidaciones: 'Liquidaciones',
  ordenes_pago:  'Honorarios',
  usuarios:      'Usuarios',
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function AuditIntegrity() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtroTabla, setFiltroTabla] = useState<AuditTabla | 'all'>('all')

  const cargarLogs = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await AuditService.getLogs(
        filtroTabla !== 'all' ? { tabla: filtroTabla, limit: 100 } : { limit: 100 }
      )
      setLogs(data)
    } finally {
      setIsLoading(false)
    }
  }, [filtroTabla])

  useEffect(() => {
    cargarLogs()
  }, [cargarLogs])

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='bg-muted/10'>
        {/* Encabezado */}
        <div className='mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-primary/10 rounded-lg'>
              <ShieldCheck className='h-6 w-6 text-primary' />
            </div>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>Auditoría de Datos</h1>
              <p className='text-sm text-muted-foreground'>
                Registro de todas las acciones críticas del sistema
              </p>
            </div>
          </div>
          <Button variant='outline' size='sm' onClick={cargarLogs} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Filtros */}
        <div className='mb-4 flex items-center gap-3'>
          <span className='text-sm font-medium text-muted-foreground'>Filtrar por módulo:</span>
          <Select
            value={filtroTabla}
            onValueChange={(v) => setFiltroTabla(v as AuditTabla | 'all')}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Todos los módulos' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los módulos</SelectItem>
              <SelectItem value='alumnos'>Alumnos</SelectItem>
              <SelectItem value='turnos'>Turnos</SelectItem>
              <SelectItem value='liquidaciones'>Liquidaciones</SelectItem>
              <SelectItem value='ordenes_pago'>Honorarios</SelectItem>
              <SelectItem value='usuarios'>Usuarios</SelectItem>
            </SelectContent>
          </Select>
          <span className='text-xs text-muted-foreground ml-auto'>
            {logs.length} registros
          </span>
        </div>

        {/* Tabla */}
        <div className='rounded-xl border bg-background shadow-sm overflow-hidden'>
          <Table>
            <TableHeader>
              <TableRow className='bg-muted/20'>
                <TableHead className='pl-6'>Acción</TableHead>
                <TableHead>Módulo</TableHead>
                <TableHead>ID Registro</TableHead>
                <TableHead>Cambios</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Sede</TableHead>
                <TableHead className='pr-6 text-right'>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-16 text-center text-muted-foreground animate-pulse'>
                    Cargando registros de auditoría...
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className='py-16 text-center'>
                    <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                      <Clock className='h-8 w-8 opacity-30' />
                      <p className='font-medium'>Sin registros todavía</p>
                      <p className='text-sm'>Las acciones sobre alumnos, turnos y liquidaciones aparecerán aquí.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => {
                  const accionCfg = ACCION_CONFIG[log.accion] ?? { label: log.accion, classes: '' }
                  const cambiosText = Object.entries(log.cambios)
                    .map(([campo, { anterior, nuevo }]) =>
                      `${campo}: ${String(anterior) ?? '—'} → ${String(nuevo)}`
                    )
                    .join(' | ')

                  return (
                    <TableRow key={log.id} className='hover:bg-muted/10 transition-colors'>
                      <TableCell className='pl-6'>
                        <Badge variant='outline' className={accionCfg.classes}>
                          {accionCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className='font-medium'>
                        {TABLA_LABEL[log.tabla] ?? log.tabla}
                      </TableCell>
                      <TableCell className='font-mono text-xs text-muted-foreground'>
                        {log.registro_id}
                      </TableCell>
                      <TableCell className='max-w-[280px]'>
                        <p className='truncate text-xs text-muted-foreground' title={cambiosText}>
                          {cambiosText || '—'}
                        </p>
                      </TableCell>
                      <TableCell className='text-sm'>
                        {log.usuario_nombre ?? log.usuario_id}
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary' className='text-xs'>
                          {log.sede_id ? `Sede ${log.sede_id}` : 'Global'}
                        </Badge>
                      </TableCell>
                      <TableCell className='pr-6 text-right text-xs text-muted-foreground whitespace-nowrap'>
                        {formatDistanceToNow(new Date(log.timestamp), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Main>
    </>
  )
}
