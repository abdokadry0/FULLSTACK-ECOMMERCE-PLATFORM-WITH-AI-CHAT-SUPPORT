import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { connectDatabase, disconnectDatabase } from './config/database';
import {
  generalLimiter,
  authLimiter,
  corsOptions,
  helmetConfig,
  sanitizeInput,
  requestLogger,
  errorHandler,
  notFoundHandler,
} from './middleware/security';
import attributionMiddleware from './utils/attributionMiddleware';

// Import routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import categoryRoutes from './routes/categories';
import paymentRoutes from './routes/payment';

// Security Core - Attribution Protection System
const backendSecurityCore = require('./utils/securityCore');

const app = express();

// Initialize security systems
backendSecurityCore.init();
attributionMiddleware.init();

// Security headers middleware
app.use(backendSecurityCore.securityHeaders());

// Attribution middleware (must be early in the chain)
app.use(attributionMiddleware.middleware());

// Request monitoring
app.use(backendSecurityCore.requestMonitoring());

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmetConfig);
app.use(cors(corsOptions));

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use('/api/payments/webhook', express.raw({ type: 'application/json' })); // Stripe webhook needs raw body
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeInput);

// Rate limiting
app.use('/api/auth', authLimiter);
app.use('/api', generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Attribution and security status endpoints
app.get('/api/attribution', (req, res) => attributionMiddleware.getAttributionInfo(req, res));
app.get('/api/security-status', (req, res) => attributionMiddleware.getSecurityStatus(req, res));

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await disconnectDatabase();
  process.exit(0);
});

export default app;