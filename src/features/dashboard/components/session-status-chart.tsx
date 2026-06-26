import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartEntry {
  estado: string
  cantidad: number
  fill: string
}

interface SessionStatusChartProps {
  data: ChartEntry[]
}

export function SessionStatusChart({ data }: SessionStatusChartProps) {
  return (
    <Card className='col-span-1 lg:col-span-3 shadow-sm border-none bg-background/60 backdrop-blur-md'>
      <CardHeader>
        <CardTitle className='text-lg font-bold'>Distribución de Sesiones</CardTitle>
        <CardDescription>
          Estado actual de la agenda semanal.
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='h-[350px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                data={data as any[]}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey='cantidad'
                nameKey='estado'
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
