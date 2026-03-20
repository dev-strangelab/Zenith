import { createFileRoute } from '@tanstack/react-router'
import { MisHonorariosFeature } from '@/features/mis-honorarios'
import { RequireRole } from '@/components/require-role'

function MisHonorariosGuarded() {
  return (
    <RequireRole roles={['profesional', 'director_organizacion', 'director_sede']}>
      <MisHonorariosFeature />
    </RequireRole>
  )
}

export const Route = createFileRoute('/_authenticated/mis-honorarios/')({
  component: MisHonorariosGuarded,
})
