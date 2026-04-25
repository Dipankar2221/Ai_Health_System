import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    disease: String,
    risk: Number,
    prediction: String,
    pdfUrl: String,
  },
  { timestamps: true }
);

const HealthRecord = mongoose.model(
  "HealthRecord",
  healthRecordSchema
);

export default HealthRecord;