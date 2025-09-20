import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Lancyy</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your premium e-commerce destination for cutting-edge electronics, trendy fashion, and curated lifestyle products. Experience shopping redefined.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="text-gray-400 hover:text-white">All Products</Link></li>
              <li><Link to="/products?category=electronics" className="text-gray-400 hover:text-white">Electronics</Link></li>
              <li><Link to="/products?category=fashion" className="text-gray-400 hover:text-white">Fashion</Link></li>
              <li><Link to="/products?category=home-garden" className="text-gray-400 hover:text-white">Home & Garden</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Returns</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Size Guide</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>cabanitlance43@gmail.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>github.com/lancyyboii</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>General Santos City, Philippines</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <div className="mb-4">
            <p className="mb-2"><strong>Portfolio Demo Project</strong> - Showcasing Full-Stack Development Skills</p>
            <p className="text-xs">This is a sample e-commerce platform built to demonstrate modern web development capabilities</p>
          </div>
          <div className="flex justify-center space-x-6 mb-4 text-xs">
            <span>React • TypeScript • Node.js • Tailwind CSS • Prisma • Zustand</span>
          </div>
          <p>&copy; 2025 Lancyy Demo Platform. Built as a portfolio showcase. | Crafted for exceptional development experiences.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;