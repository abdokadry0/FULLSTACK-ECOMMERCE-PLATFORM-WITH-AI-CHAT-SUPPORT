import { cn } from "../../lib/utils"

/**
 * Skeleton component for loading states
 * Provides smooth, accessible loading animations
 */
function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: 'shimmer 2s infinite linear'
      }}
      {...props}
    />
  );
}

/**
 * Product tile skeleton for consistent loading states
 */
function ProductTileSkeleton({ className }) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-lg" />
      
      {/* Product name */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      
      {/* Brand */}
      <Skeleton className="h-3 w-1/3" />
      
      {/* Rating */}
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-4 rounded-full" />
        ))}
        <Skeleton className="h-3 w-12 ml-2" />
      </div>
      
      {/* Price */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-4 w-20" />
      </div>
      
      {/* Button */}
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

/**
 * Product grid skeleton
 */
function ProductGridSkeleton({ count = 8, className }) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
      className
    )}>
      {[...Array(count)].map((_, i) => (
        <ProductTileSkeleton key={i} />
      ))}
    </div>
  );
}

export { 
  Skeleton, 
  ProductTileSkeleton, 
  ProductGridSkeleton 
}
