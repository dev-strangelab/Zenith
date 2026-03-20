import { createFileRoute } from '@tanstack/react-router'
import PostulacionFeature from '@/features/formularios-publicos/postulacion'

export const Route = createFileRoute('/postulacion')({
  component: PostulacionFeature,
})
