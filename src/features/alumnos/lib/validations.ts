import { z } from 'zod';

export const alumnoSchema = z.object({
  nombre: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  apellido: z.string().min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  dni: z.string().regex(/^\d{7,8}$|^\d{1,2}\.\d{3}\.\d{3}$/, {
    message: 'DNI inválido. Debe tener 7 u 8 dígitos.',
  }),
  fecha_nacimiento: z.string().optional().or(z.literal('')),
  sede_id: z.string().min(1, {
    message: 'Sede no válida.',
  }),
  obra_social_id: z.string().optional().or(z.literal('')),
  numero_afiliado: z.string().optional().or(z.literal('')),
  estado: z.enum(['activo', 'pausado', 'finalizado', 'lista_espera'] as const),
  cud_numero: z.string().optional().or(z.literal('')),
  cud_vencimiento: z.string().optional().or(z.literal('')),
  diagnostico: z.string().optional().or(z.literal('')),
  notas: z.string().optional().or(z.literal('')),
});

export type AlumnoFormValues = z.infer<typeof alumnoSchema>;
