const Redis = require('ioredis');
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
if (!REDIS_HOST || !REDIS_PORT){
  throw new AppError ("Redis config missing: REDIS_HOST and REDIS_PORT are required")
}
const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD,
  timeout: 10000,
  tls: process.env.NODE_ENV === "production" ? {} : undefined,
  retryStrategy(times) {
    if (times > 5) {
      logger.error('Retry limit reached');
      return null; // Stop retrying after 5 attempts
    }
    const delay = Math.min(times * 300, 3000);
    return delay;
  },
  maxRetriesPerRequest: 5,
})

redis.on('connect', () => {
  logger.info('Connected to Redis ✅');
});

redis.on('error', (err) => {
  logger.error('Redis error ⚠️', {err: err.message});
});

redis.on('reconnecting', () => {
  logger.warn('🔁 Reconnecting to Redis...');
});

redis.on('close', () => {
  logger.warn('Redis connection closed ❌');
});

const shutDownRedis = async () => {
  try {
    logger.info('Shutting down Redis...');
    await redis.quit(); // Close the Redis connection
    logger.info('Redis connection closed gracefully');
    process.exit(0);
  } catch (err) {
    logger.error("Error During Redis Shutdown", {err: err.message});
  }
};

module.exports = {
  redis,
  shutDownRedis
};