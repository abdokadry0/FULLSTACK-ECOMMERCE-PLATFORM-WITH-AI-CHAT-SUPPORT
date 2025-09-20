import React, { useState, useCallback, memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { LazyImage } from '../ui/lazy-image';
import { useAdvancedCart } from '../../hooks/useAdvancedCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useProductAnalytics } from '../../hooks/useProductAnalytics';
import { useKeyboardNavigation, useARIA, useFocusManagement } from '../../hooks/useAccessibility';
import { useToast } from '../../hooks/use-toast';
import { formatCurrency } from '../../lib/utils';
import { cn } from '../../lib/utils';

/**
 * ProductTile - Enterprise-grade product display component
 * 
 * Features:
 * - Optimistic UI updates
 * - Advanced micro-interactions
 * - Analytics tracking
 * - Accessibility compliance
 * - Performance optimized
 */
const ProductTile = memo(({ 
  product, 
  variant = 'default',
  showQuickActions = true,
  showRating = true,
  showBadges = true,
  className,
  onQuickView,
  priority = false,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const { addItemWithOptimisticUpdate: addToCart, isLoading: cartLoading, isItemInCart } = useAdvancedCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const { trackProductView, trackAddToCart, trackWishlistAdd } = useProductAnalytics();
  
  // Accessibility hooks
  const { generateId, getButtonProps, getLinkProps } = useARIA();
  const { handleKeyDown } = useKeyboardNavigation({
    onEnter: () => handleQuickView(),
    onSpace: () => handleAddToCart()
  });
  const { trapFocus } = useFocusManagement();
  
  const cardRef = useRef(null);
  const productId = generateId(`product-${product.id}`);
  const titleId = generateId(`product-title-${product.id}`);
  const priceId = generateId(`product-price-${product.id}`);
  const ratingId = generateId(`product-rating-${product.id}`);
  
  const isWishlisted = isInWishlist(product.id);

  // Calculate discount metrics
  const discountMetrics = React.useMemo(() => {
    if (!product.compareAtPrice || product.compareAtPrice <= product.price) {
      return null;
    }
    
    const savings = product.compareAtPrice - product.price;
    const percentage = Math.round((savings / product.compareAtPrice) * 100);
    
    return {
      savings,
      percentage,
      isSignificant: percentage >= 20
    };
  }, [product.compareAtPrice, product.price]);

  // Optimistic add to cart with error handling
  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.isAvailable || cartLoading) return;
    
    try {
      await addToCart(product);
      trackAddToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  }, [product, addToCart, trackAddToCart, toast, cartLoading]);

  // Wishlist toggle with analytics
  const handleWishlistToggle = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
      } else {
        await addToWishlist(product);
        trackWishlistAdd(product);
        toast({
          title: "Added to wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    }
  }, [product, isWishlisted, addToWishlist, removeFromWishlist, trackWishlistAdd, toast]);

  // Quick view handler
  const handleQuickView = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    trackProductView(product);
    onQuickView?.(product);
  }, [product, onQuickView, trackProductView]);

  // Track product impression
  React.useEffect(() => {
    trackProductView(product.id);
  }, [product.id, trackProductView]);

  const isInCartAlready = isItemInCart(product.id);

  return (
    <article
      ref={cardRef}
      className={cn(
        // Base styles
        "group relative bg-card rounded-lg border border-border overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        
        // Variant styles
        variant === 'compact' && "max-w-xs",
        variant === 'featured' && "lg:col-span-2 lg:row-span-2",
        
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-labelledby={titleId}
      aria-describedby={`${priceId} ${showRating ? ratingId : ''}`}
      {...props}
    >
      {/* Product Link - Main clickable area */}
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none"
        {...getLinkProps({
          'aria-label': `View details for ${product.name}`,
        })}
      >
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse" />
          )}
          
          {/* Product Image */}
          <LazyImage
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            placeholder="blur"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={false}
          />
          
          {/* Badges */}
          {showBadges && (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge variant="secondary" className="bg-green-500 text-white">
                  New
                </Badge>
              )}
              {product.discount && (
                <Badge variant="destructive">
                  -{product.discount}%
                </Badge>
              )}
            </div>
          )}
          
          {/* Quick Actions */}
          {showQuickActions && (
            <div className={cn(
              "absolute top-2 right-2 flex flex-col gap-2",
              "opacity-0 translate-x-2 transition-all duration-200",
              "group-hover:opacity-100 group-hover:translate-x-0",
              "focus-within:opacity-100 focus-within:translate-x-0"
            )}>
              {/* Wishlist Button */}
              <button
                type="button"
                className={cn(
                  "p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border",
                  "hover:bg-background hover:scale-110 transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  isWishlisted && "text-red-500 bg-red-50 border-red-200"
                )}
                onClick={handleWishlistToggle}
                {...getButtonProps({
                  'aria-label': isWishlisted 
                    ? `Remove ${product.name} from wishlist` 
                    : `Add ${product.name} to wishlist`,
                  'aria-pressed': isWishlisted
                })}
              >
                <Heart 
                  className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isWishlisted && "fill-current"
                  )} 
                />
              </button>
              
              {/* Quick View Button */}
              {onQuickView && (
                <button
                  type="button"
                  className="p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={handleQuickView}
                  {...getButtonProps({
                    'aria-label': `Quick view ${product.name}`
                  })}
                >
                  <Eye className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Product Name */}
          <h3 
            id={titleId}
            className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200"
          >
            {product.name}
          </h3>
          
          {/* Rating */}
          {showRating && product.rating && (
            <div 
              id={ratingId}
              className="flex items-center gap-1"
              role="img"
              aria-label={`Rating: ${product.rating} out of 5 stars`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-muted-foreground"
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount || 0})
              </span>
            </div>
          )}
          
          {/* Price */}
          <div id={priceId} className="flex items-center gap-2">
            <span className="font-semibold text-lg">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      {product.isAvailable && (
        <div className="p-4 pt-0">
          <button
            type="button"
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "transition-all duration-200 transform",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
              cartLoading && "animate-pulse"
            )}
            onClick={handleAddToCart}
            disabled={cartLoading}
            {...getButtonProps({
              'aria-label': `Add ${product.name} to cart`,
              'aria-describedby': cartLoading ? 'loading-message' : undefined
            })}
          >
            {cartLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                <span>Adding...</span>
                <span id="loading-message" className="sr-only">
                  Adding {product.name} to cart, please wait
                </span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      )}
    </article>
  );
});

ProductTile.displayName = 'ProductTile';

export default ProductTile;