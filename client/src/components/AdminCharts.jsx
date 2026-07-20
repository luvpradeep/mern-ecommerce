import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

import { Line, Bar } from "react-chartjs-2";

function AdminCharts() {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnalytics(data);
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);
    }
  };

  if (!analytics) return <h3>Loading...</h3>;

  const revenueData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],

    datasets: [
      {
        label: "Revenue",

        data: analytics.revenueByMonth,

        borderColor: "#2563eb",

        backgroundColor: "rgba(37,99,235,.2)",

        fill: true,

        tension: 0.4,

        pointRadius: 5,

        pointBackgroundColor: "#2563eb",
      },
    ],
  };

  const categoryData = {
    labels: Object.keys(analytics.categoryCounts),

    datasets: [
      {
        label: "Products",

        data: Object.values(analytics.categoryCounts),

        backgroundColor: [
          "#2563eb",
          "#16a34a",
          "#8b5cf6",
          "#f97316",
          "#06b6d4",
          "#ef4444",
          "#eab308",
        ],
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
    },

    interaction: {
      intersect: false,
      mode: "index",
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          maxTicksLimit: 6,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
      },

      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="admin-charts">
      <div className="chart-card">
        <h2 className="chart-title">Revenue Analytics</h2>

        <div className="chart-box">
          <Line data={revenueData} options={lineOptions} />
        </div>
      </div>
      <div className="chart-card">
        <h2 className="chart-title">Category Analytics</h2>
        <div className="chart-box">
          <Bar data={categoryData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}

export default AdminCharts;
