import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UploadCloud, FileText, RefreshCw, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useRef } from 'react'
import type { Alumno } from '@/types/database'
import { isCudVencido, isCudPorVencer } from '../../utils/cud-logic'

interface DocumentacionTabProps {
  alumno: Alumno
}

interface DocMock {
  id: string
  nombre: string
  categoria: string
  fecha: string
  estado?: 'vigente' | 'vencida' | 'pendiente_renovacion'
}

const DOCS_INICIALES: DocMock[] = [
  { id: 'doc-1', nombre: 'CUD_Renovado_2025.pdf',           categoria: 'Legales',   fecha: '10/01/2025', estado: 'vigente' },
  { id: 'doc-2', nombre: 'DNI_FrenteYReverso.pdf',          categoria: 'Identidad', fecha: '15/12/2024' },
  { id: 'doc-3', nombre: 'Prescripcion_Medica_OSDE.pdf',    categoria: 'Médicos',   fecha: '05/03/2024', estado: 'vencida' },
]

export function DocumentacionTab({ alumno }: DocumentacionTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [docs, setDocs] = useState<DocMock[]>(DOCS_INICIALES)

  const cudVencido = isCudVencido(alumno.cud_vencimiento)
  const cudPorVencer = isCudPorVencer(alumno.cud_vencimiento)
  const mostrarAlertaCud = alumno.cud_vencimiento && (cudVencido || cudPorVencer)
  const renovacionSolicitada = docs.some(d => d.estado === 'pendiente_renovacion')

  const handleUploadClick = () => fileInputRef.current?.click()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: `Subiendo ${file.name}...`,
      success: 'Archivo subido y verificado con éxito',
      error: 'Error al subir el archivo',
    })
  }

  const handleSolicitarRenovacion = () => {
    setDocs(prev => prev.map(d =>
      d.categoria === 'Legales' ? { ...d, estado: 'pendiente_renovacion' as const } : d
    ))
    toast.success('Renovación CUD solicitada', {
      description: 'Se ha notificado a la familia para gestionar el trámite.',
    })
  }

  return (
    <Card className='border-none shadow-none'>
      <CardHeader className='flex flex-row items-center justify-between px-0 pt-0'>
        <div>
          <CardTitle className='text-lg font-bold'>Repositorio Documental</CardTitle>
          <CardDescription className='text-xs'>
            Toda la papelería del paciente en formato digital.
          </CardDescription>
        </div>
        <input
          type='file'
          ref={fileInputRef}
          className='hidden'
          onChange={handleFileChange}
        />
        <Button size='sm' onClick={handleUploadClick} className='bg-primary shadow-sm h-8'>
          <UploadCloud className='mr-2 h-4 w-4' /> Subir Archivo
        </Button>
      </CardHeader>

      {/* Alerta de renovación CUD */}
      {mostrarAlertaCud && !renovacionSolicitada && (
        <div className={`mb-4 flex items-center justify-between gap-3 rounded-lg border p-3 ${cudVencido ? 'border-destructive/30 bg-destructive/5' : 'border-amber-200 bg-amber-50'}`}>
          <div className='flex items-center gap-2'>
            <AlertTriangle className={`h-4 w-4 shrink-0 ${cudVencido ? 'text-destructive' : 'text-amber-600'}`} />
            <p className={`text-xs font-medium ${cudVencido ? 'text-destructive' : 'text-amber-800'}`}>
              {cudVencido
                ? `CUD vencido el ${alumno.cud_vencimiento}. Requiere renovación urgente.`
                : `CUD próximo a vencer (${alumno.cud_vencimiento}). Se recomienda iniciar la renovación.`}
            </p>
          </div>
          <Button
            size='sm'
            variant='outline'
            className={`h-7 text-xs shrink-0 ${cudVencido ? 'border-destructive text-destructive hover:bg-destructive/10' : 'border-amber-400 text-amber-700 hover:bg-amber-100'}`}
            onClick={handleSolicitarRenovacion}
          >
            <RefreshCw className='mr-1 h-3 w-3' /> Solicitar Renovación
          </Button>
        </div>
      )}

      {renovacionSolicitada && (
        <div className='mb-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3'>
          <RefreshCw className='h-4 w-4 text-blue-600' />
          <p className='text-xs font-medium text-blue-800'>
            Renovación CUD en trámite — familia notificada.
          </p>
        </div>
      )}

      <CardContent className='px-0'>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Fecha de Subida</TableHead>
                <TableHead className='text-right'>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className='font-medium flex items-center gap-2'>
                    <FileText className={`h-4 w-4 ${doc.estado === 'vencida' ? 'text-red-500' : doc.estado === 'pendiente_renovacion' ? 'text-amber-500' : 'text-primary'}`} />
                    {doc.nombre}
                  </TableCell>
                  <TableCell>
                    {doc.estado === 'vencida' ? (
                      <Badge variant='outline' className='text-red-600 border-red-200 bg-red-50'>Vencida</Badge>
                    ) : doc.estado === 'pendiente_renovacion' ? (
                      <Badge variant='outline' className='text-amber-600 border-amber-200 bg-amber-50'>Renovación Pendiente</Badge>
                    ) : (
                      <Badge variant='secondary'>{doc.categoria}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{doc.fecha}</TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='sm'>Descargar</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
