import { createFileRoute } from '@tanstack/react-router'
import { Settings } from '@/features/settings'
import { RequireRole } from '@/components/require-role'

function SettingsGuarded() {
  return (
    <RequireRole roles={['director_organizacion', 'director_sede']}>
      <Settings />
    </RequireRole>
  )
}

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsGuarded,
})
