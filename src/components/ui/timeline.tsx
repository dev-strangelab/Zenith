import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TimelineItemProps {
  date: string
  title: string | React.ReactNode
  description?: string
  content?: React.ReactNode
  badge?: React.ReactNode
  icon?: React.ReactNode
  statusColor?: 'green' | 'yellow' | 'red' | 'blue' | 'gray'
}

const statusColors = {
  green: 'bg-green-600',
  yellow: 'bg-yellow-600',
  red: 'bg-red-600',
  blue: 'bg-blue-600',
  gray: 'bg-gray-600',
}

const statusRings = {
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  red: 'bg-red-100',
  blue: 'bg-blue-100',
  gray: 'bg-gray-100',
}

export function Timeline({ items }: { items: TimelineItemProps[] }) {
  return (
    <div className='relative border-l-2 border-primary/20 ml-3 pl-6 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500'>
      {items.map((item, index) => (
        <div key={index} className='relative'>
          {/* Dot */}
          <div className={cn(
            'absolute -left-9 mt-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-background z-10',
            item.statusColor ? statusRings[item.statusColor] : 'bg-primary/10'
          )}>
            {item.icon ? (
              item.icon
            ) : (
              <div className={cn(
                'h-2.5 w-2.5 rounded-full',
                item.statusColor ? statusColors[item.statusColor] : 'bg-primary'
              )}></div>
            )}
          </div>

          <div className='flex flex-col gap-1 mb-2'>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-semibold text-foreground'>
                {item.date}
              </span>
              {item.badge}
            </div>
            <div className='text-xs font-medium text-muted-foreground'>
              {item.title}
            </div>
          </div>

          {item.content && (
            <div className='rounded-md border bg-card p-4 text-sm text-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/20'>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
