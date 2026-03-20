import { createFileRoute } from '@tanstack/react-router'
import AuditIntegrity from '@/features/audit'

export const Route = createFileRoute('/_authenticated/audit/integrity')({
  component: AuditIntegrity,
})
