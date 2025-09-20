/**
 * Performance utilities for optimization and monitoring
 */

/**
 * Resource Hints - Preload, prefetch, and preconnect utilities
 */
export const resourceHints = {
  /**
   * Preload a resource with high priority
   */
  preload: (href, as = 'script', crossorigin = null) => {
    if (typeof document === 'undefined') return

    const existing = document.querySelector(`link[rel="preload"][href="${href}"]`)
    if (existing) return existing

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossorigin) link.crossOrigin = crossorigin
    
    document.head.appendChild(link)
    return link
  },

  /**
   * Prefetch a resource for future navigation
   */
  prefetch: (href) => {
    if (typeof document === 'undefined') return

    const existing = document.querySelector(`link[rel="prefetch"][href="${href}"]`)
    if (existing) return existing

    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    
    document.head.appendChild(link)
    return link
  },

  /**
   * Preconnect to a domain
   */
  preconnect: (href, crossorigin = false) => {
    if (typeof document === 'undefined') return

    const existing = document.querySelector(`link[rel="preconnect"][href="${href}"]`)
    if (existing) return existing

    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    if (crossorigin) link.crossOrigin = 'anonymous'
    
    document.head.appendChild(link)
    return link
  },

  /**
   * DNS prefetch for a domain
   */
  dnsPrefetch: (href) => {
    if (typeof document === 'undefined') return

    const existing = document.querySelector(`link[rel="dns-prefetch"][href="${href}"]`)
    if (existing) return existing

    const link = document.createElement('link')
    link.rel = 'dns-prefetch'
    link.href = href
    
    document.head.appendChild(link)
    return link
  }
}

/**
 * Bundle optimization utilities
 */
export const bundleOptimization = {
  /**
   * Dynamically import a module with error handling
   */
  dynamicImport: async (importFn, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        return await importFn()
      } catch (error) {
        if (i === retries - 1) throw error
        
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }
  },

  /**
   * Preload a route component
   */
  preloadRoute: async (routeImport) => {
    try {
      await routeImport()
    } catch (error) {
      console.warn('Failed to preload route:', error)
    }
  },

  /**
   * Get chunk loading stats
   */
  getChunkStats: () => {
    if (typeof window === 'undefined') return null

    const scripts = Array.from(document.querySelectorAll('script[src]'))
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
    
    return {
      scripts: scripts.length,
      styles: styles.length,
      totalResources: scripts.length + styles.length,
      scriptSources: scripts.map(s => s.src),
      styleSources: styles.map(s => s.href)
    }
  }
}

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Measure and log performance metrics
   */
  measurePerformance: (name, fn) => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    console.log(`Performance: ${name} took ${end - start} milliseconds`)
    
    // Mark performance entry
    if (performance.mark) {
      performance.mark(`${name}-start`)
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
    
    return result
  },

  /**
   * Measure async performance
   */
  measureAsync: async (name, asyncFn) => {
    const start = performance.now()
    const result = await asyncFn()
    const end = performance.now()
    
    console.log(`Performance: ${name} took ${end - start} milliseconds`)
    
    if (performance.mark) {
      performance.mark(`${name}-start`)
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
    
    return result
  },

  /**
   * Get Core Web Vitals
   */
  getCoreWebVitals: () => {
    return new Promise((resolve) => {
      const vitals = {}

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          vitals.lcp = lastEntry.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

        // First Input Delay
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            vitals.fid = entry.processingStart - entry.startTime
          })
        })
        fidObserver.observe({ entryTypes: ['first-input'] })

        // Cumulative Layout Shift
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          vitals.cls = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })

        // Resolve after a delay to collect metrics
        setTimeout(() => resolve(vitals), 3000)
      } else {
        resolve(vitals)
      }
    })
  },

  /**
   * Monitor memory usage
   */
  getMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        percentage: (performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100
      }
    }
    return null
  },

  /**
   * Monitor frame rate
   */
  monitorFPS: (callback, duration = 1000) => {
    let frames = 0
    let lastTime = performance.now()
    
    const countFrame = (currentTime) => {
      frames++
      
      if (currentTime >= lastTime + duration) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime))
        callback(fps)
        frames = 0
        lastTime = currentTime
      }
      
      requestAnimationFrame(countFrame)
    }
    
    requestAnimationFrame(countFrame)
  }
}

/**
 * Image optimization utilities
 */
