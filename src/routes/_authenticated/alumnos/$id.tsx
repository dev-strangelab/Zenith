import { createFileRoute } from '@tanstack/react-router'
import { AlumnoDetalleFeature } from '@/features/alumnos/alumno-detalle'

export const Route = createFileRoute('/_authenticated/alumnos/$id')({
  component: () => {
    const { id } = Route.useParams()
    return <AlumnoDetalleFeature id={id!} />
  },
})
