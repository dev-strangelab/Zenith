import { ContentSection } from '../components/content-section'
import { InstitutionForm } from './components/institution-form'
import { SedesList } from './components/sedes-list'
import { Separator } from '@/components/ui/separator'

export default function SettingsInstitution() {
  return (
    <ContentSection
      title='Institución'
      desc='Gestiona la información legal de tu centro y la configuración de tus sedes.'
    >
      <div className='space-y-10'>
        <section>
          <div className='mb-4'>
            <h3 className='text-lg font-medium'>Datos de la Organización</h3>
            <p className='text-sm text-muted-foreground'>
              Información legal y fiscal de la red profesional.
            </p>
          </div>
          <InstitutionForm />
        </section>

        <Separator />

        <section>
          <SedesList />
        </section>
      </div>
    </ContentSection>
  )
}
