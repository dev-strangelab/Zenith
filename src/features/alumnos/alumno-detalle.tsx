import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

import { ResumenTab } from './components/tabs/resumen-tab'
import { HistoriaClinicaTab } from './components/tabs/historia-clinica-tab'
import { EvaluacionesTab } from './components/tabs/evaluaciones-tab'
import { ObjetivosTab } from './components/tabs/objetivos-tab'
import { FamiliaresTab } from './components/tabs/familiares-tab'
import { DocumentacionTab } from './components/tabs/documentacion-tab'

import { useEffect, useState } from 'react'
import { AlumnoService } from './services/alumno-service'
import { AlumnoDetailSkeleton } from './components/alumno-skeleton'
import { usePermissions } from '@/hooks/use-permissions'
import type { Alumno } from '@/types/database'

export function AlumnoDetalleFeature({ id }: { id: string }) {
  const [alumno, setAlumno] = useState<Alumno | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { canViewDatosSensiblesAlumno, isProfesional } = usePermissions()

  useEffect(() => {
    let ignore = false

    const loadAlumno = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        const data = await AlumnoService.getAlumnoDetail(id)
        if (!ignore) {
          setAlumno(data ?? null)
        }
      } catch {
        if (!ignore) {
          setError('No se pudo cargar la información del alumno.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }
    loadAlumno()

    return () => {
      ignore = true
    }
  }, [id])

  if (!id) return null

  if (isLoading) {
    return (
      <Main>
        <AlumnoDetailSkeleton />
      </Main>
    )
  }

  if (error || !alumno) {
    return (
      <Main>
        <div className='flex flex-col items-center justify-center h-[50vh] text-center'>
          <h2 className='text-xl font-bold text-destructive mb-2'>Error</h2>
          <p className='text-muted-foreground'>{error || 'Alumno no encontrado'}</p>
        </div>
      </Main>
    )
  }

  // Tabs visibles según rol:
  // Profesional: Resumen, Historia Clínica, Evaluaciones, Objetivos
  // Admin/Coordinador/Director: todas
  const showTabsFull = canViewDatosSensiblesAlumno

  // Cantidad de tabs para el grid
  const tabCount = showTabsFull ? 6 : 4
  const gridCols = tabCount <= 4 ? `grid-cols-4` : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'

  return (
    <>
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mb-4 flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0'>
          <div className='flex items-center space-x-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary'>
              <span className='text-2xl font-bold'>
                {alumno.nombre[0]}{alumno.apellido[0]}
              </span>
            </div>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {alumno.nombre} {alumno.apellido}
              </h2>
              <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                <span>DNI {alumno.dni}</span>
                <span>•</span>
                <Badge variant='outline'>{alumno.obra_social_nombre}</Badge>
                <Badge
                  variant='outline'
                  className='bg-green-100 text-green-800 hover:bg-green-100'
                >
                  {alumno.estado.charAt(0).toUpperCase() + alumno.estado.slice(1)}
                </Badge>
                {isProfesional && (
                  <Badge variant='secondary'>Vista Profesional</Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue='resumen' className='space-y-4'>
          <TabsList className={`grid ${gridCols} mb-4`}>
            <TabsTrigger value='resumen'>Resumen</TabsTrigger>
            <TabsTrigger value='clinica'>Historia Clínica</TabsTrigger>
            <TabsTrigger value='evaluaciones'>Evaluaciones</TabsTrigger>
            <TabsTrigger value='objetivos'>Objetivos</TabsTrigger>
            {showTabsFull && (
              <TabsTrigger value='familiares'>Familiares</TabsTrigger>
            )}
            {showTabsFull && (
              <TabsTrigger value='documentacion'>Documentación</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value='resumen' className='space-y-4'>
            <ResumenTab />
          </TabsContent>

          <TabsContent value='clinica'>
            <HistoriaClinicaTab />
          </TabsContent>

          <TabsContent value='evaluaciones' className='space-y-4'>
            <EvaluacionesTab />
          </TabsContent>

          <TabsContent value='objetivos' className='space-y-4'>
            <ObjetivosTab alumnoId={alumno.id} />
          </TabsContent>

          {showTabsFull && (
            <TabsContent value='familiares' className='space-y-4'>
              <FamiliaresTab />
            </TabsContent>
          )}

          {showTabsFull && (
            <TabsContent value='documentacion' className='space-y-4'>
              <DocumentacionTab alumno={alumno} />
            </TabsContent>
          )}
        </Tabs>
      </Main>
    </>
  )
}
