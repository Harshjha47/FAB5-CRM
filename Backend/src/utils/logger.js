const { createLogger, format, transports } = require("winston");
const path = require("path");
const { combine, timestamp, printf, colorize, errors, json } = format;

const devFormat = combine(
  colorize({ all: true }),
  errors({ stack: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({level, message, timestamp, stack, ...meta}) => {
    const metaString = Object.keys(meta).length ? `${JSON.stringify(meta)}` : "";
    return `[${timestamp} [${level}]: ${stack || message} ${metaString}]`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
  },
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: process.env.NODE_ENV === "production" ? prodFormat : devFormat,
  transports: [
    new transports.Console(),
    new transports.File({
      filename: path.join("logs", "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB,
      maxFiles: 5,
    }),
    new transports.File({
      filename: path.join("logs", "combined.log"),
      maxsize: 10 * 1024 * 1024, // 10MB,
      maxFiles: 5,
    })
  ],
  exitOnError: false,
});

module.exports = logger;