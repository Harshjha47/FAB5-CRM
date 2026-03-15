const rateLimit = require("express-rate-limit");
const { redis } = require("../config/cache");

let RedisStore;
try {
  const { RedisStore: RS } = require("rate-limit-redis");
  RedisStore = RS;
} catch {
  console.warn("rate-limit-redis not installed — using memory store. Run: npm install rate-limit-redis");
}

const buildStore = () => {
  if (RedisStore) {
    return new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    });
  }
  return undefined; // falls back to default memory store
};

const keyGenerator = (req) => req.ip;

const authLimiter = rateLimit ({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: buildStore(),
  message: { success: false, message: "Too many login attempts, please try again later." },
})

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: buildStore(),
  message: { success: false, message: "Too many requests, please try again later." },
})

module.exports = {
  authLimiter,
  globalLimiter
}