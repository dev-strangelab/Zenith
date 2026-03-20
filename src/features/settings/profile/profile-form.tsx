import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'

const profileFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres.'),
  especialidad: z.string().min(2, 'La especialidad es obligatoria.'),
  matricula: z.string().min(3, 'La matrícula debe ser válida.'),
  phone: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
  nombre: 'Agustín',
  apellido: 'García',
  especialidad: 'Psicología Infantil',
  matricula: 'MN 45.123',
  phone: '11 2345 6789',
}

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  })

  function onSubmit(data: ProfileFormValues) {
    toast.promise(
      new Promise((resolve) => setTimeout(() => resolve(data), 1000)),
      {
        loading: 'Actualizando perfil...',
        success: '¡Perfil actualizado con éxito!',
        error: 'Error al actualizar el perfil.',
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='nombre'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder='Juan' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='apellido'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder='Pérez' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='especialidad'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidad</FormLabel>
                <FormControl>
                  <Input placeholder='Psicoterapeuta' {...field} />
                </FormControl>
                <FormDescription>
                  Tu especialidad clínica para reportes.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='matricula'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input placeholder='MN 12.345' {...field} />
                </FormControl>
                <FormDescription>
                  Necesaria para la firma de evoluciones.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono de Contacto</FormLabel>
              <FormControl>
                <Input placeholder='+54 9...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='shadow-lg shadow-primary/20'>
          Guardar Cambios
        </Button>
      </form>
    </Form>
  )
}
