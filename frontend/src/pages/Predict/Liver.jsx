import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { predictDisease } from "../../features/prediction/predictionSlice";
import {
  createAIReport,
  getRecommendation,
  clearReportState,
} from "../../features/report/reportSlice";

import Loader from "../../components/Loader";
import PageTitle from "../../components/PageTitle";
import Navbar from "../../components/Navbar";

// -----------------------------
// Risk Color
// -----------------------------
const getRiskColor = (level) => {
  if (level === "High") return "text-red-600";
  if (level === "Medium") return "text-yellow-500";
  return "text-green-600";
};

const Liver = () => {
  const dispatch = useDispatch();

  const { loading, results } = useSelector((state) => state.prediction);
  const {
    recommendation,
    pdfUrl,
    loading: reportLoading,
  } = useSelector((state) => state.report);

  const result = results["liver"];

  const [formData, setFormData] = useState({
    Age: "",
    Gender: "",
    Total_Bilirubin: "",
    Direct_Bilirubin: "",
    Alkaline_Phosphotase: "",
    Alamine_Aminotransferase: "",
    Aspartate_Aminotransferase: "",
    Total_Protiens: "",
    Albumin: "",
    Albumin_and_Globulin_Ratio: "",
  });

  const [activeType, setActiveType] = useState(null);

  // -----------------------------
  // Handle Input
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === "" ? "" : Number(value),
    });
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (formData[key] === "") {
        alert(`Please fill ${key}`);
        return;
      }
    }

    dispatch(predictDisease({ type: "liver", data: formData }));
    dispatch(clearReportState());
    setActiveType(null);
  };

  // -----------------------------
  // Recommendation
  // -----------------------------
  const handleRecommendation = (type) => {
    if (!result) return;

    setActiveType(type);

    dispatch(
      getRecommendation({
        type,
        prediction: result,
        formData,
      })
    );
  };

  // -----------------------------
  // Download Report
  // -----------------------------
  const handleDownloadReport = () => {
    if (!result) return;

    dispatch(
      createAIReport({
        disease: "liver",
        prediction: result,
        formData,
      })
    );
  };

  // -----------------------------
  // Open PDF
  // -----------------------------
  useEffect(() => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  }, [pdfUrl]);

  // -----------------------------
  // Reset
  // -----------------------------
  const handleReset = () => {
    setFormData({
      Age: "",
      Gender: "",
      Total_Bilirubin: "",
      Direct_Bilirubin: "",
      Alkaline_Phosphotase: "",
      Alamine_Aminotransferase: "",
      Aspartate_Aminotransferase: "",
      Total_Protiens: "",
      Albumin: "",
      Albumin_and_Globulin_Ratio: "",
    });

    dispatch(clearReportState());
    setActiveType(null);
  };

  if (loading) return <Loader text="Analyzing Liver Risk..." />;

  return (
    <>
    <PageTitle title="Diabetes" />
      <Navbar />

    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-yellow-600">
        🧬 Liver Disease Prediction
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-3">

        <input name="Age" type="number" placeholder="Age" className="input" onChange={handleChange} />

        <select name="Gender" className="input" onChange={handleChange}>
          <option value="">Gender</option>
          <option value="1">Male</option>
          <option value="0">Female</option>
        </select>

        <input name="Total_Bilirubin" type="number" step="0.1" placeholder="Total Bilirubin" className="input" onChange={handleChange} />

        <input name="Direct_Bilirubin" type="number" step="0.1" placeholder="Direct Bilirubin" className="input" onChange={handleChange} />

        <input name="Alkaline_Phosphotase" type="number" placeholder="Alkaline Phosphotase" className="input" onChange={handleChange} />

        <input name="Alamine_Aminotransferase" type="number" placeholder="ALT" className="input" onChange={handleChange} />

        <input name="Aspartate_Aminotransferase" type="number" placeholder="AST" className="input" onChange={handleChange} />

        <input name="Total_Protiens" type="number" step="0.1" placeholder="Total Proteins" className="input" onChange={handleChange} />

        <input name="Albumin" type="number" step="0.1" placeholder="Albumin" className="input" onChange={handleChange} />

        <input
          name="Albumin_and_Globulin_Ratio"
          type="number"
          step="0.1"
          placeholder="A/G Ratio"
          className="input"
          onChange={handleChange}
        />

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-yellow-600 text-white p-2 rounded w-full"
          >
            Predict
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="bg-gray-400 text-white p-2 rounded w-full"
          >
            Reset
          </button>
        </div>
      </form>

      {/* RESULT */}
      {result && (
        <div className="mt-5 p-4 border rounded bg-gray-50">
          <p>Probability: {result.probability}%</p>

          <p className={getRiskColor(result.chance_level)}>
            Risk: {result.chance_level}
          </p>

          {/* AI BUTTONS */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {["diet", "exercise", "lifestyle", "prevention"].map((type) => (
              <button
                key={type}
                disabled={reportLoading}
                onClick={() => handleRecommendation(type)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                {type}
              </button>
            ))}
          </div>

          {reportLoading && <p className="mt-3">Generating AI response...</p>}

          {recommendation && (
            <div className="mt-4 p-3 border bg-white rounded">
              <h3 className="font-semibold capitalize">{activeType}</h3>
              <p>{recommendation}</p>
            </div>
          )}

          <button
            onClick={handleDownloadReport}
            className="mt-4 bg-black text-white p-2 rounded w-full"
          >
            Download AI Report
          </button>
        </div>
      )}
    </div>
    </>
  );
};

export default Liver;