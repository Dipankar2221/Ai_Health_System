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

const Heart = () => {
  const dispatch = useDispatch();

  const { loading, results } = useSelector((state) => state.prediction);
  const {
    recommendation,
    pdfUrl,
    loading: reportLoading,
  } = useSelector((state) => state.report);

  const result = results["heart"];

  const [formData, setFormData] = useState({
    age: "",
    sex: "",
    cp: "",
    trestbps: "",
    chol: "",
    fbs: "",
    restecg: "",
    thalach: "",
    exang: "",
    oldpeak: "",
    slope: "",
    ca: "",
    thal: "",
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
  // Reset
  // -----------------------------
  const handleReset = () => {
    setFormData({
      age: "",
      sex: "",
      cp: "",
      trestbps: "",
      chol: "",
      fbs: "",
      restecg: "",
      thalach: "",
      exang: "",
      oldpeak: "",
      slope: "",
      ca: "",
      thal: "",
    });

    dispatch(clearReportState());
    setActiveType(null);
  };

  // -----------------------------
  // Submit
  // -----------------------------
  const handleSubmit = (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (formData[key] === "") {
        alert("Please fill all required fields");
        return;
      }
    }

    dispatch(predictDisease({ type: "heart", data: formData }));
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
        disease: "heart",
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

  if (loading) return <Loader text="Analyzing Heart Risk..." />;

  return (
    <>

    <PageTitle title="Diabetes" />
      <Navbar />

        <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-red-600">
        ❤️ Heart Disease Prediction
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid gap-4">

        {/* BASIC */}
        <div className="grid grid-cols-2 gap-3">
          <input name="age" type="number" placeholder="Age" className="input" onChange={handleChange} />

          <select name="sex" className="input" onChange={handleChange}>
            <option value="">Sex</option>
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>

        {/* HEART */}
        <div className="grid grid-cols-2 gap-3">
          <select name="cp" className="input" onChange={handleChange}>
            <option value="">Chest Pain</option>
            <option value="0">Typical</option>
            <option value="1">Atypical</option>
            <option value="2">Non-anginal</option>
            <option value="3">Asymptomatic</option>
          </select>

          <input name="trestbps" type="number" placeholder="Resting BP" className="input" onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="chol" type="number" placeholder="Cholesterol" className="input" onChange={handleChange} />
          <input name="thalach" type="number" placeholder="Max Heart Rate" className="input" onChange={handleChange} />
        </div>

        {/* EXTRA */}
        <div className="grid grid-cols-2 gap-3">
          <select name="fbs" className="input" onChange={handleChange}>
            <option value="">Fasting Sugar</option>
            <option value="1">High</option>
            <option value="0">Normal</option>
          </select>

          <select name="exang" className="input" onChange={handleChange}>
            <option value="">Exercise Angina</option>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input name="oldpeak" type="number" step="0.1" placeholder="Oldpeak" className="input" onChange={handleChange} />

          <select name="slope" className="input" onChange={handleChange}>
            <option value="">Slope</option>
            <option value="0">Upsloping</option>
            <option value="1">Flat</option>
            <option value="2">Downsloping</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select name="restecg" className="input" onChange={handleChange}>
            <option value="">Rest ECG</option>
            <option value="0">Normal</option>
            <option value="1">Abnormal</option>
            <option value="2">Hypertrophy</option>
          </select>

          <select name="ca" className="input" onChange={handleChange}>
            <option value="">Major Vessels</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>

        <select name="thal" className="input" onChange={handleChange}>
          <option value="">Thalassemia</option>
          <option value="1">Normal</option>
          <option value="2">Fixed</option>
          <option value="3">Reversible</option>
        </select>

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            disabled={loading}
            className="bg-red-600 text-white p-2 rounded w-full"
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

          {/* AI */}
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

export default Heart;