import { createFileRoute } from '@tanstack/react-router'
import { BuzonFeature } from '@/features/buzon'

export const Route = createFileRoute('/_authenticated/buzon/')({
  component: BuzonFeature,
})
