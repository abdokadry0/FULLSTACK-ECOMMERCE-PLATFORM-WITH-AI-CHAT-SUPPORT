// ============================================================================
// TYPE DEFINITIONS FOR E-COMMERCE PLATFORM
// ============================================================================

import * as React from 'react'

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Base entity interface
 */
export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

/**
 * Search parameters
 */
export interface SearchParams extends PaginationParams {
  query?: string
  filters?: Record<string, any>
}

// ============================================================================
// USER & AUTHENTICATION TYPES
// ============================================================================

/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  VENDOR = 'vendor',
  MODERATOR = 'moderator'
}

/**
 * User status enumeration
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

/**
 * User interface
 */
export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  phone?: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  phoneVerified: boolean
  preferences: UserPreferences
  addresses: Address[]
  lastLoginAt?: string
}

/**
 * User preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
  notifications: NotificationPreferences
  privacy: PrivacyPreferences
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  marketing: boolean
  orderUpdates: boolean
  promotions: boolean
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  profileVisibility: 'public' | 'private'
  showOnlineStatus: boolean
  allowDataCollection: boolean
  allowPersonalization: boolean
}

/**
 * Authentication credentials
 */
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  acceptTerms: boolean
  subscribeNewsletter?: boolean
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Password reset request
 */
export interface PasswordResetRequest {
  email: string
}

/**
 * Password reset data
 */
export interface PasswordResetData {
  token: string
  password: string
  confirmPassword: string
}

// ============================================================================
// ADDRESS TYPES
// ============================================================================

/**
 * Address type enumeration
 */
export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
  BOTH = 'both'
}

/**
 * Address interface
 */
export interface Address extends BaseEntity {
  userId: string
  type: AddressType
  firstName: string
  lastName: string
  company?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault: boolean
}

// ============================================================================
// PRODUCT TYPES
// ============================================================================

/**
 * Product status enumeration
 */
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  ARCHIVED = 'archived'
}

/**
 * Product availability enumeration
 */
export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  BACKORDER = 'backorder',
  DISCONTINUED = 'discontinued'
}

/**
 * Product image interface
 */
export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  sortOrder: number
}

/**
 * Product variant interface
 */
export interface ProductVariant extends BaseEntity {
  productId: string
  sku: string
  name: string
  price: number
  compareAtPrice?: number
  cost?: number
  inventory: ProductInventory
  attributes: ProductAttribute[]
  images: ProductImage[]
  weight?: number
  dimensions?: ProductDimensions
}

/**
 * Product inventory interface
 */
export interface ProductInventory {
  quantity: number
  reserved: number
  available: number
  lowStockThreshold: number
  trackQuantity: boolean
  allowBackorder: boolean
}

/**
 * Product dimensions interface
 */
export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in'
}

/**
 * Product attribute interface
 */
export interface ProductAttribute {
  name: string
  value: string
  displayName?: string
}

/**
 * Product SEO interface
 */
export interface ProductSEO {
  title?: string
  description?: string
  keywords?: string[]
  slug: string
}

/**
 * Product interface
 */
export interface Product extends BaseEntity {
  name: string
  description: string
  shortDescription?: string
  sku: string
  price: number
  compareAtPrice?: number
  cost?: number
  status: ProductStatus
  availability: ProductAvailability
  categoryId: string
  category: Category
  brandId?: string
  brand?: Brand
  tags: string[]
  images: ProductImage[]
  variants: ProductVariant[]
  inventory: ProductInventory
  attributes: ProductAttribute[]
  specifications: Record<string, string>
  dimensions?: ProductDimensions
  weight?: number
  seo: ProductSEO
  rating: number
  reviewCount: number
  salesCount: number
  viewCount: number
  isFeatured: boolean
  isDigital: boolean
  requiresShipping: boolean
  taxable: boolean
  vendor?: User
}

// ============================================================================
// CATEGORY TYPES
// ============================================================================

/**
 * Category interface
 */
