export interface DashboardStats {
  total_alumnos: number;
  mensajeria_urgente: number;
  facturacion_mensual: number;
  asistencia_porcentaje: number;
  nuevos_mes?: number;
  mes_actual?: string;
}

export interface AssistanceData {
  estado: string;
  cantidad: number;
  fill: string;
}

export interface FinancialComparison {
  mes: string;
  ingresos: number;
  honorarios: number;
}

export interface DashboardData {
  stats: DashboardStats;
  sessions: AssistanceData[];
  financial: FinancialComparison[];
  vencimientos: Record<string, unknown>[];
}

export const MOCK_DASHBOARD_DATA: Record<string, DashboardData> = {
  '1': {
    stats: {
      total_alumnos: 84,
      mensajeria_urgente: 3,
      facturacion_mensual: 14500500.00,
      asistencia_porcentaje: 93,
    },
    sessions: [
      { estado: 'Presente', cantidad: 850, fill: 'hsl(var(--primary))' },
      { estado: 'Ausente c/ Aviso', cantidad: 45, fill: 'hsl(var(--accent))' },
      { estado: 'Ausente s/ Aviso', cantidad: 12, fill: 'hsl(var(--destructive))' },
      { estado: 'Programado', cantidad: 120, fill: 'hsl(var(--muted))' },
    ],
    financial: [
      { mes: 'Oct', ingresos: 12500000, honorarios: 8500000 },
      { mes: 'Nov', ingresos: 13200000, honorarios: 9000000 },
      { mes: 'Dic', ingresos: 13500000, honorarios: 9300000 },
      { mes: 'Ene', ingresos: 12000000, honorarios: 8900000 },
      { mes: 'Feb', ingresos: 13800000, honorarios: 9500000 },
      { mes: 'Mar', ingresos: 14500500, honorarios: 10100000 },
    ],
    vencimientos: [
      { id: 'alu-02', nombre: 'Sofía Ledesma', dias_restantes: 45, estado: 'alerta' },
      { id: 'alu-03', nombre: 'Valentina Gómez', dias_restantes: 0, estado: 'critico' },
      { id: 'alu-04', nombre: 'Tomás Herrera', dias_restantes: 156, estado: 'ok' },
    ]
  },
  '2': {
    stats: {
      total_alumnos: 32,
      mensajeria_urgente: 1,
      facturacion_mensual: 5800200.00,
      asistencia_porcentaje: 88,
    },
    sessions: [
      { estado: 'Presente', cantidad: 310, fill: 'hsl(var(--primary))' },
      { estado: 'Ausente c/ Aviso', cantidad: 35, fill: 'hsl(var(--accent))' },
      { estado: 'Ausente s/ Aviso', cantidad: 5, fill: 'hsl(var(--destructive))' },
      { estado: 'Programado', cantidad: 50, fill: 'hsl(var(--muted))' },
    ],
    financial: [
      { mes: 'Oct', ingresos: 4800000, honorarios: 3500000 },
      { mes: 'Nov', ingresos: 5100000, honorarios: 3700000 },
      { mes: 'Dic', ingresos: 5200000, honorarios: 3800000 },
      { mes: 'Ene', ingresos: 4500000, honorarios: 3400000 },
      { mes: 'Feb', ingresos: 5500000, honorarios: 4000000 },
      { mes: 'Mar', ingresos: 5800200, honorarios: 4200000 },
    ],
    vencimientos: [
      { id: 'alu-08', nombre: 'Martina Silva', dias_restantes: 8, estado: 'critico' },
    ]
  }
};
