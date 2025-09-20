import * as React from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card"

/**
 * AnimatedCard - Card with smooth animations and hover effects
 * Provides professional micro-interactions and visual feedback
 */
const AnimatedCard = React.forwardRef(({
  className,
  animation = "lift",
  children,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false)

  const getAnimationClasses = () => {
    switch (animation) {
      case "lift":
        return "transition-all duration-300 ease-out hover:shadow-xl hover:-translate-y-2"
      case "scale":
        return "transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
      case "glow":
        return "transition-all duration-300 ease-out hover:shadow-2xl hover:shadow-primary/10"
      case "tilt":
        return "transition-all duration-300 ease-out hover:shadow-lg transform-gpu"
      case "slide":
        return "transition-all duration-300 ease-out hover:shadow-lg hover:translate-x-1"
      case "none":
        return ""
      default:
        return "transition-all duration-300 ease-out hover:shadow-lg"
    }
  }

  const handleMouseEnter = (e) => {
    setIsHovered(true)
    
    if (animation === "tilt") {
      const card = e.currentTarget
      const rect = card.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const handleMouseMove = (moveEvent) => {
        const x = moveEvent.clientX - centerX
        const y = moveEvent.clientY - centerY
        
        const rotateX = (y / rect.height) * -10
        const rotateY = (x / rect.width) * 10
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`
      }
      
      const handleMouseLeave = () => {
        card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)"
        card.removeEventListener("mousemove", handleMouseMove)
        card.removeEventListener("mouseleave", handleMouseLeave)
        setIsHovered(false)
      }
      
      card.addEventListener("mousemove", handleMouseMove)
      card.addEventListener("mouseleave", handleMouseLeave)
    }
  }

  const handleMouseLeave = () => {
    if (animation !== "tilt") {
      setIsHovered(false)
    }
  }

  return (
    <Card
      ref={ref}
      className={cn(
        getAnimationClasses(),
        "cursor-pointer",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Card>
  )
})

AnimatedCard.displayName = "AnimatedCard"

/**
 * ProductCard with advanced animations and interactions
 */
const AnimatedProductCard = React.forwardRef(({
  className,
  product,
  onAddToCart,
  onToggleWishlist,
  ...props
}, ref) => {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [isInWishlist, setIsInWishlist] = React.useState(false)

  return (
    <AnimatedCard
      ref={ref}
      className={cn("group overflow-hidden", className)}
      animation="lift"
      {...props}
    >
      <div className="relative overflow-hidden">
        <div className={cn(
          "aspect-square bg-gray-100 transition-all duration-500",
          !imageLoaded && "animate-pulse"
        )}>
          <img
            src={product?.image}
            alt={product?.name}
            className={cn(
              "h-full w-full object-cover transition-all duration-700 ease-out",
              "group-hover:scale-110",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300">
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsInWishlist(!isInWishlist)
                onToggleWishlist?.(product)
              }}
              className={cn(
                "p-2 rounded-full backdrop-blur-sm transition-all duration-200",
                "hover:scale-110 active:scale-95",
                isInWishlist 
                  ? "bg-red-500 text-white" 
                  : "bg-white/80 text-gray-700 hover:bg-white"
              )}
            >
              <svg className="w-4 h-4" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product?.name}
          </h3>
          
          {product?.brand && (
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          )}
          
          {product?.rating && (
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      "w-4 h-4 transition-colors duration-200",
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold">${product?.price}</span>
              {product?.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product?.discount && (
              <span className="text-sm font-medium text-green-600">
                -{product.discount}%
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onAddToCart?.(product)
          }}
          className={cn(
            "w-full py-2 px-4 rounded-md font-medium transition-all duration-200",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transform hover:scale-105 active:scale-95",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          )}
          disabled={!product?.inStock}
        >
          {product?.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </CardFooter>
    </AnimatedCard>
  )
})

AnimatedProductCard.displayName = "AnimatedProductCard"

export { AnimatedCard, AnimatedProductCard }