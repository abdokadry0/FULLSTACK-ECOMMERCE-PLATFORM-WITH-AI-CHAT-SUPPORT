import { useState, useEffect, useContext, createContext, useCallback } from 'react'

/**
 * Feature Flags Context
 */
const FeatureFlagsContext = createContext({
  flags: {},
  isEnabled: () => false,
  setFlag: () => {},
  loading: true,
  error: null
})

/**
 * Feature Flags Provider
 */
export const FeatureFlagsProvider = ({ 
  children, 
  apiEndpoint = '/api/feature-flags',
  userId = null,
  userSegment = null,
  environment = 'production',
  defaultFlags = {}
}) => {
  const [flags, setFlags] = useState(defaultFlags)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch feature flags from API
  const fetchFlags = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        ...(userId && { userId }),
        ...(userSegment && { userSegment }),
        environment
      })

      const response = await fetch(`${apiEndpoint}?${params}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch feature flags: ${response.statusText}`)
      }

      const data = await response.json()
      setFlags(prev => ({ ...prev, ...data.flags }))
    } catch (err) {
      console.error('Feature flags error:', err)
      setError(err.message)
      // Use default flags on error
      setFlags(defaultFlags)
    } finally {
      setLoading(false)
    }
  }, [apiEndpoint, userId, userSegment, environment, defaultFlags])

  // Initial fetch
  useEffect(() => {
    fetchFlags()
  }, [fetchFlags])

  // Check if a feature is enabled
  const isEnabled = useCallback((flagName, defaultValue = false) => {
    if (loading) return defaultValue
    return flags[flagName] ?? defaultValue
  }, [flags, loading])

  // Manually set a flag (for testing/development)
  const setFlag = useCallback((flagName, value) => {
    setFlags(prev => ({ ...prev, [flagName]: value }))
  }, [])

  // Refresh flags
  const refresh = useCallback(() => {
    fetchFlags()
  }, [fetchFlags])

  const value = {
    flags,
    isEnabled,
    setFlag,
    refresh,
    loading,
    error
  }

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}

/**
 * Hook to use feature flags
 */
export const useFeatureFlags = () => {
  const context = useContext(FeatureFlagsContext)
  
  if (!context) {
    throw new Error('useFeatureFlags must be used within a FeatureFlagsProvider')
  }
  
  return context
}

/**
 * Hook to check if a specific feature is enabled
 */
export const useFeatureFlag = (flagName, defaultValue = false) => {
  const { isEnabled } = useFeatureFlags()
  return isEnabled(flagName, defaultValue)
}

/**
 * Higher-order component for feature gating
 */
export const withFeatureFlag = (flagName, fallbackComponent = null) => {
  return (WrappedComponent) => {
    const FeatureGatedComponent = (props) => {
      const isEnabled = useFeatureFlag(flagName)
      
      if (!isEnabled) {
        return fallbackComponent
      }
      
      return <WrappedComponent {...props} />
    }
    
    FeatureGatedComponent.displayName = `withFeatureFlag(${WrappedComponent.displayName || WrappedComponent.name})`
    
    return FeatureGatedComponent
  }
}

/**
 * Component for conditional feature rendering
 */
export const FeatureFlag = ({ 
  name, 
  children, 
  fallback = null, 
  defaultValue = false 
}) => {
  const isEnabled = useFeatureFlag(name, defaultValue)
  
  if (!isEnabled) {
    return fallback
  }
  
  return typeof children === 'function' ? children() : children
}

/**
 * A/B Testing utilities
 */
export const useABTest = (testName, variants = ['A', 'B'], userId = null) => {
  const { flags } = useFeatureFlags()
  const [variant, setVariant] = useState(variants[0])
  
  useEffect(() => {
    // Get variant from feature flags or calculate based on user ID
    const flagValue = flags[`ab_test_${testName}`]
    
    if (flagValue && variants.includes(flagValue)) {
      setVariant(flagValue)
    } else if (userId) {
      // Simple hash-based assignment
      const hash = userId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      
      const variantIndex = Math.abs(hash) % variants.length
      setVariant(variants[variantIndex])
    }
  }, [testName, variants, userId, flags])
  
  return variant
}

