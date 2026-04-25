import axios from "axios";

// ===============================
// 🔹 Local Fallback Prediction
// ===============================
const localPrediction = (data) => {
  const values = Object.values(data).map(Number);

  const avg =
    values.reduce((a, b) => a + b, 0) / values.length;

  const probability = Math.min(100, Math.round(avg));

  return {
    prediction: probability > 50 ? "High Risk" : "Low Risk",
    probability,
  };
};

// ===============================
// 🔹 ML API Prediction (Flask)
// ===============================
const mlApiPrediction = async (endpoint, data) => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:5000/${endpoint}`,
      data
    );

    return response.data;
  } catch (error) {
    console.warn("⚠️ ML API failed, using local logic...");
    return localPrediction(data);
  }
};

// ===============================
// 🔹 Export Functions
// ===============================

export const predictHeartML = (data) =>
  mlApiPrediction("predict/heart", data);

export const predictStrokeML = (data) =>
  mlApiPrediction("predict/stroke", data);

export const predictDiabetesML = (data) =>
  mlApiPrediction("predict/diabetes", data);

export const predictKidneyML = (data) =>
  mlApiPrediction("predict/kidney", data);

export const predictLiverML = (data) =>
  mlApiPrediction("predict/liver", data);