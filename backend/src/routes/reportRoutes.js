import express from "express";
import { getReports, getDashboard, getRecommendation, createAIReport, deleteReport } from "../controller/reportController.js";
import { isAuthenticatedUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 Reports
router.get("/reportDashboard", isAuthenticatedUser, getDashboard);
router.get("/", isAuthenticatedUser, getReports);
router.delete("/:id", isAuthenticatedUser, deleteReport);

// 🔹 Dashboard
router.post("/ai/recommendation", getRecommendation);
router.post("/ai-report/:disease",isAuthenticatedUser, createAIReport);

export default router;