/**
 * usePagination - Hook para manejar paginación de datos
 *
 * Proporciona funcionalidad completa de paginación incluyendo:
 * - Control de página actual
 * - Cálculo de páginas totales
 * - Navegación (siguiente, anterior, ir a página)
 * - Slice de datos paginados
 * - Información de rango (mostrando X-Y de Z)
 */

import { useState, useMemo, useCallback } from 'react'

export interface UsePaginationOptions {
  /**
   * Número de items por página
   * @default 10
   */
  itemsPerPage?: number

  /**
   * Página inicial (base 1)
   * @default 1
   */
  initialPage?: number
}

export interface UsePaginationResult<T> {
  /** Página actual (base 1) */
  currentPage: number

  /** Total de páginas */
  totalPages: number

  /** Items de la página actual */
  paginatedItems: T[]

  /** Total de items en el dataset completo */
  totalItems: number

  /** Número del primer item en la página actual (base 1) */
  startIndex: number

  /** Número del último item en la página actual (base 1) */
  endIndex: number

  /** Si hay página anterior */
  hasPreviousPage: boolean

  /** Si hay página siguiente */
  hasNextPage: boolean

  /** Ir a la página siguiente */
  nextPage: () => void

  /** Ir a la página anterior */
  previousPage: () => void

  /** Ir a una página específica (base 1) */
  goToPage: (page: number) => void

  /** Reiniciar a la primera página */
  resetPage: () => void

  /** Cambiar items por página (reinicia a página 1) */
  setItemsPerPage: (items: number) => void
}

/**
 * Hook para manejar paginación de arrays de datos.
 *
 * @example
 * ```tsx
 * const alumnos = [...] // array de datos
 * const {
 *   paginatedItems,
 *   currentPage,
 *   totalPages,
 *   nextPage,
 *   previousPage,
 *   hasNextPage,
 *   hasPreviousPage
 * } = usePagination(alumnos, { itemsPerPage: 20 })
 *
 * return (
 *   <div>
 *     {paginatedItems.map(alumno => <AlumnoCard key={alumno.id} {...alumno} />)}
 *     <Pagination
 *       page={currentPage}
 *       total={totalPages}
 *       onNext={nextPage}
 *       onPrev={previousPage}
 *       hasNext={hasNextPage}
 *       hasPrev={hasPreviousPage}
 *     />
 *   </div>
 * )
 * ```
 *
 * @param items - Array de items a paginar
 * @param options - Opciones de configuración
 * @returns Objeto con estado y funciones de paginación
 */
export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
): UsePaginationResult<T> {
  const { itemsPerPage: initialItemsPerPage = 10, initialPage = 1 } = options

  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPageState] = useState(initialItemsPerPage)

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    if (items.length === 0) return 1
    return Math.ceil(items.length / itemsPerPage)
  }, [items.length, itemsPerPage])

  // Ajustar página actual si está fuera de rango
  const safePage = useMemo(() => {
    if (currentPage < 1) return 1
    if (currentPage > totalPages) return totalPages
    return currentPage
  }, [currentPage, totalPages])

  // Calcular items de la página actual
  const paginatedItems = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return items.slice(startIndex, endIndex)
  }, [items, safePage, itemsPerPage])

  // Calcular índices para mostrar "Mostrando X-Y de Z"
  const startIndex = useMemo(() => {
    if (items.length === 0) return 0
    return (safePage - 1) * itemsPerPage + 1
  }, [safePage, itemsPerPage, items.length])

  const endIndex = useMemo(() => {
    const calculatedEnd = safePage * itemsPerPage
    return Math.min(calculatedEnd, items.length)
  }, [safePage, itemsPerPage, items.length])

  // Funciones de navegación
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages))
  }, [totalPages])

  const previousPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1))
  }, [])

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, totalPages))
      setCurrentPage(validPage)
    },
    [totalPages]
  )

  const resetPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  const setItemsPerPage = useCallback((items: number) => {
    setItemsPerPageState(items)
    setCurrentPage(1) // Reset a la primera página cuando cambia items por página
  }, [])

  // Flags de navegación
  const hasPreviousPage = safePage > 1
  const hasNextPage = safePage < totalPages

  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    totalItems: items.length,
    startIndex,
    endIndex,
    hasPreviousPage,
    hasNextPage,
    nextPage,
    previousPage,
    goToPage,
    resetPage,
    setItemsPerPage,
  }
}
