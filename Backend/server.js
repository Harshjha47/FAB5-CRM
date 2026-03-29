require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const startReminderJob = require("./src/services/cronService")
const { shutDownRedis } = require("./src/config/cache");
const logger = require("./src/utils/logger")

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    /* Connect to Database */
    await connectDB();

    const server = app.listen(PORT, () => {
      logger.info("Server Running", { port: PORT });
      /* Start Cron Job */
      startReminderJob();
    })

    const gracefulShutdown = async (signal) => {
      logger.warn(`${signal} received — shutting down gracefully`);

      server.close(async () => {
        logger.info("HTTP server closed, waiting for ongoing requests to finish");
        try {
          const mongoose = require("mongoose");
          await mongoose.connection.close();
          logger.info("MongoDB disconnected");
          await shutDownRedis();
          logger.info("Redis closed");
        } catch (err) {
          logger.error("Error during shutdown", { error: err.message });
        } finally {
          process.exit(0);
        }
      });
    };
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
  } catch (err) {
    console.error("Failed to start server:", { err: err.message, stack: err.stack });
    process.exit(1);
  }
}

startServer();