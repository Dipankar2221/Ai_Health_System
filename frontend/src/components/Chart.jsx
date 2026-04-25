import React from "react";
import {
  Line,
  Bar,
  Pie,
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart components
ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Chart = ({ type = "line", data, title }) => {
  // Default fallback data (prevents crash)
  const defaultData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Health Data",
        data: [10, 20, 15, 25, 30],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartData = data || defaultData;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: !!title,
        text: title || "Health Chart",
      },
    },
  };

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={chartData} options={options} />;
      case "pie":
        return <Pie data={chartData} options={options} />;
      default:
        return <Line data={chartData} options={options} />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-md w-full">
      {renderChart()}
    </div>
  );
};

export default Chart;