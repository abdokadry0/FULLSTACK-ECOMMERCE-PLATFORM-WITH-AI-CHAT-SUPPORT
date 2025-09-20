import { useCallback } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

/**
 * Wishlist Store with persistence and analytics
 */
const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to wishlist
      addItem: (product) => {
        set((state) => {
          const exists = state.items.some(item => item.id === product.id);
          if (exists) return state;
          
          const wishlistItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || product.images?.[0],
            slug: product.slug,
            brand: product.brand,
            addedAt: Date.now()
          };
          
          return {
            items: [...state.items, wishlistItem]
          };
        });
      },
      
      // Remove item from wishlist
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      
      // Clear wishlist
      clearWishlist: () => {
        set({ items: [] });
      },
      
      // Check if item is in wishlist
      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId);
      }
    }),
    {
      name: 'wishlist-storage'
    }
  )
);

/**
 * Wishlist Hook with professional features
 */
export const useWishlist = () => {
  const store = useWishlistStore();
  
  // Toggle wishlist item with feedback
  const toggleWishlistItem = useCallback(async (product) => {
    const isCurrentlyInWishlist = store.isInWishlist(product.id);
    
    if (isCurrentlyInWishlist) {
      store.removeItem(product.id);
      toast.success('Removed from wishlist', {
        description: `${product.name} has been removed from your wishlist`
      });
    } else {
      store.addItem(product);
      toast.success('Added to wishlist', {
        description: `${product.name} has been saved to your wishlist`,
        action: {
          label: 'View Wishlist',
          onClick: () => {
            // Navigate to wishlist page
            window.location.href = '/wishlist';
          }
        }
      });
    }
  }, [store]);
  
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    clearWishlist: store.clearWishlist,
    isInWishlist: store.isInWishlist,
    toggleWishlistItem,
    totalItems: store.items.length
  };
};