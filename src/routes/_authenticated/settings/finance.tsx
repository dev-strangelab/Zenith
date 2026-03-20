import { createFileRoute } from '@tanstack/react-router'
import SettingsFinance from '@/features/settings/finance'

export const Route = createFileRoute('/_authenticated/settings/finance')({
  component: SettingsFinance,
})
