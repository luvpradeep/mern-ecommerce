import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./OrderList.css";
import { Fragment } from "react";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  FaSearch,
  FaRupeeSign,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaMapMarkerAlt,
  FaCreditCard,
  FaBoxOpen,
} from "react-icons/fa";

function OrderList() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [expandedOrder, setExpandedOrder] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("All");

  const [paymentFilter, setPaymentFilter] = useState("All");

  const [stats, setStats] = useState({
    totalOrders: 0,

    processingOrders: 0,

    deliveredOrders: 0,

    cancelledOrders: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const { data } = await axios.get(
        "http://localhost:5000/api/admin/orders",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const sorted = [...data.orders].sort((a, b) => {
        const finished = ["Delivered", "Cancelled"];

        const aDone = finished.includes(a.orderStatus);

        const bDone = finished.includes(b.orderStatus);

        if (aDone !== bDone) {
          return aDone ? 1 : -1;
        }

        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setOrders(sorted);

      setStats(data.stats);
    } catch (err) {
      console.log(err);

      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // DATE
  // ======================================

  const formatDate = (date) =>
    new Date(date).toLocaleDateString(
      "en-IN",

      {
        day: "2-digit",

        month: "short",

        year: "numeric",
      },
    );

  // ======================================
  // PRICE
  // ======================================

  const formatPrice = (price) => new Intl.NumberFormat("en-IN").format(price);

  // ======================================
  // EXPAND CARD
  // ======================================

  const toggleExpand = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  // ======================================
  // STATUS COLOR
  // ======================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Processing":
        return "processing";

      case "Packed":
        return "packed";

      case "Shipped":
        return "shipped";

      case "Out for Delivery":
        return "outfordelivery";

      case "Delivered":
        return "delivered";

      case "Cancelled":
        return "cancelled";

      default:
        return "processing";
    }
  };

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();

    const searchMatch =
      !search ||
      order._id.toLowerCase().includes(keyword) ||
      order.user?.name?.toLowerCase().includes(keyword) ||
      order.user?.email?.toLowerCase().includes(keyword);

    const statusMatch =
      statusFilter === "All" || order.orderStatus === statusFilter;

    const paymentMatch =
      paymentFilter === "All" || order.paymentInfo?.status === paymentFilter;

    return searchMatch && statusMatch && paymentMatch;
  });
  [orders, search, statusFilter, paymentFilter];

  const updateStatus = async (
    id,

    status,
  ) => {
    const result = await Swal.fire({
      title: "Update Status?",

      text: `Change order to "${status}"?`,

      icon: "question",

      showCancelButton: true,

      confirmButtonText: "Update",

      confirmButtonColor: "#2563eb",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/orders/${id}/status`,

        {
          orderStatus: status,
        },

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order updated");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const cancelOrder = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Order?",

      text: "This cannot be undone.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/admin/orders/cancel/${id}`,

        {},

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Order cancelled");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="admin-table-page">
      {/* ================= HEADER ================= */}

      <div className="page-header">
        <h1>Manage Orders</h1>
        <p>
          Track customer orders, update delivery status and monitor revenue.
        </p>
      </div>

      {/* ================= STATS ================= */}

      <div className="product-stats">
        <div className="stat-card total">
          <h3>Total Orders</h3>

          <h2>{stats.totalOrders}</h2>
        </div>

        <div className="stat-card low">
          <h3>Processing</h3>

          <h2>{stats.processingOrders}</h2>
        </div>

        <div className="stat-card stock">
          <h3>Delivered</h3>

          <h2>{stats.deliveredOrders}</h2>
        </div>

        <div className="stat-card out">
          <h3>Cancelled</h3>
          <h2>{stats.cancelledOrders}</h2>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="product-toolbar">
        <input
          className="search-bar"
          type="text"
          placeholder="🔍 Search Order ID, Customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>

          <option>Processing</option>

          <option>Packed</option>

          <option>Shipped</option>

          <option>Out for Delivery</option>

          <option>Delivered</option>

          <option>Cancelled</option>
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="loading-box">
          <h2>Loading Orders...</h2>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-box">
          <FaBoxOpen />

          <h2>No Orders Found</h2>
        </div>
      ) : (
        <div className="table-wrapper orders-table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order</th>

                <th>Customer</th>

                <th>Total</th>

                <th>Date</th>

                <th>Status</th>

                <th>Payment</th>

                <th>Actions</th>

                <th>Details</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <Fragment key={order._id}>
                  <tr key={order._id}>
                    <td data-label="Order ID">
                      <strong>#{order._id.slice(-8)}</strong>
                    </td>

                    <td data-label="Customer">
                      <div className="customer-info">
                        <strong>{order.user?.name}</strong>

                        <small>{order.user?.email}</small>
                      </div>
                    </td>

                    <td data-label="Total">
                      <strong>₹{order.totalPrice.toLocaleString()}</strong>

                      <small>
                        {order.orderItems.length} Item
                        {order.orderItems.length > 1 && "s"}
                      </small>
                    </td>

                    <td data-label="Date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}

                      <small>
                        {new Date(order.createdAt).toLocaleTimeString("en-IN")}
                      </small>
                    </td>

                    <td data-label="Status">
                      <span
                        className={`status ${order.orderStatus
                          .replace(/\s/g, "")
                          .toLowerCase()}`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>

                    <td data-label="Payment">
                      <span
                        className={`payment-badge ${
                          order.paymentInfo?.status === "Paid"
                            ? "paid"
                            : "pending"
                        }`}
                      >
                        {order.paymentInfo?.status}
                      </span>
                    </td>

                    <td data-label="Update">
                      {order.orderStatus === "Delivered" ? (
                        <button className="delivered-btn" disabled>
                          Delivered
                        </button>
                      ) : order.orderStatus === "Cancelled" ? (
                        <button className="cancelled-btn" disabled>
                          Cancelled
                        </button>
                      ) : (
                        <select
                          className="status-select"
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                        >
                          <option>Processing</option>
                          <option>Packed</option>
                          <option>Shipped</option>
                          <option>Out for Delivery</option>
                          <option>Delivered</option>
                        </select>
                      )}
                    </td>

                    <td>
                      <button
                        className="details-btn"
                        onClick={() => toggleExpand(order._id)}
                      >
                        {expandedOrder === order._id ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>

                  {/* ==========================
            EXPANDED DETAILS
      ========================== */}

                  {expandedOrder === order._id && (
                    <tr className="expanded-row">
                      <td colSpan="8">
                        {/* Timeline */}

                        <div className="admin-timeline">
                          {[
                            "Processing",
                            "Packed",
                            "Shipped",
                            "Out for Delivery",
                            "Delivered",
                          ].map((step, index) => {
                            const current = [
                              "Processing",
                              "Packed",
                              "Shipped",
                              "Out for Delivery",
                              "Delivered",
                            ].indexOf(order.orderStatus);

                            return (
                              <div
                                key={step}
                                className={`timeline-item
                    ${index <= current ? "done" : ""}`}
                              >
                                <div className="timeline-dot">✓</div>

                                <span>{step}</span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="expanded-content">
                          {/* LEFT */}

                          <div className="expanded-products">
                            <h3>Ordered Items</h3>

                            {order.orderItems.map((item) => (
                              <div key={item.product} className="expanded-item">
                                <img
                                  src={
                                    item.image.startsWith("http")
                                      ? item.image
                                      : `http://localhost:5000${item.image}`
                                  }
                                  alt={item.name}
                                />

                                <div className="expanded-info">
                                  <h4>{item.name}</h4>

                                  <p>Qty : {item.qty}</p>

                                  <p>₹ {item.price}</p>
                                </div>

                                <strong>
                                  ₹ {(item.qty * item.price).toLocaleString()}
                                </strong>
                              </div>
                            ))}
                          </div>

                          {/* RIGHT */}

                          <div className="expanded-side">
                            <div className="shipping-box">
                              <h3>Shipping Address</h3>

                              <p>
                                <strong>
                                  {order.shippingAddress?.fullName}
                                </strong>
                              </p>

                              <p>{order.shippingAddress?.phone}</p>

                              <p>{order.shippingAddress?.address}</p>

                              <p>
                                {order.shippingAddress?.city},{" "}
                                {order.shippingAddress?.state}
                              </p>

                              <p>PIN : {order.shippingAddress?.pincode}</p>
                            </div>

                            <div className="payment-box-admin">
                              <h3>Payment</h3>

                              <p>
                                Method :<strong> {order.paymentMethod}</strong>
                              </p>

                              <p>
                                Status :
                                <strong> {order.paymentInfo?.status}</strong>
                              </p>

                              {order.paymentInfo?.paymentId && (
                                <p>Payment ID :{order.paymentInfo.paymentId}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default OrderList;
