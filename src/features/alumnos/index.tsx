import { useEffect, useState, useCallback } from 'react'
import { Plus, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AlumnosTable } from './components/alumnos-table'
import { AlumnoService } from './services/alumno-service'
import { AlumnosTableSkeleton } from './components/alumnos-table-skeleton'
import type { Alumno } from '@/types/database'
import { useOrganization } from '@/hooks/use-organization'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { AlumnoForm } from './components/alumno-form'

export function AlumnosFeature() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingSede, setIsChangingSede] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para modales
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAlumno, setEditingAlumno] = useState<Alumno | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [alumnoToDelete, setAlumnoToDelete] = useState<Alumno | null>(null)
  
  const { activeSedeId } = useOrganization()

  const loadAlumnos = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsLoading(true)
      } else {
        setIsChangingSede(true)
      }
      
      const data = await AlumnoService.getAlumnos(activeSedeId || undefined)
      setAlumnos(data)
      setError(null)
    } catch (err) {
      setError('Ocurrió un error al cargar la lista de alumnos.')
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setIsLoading(false)
      setIsChangingSede(false)
    }
  }, [activeSedeId])

  useEffect(() => {
    loadAlumnos(true)
  }, [loadAlumnos])

  const handleCreateNew = () => {
    setEditingAlumno(null)
    setIsDialogOpen(true)
  }

  const handleEdit = (alumno: Alumno) => {
    setEditingAlumno(alumno)
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (alumno: Alumno) => {
    setAlumnoToDelete(alumno)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!alumnoToDelete) return
    
    try {
      // Usamos el servicio para simular la eliminación
      await AlumnoService.updateAlumno(alumnoToDelete.id, { estado: 'finalizado' })
      toast.success(`Alumno ${alumnoToDelete.nombre} eliminado (marcado como finalizado).`)
      loadAlumnos() // Refrescamos la lista
    } catch (err) {
      toast.error('No se pudo eliminar al alumno.')
    } finally {
      setIsDeleteDialogOpen(false)
      setAlumnoToDelete(null)
    }
  }

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-3xl font-bold tracking-tight'>
              Gestión de Alumnos
            </h2>
            <p className='text-muted-foreground mt-1'>
              Administra los legajos y el estado de la documentación de tus
              pacientes desde un panel centralizado.
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button className='shadow-sm' onClick={handleCreateNew}>
              <Plus className='mr-2 h-4 w-4' /> Nuevo Alumno
            </Button>
          </div>
        </div>

        {error ? (
          <div className='flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-destructive/5 text-destructive border-destructive/20'>
            <AlertCircle className='h-12 w-12 mb-4 opacity-50' />
            <h3 className='text-lg font-bold'>Error de Conexión</h3>
            <p className='text-sm opacity-80 mb-4'>{error}</p>
            <Button variant='outline' onClick={() => loadAlumnos(true)}>
              Reintentar
            </Button>
          </div>
        ) : (
          <div className='flex-1 lg:flex-row lg:space-y-0 lg:space-x-12 animate-in fade-in duration-500'>
            {isLoading || isChangingSede ? (
              <AlumnosTableSkeleton />
            ) : (
              <AlumnosTable 
                alumnos={alumnos} 
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            )}
          </div>
        )}

        {/* Modal de Formulario (Crear/Editar) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className='sm:max-w-[600px]'>
            <DialogHeader>
              <DialogTitle>
                {editingAlumno ? 'Editar Alumno' : 'Registrar Nuevo Alumno'}
              </DialogTitle>
              <DialogDescription>
                {editingAlumno 
                  ? 'Modifique los datos del paciente según sea necesario.' 
                  : 'Complete los datos básicos del paciente. Asegúrese de que el DNI sea correcto.'}
              </DialogDescription>
            </DialogHeader>
            <AlumnoForm 
              initialData={editingAlumno || undefined}
              onSuccess={() => {
                setIsDialogOpen(false)
                loadAlumnos()
              }} 
              onCancel={() => setIsDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>

        {/* Alerta de Confirmación de Eliminación */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está absolutamente seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción marcará al paciente como <strong>Finalizado</strong>. 
                Los datos permanecerán en el sistema pero ya no aparecerán como activos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmDelete}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Sí, eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Main>
    </>
  )
}
