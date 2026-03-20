import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Alumno } from '@/types/database'
import { isCudVencido, isCudPorVencer } from '../utils/cud-logic'
import { getPageNumbers } from '@/lib/utils'

import { MoreHorizontal, Edit, Trash, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const PAGE_SIZE = 10

interface AlumnosTableProps {
  alumnos: Alumno[]
  onEdit: (alumno: Alumno) => void
  onDelete: (alumno: Alumno) => void
}

export function AlumnosTable({ alumnos, onEdit, onDelete }: AlumnosTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(alumnos.length / PAGE_SIZE))
  const paginated = alumnos.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  return (
    <div className='space-y-3'>
      <div className='rounded-md border bg-background shadow-sm'>
        <Table>
          <TableHeader className='bg-muted/30'>
            <TableRow>
              <TableHead className='font-bold text-foreground'>Nombre y Apellido</TableHead>
              <TableHead className='font-bold text-foreground'>DNI</TableHead>
              <TableHead className='font-bold text-foreground'>Obra Social</TableHead>
              <TableHead className='font-bold text-foreground text-center'>Venc. CUD</TableHead>
              <TableHead className='font-bold text-foreground text-center'>Estado</TableHead>
              <TableHead className='text-right font-bold text-foreground'>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center text-muted-foreground italic'>
                  No se encontraron alumnos registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((alumno) => (
                <TableRow key={alumno.id} className='hover:bg-muted/10 transition-colors'>
                  <TableCell className='font-medium text-foreground py-4'>
                    {alumno.nombre} {alumno.apellido}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{alumno.dni}</TableCell>
                  <TableCell>
                    <Badge variant='outline' className='font-normal border-primary/20 bg-primary/5 text-primary'>
                      {alumno.obra_social_nombre}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-center'>
                    {alumno.cud_vencimiento ? (
                      isCudVencido(alumno.cud_vencimiento) ? (
                        <Badge variant='destructive' className='animate-pulse'>
                          Vencido ({alumno.cud_vencimiento})
                        </Badge>
                      ) : isCudPorVencer(alumno.cud_vencimiento) ? (
                        <Badge variant='outline' className='bg-amber-50 text-amber-700 border-amber-200'>
                          Próximo Vencimiento ({alumno.cud_vencimiento})
                        </Badge>
                      ) : (
                        <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
                          Vigente ({alumno.cud_vencimiento})
                        </Badge>
                      )
                    ) : (
                      <span className='text-muted-foreground italic text-xs'>Sin registrar</span>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Badge
                      variant={alumno.estado === 'activo' ? 'default' : 'secondary'}
                      className={
                        alumno.estado === 'activo'
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none'
                          : alumno.estado === 'pausado'
                          ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 border-none'
                          : ''
                      }
                    >
                      {alumno.estado.charAt(0).toUpperCase() + alumno.estado.slice(1).replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className='text-right'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>Abrir menú</span>
                          <MoreHorizontal className='h-4 w-4' />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end' className='w-[160px]'>
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to='/alumnos/$id' params={{ id: alumno.id }} className='cursor-pointer'>
                            <Eye className='mr-2 h-4 w-4' />
                            Ver ficha
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(alumno)} className='cursor-pointer'>
                          <Edit className='mr-2 h-4 w-4' />
                          Editar datos
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDelete(alumno)}
                          className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5'
                        >
                          <Trash className='mr-2 h-4 w-4' />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className='flex items-center justify-between px-1'>
          <p className='text-xs text-muted-foreground'>
            Mostrando {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, alumnos.length)} de {alumnos.length}
          </p>
          <div className='flex items-center gap-1'>
            <Button
              variant='outline'
              size='icon'
              className='h-7 w-7'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className='h-3 w-3' />
            </Button>
            {pageNumbers.map((p, i) =>
              p === '...' ? (
                <span key={`dots-${i}`} className='px-2 text-xs text-muted-foreground'>…</span>
              ) : (
                <Button
                  key={p}
                  variant={p === currentPage ? 'default' : 'outline'}
                  size='icon'
                  className='h-7 w-7 text-xs'
                  onClick={() => setCurrentPage(p as number)}
                >
                  {p}
                </Button>
              )
            )}
            <Button
              variant='outline'
              size='icon'
              className='h-7 w-7'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight className='h-3 w-3' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
