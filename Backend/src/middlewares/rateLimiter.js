const rateLimit = require("express-rate-limit");
const { redis } = require("../config/cache");

let RedisStore;
try {
  const { RedisStore: RS } = require("rate-limit-redis");
  RedisStore = RS;
} catch {
  console.warn("rate-limit-redis not installed — using memory store. Run: npm install rate-limit-redis");
}

const buildStore = (prefix = "rl:") => {
  if (RedisStore && redis) {
    return new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix: prefix,
    });
  }
  return undefined; // falls back to default memory store
};

const keyGenerator = (req) => req.ip;

const strictAuthPaths = [
  "/api/users/register/send-otp",
  "/api/users/register/verify",
  "/api/users/login",
  "/api/users/request-reset",
  "/api/users/verify-reset-otp",
  "/api/users/reset-password",
];

const authLimiter = rateLimit ({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === "production" ? 20 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: buildStore("rl:auth:"),
  skip: (req) => req.method === "OPTIONS",
  message: { success: false, message: "Too many attempts, please try again later." },
})

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  store: buildStore("rl:global:"),
  message: { success: false, message: "Too many requests, please try again later." },
  skip: (req) => {
    return req.method === "OPTIONS" || strictAuthPaths.includes(req.path);
  }
})

module.exports = {
  authLimiter,
  globalLimiter
}