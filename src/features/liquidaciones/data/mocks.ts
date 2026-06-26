import { type Liquidacion } from '@/types/database'

export const MOCK_LIQUIDACIONES: (Partial<Liquidacion> & { sede_id: string })[] = [
  // SEDE 1 - NORTE
  {
    id: 'liq-01',
    periodo: '2026-03',
    obra_social_id: 'OSDE',
    monto_total: 8500200.00,
    estado: 'borrador',
    sede_id: '1'
  },
  {
    id: 'liq-02',
    periodo: '2026-03',
    obra_social_id: 'Swiss Medical',
    monto_total: 4200000.00,
    estado: 'borrador',
    sede_id: '1'
  },
  {
    id: 'liq-03',
    periodo: '2026-02',
    obra_social_id: 'OSDE',
    monto_total: 8100000.00,
    estado: 'presentada',
    sede_id: '1'
  },
  {
    id: 'liq-04',
    periodo: '2026-02',
    obra_social_id: 'Galeno',
    monto_total: 2100000.00,
    estado: 'cobrada',
    sede_id: '1'
  },
  {
    id: 'liq-05',
    periodo: '2026-01',
    obra_social_id: 'OSDE',
    monto_total: 7500000.00,
    estado: 'cobrada',
    sede_id: '1'
  },

  // SEDE 1 - HISTÓRICO
  {
    id: 'liq-h1', periodo: '2025-10', obra_social_id: 'OSDE',          monto_total: 11200000, estado: 'cobrada',    sede_id: '1',
    organizacion_id: 'org-1', fecha_emision: '2025-10-31', fecha_presentacion: '2025-10-31', created_at: '2025-10-01T00:00:00Z', updated_at: '2025-10-31T00:00:00Z',
  },
  {
    id: 'liq-h2', periodo: '2025-10', obra_social_id: 'Swiss Medical',  monto_total:  2800000, estado: 'cobrada',    sede_id: '1',
    organizacion_id: 'org-1', fecha_emision: '2025-10-31', fecha_presentacion: '2025-10-31', created_at: '2025-10-01T00:00:00Z', updated_at: '2025-10-31T00:00:00Z',
  },
  {
    id: 'liq-h3', periodo: '2025-11', obra_social_id: 'OSDE',          monto_total: 12100000, estado: 'cobrada',    sede_id: '1',
    organizacion_id: 'org-1', fecha_emision: '2025-11-30', fecha_presentacion: '2025-11-30', created_at: '2025-11-01T00:00:00Z', updated_at: '2025-11-30T00:00:00Z',
  },
  {
    id: 'liq-h4', periodo: '2025-11', obra_social_id: 'Galeno',         monto_total:  1800000, estado: 'cobrada',    sede_id: '1',
    organizacion_id: 'org-1', fecha_emision: '2025-11-30', fecha_presentacion: '2025-11-30', created_at: '2025-11-01T00:00:00Z', updated_at: '2025-11-30T00:00:00Z',
  },
  {
    id: 'liq-h5', periodo: '2025-12', obra_social_id: 'OSDE',          monto_total: 13200000, estado: 'cobrada',    sede_id: '1',
    organizacion_id: 'org-1', fecha_emision: '2025-12-31', fecha_presentacion: '2025-12-31', created_at: '2025-12-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z',
  },
  {
    id: 'liq-h6', periodo: '2025-12', obra_social_id: 'Swiss Medical',  monto_total:  2400000, estado: 'cobrada',    sede_id: '1',
    organizacion_id: 'org-1', fecha_emision: '2025-12-31', fecha_presentacion: '2025-12-31', created_at: '2025-12-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z',
  },

  // SEDE 2 - HISTÓRICO
  {
    id: 'liq-h7', periodo: '2025-10', obra_social_id: 'Swiss Medical',  monto_total:  3900000, estado: 'cobrada',    sede_id: '2',
    organizacion_id: 'org-1', fecha_emision: '2025-10-31', fecha_presentacion: '2025-10-31', created_at: '2025-10-01T00:00:00Z', updated_at: '2025-10-31T00:00:00Z',
  },
  {
    id: 'liq-h8', periodo: '2025-11', obra_social_id: 'Swiss Medical',  monto_total:  4200000, estado: 'cobrada',    sede_id: '2',
    organizacion_id: 'org-1', fecha_emision: '2025-11-30', fecha_presentacion: '2025-11-30', created_at: '2025-11-01T00:00:00Z', updated_at: '2025-11-30T00:00:00Z',
  },
  {
    id: 'liq-h9', periodo: '2025-12', obra_social_id: 'Swiss Medical',  monto_total:  4700000, estado: 'cobrada',    sede_id: '2',
    organizacion_id: 'org-1', fecha_emision: '2025-12-31', fecha_presentacion: '2025-12-31', created_at: '2025-12-01T00:00:00Z', updated_at: '2025-12-31T00:00:00Z',
  },

  // SEDE 2 - SUR
  {
    id: 'liq-06',
    periodo: '2026-03',
    obra_social_id: 'Swiss Medical',
    monto_total: 2200000.00,
    estado: 'borrador',
    sede_id: '2'
  },
  {
    id: 'liq-07',
    periodo: '2026-03',
    obra_social_id: 'IOMA',
    monto_total: 1800000.00,
    estado: 'borrador',
    sede_id: '2'
  },
  {
    id: 'liq-08',
    periodo: '2026-02',
    obra_social_id: 'Swiss Medical',
    monto_total: 2150000.00,
    estado: 'presentada',
    sede_id: '2'
  },
  {
    id: 'liq-09',
    periodo: '2026-01',
    obra_social_id: 'Swiss Medical',
    monto_total: 2050000.00,
    estado: 'cobrada',
    sede_id: '2'
  },
]
