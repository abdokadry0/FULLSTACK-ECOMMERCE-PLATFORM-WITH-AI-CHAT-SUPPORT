import * as React from "react"
import { cn } from "../../lib/utils"
import { useVirtualization } from "../../hooks/usePerformance"

/**
 * VirtualList - Virtualized list component for large datasets
 */
const VirtualList = React.forwardRef(({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  getItemHeight,
  overscan = 5,
  className,
  itemClassName,
  onScroll,
  ...props
}, ref) => {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    handleScroll: internalHandleScroll
  } = useVirtualization(items, {
    itemHeight,
    overscan,
    getItemHeight
  })

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [containerRef, ref])

  const handleScroll = React.useCallback((e) => {
    internalHandleScroll(e)
    onScroll?.(e)
  }, [internalHandleScroll, onScroll])

  return (
    <div
      ref={combinedRef}
      className={cn(
        "relative overflow-auto",
        className
      )}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      {...props}
    >
      {/* Virtual container */}
      <div
        style={{ height: totalHeight, position: 'relative' }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.id || item.index}
            className={cn("absolute w-full", itemClassName)}
            style={item.style}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  )
})

VirtualList.displayName = "VirtualList"

/**
 * VirtualGrid - Virtualized grid component for large datasets
 */
const VirtualGrid = React.forwardRef(({
  items = [],
  itemWidth = 200,
  itemHeight = 200,
  containerHeight = 400,
  gap = 16,
  renderItem,
  className,
  itemClassName,
  onScroll,
  ...props
}, ref) => {
  const [containerWidth, setContainerWidth] = React.useState(0)
  const [scrollTop, setScrollTop] = React.useState(0)
  const containerRef = React.useRef(null)

  // Calculate columns based on container width
  const columns = React.useMemo(() => {
    if (!containerWidth) return 1
    return Math.floor((containerWidth + gap) / (itemWidth + gap))
  }, [containerWidth, itemWidth, gap])

  // Calculate visible items
  const visibleItems = React.useMemo(() => {
    if (!items.length || !containerHeight) return []

    const rows = Math.ceil(items.length / columns)
    const rowHeight = itemHeight + gap
    
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 1)
    const endRow = Math.min(rows, Math.ceil((scrollTop + containerHeight) / rowHeight) + 1)
    
    const visibleItems = []
    
    for (let row = startRow; row < endRow; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        if (index >= items.length) break
        
        const item = items[index]
        const x = col * (itemWidth + gap)
        const y = row * (itemHeight + gap)
        
        visibleItems.push({
          ...item,
          index,
          style: {
            position: 'absolute',
            left: x,
            top: y,
            width: itemWidth,
            height: itemHeight
          }
        })
      }
    }
    
    return visibleItems
  }, [items, columns, itemWidth, itemHeight, gap, scrollTop, containerHeight])

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [containerRef, ref])

  // Measure container width
  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const resizeObserver = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })

    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }, [])

  const handleScroll = React.useCallback((e) => {
    setScrollTop(e.target.scrollTop)
    onScroll?.(e)
  }, [onScroll])

  const totalHeight = Math.ceil(items.length / columns) * (itemHeight + gap)

  return (
    <div
      ref={combinedRef}
      className={cn(
        "relative overflow-auto",
        className
      )}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      {...props}
    >
      {/* Virtual container */}
      <div
        style={{ 
          height: totalHeight, 
          position: 'relative',
          width: '100%'
        }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.id || item.index}
            className={cn("absolute", itemClassName)}
            style={item.style}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
      </div>
    </div>
  )
})

VirtualGrid.displayName = "VirtualGrid"

/**
 * InfiniteList - Infinite scrolling list with virtualization
 */
