import HealthRecord from "../models/HealthRecord.js";
import {
  predictHeartML,
  predictStrokeML,
  predictDiabetesML,
  predictKidneyML,
  predictLiverML,
} from "../services/mlService.js";
import { generatePDF } from "../services/pdfService.js";

// ===============================
// 🔹 Save Report with PDF
// ===============================
const saveReport = async (user, disease, result) => {
  // Save basic report
  let report = await HealthRecord.create({
    user: user.id,
    disease,
    risk: result.probability,
    prediction: result.prediction,
  });

  // Generate PDF
  const pdfUrl = await generatePDF(user, {
    disease,
    risk: result.probability,
    prediction: result.prediction,
  });

  // Save PDF URL
  report.pdfUrl = pdfUrl;
  await report.save();

  return report;
};

// ===============================
// 🔹 Controllers
// ===============================

// ❤️ HEART
export const predictHeart = async (req, res, next) => {
  try {
    const result = await predictHeartML(req.body);

    await saveReport(req.user, "Heart", result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// 🧠 STROKE
export const predictStroke = async (req, res, next) => {
  try {
    const result = await predictStrokeML(req.body);

    await saveReport(req.user, "Stroke", result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// 🩸 DIABETES
export const predictDiabetes = async (req, res, next) => {
  try {
    const result = await predictDiabetesML(req.body);

    await saveReport(req.user, "Diabetes", result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// 🧬 KIDNEY
export const predictKidney = async (req, res, next) => {
  try {
    const result = await predictKidneyML(req.body);

    await saveReport(req.user, "Kidney", result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// 🧪 LIVER
export const predictLiver = async (req, res, next) => {
  try {
    const result = await predictLiverML(req.body);

    await saveReport(req.user, "Liver", result);

    res.json(result);
  } catch (error) {
    next(error);
  }
};