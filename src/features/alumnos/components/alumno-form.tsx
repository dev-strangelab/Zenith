import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { alumnoSchema, type AlumnoFormValues } from '../lib/validations'
import { useOrganization } from '@/hooks/use-organization'
import { Alumno } from '../data/mocks'
import { AlumnoService } from '../services/alumno-service'

interface AlumnoFormProps {
  initialData?: Alumno
  onSuccess?: () => void
  onCancel?: () => void
}

export function AlumnoForm({ initialData, onSuccess, onCancel }: AlumnoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { activeSedeId } = useOrganization()

  const isEdit = !!initialData

  const form = useForm<AlumnoFormValues>({
    resolver: zodResolver(alumnoSchema),
    defaultValues: {
      nombre: initialData?.nombre || '',
      apellido: initialData?.apellido || '',
      dni: initialData?.dni || '',
      fecha_nacimiento: '',
      sede_id: initialData?.sede_id || activeSedeId || '',
      obra_social_id: initialData?.obra_social_id || '',
      numero_afiliado: '',
      estado: initialData?.estado || 'activo',
      cud_numero: '',
      cud_vencimiento: initialData?.cud_vencimiento || '',
      diagnostico: '',
      notas: '',
    },
  })

  async function onSubmit(data: AlumnoFormValues) {
    setIsSubmitting(true)
    
    try {
      if (isEdit) {
        await AlumnoService.updateAlumno(initialData.id, data)
        toast.success('Alumno actualizado correctamente.')
      } else {
        await AlumnoService.createAlumno({
          nombre: data.nombre,
          apellido: data.apellido,
          dni: data.dni,
          obra_social_id: data.obra_social_id || '',
          cud_vencimiento: data.cud_vencimiento || null,
          estado: data.estado as 'activo' | 'pausado' | 'finalizado' | 'lista_espera',
          sede_id: data.sede_id,
        })
        toast.success('Alumno registrado correctamente.')
      }
      onSuccess?.()
    } catch (error) {
      toast.error('Ocurrió un error al guardar los datos.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Nombre */}
          <FormField
            control={form.control}
            name='nombre'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder='Ingrese el nombre' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido */}
          <FormField
            control={form.control}
            name='apellido'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder='Ingrese el apellido' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DNI */}
          <FormField
            control={form.control}
            name='dni'
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input placeholder='Ej: 40123456' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estado */}
          <FormField
            control={form.control}
            name='estado'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado del Alumno</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Seleccione un estado' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='activo'>Activo</SelectItem>
                    <SelectItem value='pausado'>Pausado</SelectItem>
                    <SelectItem value='lista_espera'>Lista de Espera</SelectItem>
                    <SelectItem value='finalizado'>Finalizado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4'>
          <h3 className='col-span-1 md:col-span-2 font-semibold text-sm text-muted-foreground uppercase tracking-wider'>
            Documentación y CUD
          </h3>
          
          {/* CUD Número */}
          <FormField
            control={form.control}
            name='cud_numero'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Certificado Único de Discapacidad (Nº)</FormLabel>
                <FormControl>
                  <Input placeholder='Nº de certificado' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* CUD Vencimiento */}
          <FormField
            control={form.control}
            name='cud_vencimiento'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vencimiento CUD</FormLabel>
                <FormControl>
                  <Input type='date' {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>Deje en blanco si no posee CUD</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex justify-end space-x-2 pt-4 border-t'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                {isEdit ? 'Actualizando...' : 'Registrando...'}
              </>
            ) : (
              isEdit ? 'Guardar Cambios' : 'Registrar Alumno'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
