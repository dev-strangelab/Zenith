import { Skeleton } from '@/components/ui/skeleton'

export function AlumnoDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center space-x-4'>
        <Skeleton className='h-16 w-16 rounded-full' />
        <div className='space-y-2'>
          <Skeleton className='h-8 w-[250px]' />
          <div className='flex items-center space-x-2'>
            <Skeleton className='h-4 w-[100px]' />
            <Skeleton className='h-4 w-[80px]' />
            <Skeleton className='h-4 w-[60px]' />
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex space-x-2'>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className='h-10 flex-1' />
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className='h-[200px] rounded-xl' />
          ))}
        </div>
      </div>
    </div>
  )
}
