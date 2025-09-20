import { Request } from 'express';

// User types
export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// JWT types
export interface JWTPayload {
  userId: string;
  email?: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    role?: string;
  };
}

// Product types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  inventoryQuantity: number;
  trackInventory: boolean;
  allowBackorders: boolean;
  weight?: number;
  categoryId?: number;
  isActive: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  inventoryQuantity?: number;
  trackInventory?: boolean;
  allowBackorders?: boolean;
  weight?: number;
  categoryId?: number;
  isActive?: boolean;
  featured?: boolean;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  isActive: boolean;
  createdAt: Date;
}

// Cart types
export interface CartItem {
  id: number;
  userId?: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: Product;
}

export interface AddToCartData {
  productId: number;
  quantity: number;
}

// Order types
export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod?: string;
  stripePaymentIntentId?: string;
  shippingAddressId?: number;
  billingAddressId?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface CreateOrderData {
  shippingAddressId: number;
  billingAddressId?: number;
  paymentMethod: string;
  notes?: string;
}

// Address types
export interface Address {
  id: number;
  userId: number;
  type: 'shipping' | 'billing';
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface CreateAddressData {
  type?: 'shipping' | 'billing';
  firstName?: string;
  lastName?: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Query types
export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: number;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt' | 'featured';
  sortOrder?: 'asc' | 'desc';
}

// Stripe types
export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

// Email types
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Error types
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}