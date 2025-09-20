// Mock data for the e-commerce application

export const categories = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Fashion', slug: 'fashion' },
  { id: '3', name: 'Home & Garden', slug: 'home-garden' },
  { id: '4', name: 'Sports', slug: 'sports' },
  { id: '5', name: 'Books', slug: 'books' }
];

export const products = [
  // Electronics
  {
    id: '1',
    name: 'iPhone 15 Pro',
    category: 'electronics',
    price: 999,
    originalPrice: 1099,
    rating: 4.8,
    reviews: 2847,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&h=600&fit=crop'
    ],
    description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system.',
    features: ['A17 Pro chip', '48MP Main camera', 'Titanium design', '5G connectivity'],
    inStock: true,
    stock: 15
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    category: 'electronics',
    price: 1199,
    originalPrice: 1299,
    rating: 4.9,
    reviews: 1932,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop'
    ],
    description: 'Ultra-thin and lightweight laptop with M3 chip, delivering exceptional performance and all-day battery life.',
    features: ['M3 chip', '13.6" Liquid Retina display', '18-hour battery', 'MagSafe charging'],
    inStock: true,
    stock: 8
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    category: 'electronics',
    price: 329,
    originalPrice: 399,
    rating: 4.7,
    reviews: 5643,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop'
    ],
    description: 'Industry-leading noise canceling wireless headphones with premium sound quality.',
    features: ['30-hour battery', 'Industry-leading noise canceling', 'Crystal clear calls', 'Touch controls'],
    inStock: true,
    stock: 23
  },
  {
    id: '4',
    name: 'Samsung 4K Smart TV',
    category: 'electronics',
    price: 799,
    originalPrice: 999,
    rating: 4.6,
    reviews: 3421,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600&h=600&fit=crop'
    ],
    description: '55" 4K Ultra HD Smart TV with HDR and built-in streaming apps.',
    features: ['4K Ultra HD', 'HDR support', 'Smart TV platform', '55-inch display'],
    inStock: true,
    stock: 12
  },
  
  // Fashion
  {
    id: '5',
    name: 'Premium Wool Coat',
    category: 'fashion',
    price: 289,
    originalPrice: 399,
    rating: 4.5,
    reviews: 892,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=600&h=600&fit=crop'
    ],
    description: 'Elegant wool coat perfect for cold weather. Made from premium wool blend with modern tailoring.',
    features: ['100% wool blend', 'Water resistant', 'Classic fit', 'Multiple colors'],
    inStock: true,
    stock: 18
  },
  {
    id: '6',
    name: 'Designer Handbag',
    category: 'fashion',
    price: 459,
    originalPrice: 599,
    rating: 4.8,
    reviews: 1247,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop'
    ],
    description: 'Luxury leather handbag with elegant design and spacious interior.',
    features: ['Genuine leather', 'Gold hardware', 'Multiple compartments', 'Adjustable strap'],
    inStock: true,
    stock: 7
  },
  {
    id: '7',
    name: 'Vintage Denim Jacket',
    category: 'fashion',
    price: 89,
    originalPrice: 129,
    rating: 4.4,
    reviews: 2156,
    image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=600&fit=crop'
    ],
    description: 'Classic vintage-style denim jacket with distressed details and comfortable fit.',
    features: ['100% cotton denim', 'Vintage wash', 'Classic fit', 'Multiple sizes'],
    inStock: true,
    stock: 31
  },
  {
    id: '8',
    name: 'Athletic Sneakers',
    category: 'fashion',
    price: 149,
    originalPrice: 199,
    rating: 4.6,
    reviews: 3892,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=600&h=600&fit=crop'
    ],
    description: 'High-performance athletic sneakers with advanced cushioning and breathable design.',
    features: ['Advanced cushioning', 'Breathable mesh', 'Durable sole', 'Multiple colorways'],
    inStock: true,
    stock: 45
  },

  // Home & Garden
  {
    id: '9',
    name: 'Modern Floor Lamp',
    category: 'home-garden',
    price: 179,
    originalPrice: 249,
    rating: 4.7,
    reviews: 756,
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600&h=600&fit=crop'
    ],
    description: 'Sleek modern floor lamp with adjustable brightness and contemporary design.',
    features: ['LED bulb included', 'Adjustable brightness', 'Modern design', 'Energy efficient'],
    inStock: true,
    stock: 14
  },
  {
    id: '10',
    name: 'Ceramic Plant Pot Set',
    category: 'home-garden',
    price: 49,
    originalPrice: 79,
    rating: 4.3,
    reviews: 1832,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop'
    ],
    description: 'Set of 3 ceramic plant pots with drainage holes and matching saucers.',
    features: ['Set of 3 pots', 'Drainage holes', 'Matching saucers', 'Multiple colors'],
    inStock: true,
    stock: 28
  }
];

// Mock API functions
export const api = {
  // Products
  getProducts: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let filteredProducts = [...products];
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // Mock newest sorting by ID
          filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
          break;
        default:
          break;
      }
    }
    
    return {
      data: filteredProducts,
      total: filteredProducts.length
    };
  },
  
  getProduct: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const product = products.find(p => p.id === id);
    return { data: product };
  },
  
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return { data: categories };
  },
  
  // Orders (mock)
  createOrder: async (orderData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        id: Math.random().toString(36).substr(2, 9),
        ...orderData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
    };
  }
};