
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

function WorkoutChart({ analytics }) {
  const data = {
    labels: ["Last 7 Days"],
    datasets: [
      {
        label: "Calories Burned",
        data: [analytics?.total_calories ?? 0],
      },
      {
        label: "Workout Duration (Minutes)",
        data: [analytics?.total_duration ?? 0],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Workout Activity Overview",
      },
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={data} options={options} />
    </div>
  );
}

export default WorkoutChart;

