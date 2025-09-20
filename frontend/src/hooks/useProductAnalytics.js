import { useCallback, useRef } from 'react';
import { debounce } from 'lodash-es';

/**
 * Product Analytics Hook
 * 
 * Tracks user interactions with products for business intelligence
 * and conversion optimization
 */
export const useProductAnalytics = () => {
  const viewedProductsRef = useRef(new Set());
  const interactionQueueRef = useRef([]);
  
  // Debounced batch send to analytics service
  const debouncedSendAnalytics = useCallback(
    debounce(async (events) => {
      try {
        // In a real app, this would send to your analytics service
        // e.g., Google Analytics, Mixpanel, Amplitude, etc.
        console.log('📊 Analytics Events:', events);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Clear the queue after successful send
        interactionQueueRef.current = [];
        
      } catch (error) {
        console.error('Failed to send analytics:', error);
        // In production, you might want to retry or store locally
      }
    }, 2000),
    []
  );
  
  // Queue an analytics event
  const queueEvent = useCallback((eventType, productId, metadata = {}) => {
    const event = {
      type: eventType,
      productId,
      timestamp: Date.now(),
      sessionId: getSessionId(),
      userId: getUserId(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      ...metadata
    };
    
    interactionQueueRef.current.push(event);
    debouncedSendAnalytics([...interactionQueueRef.current]);
  }, [debouncedSendAnalytics]);
  
  // Track product view (with deduplication)
  const trackProductView = useCallback((productId) => {
    // Only track each product view once per session
    if (viewedProductsRef.current.has(productId)) {
      return;
    }
    
    viewedProductsRef.current.add(productId);
    queueEvent('product_view', productId, {
      viewType: 'impression',
      source: 'product_listing'
    });
  }, [queueEvent]);
  
  // Track product interactions
  const trackProductInteraction = useCallback((interactionType, productId, metadata = {}) => {
    queueEvent('product_interaction', productId, {
      interactionType,
      ...metadata
    });
  }, [queueEvent]);
  
  // Track search interactions
  const trackSearchInteraction = useCallback((query, results, metadata = {}) => {
    queueEvent('search', null, {
      query,
      resultCount: results?.length || 0,
      ...metadata
    });
  }, [queueEvent]);
  
  // Track conversion events
  const trackConversion = useCallback((eventType, productId, value, metadata = {}) => {
    queueEvent('conversion', productId, {
      conversionType: eventType,
      value,
      currency: 'USD',
      ...metadata
    });
  }, [queueEvent]);
  
  return {
    trackProductView,
    trackProductInteraction,
    trackSearchInteraction,
    trackConversion
  };
};

// Utility functions for user/session identification
function getSessionId() {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function getUserId() {
  // In a real app, this would come from your auth system
  let userId = localStorage.getItem('analytics_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('analytics_user_id', userId);
  }
  return userId;
}