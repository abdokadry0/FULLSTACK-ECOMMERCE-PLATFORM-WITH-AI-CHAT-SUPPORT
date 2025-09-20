import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ErrorBoundary } from 'react-error-boundary'

// Theme Provider
import { ThemeProvider } from '../../hooks/useTheme'

// Internationalization Provider
import { I18nProvider } from '../../hooks/useInternationalization'

// Analytics Provider
import { AnalyticsProvider } from '../../hooks/useAnalytics'

// Feature Flags Provider
import { FeatureFlagsProvider } from '../../hooks/useFeatureFlags'

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
          Something went wrong
        </h2>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
          {error.message || 'An unexpected error occurred'}
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={resetErrorBoundary}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Try again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Reload page
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="text-sm text-gray-500 cursor-pointer">
              Error details (development only)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

// Create Query Client
const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: (failureCount, error) => {
          // Don't retry on 4xx errors
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          return failureCount < 3
        },
        refetchOnWindowFocus: false,
        refetchOnReconnect: true
      },
      mutations: {
        retry: 1
      }
    }
  })
}

/**
 * App Providers Component
 * Combines all providers needed for the application
 */
export const AppProviders = ({ children, config = {} }) => {
  const queryClient = React.useMemo(() => createQueryClient(), [])

  // Default configurations
  const defaultConfig = {
    theme: {
      defaultTheme: 'light',
      persistTheme: true,
      systemTheme: true,
      customThemes: {}
    },
    i18n: {
      defaultLocale: 'en',
      persistLocale: true,
      translations: {},
      loadTranslations: null
    },
    analytics: {
      providers: ['gtag'],
      config: {
        gtag: {
          measurementId: process.env.REACT_APP_GA_MEASUREMENT_ID
        },
        segment: {
          writeKey: process.env.REACT_APP_SEGMENT_WRITE_KEY
        },
        facebook: {
          pixelId: process.env.REACT_APP_FB_PIXEL_ID
        }
      },
      debug: process.env.NODE_ENV === 'development'
    },
    featureFlags: {
      apiUrl: process.env.REACT_APP_FEATURE_FLAGS_API,
      environment: process.env.NODE_ENV,
      userId: null,
      defaultFlags: {},
      enableAnalytics: true,
      enableLocalStorage: true
    }
  }

  // Merge configurations
  const mergedConfig = React.useMemo(() => {
    return {
      theme: { ...defaultConfig.theme, ...config.theme },
      i18n: { ...defaultConfig.i18n, ...config.i18n },
      analytics: { ...defaultConfig.analytics, ...config.analytics },
      featureFlags: { ...defaultConfig.featureFlags, ...config.featureFlags }
    }
  }, [config])

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Application Error:', error, errorInfo)
        
        // Report to error tracking service
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: false
          })
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider {...mergedConfig.theme}>
            <I18nProvider {...mergedConfig.i18n}>
              <AnalyticsProvider {...mergedConfig.analytics}>
                <FeatureFlagsProvider {...mergedConfig.featureFlags}>
                  {children}
                  
                  {/* Development tools */}
                  {process.env.NODE_ENV === 'development' && (
                    <ReactQueryDevtools initialIsOpen={false} />
                  )}
                </FeatureFlagsProvider>
              </AnalyticsProvider>
            </I18nProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

/**
 * Hook to access all provider contexts
 */
export const useAppContext = () => {
  const theme = React.useContext(require('../../hooks/useTheme').ThemeContext)
  const i18n = React.useContext(require('../../hooks/useInternationalization').I18nContext)
  const analytics = React.useContext(require('../../hooks/useAnalytics').AnalyticsContext)
  const featureFlags = React.useContext(require('../../hooks/useFeatureFlags').FeatureFlagsContext)

  return {
    theme,
    i18n,
    analytics,
    featureFlags
  }
}

/**
 * Higher-order component for accessing app context
 */
export const withAppContext = (Component) => {
  return React.forwardRef((props, ref) => {
    const context = useAppContext()
    
    return (
      <Component
        {...props}
        ref={ref}
        appContext={context}
      />
    )
  })
}

/**
 * Provider for specific features
 */
export const FeatureProvider = ({ feature, children, fallback = null }) => {
  const { isEnabled } = require('../../hooks/useFeatureFlags').useFeatureFlags()
  
  if (!isEnabled(feature)) {
    return fallback
  }
  
  return children
}

/**
 * Component for conditional rendering based on feature flags
 */
export const FeatureToggle = ({ 
  feature, 
  children, 
  fallback = null,
  loading = null 
}) => {
  const { isEnabled, isLoading } = require('../../hooks/useFeatureFlags').useFeatureFlags()
  
  if (isLoading) {
    return loading
  }
  
  return isEnabled(feature) ? children : fallback
}

/**
 * Hook for environment-specific configuration
 */
export const useEnvironment = () => {
  const environment = process.env.NODE_ENV
  const isProduction = environment === 'production'
  const isDevelopment = environment === 'development'
  const isTest = environment === 'test'
  
  const config = React.useMemo(() => {
    const baseConfig = {
      apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
      appUrl: process.env.REACT_APP_URL || 'http://localhost:3000',
      environment,
      version: process.env.REACT_APP_VERSION || '1.0.0'
    }
    
    if (isDevelopment) {
      return {
        ...baseConfig,
        debug: true,
        logLevel: 'debug'
      }
    }
    
    if (isProduction) {
      return {
        ...baseConfig,
        debug: false,
        logLevel: 'error'
      }
    }
    
    return baseConfig
  }, [environment, isDevelopment, isProduction])
  
  return {
    environment,
    isProduction,
    isDevelopment,
    isTest,
    config
  }
}

/**
 * Performance monitoring component
 */
export const PerformanceMonitor = ({ children }) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log)
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      })
    }
  }, [])
  
  return children
}

export default AppProviders