import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: ReactNode
  /** Componente de fallback personalizado. Si no se provee, usa el UI por defecto. */
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary a nivel de ruta.
 * Captura errores de render en el árbol de componentes y muestra
 * una UI de recuperación en lugar de romper toda la página.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // En producción, aquí se conectaría Sentry o similar
    // eslint-disable-next-line no-console
    console.error('[Órbita ErrorBoundary]', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className='flex h-full min-h-[400px] flex-col items-center justify-center gap-4 p-8 text-center'>
          <div className='rounded-full bg-destructive/10 p-4'>
            <span className='text-3xl'>⚠️</span>
          </div>
          <div>
            <h2 className='text-xl font-semibold'>Ocurrió un error inesperado</h2>
            <p className='mt-1 text-sm text-muted-foreground'>
              Esta sección no pudo cargarse. Podés intentar recargarla.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className='mt-3 max-w-lg overflow-auto rounded-md bg-muted p-3 text-left text-xs text-muted-foreground'>
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button variant='outline' onClick={this.handleReset}>
            Reintentar
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
