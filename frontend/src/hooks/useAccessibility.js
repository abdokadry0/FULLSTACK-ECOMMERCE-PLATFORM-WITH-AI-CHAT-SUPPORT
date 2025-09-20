import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * useAccessibility - Comprehensive accessibility management hook
 * Provides ARIA labels, keyboard navigation, and focus management
 */
export const useAccessibility = () => {
  const [announcements, setAnnouncements] = useState([])
  const announcementRef = useRef(null)

  // Screen reader announcements
  const announce = useCallback((message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority
    }
    
    setAnnouncements(prev => [...prev, announcement])
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== announcement.id))
    }, 1000)
  }, [])

  // Live region component for screen reader announcements
  const LiveRegion = () => (
    <div
      ref={announcementRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcements.map(announcement => (
        <div key={announcement.id} aria-live={announcement.priority}>
          {announcement.message}
        </div>
      ))}
    </div>
  )

  return {
    announce,
    LiveRegion
  }
}

/**
 * useKeyboardNavigation - Enhanced keyboard navigation hook
 */
export const useKeyboardNavigation = (items = [], options = {}) => {
  const {
    loop = true,
    orientation = 'vertical', // 'vertical' | 'horizontal' | 'both'
    onSelect,
    onEscape
  } = options

  const [activeIndex, setActiveIndex] = useState(-1)
  const itemRefs = useRef([])

  const handleKeyDown = useCallback((event) => {
    const { key } = event
    
    switch (key) {
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault()
          setActiveIndex(prev => {
            const next = prev + 1
            return next >= items.length ? (loop ? 0 : prev) : next
          })
        }
        break
        
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault()
          setActiveIndex(prev => {
            const next = prev - 1
            return next < 0 ? (loop ? items.length - 1 : prev) : next
          })
        }
        break
        
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault()
          setActiveIndex(prev => {
            const next = prev + 1
            return next >= items.length ? (loop ? 0 : prev) : next
          })
        }
        break
        
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault()
          setActiveIndex(prev => {
            const next = prev - 1
            return next < 0 ? (loop ? items.length - 1 : prev) : next
          })
        }
        break
        
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
        
      case 'End':
        event.preventDefault()
        setActiveIndex(items.length - 1)
        break
        
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (activeIndex >= 0 && onSelect) {
          onSelect(items[activeIndex], activeIndex)
        }
        break
        
      case 'Escape':
        event.preventDefault()
        if (onEscape) {
          onEscape()
        }
        break
    }
  }, [items, activeIndex, loop, orientation, onSelect, onEscape])

  // Focus management
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].focus()
    }
  }, [activeIndex])

  const getItemProps = useCallback((index) => ({
    ref: (el) => {
      itemRefs.current[index] = el
    },
    tabIndex: activeIndex === index ? 0 : -1,
    'aria-selected': activeIndex === index,
    onKeyDown: handleKeyDown,
    onFocus: () => setActiveIndex(index)
  }), [activeIndex, handleKeyDown])

  return {
    activeIndex,
    setActiveIndex,
    getItemProps,
    handleKeyDown
  }
}

/**
 * useFocusManagement - Advanced focus management hook
 */
export const useFocusManagement = () => {
  const focusHistoryRef = useRef([])
  const trapRef = useRef(null)

  // Focus trap for modals and dialogs
  const trapFocus = useCallback((containerRef) => {
    if (!containerRef.current) return

    const focusableElements = containerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement.focus()
        }
      }
    }

    containerRef.current.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => {
      containerRef.current?.removeEventListener('keydown', handleTabKey)
    }
  }, [])

  // Save and restore focus
  const saveFocus = useCallback(() => {
    const activeElement = document.activeElement
    if (activeElement && activeElement !== document.body) {
      focusHistoryRef.current.push(activeElement)
    }
  }, [])

  const restoreFocus = useCallback(() => {
    const lastFocused = focusHistoryRef.current.pop()
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus()
    }
  }, [])

  // Focus visible management
  const [focusVisible, setFocusVisible] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setFocusVisible(true)
      }
    }

    const handleMouseDown = () => {
      setFocusVisible(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  return {
    trapFocus,
    saveFocus,
    restoreFocus,
    focusVisible
  }
}

/**
 * useARIA - ARIA attributes management hook
 */
export const useARIA = () => {
  const generateId = useCallback((prefix = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const getComboboxProps = useCallback((options = {}) => {
    const {
      expanded = false,
      hasPopup = 'listbox',
      controls,
      describedBy,
      label
    } = options

    return {
      role: 'combobox',
      'aria-expanded': expanded,
      'aria-haspopup': hasPopup,
      'aria-controls': controls,
      'aria-describedby': describedBy,
      'aria-label': label
    }
  }, [])

  const getListboxProps = useCallback((options = {}) => {
    const {
      multiselectable = false,
      orientation = 'vertical',
      label,
      labelledBy
    } = options

    return {
      role: 'listbox',
      'aria-multiselectable': multiselectable,
      'aria-orientation': orientation,
      'aria-label': label,
      'aria-labelledby': labelledBy
    }
  }, [])

  const getOptionProps = useCallback((options = {}) => {
    const {
      selected = false,
      disabled = false,
      index,
      setSize
    } = options

    return {
      role: 'option',
      'aria-selected': selected,
      'aria-disabled': disabled,
      'aria-posinset': index !== undefined ? index + 1 : undefined,
      'aria-setsize': setSize
    }
  }, [])

  const getButtonProps = useCallback((options = {}) => {
    const {
      expanded = false,
      hasPopup = false,
      controls,
      describedBy,
      label,
      pressed
    } = options

    return {
      'aria-expanded': hasPopup ? expanded : undefined,
      'aria-haspopup': hasPopup,
      'aria-controls': controls,
      'aria-describedby': describedBy,
      'aria-label': label,
      'aria-pressed': pressed !== undefined ? pressed : undefined
    }
  }, [])

  const getLinkProps = useCallback((options = {}) => {
    const {
      describedBy,
      label,
      current = false
    } = options

    return {
      'aria-describedby': describedBy,
      'aria-label': label,
      'aria-current': current ? 'page' : undefined
    }
  }, [])

  return {
    generateId,
    getComboboxProps,
    getListboxProps,
    getOptionProps,
    getButtonProps,
    getLinkProps
  }
}

/**
 * useReducedMotion - Respects user's motion preferences
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
}

export default {
  useAccessibility,
  useKeyboardNavigation,
  useFocusManagement,
  useARIA,
  useReducedMotion
}