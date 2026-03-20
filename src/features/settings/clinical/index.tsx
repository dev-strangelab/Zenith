import { ContentSection } from '../components/content-section'
import { PlantillasList } from './components/plantillas-list'
import { PrestacionesTable } from './components/prestaciones-table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, ClipboardList } from 'lucide-react'

export default function SettingsClinical() {
  return (
    <ContentSection
      title='Parámetros Clínicos'
      desc='Configura las bases para la atención clínica, plantillas de evolución y aranceles de prestaciones.'
    >
      <Tabs defaultValue='plantillas' className='space-y-6'>
        <TabsList className='bg-muted/50 p-1'>
          <TabsTrigger value='plantillas' className='data-[state=active]:bg-background'>
            <Sparkles className='mr-2 h-4 w-4' /> Snippets de Evolución
          </TabsTrigger>
          <TabsTrigger value='prestaciones' className='data-[state=active]:bg-background'>
            <ClipboardList className='mr-2 h-4 w-4' /> Prestaciones y Aranceles
          </TabsTrigger>
        </TabsList>

        <TabsContent value='plantillas' className='space-y-4'>
          <div className='mb-6'>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Gestiona los textos predefinidos para agilizar la carga de evoluciones en la agenda clínica.
            </h4>
          </div>
          <PlantillasList />
        </TabsContent>

        <TabsContent value='prestaciones' className='space-y-4'>
          <div className='mb-6'>
            <h4 className='text-sm font-medium text-muted-foreground'>
              Define los códigos y valores vigentes para los módulos terapéuticos facturables.
            </h4>
          </div>
          <PrestacionesTable />
        </TabsContent>
      </Tabs>
    </ContentSection>
  )
}
