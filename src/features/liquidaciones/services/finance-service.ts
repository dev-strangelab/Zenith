import type { OrdenPago, Liquidacion } from '@/types/database'
import { MOCK_LIQUIDACIONES } from '../data/mocks'
import { AuditService } from '@/features/audit/services/audit-service'
import { useAuthStore } from '@/stores/auth-store'

let liquidacionesMock = [...MOCK_LIQUIDACIONES] as Liquidacion[]

function currentUserId(): string {
  return useAuthStore.getState().auth.user?.accountNo ?? 'sistema'
}

function currentSedeId(): string | null {
  return useAuthStore.getState().sede.activeSedeId
}

const MOCK_ORDENES_PAGO: OrdenPago[] = [
  {
    id: 'op-01',
    profesional_id: 'prof-1',
    profesional_nombre: 'Lic. Mariana Costa',
    organizacion_id: 'org-1',
    sede_id: '1',
    periodo: '2026-03-01',
    monto_bruto: 580000,
    ajustes: 0,
    monto_neto: 493000,
    estado: 'pago_pendiente',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'op-02',
    profesional_id: 'prof-2',
    profesional_nombre: 'Lic. Laura Gatti',
    organizacion_id: 'org-1',
    sede_id: '1',
    periodo: '2026-03-01',
    monto_bruto: 720000,
    ajustes: 0,
    monto_neto: 612000,
    estado: 'pendiente_facturacion',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'op-03',
    profesional_id: 'prof-3',
    profesional_nombre: 'Lic. Pablo Cárdenas',
    organizacion_id: 'org-1',
    sede_id: '1',
    periodo: '2026-02-01',
    monto_bruto: 450000,
    ajustes: 0,
    monto_neto: 382500,
    estado: 'liquidado',
    updated_at: '2026-02-28T00:00:00Z',
  },
  {
    id: 'op-04',
    profesional_id: 'prof-4',
    profesional_nombre: 'Lic. Roberto Sánchez',
    organizacion_id: 'org-1',
    sede_id: '2',
    periodo: '2026-03-01',
    monto_bruto: 610000,
    ajustes: 0,
    monto_neto: 518500,
    estado: 'pago_pendiente',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: 'op-05',
    profesional_id: 'prof-5',
    profesional_nombre: 'Lic. Carla Giménez',
    organizacion_id: 'org-1',
    sede_id: '2',
    periodo: '2026-03-01',
    monto_bruto: 390000,
    ajustes: 0,
    monto_neto: 331500,
    estado: 'pendiente_facturacion',
    updated_at: '2026-03-01T00:00:00Z',
  },
]

const ordenesMock = [...MOCK_ORDENES_PAGO]

export const FinanceService = {
  getLiquidaciones: async (sedeId: string): Promise<Liquidacion[]> => {
    await new Promise(r => setTimeout(r, 300))
    return liquidacionesMock.filter(l => l.sede_id === sedeId && l.estado !== 'anulada')
  },

  getOrdenesPago: async (sedeId: string, profesionalId?: string): Promise<OrdenPago[]> => {
    await new Promise(r => setTimeout(r, 300))
    let ordenes = ordenesMock.filter(o => o.sede_id === sedeId)
    if (profesionalId) {
      ordenes = ordenes.filter(o => o.profesional_id === profesionalId)
    }
    return ordenes
  },

  updateLiquidacionEstado: async (
    id: string,
    nuevoEstado: Liquidacion['estado']
  ): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 300))
    const anterior = liquidacionesMock.find(l => l.id === id)
    liquidacionesMock = liquidacionesMock.map(l =>
      l.id === id
        ? { ...l, estado: nuevoEstado, updated_at: new Date().toISOString() }
        : l
    )

    await AuditService.log({
      tabla: 'liquidaciones',
      registro_id: id,
      accion: 'cambiar_estado',
      cambios: { estado: { anterior: anterior?.estado ?? 'borrador', nuevo: nuevoEstado } },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },

  /**
   * Soft delete — marca la liquidación como 'anulada'.
   * No se borra del array y no aparece en getLiquidaciones.
   */
  anularLiquidacion: async (id: string, motivo: string): Promise<{ success: boolean }> => {
    await new Promise(r => setTimeout(r, 300))
    const anterior = liquidacionesMock.find(l => l.id === id)
    liquidacionesMock = liquidacionesMock.map(l =>
      l.id === id
        ? {
            ...l,
            estado: 'anulada' as const,
            notas: motivo,
            updated_at: new Date().toISOString(),
          }
        : l
    )

    await AuditService.log({
      tabla: 'liquidaciones',
      registro_id: id,
      accion: 'eliminar',
      cambios: {
        estado: { anterior: anterior?.estado ?? 'borrador', nuevo: 'anulada' },
        motivo: { anterior: null, nuevo: motivo },
      },
      usuario_id: currentUserId(),
      sede_id: currentSedeId(),
    })

    return { success: true }
  },
}
