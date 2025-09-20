import { useState, useEffect, useContext, createContext, useCallback, useRef } from 'react'

/**
 * Analytics Context
 */
const AnalyticsContext = createContext({
  track: () => {},
  identify: () => {},
  page: () => {},
  group: () => {},
  alias: () => {},
  reset: () => {},
  isReady: false
})

/**
 * Analytics Provider
 */
export const AnalyticsProvider = ({ 
  children,
  config = {},
  providers = ['gtag', 'segment'],
  debug = false
}) => {
  const [isReady, setIsReady] = useState(false)
  const [loadedProviders, setLoadedProviders] = useState(new Set())
  const queueRef = useRef([])

  // Initialize analytics providers
  useEffect(() => {
    const initializeProviders = async () => {
      const loaded = new Set()

      // Initialize Google Analytics
      if (providers.includes('gtag') && config.gtag?.measurementId) {
        try {
          // Load gtag script
          const script = document.createElement('script')
          script.async = true
          script.src = `https://www.googletagmanager.com/gtag/js?id=${config.gtag.measurementId}`
          document.head.appendChild(script)

          // Initialize gtag
          window.dataLayer = window.dataLayer || []
          window.gtag = function() {
            window.dataLayer.push(arguments)
          }
          window.gtag('js', new Date())
          window.gtag('config', config.gtag.measurementId, {
            page_title: document.title,
            page_location: window.location.href,
            ...config.gtag.config
          })

          loaded.add('gtag')
          if (debug) console.log('Google Analytics initialized')
        } catch (error) {
          console.error('Failed to initialize Google Analytics:', error)
        }
      }

      // Initialize Segment
      if (providers.includes('segment') && config.segment?.writeKey) {
        try {
          // Load Segment script
          const analytics = window.analytics = window.analytics || []
          if (!analytics.initialize) {
            if (analytics.invoked) {
              console.error('Segment snippet included twice.')
            } else {
              analytics.invoked = true
              analytics.methods = [
                'trackSubmit', 'trackClick', 'trackLink', 'trackForm', 'pageview',
                'identify', 'reset', 'group', 'track', 'ready', 'alias',
                'debug', 'page', 'once', 'off', 'on', 'addSourceMiddleware',
                'addIntegrationMiddleware', 'setAnonymousId', 'addDestinationMiddleware'
              ]
              analytics.factory = function(method) {
                return function() {
                  const args = Array.prototype.slice.call(arguments)
                  args.unshift(method)
                  analytics.push(args)
                  return analytics
                }
              }
              for (let key = 0; key < analytics.methods.length; key++) {
                const method = analytics.methods[key]
                analytics[method] = analytics.factory(method)
              }
              analytics.load = function(key, options) {
                const script = document.createElement('script')
                script.type = 'text/javascript'
                script.async = true
                script.src = 'https://cdn.segment.com/analytics.js/v1/' + key + '/analytics.min.js'
                const first = document.getElementsByTagName('script')[0]
                first.parentNode.insertBefore(script, first)
                analytics._loadOptions = options
              }
              analytics.SNIPPET_VERSION = '4.13.2'
              analytics.load(config.segment.writeKey, config.segment.options)
            }
          }

          loaded.add('segment')
          if (debug) console.log('Segment initialized')
        } catch (error) {
          console.error('Failed to initialize Segment:', error)
        }
      }

      // Initialize Facebook Pixel
      if (providers.includes('facebook') && config.facebook?.pixelId) {
        try {
          // Load Facebook Pixel
          !function(f,b,e,v,n,t,s) {
            if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');

          window.fbq('init', config.facebook.pixelId)
          window.fbq('track', 'PageView')

          loaded.add('facebook')
          if (debug) console.log('Facebook Pixel initialized')
        } catch (error) {
          console.error('Failed to initialize Facebook Pixel:', error)
        }
      }

      setLoadedProviders(loaded)
      setIsReady(true)

      // Process queued events
      queueRef.current.forEach(({ method, args }) => {
        executeMethod(method, args, loaded)
      })
      queueRef.current = []
    }

    initializeProviders()
  }, [providers, config, debug])

  // Execute analytics method across providers
  const executeMethod = useCallback((method, args, providerSet = loadedProviders) => {
    if (debug) {
      console.log(`Analytics ${method}:`, args)
    }

    // Google Analytics
    if (providerSet.has('gtag') && window.gtag) {
      switch (method) {
        case 'track':
          window.gtag('event', args[0], {
            event_category: args[1]?.category || 'engagement',
            event_label: args[1]?.label,
            value: args[1]?.value,
            ...args[1]
          })
          break
        case 'page':
          window.gtag('config', config.gtag.measurementId, {
            page_title: args[0] || document.title,
            page_location: args[1] || window.location.href
          })
          break
        case 'identify':
          window.gtag('config', config.gtag.measurementId, {
            user_id: args[0],
            custom_map: args[1]
          })
          break
      }
    }

    // Segment
    if (providerSet.has('segment') && window.analytics) {
      switch (method) {
        case 'track':
          window.analytics.track(args[0], args[1], args[2])
          break
        case 'identify':
          window.analytics.identify(args[0], args[1], args[2])
          break
        case 'page':
          window.analytics.page(args[0], args[1], args[2])
          break
        case 'group':
          window.analytics.group(args[0], args[1], args[2])
          break
        case 'alias':
          window.analytics.alias(args[0], args[1])
          break
        case 'reset':
          window.analytics.reset()
          break
      }
    }

    // Facebook Pixel
    if (providerSet.has('facebook') && window.fbq) {
      switch (method) {
        case 'track':
          const eventName = args[0]
          const properties = args[1] || {}
          
          // Map common events to Facebook standard events
          const fbEventMap = {
            'Product Viewed': 'ViewContent',
            'Product Added': 'AddToCart',
            'Order Completed': 'Purchase',
            'Checkout Started': 'InitiateCheckout',
            'Product Searched': 'Search'
          }
          
          const fbEvent = fbEventMap[eventName] || eventName
          window.fbq('track', fbEvent, properties)
          break
        case 'page':
          window.fbq('track', 'PageView')
          break
      }
    }
  }, [loadedProviders, config, debug])

  // Queue method if not ready
  const queueOrExecute = useCallback((method, args) => {
    if (isReady) {
      executeMethod(method, args)
    } else {
      queueRef.current.push({ method, args })
    }
  }, [isReady, executeMethod])

  // Analytics methods
  const track = useCallback((event, properties = {}, options = {}) => {
    queueOrExecute('track', [event, properties, options])
  }, [queueOrExecute])

  const identify = useCallback((userId, traits = {}, options = {}) => {
    queueOrExecute('identify', [userId, traits, options])
  }, [queueOrExecute])

  const page = useCallback((name = null, properties = {}, options = {}) => {
    queueOrExecute('page', [name, properties, options])
  }, [queueOrExecute])

  const group = useCallback((groupId, traits = {}, options = {}) => {
    queueOrExecute('group', [groupId, traits, options])
  }, [queueOrExecute])

  const alias = useCallback((userId, previousId = null) => {
    queueOrExecute('alias', [userId, previousId])
  }, [queueOrExecute])

  const reset = useCallback(() => {
    queueOrExecute('reset', [])
  }, [queueOrExecute])

  const value = {
    track,
    identify,
    page,
    group,
    alias,
    reset,
    isReady
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook to use analytics
 */
export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  
  return context
}

/**
 * E-commerce specific analytics hooks
 */
export const useEcommerceAnalytics = () => {
  const { track } = useAnalytics()

  const trackProductView = useCallback((product) => {
    track('Product Viewed', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      currency: 'USD',
      brand: product.brand
    })
  }, [track])

  const trackProductClick = useCallback((product, position = null, list = null) => {
    track('Product Clicked', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      position,
      list
    })
  }, [track])

  const trackAddToCart = useCallback((product, quantity = 1) => {
    track('Product Added', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      quantity,
      value: product.price * quantity,
      currency: 'USD'
    })
  }, [track])

  const trackRemoveFromCart = useCallback((product, quantity = 1) => {
    track('Product Removed', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      quantity,
      value: product.price * quantity,
      currency: 'USD'
    })
  }, [track])

  const trackCartView = useCallback((cart) => {
    track('Cart Viewed', {
      cart_id: cart.id,
      products: cart.items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        quantity: item.quantity
      })),
      value: cart.total,
      currency: 'USD'
    })
  }, [track])

  const trackCheckoutStarted = useCallback((cart) => {
    track('Checkout Started', {
      order_id: cart.id,
      products: cart.items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        quantity: item.quantity
      })),
      value: cart.total,
      currency: 'USD'
    })
  }, [track])

  const trackCheckoutStep = useCallback((step, cart, additionalData = {}) => {
    track('Checkout Step Completed', {
      step,
      order_id: cart.id,
      value: cart.total,
      currency: 'USD',
      ...additionalData
    })
  }, [track])

  const trackPurchase = useCallback((order) => {
    track('Order Completed', {
      order_id: order.id,
      total: order.total,
      revenue: order.total,
      shipping: order.shipping,
      tax: order.tax,
      discount: order.discount,
      coupon: order.coupon,
      currency: 'USD',
      products: order.items.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        quantity: item.quantity
      }))
    })
  }, [track])

  const trackSearch = useCallback((query, results = null) => {
    track('Products Searched', {
      query,
      results_count: results?.length || 0
    })
  }, [track])

  const trackWishlistAdd = useCallback((product) => {
    track('Product Added to Wishlist', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price
    })
  }, [track])

  const trackWishlistRemove = useCallback((product) => {
    track('Product Removed from Wishlist', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price
    })
  }, [track])

  return {
    trackProductView,
    trackProductClick,
    trackAddToCart,
    trackRemoveFromCart,
    trackCartView,
    trackCheckoutStarted,
    trackCheckoutStep,
    trackPurchase,
    trackSearch,
    trackWishlistAdd,
    trackWishlistRemove
  }
}

