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

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://ai-health-system-ten.vercel.app",
    "https://ai-health-system-bwyfm99ab-dip-ankars-projects.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

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