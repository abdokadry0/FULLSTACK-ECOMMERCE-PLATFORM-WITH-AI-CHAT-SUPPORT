import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { useFocusManagement, useKeyboardNavigation } from "../../hooks/useAccessibility"

/**
 * AccessibleModal - Modal with comprehensive accessibility features
 */
const AccessibleModal = DialogPrimitive.Root

const AccessibleModalTrigger = DialogPrimitive.Trigger

const AccessibleModalPortal = DialogPrimitive.Portal

const AccessibleModalClose = DialogPrimitive.Close

const AccessibleModalOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
AccessibleModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const AccessibleModalContent = React.forwardRef(({ 
  className, 
  children, 
  showCloseButton = true,
  closeButtonLabel = "Close dialog",
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props 
}, ref) => {
  const { trapFocus, restoreFocus } = useFocusManagement()
  const { handleKeyDown } = useKeyboardNavigation({
    onEscape: () => {
      // Let Radix handle the escape key
    }
  })

  const handleOpenAutoFocus = (event) => {
    trapFocus(event.currentTarget)
    onOpenAutoFocus?.(event)
  }

  const handleCloseAutoFocus = (event) => {
    restoreFocus()
    onCloseAutoFocus?.(event)
  }

  return (
    <AccessibleModalPortal>
      <AccessibleModalOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "sm:rounded-lg",
          className
        )}
        onOpenAutoFocus={handleOpenAutoFocus}
        onCloseAutoFocus={handleCloseAutoFocus}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        {showCloseButton && (
          <AccessibleModalClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">{closeButtonLabel}</span>
          </AccessibleModalClose>
        )}
      </DialogPrimitive.Content>
    </AccessibleModalPortal>
  )
})
AccessibleModalContent.displayName = DialogPrimitive.Content.displayName

const AccessibleModalHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AccessibleModalHeader.displayName = "AccessibleModalHeader"

const AccessibleModalFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AccessibleModalFooter.displayName = "AccessibleModalFooter"

const AccessibleModalTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
AccessibleModalTitle.displayName = DialogPrimitive.Title.displayName

const AccessibleModalDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AccessibleModalDescription.displayName = DialogPrimitive.Description.displayName

/**
 * ConfirmationModal - Accessible confirmation dialog
 */
const ConfirmationModal = React.forwardRef(({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default", // default, destructive
  loading = false,
  children,
  ...props
}, ref) => {
  const handleConfirm = () => {
    onConfirm?.()
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  return (
    <AccessibleModal open={open} onOpenChange={onOpenChange}>
      <AccessibleModalContent ref={ref} {...props}>
        <AccessibleModalHeader>
          <AccessibleModalTitle>{title}</AccessibleModalTitle>
          {description && (
            <AccessibleModalDescription>
              {description}
            </AccessibleModalDescription>
          )}
        </AccessibleModalHeader>
        
        {children}
        
        <AccessibleModalFooter>
          <AccessibleModalClose asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </button>
          </AccessibleModalClose>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2",
              variant === "destructive" 
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && (
              <svg
                className="mr-2 h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText}
          </button>
        </AccessibleModalFooter>
      </AccessibleModalContent>
    </AccessibleModal>
  )
})

ConfirmationModal.displayName = "ConfirmationModal"

/**
 * AlertModal - Accessible alert dialog for important messages
 */
const AlertModal = React.forwardRef(({
  open,
  onOpenChange,
  title,
  description,
  actionText = "OK",
  onAction,
  variant = "default", // default, warning, error, success
  children,
  ...props
}, ref) => {
  const handleAction = () => {
    onAction?.()
    onOpenChange?.(false)
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "warning":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
      case "error":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
      case "success":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
      default:
        return ""
    }
  }

  const getIconForVariant = () => {
    switch (variant) {
      case "warning":
        return (
          <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        )
      case "error":
        return (
          <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case "success":
        return (
          <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return (
          <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  return (
    <AccessibleModal open={open} onOpenChange={onOpenChange}>
      <AccessibleModalContent 
        ref={ref} 
        className={cn("sm:max-w-md", getVariantStyles())}
        showCloseButton={false}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIconForVariant()}
          </div>
          <div className="flex-1">
            <AccessibleModalHeader className="text-left p-0">
              <AccessibleModalTitle className="text-base">
                {title}
              </AccessibleModalTitle>
              {description && (
                <AccessibleModalDescription className="mt-2">
                  {description}
                </AccessibleModalDescription>
              )}
            </AccessibleModalHeader>
            
            {children}
          </div>
        </div>
        
        <AccessibleModalFooter className="mt-4">
          <button
            type="button"
            className="inline-flex w-full items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={handleAction}
            autoFocus
          >
            {actionText}
          </button>
        </AccessibleModalFooter>
      </AccessibleModalContent>
    </AccessibleModal>
  )
})

AlertModal.displayName = "AlertModal"

export {
  AccessibleModal,
  AccessibleModalPortal,
  AccessibleModalOverlay,
  AccessibleModalTrigger,
  AccessibleModalClose,
  AccessibleModalContent,
  AccessibleModalHeader,
  AccessibleModalFooter,
  AccessibleModalTitle,
  AccessibleModalDescription,
  ConfirmationModal,
  AlertModal,
}