const InfiniteList = React.forwardRef(({
  items = [],
  itemHeight = 100,
  containerHeight = 400,
  renderItem,
  hasNextPage = false,
  isLoading = false,
  loadMore,
  loadingComponent,
  endComponent,
  threshold = 200,
  className,
  ...props
}, ref) => {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    handleScroll: internalHandleScroll,
    scrollTop,
    containerHeight: measuredHeight
  } = useVirtualization(items, { itemHeight })

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [containerRef, ref])

  // Handle infinite scroll
  const handleScroll = React.useCallback((e) => {
    internalHandleScroll(e)
    
    const { scrollTop, scrollHeight, clientHeight } = e.target
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    
    if (distanceFromBottom < threshold && hasNextPage && !isLoading) {
      loadMore?.()
    }
  }, [internalHandleScroll, threshold, hasNextPage, isLoading, loadMore])

  return (
    <div
      ref={combinedRef}
      className={cn(
        "relative overflow-auto",
        className
      )}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      {...props}
    >
      {/* Virtual container */}
      <div
        style={{ 
          height: totalHeight + (isLoading ? itemHeight : 0), 
          position: 'relative' 
        }}
      >
        {visibleItems.map((item) => (
          <div
            key={item.id || item.index}
            className="absolute w-full"
            style={item.style}
          >
            {renderItem(item, item.index)}
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div
            className="absolute w-full flex items-center justify-center"
            style={{
              top: totalHeight,
              height: itemHeight
            }}
          >
            {loadingComponent || (
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Loading more...</span>
              </div>
            )}
          </div>
        )}
        
        {/* End indicator */}
        {!hasNextPage && !isLoading && items.length > 0 && (
          <div
            className="absolute w-full flex items-center justify-center text-muted-foreground text-sm"
            style={{
              top: totalHeight,
              height: itemHeight / 2
            }}
          >
            {endComponent || "No more items"}
          </div>
        )}
      </div>
    </div>
  )
})

InfiniteList.displayName = "InfiniteList"

/**
 * VirtualTable - Virtualized table component for large datasets
 */
const VirtualTable = React.forwardRef(({
  data = [],
  columns = [],
  rowHeight = 50,
  headerHeight = 40,
  containerHeight = 400,
  className,
  headerClassName,
  rowClassName,
  cellClassName,
  onRowClick,
  ...props
}, ref) => {
  const {
    containerRef,
    visibleItems,
    totalHeight,
    handleScroll
  } = useVirtualization(data, { itemHeight: rowHeight })

  // Combine refs
  const combinedRef = React.useCallback((node) => {
    containerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [containerRef, ref])

  return (
    <div className={cn("border rounded-lg overflow-hidden", className)} {...props}>
      {/* Header */}
      <div
        className={cn(
          "flex bg-muted/50 border-b sticky top-0 z-10",
          headerClassName
        )}
        style={{ height: headerHeight }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn(
              "flex items-center px-4 font-medium text-sm",
              column.className
            )}
            style={{ 
              width: column.width || `${100 / columns.length}%`,
              minWidth: column.minWidth
            }}
          >
            {column.title}
          </div>
        ))}
      </div>
      
      {/* Virtual body */}
      <div
        ref={combinedRef}
        className="relative overflow-auto"
        style={{ height: containerHeight - headerHeight }}
        onScroll={handleScroll}
      >
        <div
          style={{ height: totalHeight, position: 'relative' }}
        >
          {visibleItems.map((row) => (
            <div
              key={row.id || row.index}
              className={cn(
                "absolute w-full flex border-b hover:bg-muted/50 cursor-pointer",
                rowClassName
              )}
              style={row.style}
              onClick={() => onRowClick?.(row, row.index)}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className={cn(
                    "flex items-center px-4 text-sm",
                    cellClassName,
                    column.cellClassName
                  )}
                  style={{ 
                    width: column.width || `${100 / columns.length}%`,
                    minWidth: column.minWidth
                  }}
                >
                  {column.render 
                    ? column.render(row[column.key], row, row.index)
                    : row[column.key]
                  }
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

VirtualTable.displayName = "VirtualTable"

export { 
  VirtualList, 
  VirtualGrid, 
  InfiniteList, 
  VirtualTable 
}