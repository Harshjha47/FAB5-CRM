const { Worker } = require("bullmq");
const { getRedis } = require("../config/cache");
const { sendConnectionEmail } = require("../services/sendEmail");
const logger = require("../utils/logger");
const redis = getRedis();

const emailWorker = new Worker("emailQueue", async (job) => {
  logger.info("Email worker started");
  const { type, data, user } = job.data;

  await sendConnectionEmail(type, data, user);
  logger.info("Email sent successfully", { type });
},
  { connection: redis }
);

emailWorker.on("failed", (job) => {
  logger.info("Email job failed", {
    jobId: job.id,
    error: job.failedReason,
  });
});

module.exports = emailWorker;