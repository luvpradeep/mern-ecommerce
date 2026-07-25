import { useEffect, useState } from "react";
import api from "../services/api";
import "./MyOrders.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import "../fonts/NotoSans-Regular-normal";
import "../fonts/NotoSans-Bold-normal";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  FaDownload,
  FaChevronDown,
  FaChevronUp,
  FaBoxOpen,
  FaTruck,
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================
  // FETCH ORDERS
  // =====================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await api.get("/orders");

      const sortedOrders = res.data.orders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setOrders(sortedOrders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // EXPAND / COLLAPSE
  // =====================================

  const toggleExpand = (id) => {
    setExpandedOrder((prev) => (prev === id ? null : id));
  };

  // =====================================
  // DATE FORMAT
  // =====================================

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // =====================================
  // STATUS CLASS
  // =====================================

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

  // =====================================
  // STATUS ICON
  // =====================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <FaCheckCircle />;

      case "Cancelled":
        return <FaTimesCircle />;

      case "Shipped":
      case "Out for Delivery":
        return <FaTruck />;

      default:
        return <FaClock />;
    }
  };

  // =====================================
  // ORDER TIMELINE
  // =====================================

  const timeline = [
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const getCompletedStep = (status) => {
    return timeline.indexOf(status);
  };

  // =====================================
  // PDF DOWNLOAD
  // =====================================

  const downloadAllOrders = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    doc.setFont("NotoSans-Bold");
    doc.setFontSize(18);

    doc.text("MERN Shop - Order Report", 14, 20);

    doc.setFont("NotoSans-Regular");
    doc.setFontSize(11);

    doc.text(`Generated : ${new Date().toLocaleString("en-IN")}`, 14, 28);

    const rows = [];

    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        rows.push([
          order._id.slice(-8),
          item.name,
          item.qty,
          `₹${item.price}`,
          `₹${item.price * item.qty}`,
          order.orderStatus,
        ]);
      });
    });

    autoTable(doc, {
  startY: 35,

  head: [
    ["Order ID", "Product", "Qty", "Price", "Total", "Status"],
  ],

  body: rows,

  styles: {
    font: "NotoSans-Regular",
    fontSize: 10,
    cellPadding: 4,
  },

  headStyles: {
    font: "NotoSans-Bold",
    fillColor: [37, 99, 235],
    textColor: 255,
  },

  theme: "grid",
});

    doc.save("MyOrders.pdf");
  };

  // =====================================
  // PRICE FORMAT
  // =====================================

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(price);

  // =====================================
  // CANCEL ORDER
  // =====================================

  const handleCancel = async (id) => {
    const result = await Swal.fire({
      title: "Cancel Order?",

      text: "Are you sure you want to cancel this order?",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Yes, Cancel",

      cancelButtonText: "No",

      confirmButtonColor: "#dc2626",
    });

    if (!result.isConfirmed) return;

    try {
      await api.put(`/orders/cancel/${id}`);

      toast.success("Order cancelled");

      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Unable to cancel order");
    }
  };

  // =====================================
  // BUY AGAIN
  // =====================================

  const buyAgain = async (order) => {
    try {
      for (const item of order.orderItems) {
        await api.post("/cart", {
          productId: item.product._id,

          quantity: item.qty,
        });
      }
      await fetchCart();
      navigate("/cart");

      toast.success("Items added to cart");
    } catch (err) {
      console.log(err);
    }
  };

  // =====================================
  // WRITE REVIEW
  // =====================================

  const writeReview = (productId) => {
    navigate(`/product/${productId}`);
  };

  // =====================================
  // JSX
  // =====================================

  return (
    <div className="orders-page">
      {/* ================= HEADER ================= */}

      <div className="orders-header">
        <div>
          <h1>My Orders</h1>

          <p>Track your orders, download invoices and view delivery updates.</p>
        </div>

        {orders.length > 0 && (
          <button className="download-all-btn" onClick={downloadAllOrders}>
            <FaDownload />
            Download Orders PDF
          </button>
        )}
      </div>

      {/* ================= LOADING ================= */}

      {loading ? (
        <div className="orders-loading">
          <FaBoxOpen className="loading-icon" />

          <h2>Loading Orders...</h2>
        </div>
      ) : orders.length === 0 ? (
        /* ================= EMPTY ================= */

        <div className="orders-empty">
          <FaBoxOpen className="empty-icon" />

          <h2>No Orders Yet</h2>

          <p>Looks like you haven't placed any orders yet.</p>

          <Link to="/" className="shop-now-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* ================= ORDERS ================= */

        <div className="orders-list">
          {orders.map((order) => {
            const currentStep = getCompletedStep(order.orderStatus);

            const expanded = expandedOrder === order._id;

            return (
              <div className="modern-order-card" key={order._id}>
                {/* ================= TOP ================= */}

                <div className="modern-order-top">
                  <div className="order-basic">
                    <span className="order-label">Order ID</span>

                    <h3>#{order._id.slice(-8).toUpperCase()}</h3>

                    <p>Placed on {formatDate(order.createdAt)}</p>
                  </div>

                  <div className="order-summary-right">
                    <div className="order-total">
                      ₹{formatPrice(order.totalPrice)}
                    </div>

                    <span
                      className={`status-chip ${getStatusClass(
                        order.orderStatus,
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}

                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* ================= QUICK INFO ================= */}

                <div className="order-quick-grid">
                  <div className="quick-card">
                    <span>Payment</span>

                    <strong>{order.paymentMethod}</strong>
                  </div>

                  <div className="quick-card">
                    <span>Payment Status</span>

                    <strong>{order.paymentInfo?.status || "Pending"}</strong>
                  </div>

                  <div className="quick-card">
                    <span>Items</span>

                    <strong>{order.orderItems.length}</strong>
                  </div>

                  <div className="quick-card">
                    <span>Total</span>

                    <strong>₹{formatPrice(order.totalPrice)}</strong>
                  </div>
                </div>

                {/* ================= TIMELINE ================= */}

                <div className="timeline-container">
                  {timeline.map((step, index) => (
                    <div
                      className={`timeline-step
                        ${index < currentStep ? "completed" : ""}
                        ${index === currentStep ? "active" : ""}`}
                      key={step}
                    >
                      <div className="timeline-circle">
                        {index <= currentStep ? "✓" : ""}
                      </div>

                      <span>{step}</span>
                    </div>
                  ))}
                </div>

                {/* ================= EXPAND BUTTON ================= */}

                <button
                  className="expand-order-btn"
                  onClick={() => toggleExpand(order._id)}
                >
                  {expanded ? (
                    <>
                      <FaChevronUp />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <FaChevronDown />
                      View Details
                    </>
                  )}
                </button>

                {/* ================= DETAILS START ================= */}

                {expanded && (
                  <div className="order-details">
                    {/* ================= PRODUCTS ================= */}

                    <div className="order-section">
                      <h3 className="section-title">
                        <FaBoxOpen />
                        Ordered Items
                      </h3>

                      <div className="order-products">
                        {order.orderItems.map((item, index) => (
                          <div className="product-card" key={index}>
                            <div className="product-image-wrapper">
                              <img
                                src={
                                  item.image
                                    ? item.image.startsWith("http")
                                      ? item.image
                                      : `http://import.meta.env.VITE_API_URL${item.image}`
                                    : "/placeholder.png"
                                }
                                alt={item.name}
                                className="product-image"
                              />
                            </div>

                            <div className="product-details">
                              <h4>{item.name}</h4>

                              <div className="product-meta">
                                <span>
                                  Qty :<strong> {item.qty}</strong>
                                </span>

                                <span>
                                  Price :
                                  <strong> ₹{formatPrice(item.price)}</strong>
                                </span>
                              </div>
                            </div>

                            <div className="product-total">
                              ₹{formatPrice(item.price * item.qty)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ================= INFO GRID ================= */}

                    <div className="order-info-grid">
                      {/* ADDRESS */}

                      <div className="info-card">
                        <h3 className="section-title">
                          <FaMapMarkerAlt />
                          Shipping Address
                        </h3>

                        <div className="address-details">
                          <strong>{order.shippingAddress?.fullName}</strong>

                          <p>{order.shippingAddress?.phone}</p>

                          <p>{order.shippingAddress?.address}</p>

                          <p>
                            {order.shippingAddress?.city},{" "}
                            {order.shippingAddress?.state}
                          </p>

                          <p>PIN :{order.shippingAddress?.pincode}</p>
                        </div>
                      </div>

                      {/* PAYMENT */}

                      <div className="info-card">
                        <h3 className="section-title">
                          <FaCreditCard />
                          Payment
                        </h3>

                        <div className="payment-details">
                          <div className="payment-row">
                            <span>Method</span>

                            <strong>{order.paymentMethod}</strong>
                          </div>

                          <div className="payment-row">
                            <span>Status</span>

                            <span
                              className={`payment-status ${
                                order.paymentInfo?.status === "Paid"
                                  ? "paid"
                                  : "pending"
                              }`}
                            >
                              {order.paymentInfo?.status || "Pending"}
                            </span>
                          </div>

                          {order.paymentInfo?.paymentId && (
                            <div className="payment-row">
                              <span>Payment ID</span>

                              <small>{order.paymentInfo.paymentId}</small>
                            </div>
                          )}

                          {order.paymentInfo?.orderId && (
                            <div className="payment-row">
                              <span>Razorpay Order</span>

                              <small>{order.paymentInfo.orderId}</small>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ================= ORDER SUMMARY ================= */}

                    <div className="info-card summary-card">
                      <h3 className="section-title">Order Summary</h3>

                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{formatPrice(order.itemsPrice)}</span>
                      </div>

                      <div className="summary-row">
                        <span>Shipping</span>

                        <span>
                          {order.shippingPrice === 0 ? (
                            <div className="free-text">FREE</div>
                          ) : (
                            `₹${formatPrice(order.shippingPrice)}`
                          )}
                        </span>
                      </div>

                      <div className="summary-row">
                        <span>GST (5%)</span>

                        <span>₹{formatPrice(order.taxPrice)}</span>
                      </div>

                      <hr />

                      <div className="summary-row total-row">
                        <strong>Total</strong>

                        <strong>₹{formatPrice(order.totalPrice)}</strong>
                      </div>
                    </div>

                    {/* ================= ACTION BUTTONS ================= */}

                    <div className="order-actions">
                      <a
                        href={`http://import.meta.env.VITE_API_URL/invoice/${order._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="invoice-btn"
                      >
                        <FaDownload />
                        Download Invoice
                      </a>

                      {order.orderStatus === "Delivered" && (
                        <>
                          <button
                            className="buy-again-btn"
                            onClick={() => buyAgain(order)}
                          >
                            Buy Again
                          </button>

                          <button
                            className="review-btn"
                            onClick={() =>
                              writeReview(order.orderItems[0].product._id)
                            }
                          >
                            Write Review
                          </button>
                        </>
                      )}

                      {(order.orderStatus === "Processing" ||
                        order.orderStatus === "Packed") && (
                        <button
                          className="cancel-btn"
                          onClick={() => handleCancel(order._id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>

                    {/* ================= DETAILS END ================= */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyOrders;
