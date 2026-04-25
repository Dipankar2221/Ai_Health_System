import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import payment from "./routes/paymentRoutes.js";

import predictionRoutes from "./routes/predictionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";

// Middleware
import errorMiddleware from "./middleware/errorMiddleware.js";

const app = express();

// ===============================
// ✅ CORS CONFIG
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:5173"
    ],
    credentials: true,
  })
);

// ===============================
// ✅ BODY PARSER
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================
// ✅ ROUTES
// ===============================
app.use("/api", product);
app.use("/api", user);
app.use("/api", order);
app.use("/api", payment);

// 🔥 IMPORTANT (MATCH FRONTEND)
app.use("/api/predict", predictionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/chatbot", chatbotRoutes);

// ===============================
// ✅ TEST ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("🚀 AI Health API Running...");
});

// ===============================
// ❌ ERROR HANDLER (LAST)
// ===============================
app.use(errorMiddleware);

export default app;