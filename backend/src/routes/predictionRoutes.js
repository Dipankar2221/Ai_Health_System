import express from "express";
import logger from "../utils/logger.js";

// If Node < 18, uncomment below:
// import fetch from "node-fetch";

const router = express.Router();

// ---------------- ML SERVER ----------------
const BASE_URL = process.env.ML_API_URL || "http://127.0.0.1:5000";

// ---------------- ENDPOINT MAP ----------------
const endpoints = {
  heart: "/heart",
  diabetes: "/diabetes",
  stroke: "/stroke",
  kidney: "/kidney",
  liver: "/liver",
};

// ---------------- COMMON ML CALL ----------------
const callMLAPI = async (endpoint, data) => {
  try {
    logger.info(`➡️ Sending request to ML: ${endpoint}`);

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`ML API Error: ${response.status}`);
    }

    const result = await response.json();

    logger.info(`✅ ML Result (${endpoint}): ${JSON.stringify(result)}`);

    return result;

  } catch (error) {
    logger.error(`❌ ML ERROR (${endpoint}): ${error.message}`);
    throw error;
  }
};

// ===============================
// 🔥 DYNAMIC ROUTE (BEST PRACTICE)
// ===============================
router.post("/:type", async (req, res) => {
  try {
    const { type } = req.params;

    logger.info(`🔥 API HIT: /predict/${type}`);

    if (!endpoints[type]) {
      return res.status(400).json({
        success: false,
        message: "Invalid prediction type",
      });
    }

    const data = await callMLAPI(endpoints[type], req.body);

    res.status(200).json({
      success: true,
      ...data,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ML service failed",
    });
  }
});

// ===============================
// 🔥 ALL-IN-ONE (MULTI CALL)
// ===============================
router.post("/all", async (req, res) => {
  try {
    logger.info("🔥 API HIT: /predict/all");

    const results = {};

    for (const key in endpoints) {
      try {
        results[key] = await callMLAPI(endpoints[key], req.body);
      } catch {
        results[key] = { error: "Service not reachable" };
      }
    }

    res.status(200).json({
      success: true,
      results,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all predictions",
    });
  }
});

export default router;