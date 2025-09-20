import React from 'react';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { X } from 'lucide-react';
import useProductStore from '../../store/useProductStore';

const ProductFilters = ({ categories, isOpen, onClose }) => {
  const { filters, setFilters } = useProductStore();

  const handleCategoryChange = (category) => {
    setFilters({ category });
  };

  const handleSortChange = (sortBy) => {
    setFilters({ sortBy });
  };

  const handlePriceChange = (value) => {
    setFilters({ minPrice: value[0], maxPrice: value[1] });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      minPrice: 0,
      maxPrice: 2000,
      sortBy: 'newest'
    });
  };

  const activeFiltersCount = [
    filters.category !== 'all',
    filters.search !== '',
    filters.minPrice > 0 || filters.maxPrice < 2000
  ].filter(Boolean).length;

  return (
    <Card className={`${isOpen ? 'block' : 'hidden'} md:block`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-3 block">Category</label>
          <div className="space-y-2">
            <Button
              variant={filters.category === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange('all')}
              className="w-full justify-start"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filters.category === category.slug ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleCategoryChange(category.slug)}
                className="w-full justify-start"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <label className="text-sm font-medium mb-3 block">
            Price Range: ${filters.minPrice} - ${filters.maxPrice}
          </label>
          <Slider
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            max={2000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>

        {/* Sort By */}
        <div>
          <label className="text-sm font-medium mb-3 block">Sort By</label>
          <Select value={filters.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Best Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;