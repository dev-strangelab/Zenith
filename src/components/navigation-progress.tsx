import { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'

export function NavigationProgress() {
  const state = useRouterState()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (state.status === 'pending') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true)
      setProgress(30)
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 90) {
            clearInterval(timer)
            return 90
          }
          return old + 2
        })
      }, 100)
      return () => clearInterval(timer)
    } else {
      setProgress(100)
      const timeout = setTimeout(() => {
        setVisible(false)
        setProgress(0)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [state.status])

  if (!visible) return null

  return (
    <div className='fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent'>
      <div 
        className='h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]'
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
