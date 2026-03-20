import { createFileRoute } from '@tanstack/react-router'
import { AlumnosFeature } from '@/features/alumnos'

export const Route = createFileRoute('/_authenticated/alumnos/')({
  component: AlumnosFeature,
})
