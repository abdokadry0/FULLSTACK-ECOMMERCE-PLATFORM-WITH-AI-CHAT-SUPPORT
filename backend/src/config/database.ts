import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';

// Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Redis Client
const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

// Connect to Redis
const connectRedis = async () => {
  try {
    await redis.connect();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

// Connect to database
const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('Connected to PostgreSQL database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
};

// Disconnect from database
const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    await redis.disconnect();
    console.log('Disconnected from database and Redis');
  } catch (error) {
    console.error('Error disconnecting from database:', error);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await disconnectDatabase();
  process.exit(0);
});

export { prisma, redis, connectDatabase, connectRedis, disconnectDatabase };