/**
 * Feature rollout utilities
 */
export const useFeatureRollout = (flagName, rolloutPercentage = 100, userId = null) => {
  const { flags } = useFeatureFlags()
  const [isInRollout, setIsInRollout] = useState(false)
  
  useEffect(() => {
    // Check if feature is globally enabled
    const isGloballyEnabled = flags[flagName]
    
    if (isGloballyEnabled === true) {
      setIsInRollout(true)
      return
    }
    
    if (isGloballyEnabled === false) {
      setIsInRollout(false)
      return
    }
    
    // Calculate rollout based on user ID and percentage
    if (userId && rolloutPercentage > 0) {
      const hash = userId.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0)
        return a & a
      }, 0)
      
      const userPercentile = (Math.abs(hash) % 100) + 1
      setIsInRollout(userPercentile <= rolloutPercentage)
    } else {
      setIsInRollout(rolloutPercentage >= 100)
    }
  }, [flagName, rolloutPercentage, userId, flags])
  
  return isInRollout
}

/**
 * Feature flag analytics
 */
export const useFeatureFlagAnalytics = () => {
  const { flags } = useFeatureFlags()
  
  const trackFeatureUsage = useCallback((flagName, action = 'used', metadata = {}) => {
    // Send analytics event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'feature_flag_usage', {
        feature_name: flagName,
        action,
        feature_enabled: flags[flagName],
        ...metadata
      })
    }
    
    // You can also send to other analytics services
    console.log('Feature flag usage:', {
      flagName,
      action,
      enabled: flags[flagName],
      metadata
    })
  }, [flags])
  
  return { trackFeatureUsage }
}

/**
 * Development utilities for feature flags
 */
export const useFeatureFlagDebug = () => {
  const { flags, setFlag } = useFeatureFlags()
  
  const debugPanel = {
    getAllFlags: () => flags,
    toggleFlag: (flagName) => {
      setFlag(flagName, !flags[flagName])
    },
    enableFlag: (flagName) => {
      setFlag(flagName, true)
    },
    disableFlag: (flagName) => {
      setFlag(flagName, false)
    },
    resetFlags: () => {
      Object.keys(flags).forEach(flagName => {
        setFlag(flagName, false)
      })
    }
  }
  
  // Add debug panel to window in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      window.featureFlagDebug = debugPanel
    }
  }, [flags])
  
  return debugPanel
}

/**
 * Local storage persistence for feature flags
 */
export const useFeatureFlagPersistence = (key = 'feature_flags') => {
  const { flags, setFlag } = useFeatureFlags()
  
  // Load flags from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        const parsedFlags = JSON.parse(stored)
        Object.entries(parsedFlags).forEach(([flagName, value]) => {
          setFlag(flagName, value)
        })
      }
    } catch (error) {
      console.warn('Failed to load feature flags from localStorage:', error)
    }
  }, [key, setFlag])
  
  // Save flags to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(flags))
    } catch (error) {
      console.warn('Failed to save feature flags to localStorage:', error)
    }
  }, [flags, key])
}

/**
 * Remote config integration
 */
export const useRemoteConfig = (configKey, defaultValue = null) => {
  const { flags } = useFeatureFlags()
  const [config, setConfig] = useState(defaultValue)
  
  useEffect(() => {
    const configValue = flags[`config_${configKey}`]
    if (configValue !== undefined) {
      setConfig(configValue)
    }
  }, [configKey, flags])
  
  return config
}

export default {
  FeatureFlagsProvider,
  useFeatureFlags,
  useFeatureFlag,
  withFeatureFlag,
  FeatureFlag,
  useABTest,
  useFeatureRollout,
  useFeatureFlagAnalytics,
  useFeatureFlagDebug,
  useFeatureFlagPersistence,
  useRemoteConfig
}