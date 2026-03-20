import { createFileRoute } from '@tanstack/react-router'
import { AgendaFeature } from '@/features/agenda'
import { RequireRole } from '@/components/require-role'

function AgendaGuarded() {
  return (
    <RequireRole roles={['director_organizacion', 'director_sede', 'coordinador', 'profesional', 'administrativo']}>
      <AgendaFeature />
    </RequireRole>
  )
}

export const Route = createFileRoute('/_authenticated/agenda/')({
  component: AgendaGuarded,
})
