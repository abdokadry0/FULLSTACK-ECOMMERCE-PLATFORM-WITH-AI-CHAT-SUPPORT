import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"
import { useARIA, useFocusManagement } from "../../hooks/useAccessibility"

/**
 * AccessibleButton - Button with comprehensive accessibility features
 * Includes ARIA attributes, keyboard navigation, and screen reader support
 */
const AccessibleButton = React.forwardRef(({
  className,
  variant,
  size,
  children,
  disabled,
  loading,
  pressed,
  expanded,
  hasPopup,
  controls,
  describedBy,
  label,
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  const { getButtonProps } = useARIA()
  const { focusVisible } = useFocusManagement()
  const [isPressed, setIsPressed] = React.useState(false)

  const handleClick = (e) => {
    if (disabled || loading) return
    onClick?.(e)
  }

  const handleKeyDown = (e) => {
    // Handle space and enter keys
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      if (!disabled && !loading) {
        setIsPressed(true)
        onClick?.(e)
        
        // Reset pressed state
        setTimeout(() => setIsPressed(false), 150)
      }
    }
    
    onKeyDown?.(e)
  }

  const ariaProps = getButtonProps({
    expanded,
    hasPopup,
    controls,
    describedBy,
    label,
    pressed
  })

  return (
    <Button
      ref={ref}
      className={cn(
        // Focus visible styles
        focusVisible && "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        // Pressed state
        isPressed && "scale-95",
        className
      )}
      variant={variant}
      size={size}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...ariaProps}
      {...props}
    >
      {loading && (
        <span className="sr-only">Loading</span>
      )}
      {children}
    </Button>
  )
})

AccessibleButton.displayName = "AccessibleButton"

/**
 * ToggleButton - Accessible toggle button with pressed state
 */
const ToggleButton = React.forwardRef(({
  pressed = false,
  onPressedChange,
  children,
  pressedLabel,
  unpressedLabel,
  ...props
}, ref) => {
  const handleClick = (e) => {
    onPressedChange?.(!pressed)
    props.onClick?.(e)
  }

  return (
    <AccessibleButton
      ref={ref}
      pressed={pressed}
      label={pressed ? pressedLabel : unpressedLabel}
      onClick={handleClick}
      {...props}
    >
      <span aria-hidden="true">{children}</span>
      <span className="sr-only">
        {pressed ? pressedLabel : unpressedLabel}
      </span>
    </AccessibleButton>
  )
})

ToggleButton.displayName = "ToggleButton"

/**
 * MenuButton - Accessible menu trigger button
 */
const MenuButton = React.forwardRef(({
  expanded = false,
  onExpandedChange,
  menuId,
  children,
  ...props
}, ref) => {
  const handleClick = (e) => {
    onExpandedChange?.(!expanded)
    props.onClick?.(e)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!expanded) {
        onExpandedChange?.(true)
      }
    }
    
    props.onKeyDown?.(e)
  }

  return (
    <AccessibleButton
      ref={ref}
      expanded={expanded}
      hasPopup="menu"
      controls={menuId}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
      <span className="sr-only">
        {expanded ? "Close menu" : "Open menu"}
      </span>
    </AccessibleButton>
  )
})

MenuButton.displayName = "MenuButton"

/**
 * IconButton - Accessible icon-only button
 */
const IconButton = React.forwardRef(({
  icon: Icon,
  label,
  tooltip,
  children,
  ...props
}, ref) => {
  const [showTooltip, setShowTooltip] = React.useState(false)
  const tooltipId = React.useId()

  return (
    <div className="relative">
      <AccessibleButton
        ref={ref}
        label={label}
        describedBy={tooltip ? tooltipId : undefined}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        {...props}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
        {children}
        <span className="sr-only">{label}</span>
      </AccessibleButton>
      
      {tooltip && showTooltip && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded whitespace-nowrap z-50"
        >
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
    </div>
  )
})

IconButton.displayName = "IconButton"

/**
 * ButtonGroup - Accessible button group with keyboard navigation
 */
const ButtonGroup = React.forwardRef(({
  className,
  orientation = "horizontal",
  children,
  label,
  ...props
}, ref) => {
  const groupRef = React.useRef(null)
  const [focusedIndex, setFocusedIndex] = React.useState(0)
  
  React.useImperativeHandle(ref, () => groupRef.current)

  const buttons = React.Children.toArray(children)

  const handleKeyDown = (e, index) => {
    let nextIndex = index

    switch (e.key) {
      case 'ArrowRight':
        if (orientation === 'horizontal') {
          e.preventDefault()
          nextIndex = (index + 1) % buttons.length
        }
        break
      case 'ArrowLeft':
        if (orientation === 'horizontal') {
          e.preventDefault()
          nextIndex = index === 0 ? buttons.length - 1 : index - 1
        }
        break
      case 'ArrowDown':
        if (orientation === 'vertical') {
          e.preventDefault()
          nextIndex = (index + 1) % buttons.length
        }
        break
      case 'ArrowUp':
        if (orientation === 'vertical') {
          e.preventDefault()
          nextIndex = index === 0 ? buttons.length - 1 : index - 1
        }
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = buttons.length - 1
        break
    }

    if (nextIndex !== index) {
      setFocusedIndex(nextIndex)
      // Focus will be handled by the button's tabIndex
    }
  }

  return (
    <div
      ref={groupRef}
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex",
        orientation === "horizontal" ? "flex-row" : "flex-col",
        className
      )}
      {...props}
    >
      {buttons.map((button, index) =>
        React.cloneElement(button, {
          key: index,
          tabIndex: focusedIndex === index ? 0 : -1,
          onKeyDown: (e) => {
            handleKeyDown(e, index)
            button.props.onKeyDown?.(e)
          },
          onFocus: () => {
            setFocusedIndex(index)
            button.props.onFocus?.()
          }
        })
      )}
    </div>
  )
})

ButtonGroup.displayName = "ButtonGroup"

export { 
  AccessibleButton, 
  ToggleButton, 
  MenuButton, 
  IconButton, 
  ButtonGroup 
}