export interface Category extends BaseEntity {
  name: string
  description?: string
  slug: string
  parentId?: string
  parent?: Category
  children: Category[]
  image?: string
  icon?: string
  sortOrder: number
  isActive: boolean
  productCount: number
  seo: CategorySEO
}

/**
 * Category SEO interface
 */
export interface CategorySEO {
  title?: string
  description?: string
  keywords?: string[]
}

// ============================================================================
// BRAND TYPES
// ============================================================================

/**
 * Brand interface
 */
export interface Brand extends BaseEntity {
  name: string
  description?: string
  slug: string
  logo?: string
  website?: string
  isActive: boolean
  productCount: number
}

// ============================================================================
// CART TYPES
// ============================================================================

/**
 * Cart item interface
 */
export interface CartItem {
  id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  total: number
  addedAt: string
}

/**
 * Cart discount interface
 */
export interface CartDiscount {
  id: string
  code: string
  type: 'percentage' | 'fixed' | 'shipping'
  value: number
  description: string
}

/**
 * Cart totals interface
 */
export interface CartTotals {
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
}

/**
 * Cart interface
 */
export interface Cart extends BaseEntity {
  userId?: string
  sessionId?: string
  items: CartItem[]
  discounts: CartDiscount[]
  totals: CartTotals
  currency: string
  expiresAt?: string
}

// ============================================================================
// ORDER TYPES
// ============================================================================

/**
 * Order status enumeration
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

/**
 * Payment status enumeration
 */
export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

/**
 * Fulfillment status enumeration
 */
export enum FulfillmentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

/**
 * Order item interface
 */
export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  quantity: number
  price: number
  total: number
}

/**
 * Order shipping interface
 */
export interface OrderShipping {
  method: string
  carrier: string
  trackingNumber?: string
  cost: number
  estimatedDelivery?: string
  address: Address
}

/**
 * Order payment interface
 */
export interface OrderPayment {
  method: string
  status: PaymentStatus
  transactionId?: string
  amount: number
  currency: string
  gateway: string
  gatewayTransactionId?: string
}

/**
 * Order interface
 */
export interface Order extends BaseEntity {
  orderNumber: string
  userId: string
  user: User
  status: OrderStatus
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  items: OrderItem[]
  subtotal: number
  discount: number
  shippingCost: number
  tax: number
  total: number
  currency: string
  shippingAddress: Address
  billingAddress: Address
  shipping: OrderShipping
  payment: OrderPayment
  notes?: string
  cancelledAt?: string
  cancelReason?: string
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

/**
 * Review interface
 */
export interface Review extends BaseEntity {
  productId: string
  product: Product
  userId: string
  user: User
  rating: number
  title: string
  content: string
  images?: string[]
  isVerified: boolean
  isRecommended: boolean
  helpfulCount: number
  reportCount: number
  status: 'pending' | 'approved' | 'rejected'
}

// ============================================================================
// WISHLIST TYPES
// ============================================================================

/**
 * Wishlist item interface
 */
export interface WishlistItem {
  id: string
  productId: string
  variantId?: string
  product: Product
  variant?: ProductVariant
  addedAt: string
}

/**
 * Wishlist interface
 */
export interface Wishlist extends BaseEntity {
  userId: string
  name: string
  description?: string
  isPublic: boolean
  items: WishlistItem[]
}

// ============================================================================
// COUPON TYPES
// ============================================================================

/**
 * Coupon type enumeration
 */
export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
  SHIPPING = 'shipping',
  BUY_X_GET_Y = 'buy_x_get_y'
}

/**
 * Coupon interface
 */
