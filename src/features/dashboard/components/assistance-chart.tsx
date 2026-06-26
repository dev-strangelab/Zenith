import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type AssistanceData } from '../data/mocks'

interface AssistanceChartProps {
  data: AssistanceData[]
}

export function AssistanceChart({ data }: AssistanceChartProps) {
  return (
    <Card className='col-span-1 lg:col-span-4 shadow-sm border-none bg-background/60 backdrop-blur-md'>
      <CardHeader>
        <CardTitle className='text-lg font-bold'>Asistencia Semanal</CardTitle>
        <CardDescription>
          Comparativa de turnos programados vs presentismo real.
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-4'>
        <div className='h-[350px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='hsl(var(--muted))' />
              <XAxis 
                dataKey='dia' 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                }}
              />
              <Legend verticalAlign="top" align="right" height={36}/>
              <Bar 
                dataKey='programados' 
                name='Programados' 
                fill='hsl(var(--primary))' 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                dataKey='presentes' 
                name='Presentes' 
                fill='hsl(var(--accent))' 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                dataKey='ausentes' 
                name='Ausentes' 
                fill='hsl(var(--destructive)/0.8)' 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
