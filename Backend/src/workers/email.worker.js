const { Worker } = require("bullmq");
const { getRedis } = require("../config/cache");
const { sendConnectionEmail } = require("../services/sendEmail");
const logger = require("../utils/logger");

logger.info("Email Worker File Loaded & Listening to emailQueue...");

const redis = getRedis();

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    logger.info(`Worker actively processing job ID: ${job.id}`);
    
    const { type, data, user } = job.data;
    
    await sendConnectionEmail(type, data, user);
    
    return "Email dispatched to EmailJS";
  },
  { 
    connection: redis,
    concurrency: 5 
  }
);

// ─── BullMQ Lifecycle Event Listeners ────────────────────────────────────────
emailWorker.on("completed", (job, returnvalue) => {
  logger.info("Email job completed successfully", { 
    jobId: job.id, 
    type: job.data.type 
  });
});

emailWorker.on("failed", (job, err) => {
  logger.error("❌ Email job failed", {
    jobId: job?.id,
    type: job?.data?.type,
    error: err?.message || "Unknown error",
  });
});

emailWorker.on("error", (err) => {
  logger.error("⚠️ BullMQ Worker Error (Redis Disconnected?)", { 
    error: err.message 
  });
});

module.exports = emailWorker;