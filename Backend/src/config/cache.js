const Redis = require('ioredis');

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("Redis config missing: REDIS_HOST and REDIS_PORT are required")
}

let redis;
const getRedis = () => {
  if (!redis) {
    redis = new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      password: REDIS_PASSWORD || undefined,
      connectionTimeout: 10000,
      tls: process.env.REDIS_URL?.startsWith("rediss") ? { rejectUnauthorized: false } : undefined,
      // enableOfflineQueue: false,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      retryStrategy(times) {
        if (times > 5) {
          require("../utils/logger").error("Retry limit reached");
          return null;
        }
        return Math.min(times * 300, 3000);
      },
    });

    redis.on("connect", () => {
      require("../utils/logger").info("Redis connected");
    });

    redis.on("ready", () => {
      require("../utils/logger").info("Redis ready");
    });

    redis.on("error", (err) => {
      require("../utils/logger").error("Redis error", { error: err.message });
    });
  }

  return redis;
};

const shutDownRedis = async () => {
  try {
    if (redis) {
      require("../utils/logger").info('Shutting down Redis...');
      await redis.quit(); // Close the Redis connection
      require("../utils/logger").info('Redis connection closed gracefully');
    }
  } catch (err) {
    require("../utils/logger").error("Error During Redis Shutdown", { err: err.message });
  }
};

module.exports = {
  getRedis,
  shutDownRedis
};