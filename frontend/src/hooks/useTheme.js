import { useState, useEffect, useContext, createContext, useCallback, useMemo } from 'react'

/**
 * Theme Context
 */
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  customTheme: null,
  setCustomTheme: () => {},
  availableThemes: [],
  isDark: false,
  colors: {},
  spacing: {},
  typography: {},
  breakpoints: {},
  shadows: {},
  borderRadius: {},
  transitions: {}
})

/**
 * Default theme configurations
 */
const defaultThemes = {
  light: {
    name: 'Light',
    colors: {
      // Primary colors
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      
      // Secondary colors
      secondary: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a'
      },
      
      // Success colors
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      
      // Warning colors
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      
      // Error colors
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      
      // Neutral colors
      neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717'
      },
      
      // Background colors
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        inverse: '#0f172a'
      },
      
      // Text colors
      text: {
        primary: '#0f172a',
        secondary: '#475569',
        tertiary: '#64748b',
        inverse: '#ffffff',
        disabled: '#94a3b8'
      },
      
      // Border colors
      border: {
        primary: '#e2e8f0',
        secondary: '#cbd5e1',
        focus: '#0ea5e9',
        error: '#ef4444'
      }
    },
    
    spacing: {
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      8: '2rem',
      10: '2.5rem',
      12: '3rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      32: '8rem',
      40: '10rem',
      48: '12rem',
      56: '14rem',
      64: '16rem'
    },
    
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Menlo', 'Monaco', 'monospace']
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }]
      },
      fontWeight: {
        thin: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900'
      }
    },
    
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
    },
    
    borderRadius: {
      none: '0px',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    
    transitions: {
      none: 'none',
      all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      default: 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      colors: 'color, background-color, border-color, text-decoration-color, fill, stroke 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: 'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      shadow: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1)'
    }
  },
  
  dark: {
    name: 'Dark',
    colors: {
      // Primary colors (same as light)
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e'
      },
      
      // Secondary colors (inverted)
      secondary: {
        50: '#0f172a',
        100: '#1e293b',
        200: '#334155',
        300: '#475569',
        400: '#64748b',
        500: '#94a3b8',
        600: '#cbd5e1',
        700: '#e2e8f0',
        800: '#f1f5f9',
        900: '#f8fafc'
      },
      
      // Success colors (same as light)
      success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d'
      },
      
      // Warning colors (same as light)
      warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f'
      },
      
      // Error colors (same as light)
      error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d'
      },
      
      // Neutral colors (inverted)
      neutral: {
        50: '#171717',
        100: '#262626',
        200: '#404040',
        300: '#525252',
        400: '#737373',
        500: '#a3a3a3',
        600: '#d4d4d4',
        700: '#e5e5e5',
        800: '#f5f5f5',
        900: '#fafafa'
      },
      
      // Background colors (dark)
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
        inverse: '#ffffff'
      },
      
      // Text colors (inverted)
      text: {
        primary: '#f8fafc',
        secondary: '#cbd5e1',
        tertiary: '#94a3b8',
        inverse: '#0f172a',
        disabled: '#64748b'
      },
      
      // Border colors (dark)
      border: {
        primary: '#334155',
        secondary: '#475569',
        focus: '#0ea5e9',
        error: '#ef4444'
      }
    },
    
    // Inherit other properties from light theme
    spacing: defaultThemes?.light?.spacing || {},
    typography: defaultThemes?.light?.typography || {},
    breakpoints: defaultThemes?.light?.breakpoints || {},
    borderRadius: defaultThemes?.light?.borderRadius || {},
    transitions: defaultThemes?.light?.transitions || {},
    
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
      base: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
      inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)'
    }
  }
}

// Fix the circular reference
defaultThemes.dark.spacing = defaultThemes.light.spacing
defaultThemes.dark.typography = defaultThemes.light.typography
defaultThemes.dark.breakpoints = defaultThemes.light.breakpoints
defaultThemes.dark.borderRadius = defaultThemes.light.borderRadius
defaultThemes.dark.transitions = defaultThemes.light.transitions

/**
 * Theme Provider
 */
