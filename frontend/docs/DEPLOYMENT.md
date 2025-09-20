# Deployment Guide

This guide covers deploying the e-commerce frontend to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [AWS S3 + CloudFront](#aws-s3--cloudfront)
  - [Docker](#docker)
  - [Traditional Hosting](#traditional-hosting)
- [CI/CD Setup](#cicd-setup)
- [Performance Optimization](#performance-optimization)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- Access to deployment platform
- Environment variables configured

## Environment Configuration

### Environment Files

Create environment files for different stages:

```bash
# Development
.env.local

# Staging
.env.staging

# Production
.env.production
```

### Required Environment Variables

```env
# API Configuration
REACT_APP_API_URL=https://api.yoursite.com
REACT_APP_URL=https://yoursite.com

# Analytics
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_SEGMENT_WRITE_KEY=your_segment_key
REACT_APP_FB_PIXEL_ID=your_fb_pixel_id

# Feature Flags
REACT_APP_FEATURE_FLAGS_API=https://flags.yoursite.com

# Payment
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Other Services
REACT_APP_SENTRY_DSN=https://...@sentry.io/...
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=production
```

### Environment-Specific Configuration

```javascript
// src/config/environment.js
const config = {
  development: {
    apiUrl: 'http://localhost:3001',
    debug: true,
    analytics: {
      enabled: false
    }
  },
  staging: {
    apiUrl: 'https://api-staging.yoursite.com',
    debug: true,
    analytics: {
      enabled: true
    }
  },
  production: {
    apiUrl: 'https://api.yoursite.com',
    debug: false,
    analytics: {
      enabled: true
    }
  }
}

export default config[process.env.REACT_APP_ENVIRONMENT || 'development']
```

## Build Process

### Production Build

```bash
# Install dependencies
npm ci --only=production

# Build for production
npm run build

# Analyze bundle (optional)
npm run analyze
```

### Build Optimization

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

## Deployment Platforms

### Vercel

#### Automatic Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login and connect
   vercel login
   vercel
   ```

2. **Configure Project**
   ```json
   // vercel.json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm ci",
     "framework": "vite",
     "env": {
       "REACT_APP_API_URL": "@api-url",
       "REACT_APP_GA_MEASUREMENT_ID": "@ga-id"
     },
     "build": {
       "env": {
         "REACT_APP_ENVIRONMENT": "production"
       }
     },
     "rewrites": [
       {
         "source": "/((?!api/.*).*)",
         "destination": "/index.html"
       }
     ],
     "headers": [
       {
         "source": "/static/(.*)",
         "headers": [
           {
             "key": "Cache-Control",
             "value": "public, max-age=31536000, immutable"
           }
         ]
       }
     ]
   }
   ```

3. **Deploy**
   ```bash
   # Deploy to production
   vercel --prod
   
   # Deploy to preview
   vercel
   ```

#### Manual Deployment

```bash
# Build and deploy
npm run build
vercel --prod --prebuilt
```

### Netlify

#### Automatic Deployment

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "New site from Git"
   - Connect your repository

2. **Configure Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "16"
     REACT_APP_ENVIRONMENT = "production"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   
   [[headers]]
     for = "/static/*"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   
   [[headers]]
     for = "/*.js"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   
   [[headers]]
     for = "/*.css"
     [headers.values]
       Cache-Control = "public, max-age=31536000, immutable"
   ```

#### Manual Deployment

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### AWS S3 + CloudFront

#### Setup S3 Bucket

```bash
# Create S3 bucket
aws s3 mb s3://your-site-bucket

# Configure bucket for static website hosting
aws s3 website s3://your-site-bucket \
  --index-document index.html \
  --error-document index.html
```

#### Deploy to S3

```bash
# Build application
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-site-bucket \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "service-worker.js"

# Upload HTML files with no-cache
aws s3 sync dist/ s3://your-site-bucket \
  --delete \
  --cache-control "no-cache" \
  --include "*.html" \
  --include "service-worker.js"
```

#### CloudFront Configuration

```json
{
  "Origins": [
    {
      "DomainName": "your-site-bucket.s3.amazonaws.com",
      "Id": "S3-your-site-bucket",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-your-site-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html"
    }
  ]
}
```

### Docker

#### Dockerfile

```dockerfile
# Multi-stage build
FROM node:16-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Cache static assets
        location /static/ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy (optional)
        location /api/ {
            proxy_pass http://api-server:3001;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t ecommerce-frontend .

# Run container
docker run -p 80:80 ecommerce-frontend

# Using docker-compose
docker-compose up -d
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - api
    networks:
      - ecommerce-network

  api:
    image: ecommerce-api:latest
    ports:
      - "3001:3001"
    networks:
      - ecommerce-network

networks:
  ecommerce-network:
    driver: bridge
```

### Traditional Hosting

#### Build and Upload

```bash
# Build application
npm run build

# Upload dist/ folder to your web server
# Ensure your server is configured to serve index.html for all routes
```

#### Apache Configuration

```apache
# .htaccess
Options -MultiViews
RewriteEngine On

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
</FilesMatch>

# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set X-XSS-Protection "1; mode=block"
```

## CI/CD Setup

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build application
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          REACT_APP_GA_MEASUREMENT_ID: ${{ secrets.GA_ID }}

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "16"

cache:
  paths:
    - node_modules/

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run test

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - npm i -g netlify-cli
    - netlify deploy --prod --dir=dist --site=$NETLIFY_SITE_ID --auth=$NETLIFY_AUTH_TOKEN
  only:
    - main
```

## Performance Optimization

### Build Optimization

```javascript
// vite.config.js optimizations
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react'
            if (id.includes('router')) return 'router'
            return 'vendor'
          }
        }
      }
    },
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

