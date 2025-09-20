import * as React from "react"
import { VirtualGrid, InfiniteList } from "../ui/virtual-list"
import ProductTile from "./ProductTile"
import ProductCard from './ProductCard'
import { cn } from "../../lib/utils"
import { useIntersectionObserver } from "../../hooks/usePerformance"
import { Loader2 } from 'lucide-react'

/**
 * ProductSkeleton - Loading skeleton for products
 */
const ProductSkeleton = ({ className }) => (
  <div className={cn("space-y-3", className)}>
    <div className="aspect-square bg-muted animate-pulse rounded-lg" />
    <div className="space-y-2">
      <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
      <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
      <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
    </div>
  </div>
)

/**
 * Enhanced ProductGrid with virtualization and performance optimizations
 */
const ProductGrid = React.forwardRef(({
  products = [],
  loading = false,
  columns = 4,
  itemWidth = 280,
  itemHeight = 400,
  gap = 16,
  containerHeight = 600,
  className,
  onProductClick,
  error = null,
  useVirtualization = false,
  ...props
}, ref) => {
  const renderProduct = React.useCallback((product, index) => {
    // Use ProductTile if available, fallback to ProductCard
    const ProductComponent = ProductTile || ProductCard
    return (
      <ProductComponent
        key={product.id}
        product={product}
        onClick={() => onProductClick?.(product, index)}
        className="h-full"
      />
    )
  }, [onProductClick])

  // Error state
  if (error) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        className
      )}>
        <div className="text-destructive mb-4">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2">Failed to load products</h3>
        <p className="text-muted-foreground">{error.message || "Something went wrong"}</p>
      </div>
    )
  }

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
      </div>
    )
  }

  // Use virtualization for large datasets
  if (useVirtualization && products.length > 50) {
    return (
      <VirtualGrid
        ref={ref}
        items={products}
        itemWidth={itemWidth}
        itemHeight={itemHeight}
        gap={gap}
        containerHeight={containerHeight}
        renderItem={renderProduct}
        className={cn("w-full", className)}
        {...props}
      />
    )
  }

  // Regular responsive grid
  return (
    <div
      ref={ref}
      className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}
      {...props}
    >
      {products.map((product, index) => renderProduct(product, index))}
    </div>
  )
})

ProductGrid.displayName = "ProductGrid"

/**
 * InfiniteProductGrid - Infinite scrolling product grid
 */
const InfiniteProductGrid = React.forwardRef(({
  products = [],
  itemHeight = 400,
  containerHeight = 600,
  hasNextPage = false,
  isLoading = false,
  loadMore,
  className,
  onProductClick,
  ...props
}, ref) => {
  const renderProduct = React.useCallback((product, index) => {
    const ProductComponent = ProductTile || ProductCard
    return (
      <ProductComponent
        key={product.id}
        product={product}
        onClick={() => onProductClick?.(product, index)}
        className="h-full"
      />
    )
  }, [onProductClick])

  const loadingComponent = (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-muted-foreground">Loading more products...</span>
      </div>
    </div>
  )

  const endComponent = (
    <div className="text-center p-4 text-muted-foreground">
      <p>You've seen all products!</p>
    </div>
  )

  return (
    <InfiniteList
      ref={ref}
      items={products}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderProduct}
      hasNextPage={hasNextPage}
      isLoading={isLoading}
      loadMore={loadMore}
      loadingComponent={loadingComponent}
      endComponent={endComponent}
      className={cn("w-full", className)}
      {...props}
    />
  )
})

InfiniteProductGrid.displayName = "InfiniteProductGrid"

/**
 * ResponsiveProductGrid - Responsive grid that adapts to screen size
 */
const ResponsiveProductGrid = React.forwardRef(({
  products = [],
  className,
  ...props
}, ref) => {
  const [columns, setColumns] = React.useState(4)
  const containerRef = React.useRef(null)

  // Responsive columns based on container width
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateColumns = () => {
      const width = container.offsetWidth
      if (width < 640) setColumns(1)
      else if (width < 768) setColumns(2)
      else if (width < 1024) setColumns(3)
      else if (width < 1280) setColumns(4)
      else setColumns(5)
    }

    const resizeObserver = new ResizeObserver(updateColumns)
    resizeObserver.observe(container)
    updateColumns()

    return () => resizeObserver.disconnect()
  }, [])

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [ref])

  return (
    <ProductGrid
      ref={combinedRef}
      products={products}
      columns={columns}
      className={className}
      {...props}
    />
  )
})

ResponsiveProductGrid.displayName = "ResponsiveProductGrid"

export default ProductGrid
export { 
  ProductGrid, 
  InfiniteProductGrid, 
  ProductSkeleton, 
  ResponsiveProductGrid 
}