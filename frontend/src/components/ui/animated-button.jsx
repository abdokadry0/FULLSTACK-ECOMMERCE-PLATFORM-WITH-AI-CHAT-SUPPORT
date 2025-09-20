import * as React from "react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

/**
 * AnimatedButton - Button with micro-interactions and smooth animations
 * Provides professional visual feedback and enhanced user experience
 */
const AnimatedButton = React.forwardRef(({
  className,
  variant = "default",
  size = "default",
  animation = "scale",
  children,
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = React.useState(false)
  const [ripples, setRipples] = React.useState([])

  const handleMouseDown = (e) => {
    setIsPressed(true)
    
    // Create ripple effect
    if (animation === "ripple") {
      const rect = e.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2
      
      const newRipple = {
        x,
        y,
        size,
        id: Date.now()
      }
      
      setRipples(prev => [...prev, newRipple])
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
      }, 600)
    }
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleMouseLeave = () => {
    setIsPressed(false)
  }

  const getAnimationClasses = () => {
    switch (animation) {
      case "scale":
        return "transform transition-all duration-150 ease-in-out hover:scale-105 active:scale-95"
      case "bounce":
        return "transform transition-all duration-200 ease-in-out hover:scale-105 active:animate-bounce"
      case "slide":
        return "transform transition-all duration-200 ease-in-out hover:translate-y-[-2px] active:translate-y-0 hover:shadow-lg"
      case "glow":
        return "transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/25"
      case "ripple":
        return "relative overflow-hidden transition-all duration-200 ease-in-out"
      case "pulse":
        return "transition-all duration-200 ease-in-out hover:animate-pulse"
      default:
        return "transition-all duration-150 ease-in-out"
    }
  }

  return (
    <Button
      ref={ref}
      className={cn(
        getAnimationClasses(),
        isPressed && animation === "scale" && "scale-95",
        className
      )}
      variant={variant}
      size={size}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {animation === "ripple" && (
        <span className="absolute inset-0 overflow-hidden rounded-inherit">
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute bg-white/30 rounded-full animate-ping"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: ripple.size,
                height: ripple.size,
                animationDuration: "600ms",
                animationTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            />
          ))}
        </span>
      )}
      <span className="relative z-10">
        {children}
      </span>
    </Button>
  )
})

AnimatedButton.displayName = "AnimatedButton"

/**
 * FloatingActionButton - Material Design inspired FAB with animations
 */
const FloatingActionButton = React.forwardRef(({
  className,
  size = "default",
  children,
  ...props
}, ref) => {
  return (
    <AnimatedButton
      ref={ref}
      className={cn(
        "rounded-full shadow-lg hover:shadow-xl transition-all duration-300",
        "fixed bottom-6 right-6 z-50",
        size === "sm" && "h-12 w-12",
        size === "default" && "h-14 w-14",
        size === "lg" && "h-16 w-16",
        className
      )}
      animation="scale"
      {...props}
    >
      {children}
    </AnimatedButton>
  )
})

FloatingActionButton.displayName = "FloatingActionButton"

/**
 * MagneticButton - Button with magnetic hover effect
 */
const MagneticButton = React.forwardRef(({
  className,
  children,
  magneticStrength = 0.3,
  ...props
}, ref) => {
  const buttonRef = React.useRef(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  React.useImperativeHandle(ref, () => buttonRef.current)

  const handleMouseMove = (e) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * magneticStrength
    const deltaY = (e.clientY - centerY) * magneticStrength
    
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Button
      ref={buttonRef}
      className={cn(
        "transition-transform duration-300 ease-out",
        className
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Button>
  )
})

MagneticButton.displayName = "MagneticButton"

export { 
  AnimatedButton, 
  FloatingActionButton, 
  MagneticButton 
}