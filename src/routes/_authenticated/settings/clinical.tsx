import { createFileRoute } from '@tanstack/react-router'
import SettingsClinical from '@/features/settings/clinical'

export const Route = createFileRoute('/_authenticated/settings/clinical')({
  component: SettingsClinical,
})
