import { type CuentaBancaria } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Landmark, Copy, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

const mockCuentas: CuentaBancaria[] = [
  {
    id: 'cta-1',
    organizacion_id: 'org-1',
    sede_id: null,
    banco: 'Banco Galicia',
    titular: 'Iter-softco S.A.',
    cbu_cvu: '0070123420000001234567',
    alias: 'ITER.SOFTCO.GALICIA',
    tipo_cuenta: 'corriente',
    moneda: 'ARS',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export function CuentasBancariasList() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copiado al portapapeles.')
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-medium'>Cuentas de Cobro</h3>
        <Button size='sm' variant='outline'>
          <Plus className='mr-2 h-4 w-4' /> Vincular Cuenta
        </Button>
      </div>

      <div className='grid gap-4'>
        {mockCuentas.map((cta) => (
          <Card key={cta.id} className='border-none shadow-sm bg-muted/30'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2'>
                  <Landmark className='h-4 w-4 text-primary' />
                  <CardTitle className='text-base'>{cta.banco}</CardTitle>
                </div>
                <CardDescription>Titular: {cta.titular}</CardDescription>
              </div>
              <Badge variant='outline' className='bg-primary/5 text-primary border-primary/20 capitalize'>
                {cta.tipo_cuenta}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-2'>
                <div className='flex items-center justify-between p-2 rounded-md bg-background/50 border'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase text-muted-foreground'>CBU / CVU</span>
                    <span className='text-sm font-mono'>{cta.cbu_cvu}</span>
                  </div>
                  <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => copyToClipboard(cta.cbu_cvu)}>
                    <Copy className='h-3.5 w-3.5' />
                  </Button>
                </div>
                <div className='flex items-center justify-between p-2 rounded-md bg-background/50 border'>
                  <div className='flex flex-col'>
                    <span className='text-[10px] uppercase text-muted-foreground'>Alias</span>
                    <span className='text-sm font-semibold'>{cta.alias}</span>
                  </div>
                  <Button variant='ghost' size='icon' className='h-8 w-8' onClick={() => copyToClipboard(cta.alias || '')}>
                    <Copy className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
              <div className='mt-4 flex justify-end space-x-2'>
                <Button variant='ghost' size='sm' className='text-muted-foreground hover:text-destructive'>
                  <Trash2 className='mr-2 h-4 w-4' /> Desvincular
                </Button>
                <Button variant='ghost' size='sm'>Editar</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
