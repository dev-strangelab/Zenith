import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ResumenTab() {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Vencimiento CUD
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>15 Oct 2025</div>
          <p className='text-xs text-muted-foreground'>
            Faltan 580 días
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-sm font-medium'>
            Autorizaciones OSDE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='text-2xl font-bold'>24 / 40</div>
          <p className='text-xs text-muted-foreground'>
            Sesiones ocupadas este año
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
