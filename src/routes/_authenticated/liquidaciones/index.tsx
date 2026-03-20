import { createFileRoute } from '@tanstack/react-router'
import { LiquidacionesFeature } from '@/features/liquidaciones'
import { RequireRole } from '@/components/require-role'

function LiquidacionesGuarded() {
  return (
    <RequireRole roles={['director_organizacion', 'director_sede', 'administrativo']}>
      <LiquidacionesFeature />
    </RequireRole>
  )
}

export const Route = createFileRoute('/_authenticated/liquidaciones/')({
  component: LiquidacionesGuarded,
})
