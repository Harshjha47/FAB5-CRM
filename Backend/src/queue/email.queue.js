const { Queue } = require("bullmq");
const { createBullMQConnection } = require("../config/cache");
const logger = require("../utils/logger");

const emailQueue = new Queue("emailQueue", {
  connection: createBullMQConnection("Queue"),
});

emailQueue.on("error", (err) => {
  logger.error("⚠️ BullMQ Queue Error:", { error: err.message });
});

module.exports = emailQueue;