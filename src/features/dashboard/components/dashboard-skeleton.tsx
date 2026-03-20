import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      {/* KPI Cards Skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="shadow-sm border-none bg-background/60 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[150px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-7">
        {/* Financial Chart Skeleton */}
        <Card className="col-span-1 lg:col-span-4 shadow-sm border-none bg-background/60 backdrop-blur-md">
          <CardHeader>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[300px]" />
          </CardHeader>
          <CardContent className="h-[350px] flex items-end gap-2 px-6 pb-6">
            <Skeleton className="h-[60%] w-full" />
            <Skeleton className="h-[80%] w-full" />
            <Skeleton className="h-[40%] w-full" />
            <Skeleton className="h-[90%] w-full" />
            <Skeleton className="h-[70%] w-full" />
          </CardContent>
        </Card>

        {/* Session Distribution Skeleton */}
        <Card className="col-span-1 lg:col-span-3 shadow-sm border-none bg-background/60 backdrop-blur-md">
          <CardHeader>
            <Skeleton className="h-6 w-[200px] mb-2" />
            <Skeleton className="h-4 w-[150px]" />
          </CardHeader>
          <CardContent className="h-[350px] flex items-center justify-center">
            <Skeleton className="h-[200px] w-[200px] rounded-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
