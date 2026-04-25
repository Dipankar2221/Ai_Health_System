import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error("❌ Error:", err.message);

  // Default status
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle MongoDB errors
  if (err.name === "CastError") {
    statusCode = 400;
    err.message = "Invalid ID format";
  }

  if (err.code === 11000) {
    statusCode = 400;
    err.message = "Duplicate field value entered";
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    err.message = "Invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    err.message = "Token expired";
  }

  // Final response
  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorMiddleware;