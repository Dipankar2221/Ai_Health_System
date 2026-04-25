import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { predictDisease } from "../../features/prediction/predictionSlice";
import {
  createAIReport,
  getRecommendation,
  clearReportState,
} from "../../features/report/reportSlice";

import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";
import PageTitle from "../../components/PageTitle";

// -----------------------------
// Risk Color
// -----------------------------
const getRiskColor = (level) => {
  if (level === "High") return "text-red-600";
  if (level === "Medium") return "text-yellow-500";
  return "text-green-600";
};

const Diabetes = () => {
  const dispatch = useDispatch();

  const { loading, results } = useSelector((state) => state.prediction);
  const {
    recommendation,
    pdfUrl,
    loading: reportLoading,
  } = useSelector((state) => state.report);

  const result = results["diabetes"];

  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigreeFunction: "",
    age: "",
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

    dispatch(predictDisease({ type: "diabetes", data: formData }));
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
        disease: "diabetes",
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

  if (loading) return <Loader text="Analyzing Diabetes Risk..." />;

  return (
    <>
      <PageTitle title="Diabetes" />
      <Navbar />

      <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">
        🩸 Diabetes Prediction
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-3">

        <input name="pregnancies" type="number" placeholder="Pregnancies" className="input" onChange={handleChange} />

        <input name="glucose" type="number" placeholder="Glucose Level" className="input" onChange={handleChange} />

        <input name="bloodPressure" type="number" placeholder="Blood Pressure" className="input" onChange={handleChange} />

        <input name="skinThickness" type="number" placeholder="Skin Thickness" className="input" onChange={handleChange} />

        <input name="insulin" type="number" placeholder="Insulin" className="input" onChange={handleChange} />

        <input name="bmi" type="number" step="0.1" placeholder="BMI" className="input" onChange={handleChange} />

        <input name="diabetesPedigreeFunction" type="number" step="0.01" placeholder="Diabetes Pedigree Function" className="input" onChange={handleChange} />

        <input name="age" type="number" placeholder="Age" className="input" onChange={handleChange} />

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded w-full"
          >
            Predict
          </button>

          <button
            type="button"
            onClick={() => {
              setFormData({
                pregnancies: "",
                glucose: "",
                bloodPressure: "",
                skinThickness: "",
                insulin: "",
                bmi: "",
                diabetesPedigreeFunction: "",
                age: "",
              });
              dispatch(clearReportState());
              setActiveType(null);
            }}
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

export default Diabetes;