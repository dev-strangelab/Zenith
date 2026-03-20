import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { sidebarData } from './data/sidebar-data'

export function SedeThemeManager() {
  const { sede: sedeState } = useAuthStore()
  const activeSedeId = sedeState.activeSedeId

  useEffect(() => {
    const activeSede = sidebarData.sedes.find(s => s.id === activeSedeId)
    if (activeSede?.color_identidad) {
      const color = activeSede.color_identidad
      
      // Actualizamos la variable --primary en el root
      document.documentElement.style.setProperty('--primary', color)
      
      // Si quisiéramos ajustar el color de fondo de la barra lateral o similar
      // document.documentElement.style.setProperty('--sidebar-primary', color)
    }
  }, [activeSedeId])

  return null
}
