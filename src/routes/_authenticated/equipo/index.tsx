import { createFileRoute } from '@tanstack/react-router'
import { EquipoFeature } from '@/features/equipo'
import { RequireRole } from '@/components/require-role'

function EquipoGuarded() {
  return (
    <RequireRole roles={['director_organizacion', 'director_sede', 'coordinador']}>
      <EquipoFeature />
    </RequireRole>
  )
}

export const Route = createFileRoute('/_authenticated/equipo/')({
  component: EquipoGuarded,
})
