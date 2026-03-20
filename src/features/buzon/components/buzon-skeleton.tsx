import { Skeleton } from '@/components/ui/skeleton'

export function BuzonSkeleton() {
  return (
    <div className='flex h-full w-full'>
      {/* Lista lateral */}
      <div className='w-[380px] border-r flex flex-col space-y-4 p-4'>
        <Skeleton className='h-10 w-full mb-4' />
        <Skeleton className='h-8 w-full' />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className='flex gap-3 py-2'>
            <Skeleton className='h-12 w-12 rounded-full' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-1/2' />
              <Skeleton className='h-3 w-3/4' />
            </div>
          </div>
        ))}
      </div>
      {/* Área de chat */}
      <div className='flex-1 flex flex-col p-6 space-y-6'>
        <div className='flex justify-between'>
          <Skeleton className='h-10 w-1/3' />
          <Skeleton className='h-10 w-1/4' />
        </div>
        <div className='flex-1 flex flex-col justify-end space-y-4 pb-20'>
          <Skeleton className='h-16 w-1/2 self-start rounded-2xl' />
          <Skeleton className='h-16 w-1/2 self-end rounded-2xl' />
          <Skeleton className='h-16 w-1/3 self-start rounded-2xl' />
        </div>
        <Skeleton className='h-[60px] w-full rounded-xl' />
      </div>
    </div>
  )
}
