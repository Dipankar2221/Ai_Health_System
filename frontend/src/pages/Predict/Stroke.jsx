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

const Stroke = () => {
  const dispatch = useDispatch();

  const { loading, results } = useSelector((state) => state.prediction);
  const {
    recommendation,
    pdfUrl,
    loading: reportLoading,
  } = useSelector((state) => state.report);

  const result = results["stroke"];

  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: "",
    heart_disease: "",
    ever_married: "",
    work_type: "",
    Residence_type: "",
    avg_glucose_level: "",
    bmi: "",
    smoking_status: "",
  });

  const [activeType, setActiveType] = useState(null);

  // -----------------------------
  // Handle Input
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value === "" ? "" : isNaN(value) ? value : Number(value),
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

    dispatch(predictDisease({ type: "stroke", data: formData }));
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
        disease: "stroke",
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
      gender: "",
      age: "",
      hypertension: "",
      heart_disease: "",
      ever_married: "",
      work_type: "",
      Residence_type: "",
      avg_glucose_level: "",
      bmi: "",
      smoking_status: "",
    });

    dispatch(clearReportState());
    setActiveType(null);
  };

  if (loading) return <Loader text="Analyzing Stroke Risk..." />;

  return (
    <>
       <PageTitle title="Diabetes" />
      <Navbar /> 

       <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">
        🧠 Stroke Prediction
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-3">

        <select name="gender" className="input" onChange={handleChange}>
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <input name="age" type="number" placeholder="Age" className="input" onChange={handleChange} />

        <select name="hypertension" className="input" onChange={handleChange}>
          <option value="">Hypertension</option>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>

        <select name="heart_disease" className="input" onChange={handleChange}>
          <option value="">Heart Disease</option>
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </select>

        <select name="ever_married" className="input" onChange={handleChange}>
          <option value="">Ever Married</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>

        <select name="work_type" className="input" onChange={handleChange}>
          <option value="">Work Type</option>
          <option value="Private">Private</option>
          <option value="Self-employed">Self-employed</option>
          <option value="Govt_job">Govt Job</option>
        </select>

        <select name="Residence_type" className="input" onChange={handleChange}>
          <option value="">Residence Type</option>
          <option value="Urban">Urban</option>
          <option value="Rural">Rural</option>
        </select>

        <input name="avg_glucose_level" type="number" placeholder="Avg Glucose Level" className="input" onChange={handleChange} />

        <input name="bmi" type="number" step="0.1" placeholder="BMI" className="input" onChange={handleChange} />

        <select name="smoking_status" className="input" onChange={handleChange}>
          <option value="">Smoking Status</option>
          <option value="never smoked">Never</option>
          <option value="formerly smoked">Former</option>
          <option value="smokes">Smokes</option>
        </select>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-purple-600 text-white p-2 rounded w-full"
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

export default Stroke;