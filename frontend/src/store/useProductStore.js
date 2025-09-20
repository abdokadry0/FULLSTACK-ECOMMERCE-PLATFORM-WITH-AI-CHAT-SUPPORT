import { create } from 'zustand';
import { api } from '../data/mockData';

const useProductStore = create((set, get) => ({
  // State
  products: [],
  categories: [],
  currentProduct: null,
  loading: false,
  error: null,
  
  // Filters
  filters: {
    category: 'all',
    search: '',
    minPrice: 0,
    maxPrice: 2000,
    sortBy: 'newest'
  },
  
  // Actions
  setFilters: (newFilters) => {
    set({
      filters: { ...get().filters, ...newFilters }
    });
    get().fetchProducts();
  },
  
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.getProducts(get().filters);
      set({
        products: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.message,
        loading: false
      });
    }
  },
  
  fetchProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await api.getProduct(id);
      set({
        currentProduct: response.data,
        loading: false
      });
    } catch (error) {
      set({
        error: error.message,
        loading: false,
        currentProduct: null
      });
    }
  },
  
  fetchCategories: async () => {
    try {
      const response = await api.getCategories();
      set({ categories: response.data });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  },
  
  clearCurrentProduct: () => {
    set({ currentProduct: null });
  }
}));

export default useProductStore;