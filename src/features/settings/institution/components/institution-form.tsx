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

const institutionFormSchema = z.object({
  nombre: z.string().min(2, 'El nombre institucional es obligatorio.'),
  cuit: z.string().min(11, 'CUIT inválido (11 dígitos).').max(13),
  email_contacto: z.string().email('Email inválido.'),
  telefono: z.string().min(8, 'Teléfono inválido.'),
  direccion_legal: z.string().min(5, 'Dirección legal obligatoria.'),
})

type InstitutionFormValues = z.infer<typeof institutionFormSchema>

const defaultValues: InstitutionFormValues = {
  nombre: 'Iter-softco',
  cuit: '30-12345678-9',
  email_contacto: 'admin@itersoftco.com',
  telefono: '011 4567-8900',
  direccion_legal: 'Av. Corrientes 1234, CABA',
}

export function InstitutionForm() {
  const form = useForm<InstitutionFormValues>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues,
  })

  function onSubmit(data: InstitutionFormValues) {
    toast.promise(
      new Promise((resolve) => setTimeout(() => resolve(data), 1000)),
      {
        loading: 'Guardando datos institucionales...',
        success: 'Institución actualizada correctamente.',
        error: 'Error al guardar.',
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
                <FormLabel>Nombre Institucional</FormLabel>
                <FormControl>
                  <Input placeholder='Nombre de la Red' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='cuit'
            render={({ field }) => (
              <FormItem>
                <FormLabel>CUIT Organización</FormLabel>
                <FormControl>
                  <Input placeholder='30-00000000-0' {...field} />
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
            name='email_contacto'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de Contacto</FormLabel>
                <FormControl>
                  <Input placeholder='correo@institucion.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='telefono'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono Central</FormLabel>
                <FormControl>
                  <Input placeholder='Central telefónica' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='direccion_legal'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección Legal</FormLabel>
              <FormControl>
                <Input placeholder='Domicilio legal completo' {...field} />
              </FormControl>
              <FormDescription>
                Esta dirección figurará en las facturas y liquidaciones.
              </FormDescription>
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