export interface Coupon extends BaseEntity {
  code: string
  name: string
  description?: string
  type: CouponType
  value: number
  minimumAmount?: number
  maximumDiscount?: number
  usageLimit?: number
  usageCount: number
  userUsageLimit?: number
  isActive: boolean
  startsAt?: string
  expiresAt?: string
  applicableProducts?: string[]
  applicableCategories?: string[]
  excludedProducts?: string[]
  excludedCategories?: string[]
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

/**
 * Analytics event interface
 */
export interface AnalyticsEvent {
  event: string
  properties: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp: string
}

/**
 * Analytics metrics interface
 */
export interface AnalyticsMetrics {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  averageSessionDuration: number
  conversionRate: number
  revenue: number
  orders: number
  averageOrderValue: number
}

// ============================================================================
// FEATURE FLAGS TYPES
// ============================================================================

/**
 * Feature flag interface
 */
export interface FeatureFlag {
  key: string
  name: string
  description?: string
  enabled: boolean
  rolloutPercentage: number
  conditions?: FeatureFlagCondition[]
  variants?: FeatureFlagVariant[]
}

/**
 * Feature flag condition interface
 */
export interface FeatureFlagCondition {
  attribute: string
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'greater_than' | 'less_than'
  value: any
}

/**
 * Feature flag variant interface
 */
export interface FeatureFlagVariant {
  key: string
  name: string
  weight: number
  payload?: any
}

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Theme color palette interface
 */
export interface ColorPalette {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
}

/**
 * Theme colors interface
 */
export interface ThemeColors {
  primary: ColorPalette
  secondary: ColorPalette
  success: ColorPalette
  warning: ColorPalette
  error: ColorPalette
  neutral: ColorPalette
  background: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    inverse: string
    disabled: string
  }
  border: {
    primary: string
    secondary: string
    focus: string
    error: string
  }
}

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  name: string
  colors: ThemeColors
  spacing: Record<string, string>
  typography: {
    fontFamily: Record<string, string[]>
    fontSize: Record<string, [string, { lineHeight: string }]>
    fontWeight: Record<string, string>
  }
  breakpoints: Record<string, string>
  shadows: Record<string, string>
  borderRadius: Record<string, string>
  transitions: Record<string, string>
}

// ============================================================================
// INTERNATIONALIZATION TYPES
// ============================================================================

/**
 * Locale configuration interface
 */
export interface LocaleConfig {
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  dateFormat: string
  timeFormat: string
  currency: string
  currencySymbol: string
  numberFormat: {
    decimal: string
    thousands: string
    precision: number
  }
}

/**
 * Translation interface
 */
export interface Translation {
  [key: string]: string | Translation
}

// ============================================================================
// FORM TYPES
// ============================================================================

/**
 * Form field interface
 */
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: { label: string; value: any }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    custom?: (value: any) => string | null
  }
}

/**
 * Form errors interface
 */
export interface FormErrors {
  [fieldName: string]: string
}

/**
 * Form state interface
 */
export interface FormState {
  values: Record<string, any>
  errors: FormErrors
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// ============================================================================
// API TYPES
// ============================================================================

/**
 * HTTP methods enumeration
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * API request configuration
 */
export interface ApiRequestConfig {
  method: HttpMethod
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
}

/**
 * API error interface
 */
export interface ApiError {
  message: string
  status: number
  code?: string
  details?: any
}

// ============================================================================
// COMPONENT PROPS TYPES
// ============================================================================

/**
 * Base component props
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  testId?: string
}

/**
 * Button variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

/**
 * Button props interface
 */
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

/**
 * Input props interface
 */
export interface InputProps extends BaseComponentProps {
  type?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  label?: string
  helperText?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  startAdornment?: React.ReactNode
  endAdornment?: React.ReactNode
}

/**
 * Modal props interface
 */
export interface ModalProps extends BaseComponentProps {
  open: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Make all properties optional
 */
export type Partial<T> = {
  [P in keyof T]?: T[P]
}

/**
 * Make all properties required
 */
export type Required<T> = {
  [P in keyof T]-?: T[P]
}

/**
 * Pick specific properties
 */
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

/**
 * Omit specific properties
 */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Create type from union
 */
export type Record<K extends keyof any, T> = {
  [P in K]: T
}

/**
 * Extract function return type
 */
export type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any

/**
 * Extract function parameters type
 */
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never

/**
 * Create nullable type
 */
export type Nullable<T> = T | null

/**
 * Create optional type
 */
export type Optional<T> = T | undefined

/**
 * Deep partial type
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

// ============================================================================
// EXPORTS
// ============================================================================

// All types are already exported as interfaces and enums above
// No additional exports needed