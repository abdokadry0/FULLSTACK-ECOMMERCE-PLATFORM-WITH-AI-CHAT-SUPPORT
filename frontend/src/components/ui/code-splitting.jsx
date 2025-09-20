import * as React from "react"
import { cn } from "../../lib/utils"
import { useCodeSplitting, usePreloadRoute } from "../../hooks/usePerformance"

/**
 * LazyComponent - Wrapper for lazy-loaded components with loading states
 */
const LazyComponent = React.forwardRef(({
  loader,
  fallback,
  errorFallback,
  preload = false,
  className,
  children,
  ...props
}, ref) => {
  const {
    Component,
    isLoading,
    error,
    retry
  } = useCodeSplitting(loader, { preload })

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
        {errorFallback ? (
          typeof errorFallback === 'function' ? errorFallback(error, retry) : errorFallback
        ) : (
          <div className="space-y-4">
            <div className="text-destructive">
              <svg className="h-12 w-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold">Failed to load component</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {error.message || "Something went wrong while loading this component."}
              </p>
            </div>
            <button
              onClick={retry}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        {fallback || (
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Loading component...</span>
          </div>
        )}
      </div>
    )
  }

  if (!Component) {
    return null
  }

  return (
    <Component ref={ref} className={className} {...props}>
      {children}
    </Component>
  )
})

LazyComponent.displayName = "LazyComponent"

/**
 * RoutePreloader - Component to preload routes on hover/focus
 */
const RoutePreloader = React.forwardRef(({
  route,
  children,
  preloadOn = 'hover',
  delay = 100,
  className,
  ...props
}, ref) => {
  const { preload, isPreloaded } = usePreloadRoute(route)
  const timeoutRef = React.useRef(null)

  const handlePreload = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      preload()
    }, delay)
  }, [preload, delay])

  const handleCancelPreload = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const eventHandlers = React.useMemo(() => {
    const handlers = {}
    
    if (preloadOn === 'hover' || preloadOn === 'both') {
      handlers.onMouseEnter = handlePreload
      handlers.onMouseLeave = handleCancelPreload
    }
    
    if (preloadOn === 'focus' || preloadOn === 'both') {
      handlers.onFocus = handlePreload
      handlers.onBlur = handleCancelPreload
    }
    
    return handlers
  }, [preloadOn, handlePreload, handleCancelPreload])

  return (
    <div
      ref={ref}
      className={cn(className, isPreloaded && "data-[preloaded=true]:opacity-100")}
      data-preloaded={isPreloaded}
      {...eventHandlers}
      {...props}
    >
      {children}
    </div>
  )
})

RoutePreloader.displayName = "RoutePreloader"

/**
 * ChunkErrorBoundary - Error boundary specifically for chunk loading errors
 */
class ChunkErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Check if it's a chunk loading error
    const isChunkError = error.name === 'ChunkLoadError' || 
                        error.message?.includes('Loading chunk') ||
                        error.message?.includes('Loading CSS chunk')
    
    return { 
      hasError: true, 
      isChunkError,
      error 
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    
    // Log chunk errors for monitoring
    if (this.state.isChunkError) {
      console.warn('Chunk loading error:', error, errorInfo)
      
      // You can integrate with error reporting services here
      if (this.props.onChunkError) {
        this.props.onChunkError(error, errorInfo)
      }
    }
  }

  handleRetry = () => {
    // For chunk errors, reload the page to get fresh chunks
    if (this.state.isChunkError) {
      window.location.reload()
    } else {
      this.setState({ hasError: false, error: null, errorInfo: null })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleRetry)
      }

      return (
        <div className={cn(
          "flex flex-col items-center justify-center p-8 text-center min-h-[200px]",
          this.props.className
        )}>
          <div className="space-y-4 max-w-md">
            <div className="text-destructive">
              <svg className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h2 className="text-xl font-semibold">
                {this.state.isChunkError ? 'Update Available' : 'Something went wrong'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {this.state.isChunkError 
                  ? 'A new version is available. Please refresh to get the latest updates.'
                  : 'An unexpected error occurred. Please try again.'
                }
              </p>
            </div>
            
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                {this.state.isChunkError ? 'Refresh Page' : 'Try Again'}
              </button>
              
              {this.props.showDetails && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Show Error Details
                  </summary>
                  <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto max-h-40">
                    {this.state.error?.stack || this.state.error?.message}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * LazyRoute - Wrapper for lazy-loaded route components
 */
const LazyRoute = React.forwardRef(({
  component: Component,
  fallback,
  errorBoundary = true,
  preload = false,
  className,
  ...props
}, ref) => {
  const LazyComponent = React.useMemo(() => {
    return React.lazy(() => {
      // Add artificial delay in development for testing
      const componentPromise = typeof Component === 'function' ? Component() : Component
      
      if (process.env.NODE_ENV === 'development' && props.delay) {
        return new Promise(resolve => {
          setTimeout(() => {
            componentPromise.then(resolve)
          }, props.delay)
        })
      }
      
      return componentPromise
    })
  }, [Component, props.delay])

  const content = (
    <React.Suspense 
      fallback={fallback || (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Loading page...</span>
          </div>
        </div>
      )}
    >
      <LazyComponent ref={ref} className={className} {...props} />
    </React.Suspense>
  )

  if (errorBoundary) {
    return (
      <ChunkErrorBoundary className={className}>
        {content}
      </ChunkErrorBoundary>
    )
  }

  return content
})

LazyRoute.displayName = "LazyRoute"

/**
 * PreloadLink - Link component that preloads routes
 */
const PreloadLink = React.forwardRef(({
  to,
  children,
  preloadOn = 'hover',
  delay = 100,
  className,
  ...props
}, ref) => {
  return (
    <RoutePreloader
      route={to}
      preloadOn={preloadOn}
      delay={delay}
      className={className}
    >
      <a
        ref={ref}
        href={to}
        className={cn("transition-colors hover:text-primary", className)}
        {...props}
      >
        {children}
      </a>
    </RoutePreloader>
  )
})

PreloadLink.displayName = "PreloadLink"

/**
 * BundleAnalyzer - Development component to analyze bundle sizes
 */
const BundleAnalyzer = ({ enabled = process.env.NODE_ENV === 'development' }) => {
  const [stats, setStats] = React.useState(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (!enabled) return

    // Collect bundle statistics
    const collectStats = () => {
      const scripts = Array.from(document.querySelectorAll('script[src]'))
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      
      const bundleStats = {
        scripts: scripts.map(script => ({
          src: script.src,
          size: script.src.length // Approximation
        })),
        styles: styles.map(style => ({
          href: style.href,
          size: style.href.length // Approximation
        })),
        timestamp: new Date().toISOString()
      }
      
      setStats(bundleStats)
    }

    collectStats()
    
    // Listen for new chunks being loaded
    const observer = new MutationObserver(collectStats)
    observer.observe(document.head, { childList: true })
    
    return () => observer.disconnect()
  }, [enabled])

  if (!enabled || !stats) return null

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        title="Bundle Analyzer"
      >
        📊
      </button>
      
      {isVisible && (
        <div className="fixed inset-4 z-50 bg-background border rounded-lg shadow-xl overflow-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bundle Analysis</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-muted rounded"
            >
              ✕
            </button>
          </div>
          
          <div className="p-4 space-y-4">
            <div>
              <h4 className="font-medium mb-2">JavaScript Bundles ({stats.scripts.length})</h4>
              <div className="space-y-1 text-sm">
                {stats.scripts.map((script, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="truncate">{script.src.split('/').pop()}</span>
                    <span className="text-muted-foreground ml-2">~{script.size}b</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">CSS Bundles ({stats.styles.length})</h4>
              <div className="space-y-1 text-sm">
                {stats.styles.map((style, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="truncate">{style.href.split('/').pop()}</span>
                    <span className="text-muted-foreground ml-2">~{style.size}b</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export { 
  LazyComponent, 
  RoutePreloader, 
  ChunkErrorBoundary, 
  LazyRoute, 
  PreloadLink, 
  BundleAnalyzer 
}