### CDN Configuration

```javascript
// Use CDN for static assets
const CDN_URL = process.env.REACT_APP_CDN_URL

export const getAssetUrl = (path) => {
  return CDN_URL ? `${CDN_URL}${path}` : path
}
```

### Service Worker

```javascript
// public/sw.js
const CACHE_NAME = 'ecommerce-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request)
      })
  )
})
```

## Monitoring and Analytics

### Error Tracking

```javascript
// src/utils/errorTracking.js
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.REACT_APP_ENVIRONMENT,
  integrations: [
    new Sentry.BrowserTracing()
  ],
  tracesSampleRate: 1.0
})
```

### Performance Monitoring

```javascript
// src/utils/performance.js
export const trackWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry)
      getFID(onPerfEntry)
      getFCP(onPerfEntry)
      getLCP(onPerfEntry)
      getTTFB(onPerfEntry)
    })
  }
}
```

### Health Checks

```javascript
// src/utils/healthCheck.js
export const healthCheck = async () => {
  try {
    const response = await fetch('/api/health')
    return response.ok
  } catch (error) {
    console.error('Health check failed:', error)
    return false
  }
}
```

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version
npm --version
```

#### Environment Variables Not Loading

```javascript
// Debug environment variables
console.log('Environment:', process.env.NODE_ENV)
console.log('API URL:', process.env.REACT_APP_API_URL)
```

#### Routing Issues

```javascript
// Ensure proper routing configuration
// For hash routing
import { HashRouter } from 'react-router-dom'

// For browser routing (requires server configuration)
import { BrowserRouter } from 'react-router-dom'
```

#### CORS Issues

```javascript
// Configure proxy in development
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})
```

### Debugging

#### Enable Debug Mode

```env
REACT_APP_DEBUG=true
REACT_APP_LOG_LEVEL=debug
```

#### Performance Debugging

```javascript
// Enable React DevTools Profiler
if (process.env.NODE_ENV === 'development') {
  import('@welldone-software/why-did-you-render').then(whyDidYouRender => {
    whyDidYouRender(React)
  })
}
```

### Rollback Strategy

```bash
# Vercel rollback
vercel rollback [deployment-url]

# Netlify rollback
netlify sites:list
netlify api listSiteDeploys --site-id=SITE_ID
netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID
```

## Security Considerations

### Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://www.google-analytics.com; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

### Environment Variables Security

- Never commit `.env` files to version control
- Use platform-specific secret management
- Rotate API keys regularly
- Use different keys for different environments

### HTTPS Configuration

```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production' && location.protocol !== 'https:') {
  location.replace(`https:${location.href.substring(location.protocol.length)}`)
}
```

This deployment guide covers the most common scenarios and platforms. Choose the deployment method that best fits your infrastructure and requirements.