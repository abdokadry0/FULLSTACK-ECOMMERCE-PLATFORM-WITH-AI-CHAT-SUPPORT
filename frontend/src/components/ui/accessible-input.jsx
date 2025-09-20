import * as React from "react"
import { cn } from "../../lib/utils"
import { Input } from "./input"
import { Label } from "./label"
import { useARIA } from "../../hooks/useAccessibility"

/**
 * AccessibleInput - Input with comprehensive accessibility features
 */
const AccessibleInput = React.forwardRef(({
  className,
  type = "text",
  label,
  description,
  error,
  required = false,
  disabled = false,
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}, ref) => {
  const { generateId } = useARIA()
  const [isFocused, setIsFocused] = React.useState(false)
  const [hasValue, setHasValue] = React.useState(Boolean(value))
  
  const inputId = React.useMemo(() => generateId('input'), [generateId])
  const descriptionId = React.useMemo(() => generateId('description'), [generateId])
  const errorId = React.useMemo(() => generateId('error'), [generateId])

  React.useEffect(() => {
    setHasValue(Boolean(value))
  }, [value])

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const handleChange = (e) => {
    setHasValue(Boolean(e.target.value))
    onChange?.(e)
  }

  const describedBy = [
    description && descriptionId,
    error && errorId
  ].filter(Boolean).join(' ')

  return (
    <div className="space-y-2">
      {label && (
        <Label 
          htmlFor={inputId}
          className={cn(
            "text-sm font-medium",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "transition-all duration-200",
            // Focus states
            isFocused && "ring-2 ring-ring ring-offset-2",
            // Error states
            error && "border-destructive focus:border-destructive focus:ring-destructive",
            // Floating label support
            label && !placeholder && "placeholder-transparent",
            className
          )}
          placeholder={placeholder || (label && " ")}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          aria-describedby={describedBy || undefined}
          aria-invalid={error ? "true" : "false"}
          aria-required={required}
          {...props}
        />
        
        {/* Floating label */}
        {label && !placeholder && (
          <Label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              "text-muted-foreground",
              (isFocused || hasValue) 
                ? "top-0 -translate-y-1/2 text-xs bg-background px-1" 
                : "top-1/2 -translate-y-1/2 text-sm",
              disabled && "opacity-50"
            )}
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
        )}
      </div>
      
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  )
})

AccessibleInput.displayName = "AccessibleInput"

/**
 * SearchInput - Accessible search input with combobox behavior
 */
const SearchInput = React.forwardRef(({
  className,
  placeholder = "Search...",
  suggestions = [],
  onSuggestionSelect,
  showSuggestions = false,
  onShowSuggestionsChange,
  value,
  onChange,
  ...props
}, ref) => {
  const { generateId, getComboboxProps, getListboxProps, getOptionProps } = useARIA()
  const [activeSuggestion, setActiveSuggestion] = React.useState(-1)
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([])
  
  const inputId = React.useMemo(() => generateId('search'), [generateId])
  const listboxId = React.useMemo(() => generateId('listbox'), [generateId])
  
  const inputRef = React.useRef(null)
  React.useImperativeHandle(ref, () => inputRef.current)

  React.useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setActiveSuggestion(-1)
    } else {
      setFilteredSuggestions([])
    }
  }, [value, suggestions])

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveSuggestion(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (activeSuggestion >= 0) {
          const suggestion = filteredSuggestions[activeSuggestion]
          onSuggestionSelect?.(suggestion)
          onShowSuggestionsChange?.(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        onShowSuggestionsChange?.(false)
        setActiveSuggestion(-1)
        break
    }
  }

  const handleSuggestionClick = (suggestion) => {
    onSuggestionSelect?.(suggestion)
    onShowSuggestionsChange?.(false)
    inputRef.current?.focus()
  }

  const comboboxProps = getComboboxProps({
    expanded: showSuggestions && filteredSuggestions.length > 0,
    controls: listboxId
  })

  const listboxProps = getListboxProps({
    label: "Search suggestions"
  })

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={inputId}
        type="search"
        className={cn("pr-10", className)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        onFocus={() => onShowSuggestionsChange?.(true)}
        {...comboboxProps}
        {...props}
      />
      
      {/* Search icon */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-4 w-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          id={listboxId}
          className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          {...listboxProps}
        >
          {filteredSuggestions.map((suggestion, index) => {
            const optionProps = getOptionProps({
              selected: index === activeSuggestion,
              index,
              setSize: filteredSuggestions.length
            })
            
            return (
              <div
                key={suggestion}
                className={cn(
                  "px-3 py-2 cursor-pointer text-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  index === activeSuggestion && "bg-accent text-accent-foreground"
                )}
                onClick={() => handleSuggestionClick(suggestion)}
                {...optionProps}
              >
                {suggestion}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
})

SearchInput.displayName = "SearchInput"

/**
 * FormField - Accessible form field wrapper
 */
const FormField = React.forwardRef(({
  children,
  label,
  description,
  error,
  required = false,
  className,
  ...props
}, ref) => {
  const { generateId } = useARIA()
  const fieldId = React.useMemo(() => generateId('field'), [generateId])
  const descriptionId = React.useMemo(() => generateId('description'), [generateId])
  const errorId = React.useMemo(() => generateId('error'), [generateId])

  const describedBy = [
    description && descriptionId,
    error && errorId
  ].filter(Boolean).join(' ')

  return (
    <fieldset
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    >
      {label && (
        <legend className={cn(
          "text-sm font-medium",
          required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}>
          {label}
        </legend>
      )}
      
      <div aria-describedby={describedBy || undefined}>
        {children}
      </div>
      
      {description && (
        <p 
          id={descriptionId}
          className="text-sm text-muted-foreground"
        >
          {description}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </fieldset>
  )
})

FormField.displayName = "FormField"

export { 
  AccessibleInput, 
  SearchInput, 
  FormField 
}