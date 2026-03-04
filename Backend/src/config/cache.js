const asyncHandler = require('../utils/asyncHandler');
const Redis = require('ioredis').default;

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
},{
  retryStrategy(times) {
    if(times > 5) {
      console.error('Retry limit reached');
      return null; // Stop retrying after 5 attempts
    }
    const delay = Math.min(times * 300, 3000);
    return delay;
  }
})

redis.on('connect', () => {
  console.log('Connected to Redis ✅');
});

redis.on('error', (err) => {
  console.error('Redis error ⚠️ ', err.message);
});

redis.on('reconnecting', () => {
  console.log('🔁 Reconnecting to Redis...');
});

redis.on('close', () => {
  console.warn('Redis connection closed ❌');
});

const shutDownRedis = asyncHandler(async () => {
    console.log('Shutting down Redis...');
    await redis.quit(); // Close the Redis connection
    console.log('Redis connection closed gracefully');
    process.exit(0); // Exit the process
});

process.on("SIGINT", shutDownRedis);
process.on("SIGTERM", shutDownRedis);

module.exports = redis;