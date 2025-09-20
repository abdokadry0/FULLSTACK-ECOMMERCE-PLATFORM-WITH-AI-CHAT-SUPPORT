# API Documentation

This document describes the API endpoints and services used by the frontend application.

## Base Configuration

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'
const API_VERSION = 'v1'
const API_URL = `${API_BASE_URL}/api/${API_VERSION}`
```

## Authentication

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}
```

### Logout
```http
POST /api/v1/auth/logout
Authorization: Bearer jwt_token_here
```

## Products

### Get Products
```http
GET /api/v1/products?page=1&limit=20&category=electronics&search=laptop
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `search` (string): Search query
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (price, name, createdAt)
- `sortOrder` (string): Sort order (asc, desc)

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "name": "Laptop",
        "description": "High-performance laptop",
        "price": 999.99,
        "originalPrice": 1199.99,
        "discount": 16.67,
        "images": ["image1.jpg", "image2.jpg"],
        "category": {
          "id": "cat_123",
          "name": "Electronics"
        },
        "brand": {
          "id": "brand_123",
          "name": "TechBrand"
        },
        "stock": 10,
        "rating": 4.5,
        "reviewCount": 25,
        "variants": [
          {
            "id": "var_123",
            "name": "16GB RAM",
            "price": 999.99,
            "stock": 5
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Product by ID
```http
GET /api/v1/products/:id
```

### Get Product Reviews
```http
GET /api/v1/products/:id/reviews?page=1&limit=10
```

## Categories

### Get Categories
```http
GET /api/v1/categories
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cat_123",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "image": "electronics.jpg",
      "parentId": null,
      "children": [
        {
          "id": "cat_124",
          "name": "Laptops",
          "slug": "laptops",
          "parentId": "cat_123"
        }
      ]
    }
  ]
}
```

## Shopping Cart

### Get Cart
```http
GET /api/v1/cart
Authorization: Bearer jwt_token_here
```

### Add to Cart
```http
POST /api/v1/cart/items
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "productId": "prod_123",
  "variantId": "var_123",
  "quantity": 2
}
```

### Update Cart Item
```http
PUT /api/v1/cart/items/:itemId
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "quantity": 3
}
```

### Remove from Cart
```http
DELETE /api/v1/cart/items/:itemId
Authorization: Bearer jwt_token_here
```

### Clear Cart
```http
DELETE /api/v1/cart
Authorization: Bearer jwt_token_here
```

## Orders

### Create Order
```http
POST /api/v1/orders
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "items": [
    {
      "productId": "prod_123",
      "variantId": "var_123",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "billingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "US"
  },
  "paymentMethod": "stripe",
  "couponCode": "SAVE10"
}
```

### Get Orders
```http
GET /api/v1/orders?page=1&limit=10
Authorization: Bearer jwt_token_here
```

### Get Order by ID
```http
GET /api/v1/orders/:id
Authorization: Bearer jwt_token_here
```

### Cancel Order
```http
POST /api/v1/orders/:id/cancel
Authorization: Bearer jwt_token_here
```

## Wishlist

### Get Wishlist
```http
GET /api/v1/wishlist
Authorization: Bearer jwt_token_here
```

### Add to Wishlist
```http
POST /api/v1/wishlist/items
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "productId": "prod_123"
}
```

### Remove from Wishlist
```http
DELETE /api/v1/wishlist/items/:productId
Authorization: Bearer jwt_token_here
```

## User Profile

### Get Profile
```http
GET /api/v1/users/profile
Authorization: Bearer jwt_token_here
```

### Update Profile
```http
PUT /api/v1/users/profile
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

### Get Addresses
```http
GET /api/v1/users/addresses
Authorization: Bearer jwt_token_here
```

### Add Address
```http
POST /api/v1/users/addresses
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "type": "shipping",
  "street": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "US",
  "isDefault": true
}
```

## Reviews

### Create Review
```http
POST /api/v1/reviews
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "productId": "prod_123",
  "orderId": "order_123",
  "rating": 5,
  "title": "Great product!",
  "comment": "I love this product. Highly recommended!",
  "images": ["review1.jpg", "review2.jpg"]
}
```

### Get Reviews
```http
GET /api/v1/reviews?productId=prod_123&page=1&limit=10
```

## Coupons

### Validate Coupon
```http
POST /api/v1/coupons/validate
Authorization: Bearer jwt_token_here
Content-Type: application/json

{
  "code": "SAVE10",
  "cartTotal": 100.00
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "discount": {
      "type": "percentage",
      "value": 10,
      "amount": 10.00
    },
    "coupon": {
      "id": "coupon_123",
      "code": "SAVE10",
      "description": "10% off your order"
    }
  }
}
```

## Search

### Search Products
```http
GET /api/v1/search?q=laptop&category=electronics&page=1&limit=20
```

### Search Suggestions
```http
GET /api/v1/search/suggestions?q=lap
```

**Response:**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      "laptop",
      "laptop bag",
      "laptop stand"
    ]
  }
}
```

## Analytics

### Track Event
```http
POST /api/v1/analytics/events
Content-Type: application/json

{
  "event": "product_view",
  "properties": {
    "productId": "prod_123",
    "category": "electronics",
    "price": 999.99
  },
  "userId": "user_123",
  "sessionId": "session_123"
}
```

## Error Responses

All API endpoints return errors in the following format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes

- `VALIDATION_ERROR` (400): Invalid input data
- `UNAUTHORIZED` (401): Authentication required
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `CONFLICT` (409): Resource already exists
- `RATE_LIMIT_EXCEEDED` (429): Too many requests
- `INTERNAL_SERVER_ERROR` (500): Server error

## Rate Limiting

API endpoints are rate limited:
- Authentication endpoints: 5 requests per minute
- General endpoints: 100 requests per minute
- Search endpoints: 50 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

List endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Pagination info is included in the response:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

### Filtering
- Use query parameters for basic filtering
- Use `filter[field]=value` for complex filtering
- Use `filter[field][operator]=value` for advanced filtering

### Sorting
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`
- Multiple sorts: `sortBy=price,name&sortOrder=desc,asc`

## WebSocket Events

Real-time updates are available via WebSocket connection:

### Connection
```javascript
const ws = new WebSocket('ws://localhost:3001/ws')
```

### Events
- `cart_updated`: Cart items changed
- `order_status_changed`: Order status updated
- `product_stock_changed`: Product stock updated
- `price_changed`: Product price updated

### Example Event
```json
{
  "type": "cart_updated",
  "data": {
    "userId": "user_123",
    "cartId": "cart_123",
    "itemCount": 3,
    "total": 299.97
  }
}
```