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
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'

const notificationsFormSchema = z.object({
  buzon_email: z.boolean(),
  seguridad_email: z.boolean(),
})

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>

const defaultValues: NotificationsFormValues = {
  buzon_email: true,
  seguridad_email: true,
}

export function NotificationsForm() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  })

  function onSubmit(data: NotificationsFormValues) {
    toast.promise(
      new Promise((resolve) => setTimeout(() => resolve(data), 800)),
      {
        loading: 'Guardando preferencias...',
        success: 'Preferencias de notificación actualizadas.',
        error: 'Error al guardar.',
      }
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div>
          <h3 className='mb-4 text-lg font-medium'>Notificaciones por Email</h3>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='buzon_email'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Buzón Familiar</FormLabel>
                    <FormDescription>
                      Recibir un aviso por email cuando un tutor envíe un mensaje urgente.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='seguridad_email'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Alertas de Seguridad</FormLabel>
                    <FormDescription>
                      Recibir avisos sobre inicios de sesión sospechosos o cambios de contraseña.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type='submit' className='shadow-lg shadow-primary/20'>
          Actualizar Preferencias
        </Button>
      </form>
    </Form>
  )
}
