import { createFileRoute } from '@tanstack/react-router'
import PreinscripcionFeature from '@/features/formularios-publicos/preinscripcion'

export const Route = createFileRoute('/preinscripcion')({
  component: PreinscripcionFeature,
})
