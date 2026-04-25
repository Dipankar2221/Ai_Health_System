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

const Kidney = () => {
  const dispatch = useDispatch();

  const { loading, results } = useSelector((state) => state.prediction);
  const {
    recommendation,
    pdfUrl,
    loading: reportLoading,
  } = useSelector((state) => state.report);

  const result = results["kidney"];

  const [formData, setFormData] = useState({
    age: "",
    bp: "",
    sg: "",
    al: "",
    su: "",
    bgr: "",
    bu: "",
    sc: "",
    hemo: "",
  });

  const [activeType, setActiveType] = useState(null);

  // -----------------------------
  // Input change
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

    dispatch(predictDisease({ type: "kidney", data: formData }));
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
        disease: "kidney",
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
      age: "",
      bp: "",
      sg: "",
      al: "",
      su: "",
      bgr: "",
      bu: "",
      sc: "",
      hemo: "",
    });

    dispatch(clearReportState());
    setActiveType(null);
  };

  if (loading) return <Loader text="Analyzing Kidney Risk..." />;

  return (
    <>
      <PageTitle title="Diabetes" />
      <Navbar />

      <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-green-600">
        🧪 Kidney Disease Prediction
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-3">

        <div>
          <input name="age" type="number" placeholder="Age" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Range: 1 – 100</p>
        </div>

        <div>
          <input name="bp" type="number" placeholder="Blood Pressure" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Normal: 80 – 120 mmHg</p>
        </div>

        <div>
          <input name="sg" type="number" step="0.001" placeholder="Specific Gravity" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Normal: 1.005 – 1.030</p>
        </div>

        <div>
          <input name="al" type="number" placeholder="Albumin" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Range: 0 – 5</p>
        </div>

        <div>
          <input name="su" type="number" placeholder="Sugar" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Range: 0 – 5</p>
        </div>

        <div>
          <input name="bgr" type="number" placeholder="Blood Glucose Random" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Normal: 70 – 140 mg/dL</p>
        </div>

        <div>
          <input name="bu" type="number" placeholder="Blood Urea" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Normal: 7 – 20 mg/dL</p>
        </div>

        <div>
          <input name="sc" type="number" step="0.1" placeholder="Serum Creatinine" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Normal: 0.6 – 1.3 mg/dL</p>
        </div>

        <div>
          <input name="hemo" type="number" step="0.1" placeholder="Hemoglobin" className="input" onChange={handleChange} />
          <p className="text-xs text-gray-500">Normal: 12 – 17 g/dL</p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-green-600 text-white p-2 rounded w-full"
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

export default Kidney;