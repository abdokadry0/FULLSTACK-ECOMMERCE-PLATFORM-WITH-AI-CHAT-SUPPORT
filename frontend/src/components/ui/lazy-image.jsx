import * as React from "react"
import { cn } from "../../lib/utils"
import { useLazyImage, useIntersectionObserver } from "../../hooks/usePerformance"

/**
 * LazyImage - Optimized image component with lazy loading and blur placeholder
 */
const LazyImage = React.forwardRef(({
  src,
  alt,
  className,
  placeholder,
  blurDataURL,
  quality = 75,
  priority = false,
  sizes = "100vw",
  aspectRatio,
  objectFit = "cover",
  onLoad,
  onError,
  ...props
}, ref) => {
  const {
    targetRef,
    imageProps,
    imageStatus,
    isLoaded,
    hasError
  } = useLazyImage(src, {
    placeholder,
    blurDataURL,
    quality,
    priority,
    sizes,
    onLoad,
    onError
  })

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    targetRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [targetRef, ref])

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      {...props}
    >
      {/* Blur placeholder */}
      {blurDataURL && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover filter blur-sm scale-110",
            "transition-opacity duration-300",
            isLoaded && "opacity-0"
          )}
          aria-hidden="true"
        />
      )}
      
      {/* Loading skeleton */}
      {!blurDataURL && imageStatus === 'loading' && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
      )}
      
      {/* Main image */}
      <img
        ref={combinedRef}
        alt={alt}
        className={cn(
          "w-full h-full transition-all duration-500",
          `object-${objectFit}`,
          !isLoaded && "opacity-0 scale-95",
          isLoaded && "opacity-100 scale-100"
        )}
        {...imageProps}
      />
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
          <div className="text-center">
            <svg
              className="mx-auto h-8 w-8 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Image unavailable</span>
          </div>
        </div>
      )}
      
      {/* Loading indicator */}
      {imageStatus === 'loading' && !blurDataURL && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
})

LazyImage.displayName = "LazyImage"

/**
 * ProgressiveImage - Image with progressive loading and multiple quality levels
 */
const ProgressiveImage = React.forwardRef(({
  src,
  alt,
  className,
  lowQualitySrc,
  mediumQualitySrc,
  highQualitySrc,
  priority = false,
  onLoad,
  ...props
}, ref) => {
  const [currentSrc, setCurrentSrc] = React.useState(lowQualitySrc || src)
  const [loadedSources, setLoadedSources] = React.useState(new Set())
  const [isLoading, setIsLoading] = React.useState(true)

  const { targetRef, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1
  })

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    targetRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [targetRef, ref])

  // Progressive loading logic
  React.useEffect(() => {
    if (!hasIntersected && !priority) return

    const sources = [
      lowQualitySrc,
      mediumQualitySrc,
      highQualitySrc || src
    ].filter(Boolean)

    let currentIndex = 0

    const loadNextImage = () => {
      if (currentIndex >= sources.length) {
        setIsLoading(false)
        return
      }

      const imageSrc = sources[currentIndex]
      if (loadedSources.has(imageSrc)) {
        currentIndex++
        loadNextImage()
        return
      }

      const img = new Image()
      img.onload = () => {
        setLoadedSources(prev => new Set([...prev, imageSrc]))
        setCurrentSrc(imageSrc)
        onLoad?.(img)
        
        currentIndex++
        // Load next quality level after a short delay
        setTimeout(loadNextImage, 100)
      }
      
      img.onerror = () => {
        currentIndex++
        loadNextImage()
      }
      
      img.src = imageSrc
    }

    loadNextImage()
  }, [hasIntersected, priority, lowQualitySrc, mediumQualitySrc, highQualitySrc, src, loadedSources, onLoad])

  return (
    <div className={cn("relative overflow-hidden", className)} {...props}>
      <img
        ref={combinedRef}
        src={currentSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover transition-all duration-500",
          isLoading && "filter blur-sm"
        )}
        loading={priority ? "eager" : "lazy"}
      />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  )
})

ProgressiveImage.displayName = "ProgressiveImage"

/**
 * ResponsiveImage - Image with responsive srcSet and sizes
 */
const ResponsiveImage = React.forwardRef(({
  src,
  alt,
  className,
  srcSet,
  sizes = "100vw",
  priority = false,
  aspectRatio,
  ...props
}, ref) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  const { targetRef, hasIntersected } = useIntersectionObserver({
    triggerOnce: true,
    threshold: 0.1
  })

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    targetRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [targetRef, ref])

  const handleLoad = React.useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = React.useCallback(() => {
    setHasError(true)
  }, [])

  // Generate srcSet if not provided
  const generatedSrcSet = React.useMemo(() => {
    if (srcSet) return srcSet
    
    const widths = [320, 640, 768, 1024, 1280, 1536]
    return widths
      .map(width => `${src}?w=${width}&q=75 ${width}w`)
      .join(', ')
  }, [src, srcSet])

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted",
        aspectRatio && `aspect-[${aspectRatio}]`,
        className
      )}
      {...props}
    >
      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
      )}
      
      {/* Responsive image */}
      {(hasIntersected || priority) && !hasError && (
        <img
          ref={combinedRef}
          src={src}
          srcSet={generatedSrcSet}
          sizes={sizes}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-all duration-500",
            !isLoaded && "opacity-0 scale-95",
            isLoaded && "opacity-100 scale-100"
          )}
          loading={priority ? "eager" : "lazy"}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <svg
              className="mx-auto h-6 w-6 mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        </div>
      )}
    </div>
  )
})

ResponsiveImage.displayName = "ResponsiveImage"

/**
 * ImageGallery - Optimized image gallery with lazy loading
 */
const ImageGallery = React.forwardRef(({
  images = [],
  className,
  itemClassName,
  priority = false,
  onImageClick,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn("grid gap-4", className)}
      {...props}
    >
      {images.map((image, index) => (
        <div
          key={image.id || index}
          className={cn("cursor-pointer", itemClassName)}
          onClick={() => onImageClick?.(image, index)}
        >
          <LazyImage
            src={image.src}
            alt={image.alt || `Image ${index + 1}`}
            blurDataURL={image.blurDataURL}
            priority={priority && index < 2} // Prioritize first 2 images
            className="w-full h-full rounded-lg"
            aspectRatio={image.aspectRatio}
          />
        </div>
      ))}
    </div>
  )
})

ImageGallery.displayName = "ImageGallery"

export { 
  LazyImage, 
  ProgressiveImage, 
  ResponsiveImage, 
  ImageGallery 
}