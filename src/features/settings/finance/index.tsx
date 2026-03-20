import { ContentSection } from '../components/content-section'
import { CuentasBancariasList } from './components/cuentas-bancarias-list'
import { ObrasSocialesTable } from './components/obras-sociales-table'
import { Separator } from '@/components/ui/separator'

export default function SettingsFinance() {
  return (
    <ContentSection
      title='Finanzas y Contratos'
      desc='Configura tus cuentas de cobro y gestiona los datos de las obras sociales para el ciclo de liquidación.'
    >
      <div className='space-y-10'>
        <section>
          <div className='mb-4 text-muted-foreground'>
            <h4 className='text-sm font-medium text-foreground'>Configuración Bancaria</h4>
            <p className='text-xs'>Define dónde recibirás los pagos de las liquidaciones aprobadas.</p>
          </div>
          <CuentasBancariasList />
        </section>

        <Separator />

        <section>
          <div className='mb-4 text-muted-foreground'>
            <h4 className='text-sm font-medium text-foreground'>Obras Sociales</h4>
            <p className='text-xs'>Gestiona el maestro de entidades, datos de facturación y correos de contacto.</p>
          </div>
          <ObrasSocialesTable />
        </section>
      </div>
    </ContentSection>
  )
}
