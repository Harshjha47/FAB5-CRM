const { Queue } = require("bullmq");
const { getRedis } = require("../config/cache");
const redis = getRedis();

const emailQueue = new Queue("emailQueue", {
  connection: redis,
});

module.exports = emailQueue;