export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'light',
  customThemes = {},
  persistTheme = true,
  systemTheme = true
}) => {
  const [theme, setThemeState] = useState(() => {
    if (persistTheme && typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme')
      if (saved) return saved
    }
    
    if (systemTheme && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    return defaultTheme
  })
  
  const [customTheme, setCustomTheme] = useState(null)

  // Listen to system theme changes
  useEffect(() => {
    if (systemTheme && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e) => {
        if (!persistTheme || !localStorage.getItem('theme')) {
          setThemeState(e.matches ? 'dark' : 'light')
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [systemTheme, persistTheme])

  // Apply theme to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const currentThemeConfig = getCurrentTheme()
      
      // Update CSS custom properties
      const root = document.documentElement
      
      // Set color variables
      Object.entries(currentThemeConfig.colors).forEach(([category, colors]) => {
        if (typeof colors === 'object' && colors !== null) {
          Object.entries(colors).forEach(([shade, value]) => {
            root.style.setProperty(`--color-${category}-${shade}`, value)
          })
        } else {
          root.style.setProperty(`--color-${category}`, colors)
        }
      })
      
      // Set spacing variables
      Object.entries(currentThemeConfig.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value)
      })
      
      // Set shadow variables
      Object.entries(currentThemeConfig.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value)
      })
      
      // Set border radius variables
      Object.entries(currentThemeConfig.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value)
      })
      
      // Update theme class
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .concat(` theme-${theme}`)
        .trim()
      
      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]')
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', currentThemeConfig.colors.background.primary)
      }
    }
  }, [theme, customTheme])

  // Set theme with persistence
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
    
    if (persistTheme && typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme)
    }
  }, [persistTheme])

  // Toggle theme
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }, [theme, setTheme])

  // Get current theme configuration
  const getCurrentTheme = useCallback(() => {
    if (customTheme) {
      return customTheme
    }
    
    const allThemes = { ...defaultThemes, ...customThemes }
    return allThemes[theme] || defaultThemes[defaultTheme]
  }, [theme, customTheme, customThemes, defaultTheme])

  // Available themes
  const availableThemes = useMemo(() => {
    const allThemes = { ...defaultThemes, ...customThemes }
    return Object.keys(allThemes).map(key => ({
      key,
      name: allThemes[key].name || key,
      ...allThemes[key]
    }))
  }, [customThemes])

  // Is dark theme
  const isDark = useMemo(() => {
    return theme === 'dark' || getCurrentTheme().colors.background.primary === '#0f172a'
  }, [theme, getCurrentTheme])

  // Current theme config
  const currentThemeConfig = getCurrentTheme()

  const value = {
    theme,
    setTheme,
    toggleTheme,
    customTheme,
    setCustomTheme,
    availableThemes,
    isDark,
    colors: currentThemeConfig.colors,
    spacing: currentThemeConfig.spacing,
    typography: currentThemeConfig.typography,
    breakpoints: currentThemeConfig.breakpoints,
    shadows: currentThemeConfig.shadows,
    borderRadius: currentThemeConfig.borderRadius,
    transitions: currentThemeConfig.transitions
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to use theme
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  
  return context
}

/**
 * Hook for responsive design
 */
export const useResponsive = () => {
  const { breakpoints } = useTheme()
  const [screenSize, setScreenSize] = useState('lg')
  
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const updateScreenSize = () => {
      const width = window.innerWidth
      
      if (width < parseInt(breakpoints.sm)) {
        setScreenSize('xs')
      } else if (width < parseInt(breakpoints.md)) {
        setScreenSize('sm')
      } else if (width < parseInt(breakpoints.lg)) {
        setScreenSize('md')
      } else if (width < parseInt(breakpoints.xl)) {
        setScreenSize('lg')
      } else if (width < parseInt(breakpoints['2xl'])) {
        setScreenSize('xl')
      } else {
        setScreenSize('2xl')
      }
    }
    
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [breakpoints])
  
  const isMobile = screenSize === 'xs' || screenSize === 'sm'
  const isTablet = screenSize === 'md'
  const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl'
  
  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints
  }
}

/**
 * Hook for theme-aware styling
 */
export const useThemedStyles = () => {
  const theme = useTheme()
  
  const getColor = useCallback((path) => {
    const keys = path.split('.')
    let value = theme.colors
    
    for (const key of keys) {
      value = value?.[key]
      if (value === undefined) break
    }
    
    return value || path
  }, [theme.colors])
  
  const getSpacing = useCallback((key) => {
    return theme.spacing[key] || key
  }, [theme.spacing])
  
  const getShadow = useCallback((key) => {
    return theme.shadows[key] || key
  }, [theme.shadows])
  
  const getRadius = useCallback((key) => {
    return theme.borderRadius[key] || key
  }, [theme.borderRadius])
  
  const getTransition = useCallback((key) => {
    return theme.transitions[key] || key
  }, [theme.transitions])
  
  return {
    getColor,
    getSpacing,
    getShadow,
    getRadius,
    getTransition,
    ...theme
  }
}

/**
 * Hook for creating theme variants
 */
export const useThemeVariants = () => {
  const { setCustomTheme, colors } = useTheme()
  
  const createVariant = useCallback((baseTheme, overrides) => {
    const variant = {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        ...overrides.colors
      },
      ...overrides
    }
    
    setCustomTheme(variant)
    return variant
  }, [setCustomTheme])
  
  const createColorScheme = useCallback((primaryColor, secondaryColor) => {
    const colorScheme = {
      colors: {
        ...colors,
        primary: primaryColor,
        secondary: secondaryColor
      }
    }
    
    return colorScheme
  }, [colors])
  
  return {
    createVariant,
    createColorScheme
  }
}

export default {
  ThemeProvider,
  useTheme,
  useResponsive,
  useThemedStyles,
  useThemeVariants
}