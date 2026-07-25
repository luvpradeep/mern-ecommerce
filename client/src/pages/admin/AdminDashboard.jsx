import { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminDashboard.css";
import AdminCharts from "../../components/AdminCharts";
import {
  FaBoxOpen,
  FaShoppingCart,
  FaUsers,
  FaUserShield,
  FaUserFriends,
  FaRupeeSign,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaTimesCircle,
  FaWarehouse,
} from "react-icons/fa";

function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {

      const { data } = await api.get("/admin/dashboard");

      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">
        <h1 className="admin-title">Admin Dashboard</h1>

        <div className="admin-stats-grid">
          <div className="dashboard-card products-card">
            <div className="card-icon">
              <FaBoxOpen />
            </div>

            <div>
              <h2>{stats.productCount}</h2>
              <p>Products</p>
            </div>
          </div>

          <div className="dashboard-card instock-card">
            <div className="card-icon">
              <FaWarehouse />
            </div>

            <div>
              <h2>{stats.inStockCount}</h2>
              <p>In Stock</p>
            </div>
          </div>

          <div className="dashboard-card stock-card">
            <div className="card-icon">
              <FaExclamationTriangle />
            </div>

            <div>
              <h2>{stats.lowStockCount}</h2>
              <p>Low Stock</p>
            </div>
          </div>

          <div className="dashboard-card out-card">
            <div className="card-icon">
              <FaTimesCircle />
            </div>

            <div>
              <h2>{stats.outOfStockCount}</h2>
              <p>Out of Stock</p>
            </div>
          </div>

          <div className="dashboard-card users-card">
            <div className="card-icon">
              <FaUsers />
            </div>

            <div>
              <h2>{stats.userCount}</h2>
              <p>Users</p>
            </div>
          </div>

          <div className="dashboard-card customer-card">
            <div className="card-icon">
              <FaUserFriends />
            </div>

            <div>
              <h2>{stats.customerCount}</h2>
              <p>Customers</p>
            </div>
          </div>

          <div className="dashboard-card admin-card">
            <div className="card-icon">
              <FaUserShield />
            </div>

            <div>
              <h2>{stats.adminCount}</h2>
              <p>Admins</p>
            </div>
          </div>

          <div className="dashboard-card average-card">
            <div className="card-icon">
              <FaChartLine />
            </div>

            <div>
              <h2>₹{stats.averageOrderValue}</h2>
              <p>Avg Order</p>
            </div>
          </div>

          <div className="dashboard-card orders-card">
            <div className="card-icon">
              <FaShoppingCart />
            </div>

            <div>
              <h2>{stats.orderCount}</h2>
              <p>Orders</p>
            </div>
          </div>

          <div className="dashboard-card delivered-card">
            <div className="card-icon">
              <FaCheckCircle />
            </div>

            <div>
              <h2>{stats.deliveredOrders}</h2>
              <p>Delivered</p>
            </div>
          </div>

          <div className="dashboard-card pending-card">
            <div className="card-icon">
              <FaClock />
            </div>

            <div>
              <h2>{stats.pendingOrders}</h2>
              <p>Pending</p>
            </div>
          </div>

          <div className="dashboard-card revenue-card">
            <div className="card-icon">
              <FaRupeeSign />
            </div>

            <div>
              <h2>₹{stats.totalRevenue || 0}</h2>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        <div className="chart-wrapper">
          <AdminCharts />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
