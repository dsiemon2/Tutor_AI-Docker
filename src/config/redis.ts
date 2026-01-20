// TutorAI Redis Configuration
// Redis client for session storage

import Redis from 'ioredis';
import { logger } from '../utils/logger';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Create Redis client
export const redis = new Redis(REDIS_URL, {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  lazyConnect: true
});

// Error handling
redis.on('error', (err) => {
  logger.error({ error: err.message }, 'Redis connection error');
});

redis.on('connect', () => {
  logger.info({}, 'Redis connected successfully');
});

redis.on('ready', () => {
  logger.info({}, 'Redis ready to accept commands');
});

redis.on('close', () => {
  logger.info({}, 'Redis connection closed');
});

// Connect to Redis
export const connectRedis = async (): Promise<void> => {
  try {
    await redis.connect();
  } catch (error) {
    // May already be connected
    if ((error as Error).message !== 'Redis is already connecting/connected') {
      throw error;
    }
  }
};

// Graceful shutdown
export const disconnectRedis = async (): Promise<void> => {
  await redis.quit();
};

export default redis;
