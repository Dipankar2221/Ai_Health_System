import HealthRecord from "../models/HealthRecord.js";
import { generateReport, generateRecommendation } from "../services/aiServices.js";
import { generatePDF } from "../services/pdfService.js";

// ===============================
// 🔹 Create AI Report + Save
// ===============================
export const createAIReport = async (req, res) => {
  try {
    const { prediction, formData } = req.body;

    // ✅ GET DISEASE FROM URL
    const diseaseParam = req.params.disease;  // <-- IMPORTANT

    // ✅ Convert to Proper Name
    const diseaseMap = {
      heart: "Heart Disease",
      diabetes: "Diabetes",
      kidney: "Kidney Disease",
      liver: "Liver Disease",
      stroke: "Stroke"
    };

    const finalDisease =
      diseaseMap[diseaseParam?.toLowerCase()] || "Unknown";

    // ✅ Attach disease to prediction
    const finalPrediction = {
      ...prediction,
      disease: finalDisease,
    };

    // ===============================
    // 🔐 Auth Check
    // ===============================
    if (!req.user) {
      return res.status(401).json({
        error: "Unauthorized - User not found",
      });
    }

    // ===============================
    // 1️⃣ AI Report
    // ===============================
    const aiText = await generateReport(finalPrediction, formData);

    // ===============================
    // 2️⃣ PDF
    // ===============================
    const pdfUrl = await generatePDF(
      req.user,
      formData,
      finalPrediction,
      aiText
    );

    // ===============================
    // 3️⃣ Save DB
    // ===============================
    const record = await HealthRecord.create({
      user: req.user._id,
      disease: finalDisease, // ✅ always correct now
      prediction: finalPrediction?.chance_level || "Unknown",
      risk: finalPrediction?.probability || 0,
      pdfUrl,
    });

    // ===============================
    // 4️⃣ Response
    // ===============================
    res.status(201).json({
      success: true,
      pdfUrl,
      record,
    });

  } catch (error) {
    console.error("AI Report Error:", error);
    res.status(500).json({ error: "Report failed" });
  }
};
// ===============================
// 🔹 Recommendation
// ===============================
export const getRecommendation = async (req, res) => {
  try {
    const { type, prediction, formData } = req.body;

    const answer = await generateRecommendation(type, prediction, formData);

    res.json({ answer });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI Error" });
  }
};

// ===============================
// 🔹 Get Reports
// ===============================
export const getReports = async (req, res, next) => {
  try {
    const reports = await HealthRecord.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    const formatted = reports.map((r) => ({
      _id: r._id,
      disease: r.disease || "Unknown",
      risk: r.risk || 0,
      prediction: r.prediction || "",
      date: r.createdAt,
      pdfUrl: r.pdfUrl || "",
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      reports: formatted,
    });

  } catch (error) {
    console.error("Get Reports Error:", error);
    next(error);
  }
};

// ===============================
// 🔹 Dashboard
// ===============================
export const getDashboard = async (req, res) => {
  try {
    const reports = await HealthRecord.find({ user: req.user._id }); // ✅ FIXED

    if (!reports.length) {
      return res.json({
        success: true,
        totalReports: 0,
        highRisk: 0,
        mediumRisk: 0,
        lowRisk: 0,
        diseases: [],
      });
    }

    let highRisk = 0;
    let mediumRisk = 0;
    let lowRisk = 0;

    reports.forEach((r) => {
      const risk = Number(r.risk) || 0;

      if (risk >= 70) highRisk++;
      else if (risk >= 40) mediumRisk++;
      else lowRisk++;
    });

    const diseaseMap = {};

    reports.forEach((r) => {
      const disease = r.disease || "Unknown";
      const risk = Number(r.risk) || 0;

      if (!diseaseMap[disease]) {
        diseaseMap[disease] = { total: 0, count: 0 };
      }

      diseaseMap[disease].total += risk;
      diseaseMap[disease].count += 1;
    });

    const diseases = Object.keys(diseaseMap).map((key) => ({
      name: key,
      risk: Math.round(
        diseaseMap[key].total / diseaseMap[key].count
      ),
    }));

    res.json({
      success: true,
      totalReports: reports.length,
      highRisk,
      mediumRisk,
      lowRisk,
      diseases,
    });

  } catch (error) {
    res.status(500).json({ error: "Dashboard error" });
  }
};


// ===============================
// 🔹 DELETE REPORT
// ===============================
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await HealthRecord.findOneAndDelete({
      _id: id,
      user: req.user.id, // 🔐 security (only own report)
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
};