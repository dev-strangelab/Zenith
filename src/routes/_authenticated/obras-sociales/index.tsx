import { createFileRoute } from '@tanstack/react-router'
import { ObrasSocialesFeature } from '@/features/obras-sociales'

export const Route = createFileRoute('/_authenticated/obras-sociales/')({
  component: ObrasSocialesFeature,
})
