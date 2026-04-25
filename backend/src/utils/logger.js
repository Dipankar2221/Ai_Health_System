import winston from "winston";
import fs from "fs";
import path from "path";

// ===============================
// 🔹 Create logs directory
// ===============================
const logDir = "logs";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// ===============================
// 🔹 Logger Configuration
// ===============================
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ level, message, timestamp }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    // Console (development)
    new winston.transports.Console(),

    // Error logs
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),

    // All logs
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

export default logger;