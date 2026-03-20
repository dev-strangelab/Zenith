/**
 * useDebounce - Hook para debouncing de valores
 *
 * Retrasa la actualización de un valor hasta que haya pasado un tiempo
 * determinado sin cambios. Útil para optimizar búsquedas y filtros en tiempo real.
 *
 * Casos de uso:
 * - Búsqueda en tiempo real (esperar a que el usuario termine de escribir)
 * - Filtros que disparan llamadas API
 * - Validaciones costosas
 * - Resize/scroll handlers
 */

import { useState, useEffect } from 'react'

/**
 * Hook para hacer debounce de un valor.
 *
 * @example
 * ```tsx
 * function SearchComponent() {
 *   const [searchTerm, setSearchTerm] = useState('')
 *   const debouncedSearchTerm = useDebounce(searchTerm, 500)
 *
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       // Ejecutar búsqueda solo después de 500ms sin cambios
 *       fetchSearchResults(debouncedSearchTerm)
 *     }
 *   }, [debouncedSearchTerm])
 *
 *   return (
 *     <input
 *       value={searchTerm}
 *       onChange={(e) => setSearchTerm(e.target.value)}
 *       placeholder="Buscar..."
 *     />
 *   )
 * }
 * ```
 *
 * @param value - Valor a debounce
 * @param delay - Retraso en milisegundos (default: 500ms)
 * @returns Valor debounced
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Configurar el timer
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Limpiar el timer si el valor cambia antes de que expire
    // Esto previene actualizaciones innecesarias
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook para hacer debounce de callbacks/funciones.
 * Útil cuando necesitas debounce de una función en lugar de un valor.
 *
 * @example
 * ```tsx
 * function FilterComponent() {
 *   const handleSearch = useDebouncedCallback((query: string) => {
 *     console.log('Searching for:', query)
 *     // Ejecutar búsqueda
 *   }, 500)
 *
 *   return (
 *     <input
 *       onChange={(e) => handleSearch(e.target.value)}
 *       placeholder="Buscar..."
 *     />
 *   )
 * }
 * ```
 *
 * @param callback - Función a debounce
 * @param delay - Retraso en milisegundos (default: 500ms)
 * @returns Función debounced
 */
export function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 500
): T {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  const debouncedCallback = ((...args: Parameters<T>) => {
    // Limpiar timer anterior si existe
    if (timer) {
      clearTimeout(timer)
    }

    // Crear nuevo timer
    const newTimer = setTimeout(() => {
      callback(...args)
    }, delay)

    setTimer(newTimer)
  }) as T

  // Limpiar timer al desmontar el componente
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [timer])

  return debouncedCallback
}
