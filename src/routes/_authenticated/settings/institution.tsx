import { createFileRoute } from '@tanstack/react-router'
import SettingsInstitution from '@/features/settings/institution'

export const Route = createFileRoute('/_authenticated/settings/institution')({
  component: SettingsInstitution,
})
