// server.js
import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectDB from "./src/db/db.js";
import logger from "./src/utils/logger.js";

connectDB();

const PORT = process.env.PORT || 3000;

const checkMLServer = async () => {
  try {
    logger.info("🔍 Checking ML Server...");
    const res = await fetch(process.env.ML_API_URL);

    if (res.ok) {
      logger.info("✅ ML Server Connected");
    } else {
      logger.warn("⚠️ ML Server responded but not OK");
    }

  } catch {
    logger.error("❌ ML Server NOT reachable. Start Python server!");
  }
};

const startServer = async () => {
  try {
    await connectDB();
    await checkMLServer();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    logger.error(err.message);
  }
};

startServer();