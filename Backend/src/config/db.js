const mongoose = require("mongoose");
const logger = require("../utils/logger");

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    if (process.env.NODE_ENV !== "production") {
      logger.info("MongoDB Connected", { host: conn.connection.host });
    } else {
      logger.info("MongoDB Connected ✅");
    }

    mongoose.connection.on("disconnected", () => {
      logger.error("MongoDB disconnected unexpectedly");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB runtime error", { error: err.message });
    });

    mongoose.connection.on("reconnected", () => {
      logger.info("MongoDB reconnected");
    });

  } catch (error) {
    logger.error("MongoDB connection failed", { error: error.message });
    process.exit(1);
  }
};

module.exports = connectDB;