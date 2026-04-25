import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboard } from "../features/report/reportSlice";
import Chart from "../components/Chart";
import Loader from "../components/Loader";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";

const Dashboar = () => {
  const dispatch = useDispatch();

  const { dashboard, loading, error } = useSelector(
    (state) => state.report
  );
  const { user } = useSelector((state) => state.user);

  // ✅ FIX: wait for user before API call
  useEffect(() => {
    if (user) {
      dispatch(getDashboard());
    }
  }, [dispatch, user]);

  // ================= LOADING =================
  if (loading) return <Loader text="Loading dashboard..." />;

  // ================= ERROR =================
  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        Failed to load dashboard
      </div>
    );
  }

  // ================= FALLBACK =================
  const fallback = {
    totalReports: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    diseases: [],
  };

  const dataSource = dashboard || fallback;

  // ================= SAFE DATA =================
  const diseaseNames =
    dataSource.diseases?.map((d) => d.name) || [];
  const diseaseRisk =
    dataSource.diseases?.map((d) => d.risk) || [];

  // ================= CHART DATA =================
  const pieData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        data: [
          dataSource.highRisk,
          dataSource.mediumRisk,
          dataSource.lowRisk,
        ],
        backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
      },
    ],
  };

  const barData = {
    labels: diseaseNames.length ? diseaseNames : ["No Data"],
    datasets: [
      {
        label: "Risk %",
        data: diseaseRisk.length ? diseaseRisk : [0],
        backgroundColor: "#3b82f6",
      },
    ],
  };

  return (
    <>
    <PageTitle title="Diabetes" />
      <Navbar /> 

      <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        📊 Health Dashboard
      </h1>

      {/* ================= STATS ================= */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Total Reports</h3>
          <p className="text-2xl font-bold text-blue-600">
            {dataSource.totalReports}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">High Risk</h3>
          <p className="text-2xl font-bold text-red-500">
            {dataSource.highRisk}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Medium Risk</h3>
          <p className="text-2xl font-bold text-yellow-500">
            {dataSource.mediumRisk}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-sm text-gray-500">Low Risk</h3>
          <p className="text-2xl font-bold text-green-500">
            {dataSource.lowRisk}
          </p>
        </div>

      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
          <Chart type="pie" data={pieData} title="Risk Distribution" />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
          <Chart type="bar" data={barData} title="Disease Risk Analysis" />
        </div>

      </div>

      {/* ================= EMPTY STATE ================= */}
      {dataSource.diseases.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No disease data available yet.
        </p>
      )}

    </div>
    </>
    
  );
};

export default Dashboar;