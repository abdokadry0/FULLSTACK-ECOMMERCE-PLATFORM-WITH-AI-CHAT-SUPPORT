import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Search, Menu, Heart } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import useCartStore from '../../store/useCartStore';
import useProductStore from '../../store/useProductStore';

const Header = () => {
  const { itemCount, toggleCart } = useCartStore();
  const { filters, setFilters } = useProductStore();

  const handleSearchChange = (e) => {
    setFilters({ search: e.target.value });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Lancyy</span>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleSearchChange}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/products">
                <Button variant="ghost">Products</Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleCart}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </nav>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
              className="pl-10 pr-4 w-full"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;