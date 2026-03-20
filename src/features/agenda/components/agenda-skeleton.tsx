import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function AgendaSkeleton() {
  return (
    <div className='grid gap-4 md:grid-cols-[auto_1fr]'>
      {/* Calendario Skeleton */}
      <div className="rounded-md border p-2 bg-card h-[350px] w-[300px]">
        <Skeleton className="h-full w-full rounded-md" />
      </div>

      {/* Turnos Diarios Skeleton */}
      <Card className="h-full border-border/50 shadow-md">
        <CardHeader className="border-b bg-card pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
            <Skeleton className="h-8 w-[100px] rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-14 w-16 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-[100px]" />
                <Skeleton className="h-9 w-[80px]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
