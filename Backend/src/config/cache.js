const Redis = require('ioredis');
const logger = require("../utils/logger");

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;
if (!REDIS_HOST || !REDIS_PORT) {
  throw new Error("Redis config missing: REDIS_HOST and REDIS_PORT are required")
}

const redisOptions = {
  host: REDIS_HOST,
  port: Number(REDIS_PORT),
  password: REDIS_PASSWORD || undefined,
  connectionTimeout: 10000,
  tls: process.env.REDIS_URL?.startsWith("rediss") ? { rejectUnauthorized: false } : undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  retryStrategy(times) {
    return Math.min(times * 500, 5000);
  },
};

let redis;

const getRedis = () => {
  if (!redis) {
    redis = new Redis(redisOptions);
    redis.on("connect", () => logger.info("Redis connected"));
    redis.on("ready", () => logger.info("Redis ready"));
    redis.on("error", (err) => logger.error("Redis error", { error: err.message }));
  }
  return redis;
};

const createBullMQConnection = (serviceName = "BullMQ") => {
  const conn = new Redis(redisOptions);
  conn.on("error", (err) => logger.error(`Redis (${serviceName}) error`, { error: err.message }));
  return conn;
};

const shutDownRedis = async () => {
  try {
    if (redis) {
      logger.info('Shutting down Redis...');
      await redis.quit();
      logger.info('Redis connection closed gracefully');
    }
  } catch (err) {
    logger.error("Error During Redis Shutdown", { err: err.message });
  }
};

module.exports = {
  getRedis,
  createBullMQConnection,
  shutDownRedis
};