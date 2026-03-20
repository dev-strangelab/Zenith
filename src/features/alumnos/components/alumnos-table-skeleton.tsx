import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function AlumnosTableSkeleton() {
  return (
    <div className='rounded-md border bg-background shadow-sm'>
      <Table>
        <TableHeader className='bg-muted/30'>
          <TableRow>
            <TableHead className='w-[250px]'><Skeleton className='h-4 w-32' /></TableHead>
            <TableHead><Skeleton className='h-4 w-20' /></TableHead>
            <TableHead><Skeleton className='h-4 w-24' /></TableHead>
            <TableHead><Skeleton className='h-4 w-28' /></TableHead>
            <TableHead><Skeleton className='h-4 w-16' /></TableHead>
            <TableHead className='text-right'><Skeleton className='h-4 w-20 ml-auto' /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className='h-5 w-48' /></TableCell>
              <TableCell><Skeleton className='h-5 w-24' /></TableCell>
              <TableCell><Skeleton className='h-6 w-20 rounded-full' /></TableCell>
              <TableCell><Skeleton className='h-5 w-32' /></TableCell>
              <TableCell><Skeleton className='h-6 w-16 rounded-full' /></TableCell>
              <TableCell className='text-right'><Skeleton className='h-9 w-24 ml-auto rounded-md' /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