export const imageOptimization = {
  /**
   * Generate responsive image srcSet
   */
  generateSrcSet: (baseUrl, sizes = [320, 640, 768, 1024, 1280, 1920]) => {
    return sizes.map(size => `${baseUrl}?w=${size} ${size}w`).join(', ')
  },

  /**
   * Generate sizes attribute for responsive images
   */
  generateSizes: (breakpoints = {
    sm: '100vw',
    md: '50vw',
    lg: '33vw',
    xl: '25vw'
  }) => {
    const entries = Object.entries(breakpoints)
    const mediaQueries = entries.slice(0, -1).map(([bp, size]) => {
      const minWidth = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }[bp]
      return `(min-width: ${minWidth}) ${size}`
    })
    
    const defaultSize = entries[entries.length - 1][1]
    return [...mediaQueries, defaultSize].join(', ')
  },

  /**
   * Create blur placeholder from image
   */
  createBlurPlaceholder: (width = 8, height = 8) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, '#f3f4f6')
    gradient.addColorStop(1, '#e5e7eb')
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
    
    return canvas.toDataURL()
  },

  /**
   * Lazy load images with Intersection Observer
   */
  lazyLoadImages: (selector = 'img[data-src]', options = {}) => {
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without Intersection Observer
      const images = document.querySelectorAll(selector)
      images.forEach(img => {
        img.src = img.dataset.src
        img.classList.remove('lazy')
      })
      return
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01,
      ...options
    })

    const images = document.querySelectorAll(selector)
    images.forEach(img => imageObserver.observe(img))
    
    return imageObserver
  }
}

/**
 * Network optimization utilities
 */
export const networkOptimization = {
  /**
   * Get network information
   */
  getNetworkInfo: () => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  },

  /**
   * Adapt quality based on network conditions
   */
  adaptToNetwork: (highQuality, lowQuality) => {
    const networkInfo = networkOptimization.getNetworkInfo()
    
    if (!networkInfo) return highQuality
    
    // Use low quality for slow connections or data saver mode
    if (networkInfo.saveData || 
        networkInfo.effectiveType === 'slow-2g' || 
        networkInfo.effectiveType === '2g') {
      return lowQuality
    }
    
    return highQuality
  },

  /**
   * Preload critical resources based on network
   */
  preloadCriticalResources: (resources) => {
    const networkInfo = networkOptimization.getNetworkInfo()
    
    // Skip preloading on slow connections
    if (networkInfo?.saveData || 
        networkInfo?.effectiveType === 'slow-2g' || 
        networkInfo?.effectiveType === '2g') {
      return
    }
    
    resources.forEach(resource => {
      resourceHints.preload(resource.href, resource.as, resource.crossorigin)
    })
  }
}

/**
 * Code splitting utilities
 */
export const codeSplitting = {
  /**
   * Create a lazy component with loading and error states
   */
  createLazyComponent: (importFn, fallback = null) => {
    const LazyComponent = React.lazy(() => 
      bundleOptimization.dynamicImport(importFn)
    )
    
    return (props) => (
      <React.Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  },

  /**
   * Preload a lazy component
   */
  preloadComponent: (importFn) => {
    // Preload the component without rendering
    importFn().catch(error => {
      console.warn('Failed to preload component:', error)
    })
  }
}

/**
 * Performance budget utilities
 */
export const performanceBudget = {
  /**
   * Check if performance budget is exceeded
   */
  checkBudget: (budget = {
    maxBundleSize: 250000, // 250KB
    maxImageSize: 100000,  // 100KB
    maxFCP: 1800,          // 1.8s
    maxLCP: 2500           // 2.5s
  }) => {
    const results = {
      bundleSize: { passed: true, actual: 0, limit: budget.maxBundleSize },
      imageSize: { passed: true, actual: 0, limit: budget.maxImageSize },
      fcp: { passed: true, actual: 0, limit: budget.maxFCP },
      lcp: { passed: true, actual: 0, limit: budget.maxLCP }
    }

    // Check bundle size
    const chunkStats = bundleOptimization.getChunkStats()
    if (chunkStats) {
      // Rough estimation of bundle size
      results.bundleSize.actual = chunkStats.totalResources * 50000 // 50KB per resource estimate
      results.bundleSize.passed = results.bundleSize.actual <= budget.maxBundleSize
    }

    // Check performance metrics
    if (performance.getEntriesByType) {
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        results.fcp.actual = fcpEntry.startTime
        results.fcp.passed = fcpEntry.startTime <= budget.maxFCP
      }
    }

    return results
  },

  /**
   * Log performance budget results
   */
  logBudgetResults: (results) => {
    console.group('Performance Budget Results')
    
    Object.entries(results).forEach(([metric, result]) => {
      const status = result.passed ? '✅' : '❌'
      console.log(`${status} ${metric}: ${result.actual} / ${result.limit}`)
    })
    
    console.groupEnd()
  }
}

// Export all utilities
export default {
  resourceHints,
  bundleOptimization,
  performanceMonitor,
  imageOptimization,
  networkOptimization,
  codeSplitting,
  performanceBudget
}