/**
 * Page tracking hook
 */
export const usePageTracking = () => {
  const { page } = useAnalytics()
  
  useEffect(() => {
    page()
  }, [page])
}

/**
 * Auto-tracking hook for common events
 */
export const useAutoTracking = (options = {}) => {
  const { track } = useAnalytics()
  
  useEffect(() => {
    // Track scroll depth
    if (options.scrollDepth) {
      let maxScroll = 0
      const trackScroll = () => {
        const scrollPercent = Math.round(
          (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        )
        
        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
          maxScroll = scrollPercent
          track('Scroll Depth', { percent: scrollPercent })
        }
      }
      
      window.addEventListener('scroll', trackScroll)
      return () => window.removeEventListener('scroll', trackScroll)
    }
  }, [track, options.scrollDepth])

  useEffect(() => {
    // Track time on page
    if (options.timeOnPage) {
      const startTime = Date.now()
      
      const trackTimeOnPage = () => {
        const timeSpent = Math.round((Date.now() - startTime) / 1000)
        track('Time on Page', { seconds: timeSpent })
      }
      
      window.addEventListener('beforeunload', trackTimeOnPage)
      return () => window.removeEventListener('beforeunload', trackTimeOnPage)
    }
  }, [track, options.timeOnPage])

  useEffect(() => {
    // Track clicks on external links
    if (options.externalLinks) {
      const trackExternalClick = (event) => {
        const link = event.target.closest('a')
        if (link && link.hostname !== window.location.hostname) {
          track('External Link Clicked', {
            url: link.href,
            text: link.textContent
          })
        }
      }
      
      document.addEventListener('click', trackExternalClick)
      return () => document.removeEventListener('click', trackExternalClick)
    }
  }, [track, options.externalLinks])
}

/**
 * Performance tracking hook
 */
export const usePerformanceTracking = () => {
  const { track } = useAnalytics()
  
  useEffect(() => {
    // Track Core Web Vitals
    const trackWebVitals = () => {
      // First Contentful Paint
      const paintEntries = performance.getEntriesByType('paint')
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
      
      if (fcpEntry) {
        track('Performance Metric', {
          metric: 'first_contentful_paint',
          value: Math.round(fcpEntry.startTime)
        })
      }

      // Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          track('Performance Metric', {
            metric: 'largest_contentful_paint',
            value: Math.round(lastEntry.startTime)
          })
        })
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      }
    }
    
    // Track after page load
    if (document.readyState === 'complete') {
      trackWebVitals()
    } else {
      window.addEventListener('load', trackWebVitals)
    }
  }, [track])
}

export default {
  AnalyticsProvider,
  useAnalytics,
  useEcommerceAnalytics,
  usePageTracking,
  useAutoTracking,
  usePerformanceTracking
}