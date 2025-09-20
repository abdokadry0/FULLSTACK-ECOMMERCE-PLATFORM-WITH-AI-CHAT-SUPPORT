import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

/**
 * useIntersectionObserver - Hook for lazy loading and viewport detection
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasIntersected, setHasIntersected] = useState(false)
  const targetRef = useRef(null)

  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true,
    ...restOptions
  } = options

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting
        setIsIntersecting(isVisible)
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true)
          if (triggerOnce) {
            observer.unobserve(target)
          }
        }
      },
      {
        threshold,
        rootMargin,
        ...restOptions
      }
    )

    observer.observe(target)

    return () => {
      observer.unobserve(target)
    }
  }, [threshold, rootMargin, triggerOnce, hasIntersected, restOptions])

  return {
    targetRef,
    isIntersecting,
    hasIntersected
  }
}

/**
 * useLazyImage - Hook for optimized image loading with placeholder support
 */
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [imageStatus, setImageStatus] = useState('loading') // loading, loaded, error
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  
  const {
    placeholder = null,
    blurDataURL = null,
    quality = 75,
    priority = false,
    sizes = '100vw',
    onLoad,
    onError
  } = options

  const { targetRef, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px'
  })

  // Preload image when in viewport or priority is true
  useEffect(() => {
    if (!src || (!hasIntersected && !priority)) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setImageStatus('loaded')
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight })
      onLoad?.(img)
    }
    
    img.onerror = (error) => {
      setImageStatus('error')
      onError?.(error)
    }
    
    // Add quality and optimization parameters if supported
    const optimizedSrc = src.includes('?') 
      ? `${src}&q=${quality}&auto=format`
      : `${src}?q=${quality}&auto=format`
    
    img.src = optimizedSrc
  }, [src, hasIntersected, priority, quality, onLoad, onError])

  const imageProps = useMemo(() => ({
    src: imageStatus === 'loaded' ? imageSrc : (placeholder || blurDataURL),
    'data-loaded': imageStatus === 'loaded',
    'data-error': imageStatus === 'error',
    loading: priority ? 'eager' : 'lazy',
    sizes,
    width: dimensions.width,
    height: dimensions.height
  }), [imageSrc, imageStatus, placeholder, blurDataURL, priority, sizes, dimensions])

  return {
    targetRef,
    imageProps,
    imageStatus,
    dimensions,
    isLoaded: imageStatus === 'loaded',
    hasError: imageStatus === 'error'
  }
}

/**
 * useVirtualization - Hook for virtualizing large lists
 */
export const useVirtualization = (items, options = {}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef(null)

  const {
    itemHeight = 100,
    overscan = 5,
    getItemHeight = () => itemHeight
  } = options

  // Calculate visible range
  const visibleRange = useMemo(() => {
    if (!containerHeight || !items.length) {
      return { start: 0, end: 0, visibleItems: [] }
    }

    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
    const end = Math.min(items.length, start + visibleCount)

    const visibleItems = items.slice(start, end).map((item, index) => ({
      ...item,
      index: start + index,
      style: {
        position: 'absolute',
        top: (start + index) * itemHeight,
        height: getItemHeight(item, start + index),
        width: '100%'
      }
    }))

    return { start, end, visibleItems }
  }, [scrollTop, containerHeight, items, itemHeight, overscan, getItemHeight])

  // Handle scroll events
  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  // Measure container height
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height)
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  const totalHeight = items.length * itemHeight

  return {
    containerRef,
    visibleItems: visibleRange.visibleItems,
    totalHeight,
    handleScroll,
    scrollTop,
    containerHeight
  }
}

/**
 * useCodeSplitting - Hook for dynamic imports and code splitting
 */
export const useCodeSplitting = (importFn, fallback = null) => {
  const [component, setComponent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadComponent = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const module = await importFn()
        
        if (mounted) {
          setComponent(() => module.default || module)
          setLoading(false)
        }
      } catch (err) {
        if (mounted) {
          setError(err)
          setLoading(false)
        }
      }
    }

    loadComponent()

    return () => {
      mounted = false
    }
  }, [importFn])

  return {
    Component: component,
    loading,
    error,
    fallback
  }
}

/**
 * usePreloadRoute - Hook for preloading routes and components
 */
export const usePreloadRoute = () => {
  const preloadedRoutes = useRef(new Set())

  const preloadRoute = useCallback(async (routeImport) => {
    const routeKey = routeImport.toString()
    
    if (preloadedRoutes.current.has(routeKey)) {
      return
    }

    try {
      await routeImport()
      preloadedRoutes.current.add(routeKey)
    } catch (error) {
      console.warn('Failed to preload route:', error)
    }
  }, [])

  const preloadOnHover = useCallback((routeImport) => {
    return {
      onMouseEnter: () => preloadRoute(routeImport),
      onFocus: () => preloadRoute(routeImport)
    }
  }, [preloadRoute])

  return {
    preloadRoute,
    preloadOnHover
  }
}

/**
 * useResourceHints - Hook for managing resource hints (preload, prefetch, etc.)
 */
export const useResourceHints = () => {
  const addedHints = useRef(new Set())

  const addResourceHint = useCallback((href, rel = 'prefetch', options = {}) => {
    const key = `${rel}:${href}`
    
    if (addedHints.current.has(key)) {
      return
    }

    const link = document.createElement('link')
    link.rel = rel
    link.href = href
    
    // Add additional attributes
    Object.entries(options).forEach(([key, value]) => {
      link.setAttribute(key, value)
    })

    document.head.appendChild(link)
    addedHints.current.add(key)

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link)
        addedHints.current.delete(key)
      }
    }
  }, [])

  const preloadImage = useCallback((src) => {
    return addResourceHint(src, 'preload', { as: 'image' })
  }, [addResourceHint])

  const prefetchRoute = useCallback((href) => {
    return addResourceHint(href, 'prefetch')
  }, [addResourceHint])

  const preconnect = useCallback((origin) => {
    return addResourceHint(origin, 'preconnect')
  }, [addResourceHint])

  return {
    addResourceHint,
    preloadImage,
    prefetchRoute,
    preconnect
  }
}

/**
 * usePerformanceMonitor - Hook for monitoring performance metrics
 */
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fcp: null, // First Contentful Paint
    lcp: null, // Largest Contentful Paint
    fid: null, // First Input Delay
    cls: null, // Cumulative Layout Shift
    ttfb: null // Time to First Byte
  })

  useEffect(() => {
    // Observe performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }))
            }
            break
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }))
            break
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }))
            break
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + entry.value }))
            }
            break
          case 'navigation':
            setMetrics(prev => ({ ...prev, ttfb: entry.responseStart - entry.requestStart }))
            break
        }
      })
    })

    // Observe different entry types
    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] })
    } catch (error) {
      console.warn('Performance observer not supported:', error)
    }

    return () => observer.disconnect()
  }, [])

  const reportMetrics = useCallback(() => {
    // Report metrics to analytics service
    console.log('Performance Metrics:', metrics)
    
    // You can integrate with analytics services here
    // analytics.track('performance_metrics', metrics)
  }, [metrics])

  return {
    metrics,
    reportMetrics
  }
}

/**
 * useMemoryOptimization - Hook for memory management and cleanup
 */
export const useMemoryOptimization = () => {
  const cleanupFunctions = useRef([])

  const addCleanup = useCallback((cleanupFn) => {
    cleanupFunctions.current.push(cleanupFn)
  }, [])

  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.warn('Cleanup function failed:', error)
      }
    })
    cleanupFunctions.current = []
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return {
    addCleanup,
    cleanup
  }
}