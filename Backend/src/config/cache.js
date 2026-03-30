const Redis = require('ioredis');
const logger = require("../utils/logger");

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("Redis config missing: REDIS_HOST and REDIS_PORT are required")
}

const redis = new Redis({
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD || undefined,
  connectionTimeout: 10000,
  tls: process.env.REDIS_URL?.startsWith("rediss") ? { rejectUnauthorized: false } :undefined,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
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

// ─────────────────────── Connection Lifecycle Events ─────────────────────────────────────
redis.on("connect", () => {
  logger.info("✅ Redis connected");
});
redis.on("ready", () => {
  logger.info("✅ Redis ready");
});
redis.on("error", (err) => {
  logger.error("❌ Redis error", { error: err.message });
});
redis.on("reconnecting", () => {
  logger.warn("⚠️  Redis reconnecting...");
});
redis.on("close", () => {
  logger.warn("⚠️  Redis connection closed");
});
redis.on("end", () => {
  logger.warn("⚠️  Redis connection ended — no more retries");
});

const shutDownRedis = async () => {
  try {
    logger.info('Shutting down Redis...');
    await redis.quit(); // Close the Redis connection
    logger.info('Redis connection closed gracefully');
  } catch (err) {
    logger.error("Error During Redis Shutdown", { err: err.message });
  }
};

module.exports = {
  redis,
  shutDownRedis
};