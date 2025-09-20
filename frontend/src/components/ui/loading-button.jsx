import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./button"

/**
 * LoadingButton - Professional button with loading states and micro-interactions
 * Provides visual feedback during async operations
 */
const LoadingButton = React.forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  children,
  disabled,
  onClick,
  ...props
}, ref) => {
  const [isLoading, setIsLoading] = React.useState(loading)
  const [optimisticLoading, setOptimisticLoading] = React.useState(false)

  React.useEffect(() => {
    setIsLoading(loading)
  }, [loading])

  const handleClick = async (e) => {
    if (isLoading || disabled) return

    // Optimistic loading for better UX
    if (onClick && typeof onClick === 'function') {
      setOptimisticLoading(true)
      
      try {
        const result = onClick(e)
        
        // Handle async functions
        if (result && typeof result.then === 'function') {
          await result
        }
      } catch (error) {
        console.error('Button action failed:', error)
      } finally {
        setOptimisticLoading(false)
      }
    }
  }

  const showLoading = isLoading || optimisticLoading
  const isDisabled = disabled || showLoading

  return (
    <Button
      className={cn(
        "relative transition-all duration-200",
        showLoading && "cursor-not-allowed",
        className
      )}
      variant={variant}
      size={size}
      asChild={asChild}
      disabled={isDisabled}
      onClick={handleClick}
      ref={ref}
      {...props}
    >
      <span className={cn(
        "flex items-center justify-center transition-opacity duration-200",
        showLoading && "opacity-0"
      )}>
        {children}
      </span>
      
      {showLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          {loadingText || "Loading..."}
        </span>
      )}
    </Button>
  )
})

LoadingButton.displayName = "LoadingButton"

/**
 * AsyncButton - Button that automatically handles async operations
 */
const AsyncButton = React.forwardRef(({
  asyncAction,
  onSuccess,
  onError,
  successMessage = "Success!",
  errorMessage = "Something went wrong",
  ...props
}, ref) => {
  const [loading, setLoading] = React.useState(false)

  const handleClick = async (e) => {
    if (!asyncAction) return

    setLoading(true)
    
    try {
      const result = await asyncAction(e)
      
      if (onSuccess) {
        onSuccess(result)
      }
      
      // Show success toast if available
      if (window.toast) {
        window.toast.success(successMessage)
      }
    } catch (error) {
      console.error('Async action failed:', error)
      
      if (onError) {
        onError(error)
      }
      
      // Show error toast if available
      if (window.toast) {
        window.toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={handleClick}
      ref={ref}
      {...props}
    />
  )
})

AsyncButton.displayName = "AsyncButton"

export { LoadingButton, AsyncButton }