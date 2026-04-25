import PDFDocument from "pdfkit";
import {imagekit} from "../utils/imagekit.js";

export const generatePDF = (user, formData, prediction, aiText) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const chunks = [];

      doc.on("data", (chunk) => chunks.push(chunk));

      doc.on("end", async () => {
        try {
          const pdfBuffer = Buffer.concat(chunks);

          const response = await imagekit.upload({
            file: pdfBuffer,
            fileName: `report_${Date.now()}.pdf`,
            folder: "/reports",
          });

          resolve(response.url);
        } catch (err) {
          reject(err);
        }
      });

      // ===============================
      // SAFE DATA
      // ===============================
      const safeUser = user || {};
      const safeForm = formData || {};
      const safePrediction = prediction || {};
      const safeAIText = aiText || "No AI content available";

      const gender = safeForm.gender
        ? safeForm.gender.charAt(0).toUpperCase() + safeForm.gender.slice(1)
        : "Not Provided";

      // ===============================
      // 🎨 COLORS
      // ===============================
      const titleColor = "#0A66C2";
      const boxBg = "#F5F9FF";
      const borderColor = "#0A66C2";

      // ===============================
      // 🧠 TITLE
      // ===============================
      doc
        .fontSize(20)
        .fillColor("black")
        .text("AI Health Report", { align: "center" });

      doc.moveDown();

      // ===============================
      // 👤 USER INFO
      // ===============================
      doc
        .fontSize(12)
        .fillColor("black")
        .font("Helvetica")
        .text(`Name: ${safeUser.name || "N/A"}`)
        .text(`Email: ${safeUser.email || "N/A"}`)
        .text(`Age: ${safeForm.age || "N/A"}`)
        .text(`Gender: ${gender}`)
        .text(`Date: ${new Date().toLocaleDateString()}`);

      doc.moveDown();

      // ===============================
      // 📊 PREDICTION
      // ===============================
      const disease =
        safePrediction?.disease ||
        safeForm?.disease ||
        "Unknown";

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("black")
        .text("Prediction Details:");

      doc.moveDown(0.5);

      doc
        .fontSize(12)
        .font("Helvetica")
        .text(`Disease: ${disease}`)
        .text(`Prediction: ${safePrediction.chance_level || "N/A"}`)
        .text(`Risk Score: ${safePrediction.probability || 0}%`);

      doc.moveDown();

      // ===============================
      // 🔧 DRAW BOX FUNCTION
      // ===============================
      const drawBox = (text) => {
        const x = doc.x;
        const y = doc.y;

        const boxWidth = 500;
        const padding = 10;

        const textHeight = doc.heightOfString(text, {
          width: boxWidth - padding * 2,
        });

        const boxHeight = textHeight + padding * 2;

        doc
          .roundedRect(x, y, boxWidth, boxHeight, 8)
          .fillAndStroke(boxBg, borderColor);

        doc
          .fillColor("black")
          .font("Helvetica")
          .fontSize(11)
          .text(text, x + padding, y + padding, {
            width: boxWidth - padding * 2,
          });

        doc.moveDown(1.5);
      };

      // ===============================
      // 🎨 COLOR BASED ON SECTION
      // ===============================
      const getColor = (title) => {
        if (title.toLowerCase().includes("risk")) return "#D32F2F"; // red
        if (title.toLowerCase().includes("diet")) return "#2E7D32"; // green
        if (title.toLowerCase().includes("exercise")) return "#ED6C02"; // orange
        return "#0A66C2";
      };

      // ===============================
      // 🧠 AI REPORT
      // ===============================
      doc.moveDown();

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("black")
        .text("AI Report:");

      doc.moveDown(0.5);

      const sections = safeAIText.split(/\n(?=\d\.)/);

      sections.forEach((section) => {
        const lines = section.split("\n").filter(Boolean);

        if (lines.length === 0) return;

        const title = lines[0];

        // 🔥 Section Title Style
        doc
          .fillColor(getColor(title))
          .font("Helvetica-Bold")
          .fontSize(13)
          .text(title, { underline: true });

        doc.moveDown(0.5);

        // 📦 Points in Boxes
        lines.slice(1).forEach((point) => {
          drawBox(point);
        });

        doc.moveDown();
      });

      // ===============================
      // ⚠️ DISCLAIMER
      // ===============================
      doc
        .moveDown()
        .fontSize(10)
        .fillColor("gray")
        .text(
          "This report is AI-generated and should not replace professional medical advice.",
          { align: "center" }
        );

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};