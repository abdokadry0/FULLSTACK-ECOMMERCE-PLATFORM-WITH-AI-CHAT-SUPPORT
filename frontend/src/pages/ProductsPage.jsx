import React, { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import ProductGrid from '../components/product/ProductGrid';
import ProductFilters from '../components/product/ProductFilters';
import useProductStore from '../store/useProductStore';

const ProductsPage = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { 
    products, 
    categories, 
    loading, 
    filters,
    fetchProducts, 
    fetchCategories 
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []); // Empty dependency array to run only once on mount

  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${products.length} products found`}
            {filters.search && ` for "${filters.search}"`}
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={toggleFilters}
          className="md:hidden"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <ProductFilters
            categories={categories}
            isOpen={filtersOpen}
            onClose={() => setFiltersOpen(false)}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;