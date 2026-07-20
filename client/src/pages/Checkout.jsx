import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CartContext } from "../context/CartContext";
import { NotificationContext } from "../context/NotificationContext";
import api from "../services/api";

import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { fetchNotifications } = useContext(NotificationContext);

  const navigate = useNavigate();

  // ==========================
  // UI STATE
  // ==========================

  const [loading, setLoading] = useState(false);

  const [placingOrder, setPlacingOrder] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("success");

  // ==========================
  // SHIPPING ADDRESS
  // ==========================

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ==========================
  // PAYMENT
  // ==========================

  const [paymentMethod, setPaymentMethod] = useState("COD");

  // ==========================
  // VALIDATION
  // ==========================

  const [errors, setErrors] = useState({});

  // ==========================
  // TOAST MESSAGE
  // ==========================

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    clearTimeout(window.checkoutToast);

    window.checkoutToast = setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ==========================
  // LOAD SAVED ADDRESS
  // ==========================

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("shippingAddress"));

    if (saved) {
      setAddress(saved);
    }
  }, []);

  // ==========================
  // HANDLE INPUT
  // ==========================

  const handleAddressChange = (e) => {
    const updated = {
      ...address,
      [e.target.name]: e.target.value,
    };

    setAddress(updated);

    localStorage.setItem("shippingAddress", JSON.stringify(updated));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  // ==========================
  // ORDER TOTALS
  // ==========================

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const GST_RATE = 0.05; // 5% GST

  const gst = Number((subtotal * GST_RATE).toFixed());

  const shipping = subtotal >= 999 ? 0 : 60;

  const total = Number((subtotal + gst + shipping).toFixed());

  // ==========================
  // ADDRESS VALIDATION
  // ==========================

  const validateAddress = () => {
    const validation = {};

    if (!address.fullName.trim()) {
      validation.fullName = "Full Name is required";
    }

    if (!/^[6-9]\d{9}$/.test(address.phone)) {
      validation.phone = "Enter a valid 10-digit mobile number";
    }

    if (!address.address.trim()) {
      validation.address = "Address is required";
    }

    if (!address.city.trim()) {
      validation.city = "City is required";
    }

    if (!address.state.trim()) {
      validation.state = "State is required";
    }

    if (!/^\d{6}$/.test(address.pincode)) {
      validation.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(validation);

    return Object.keys(validation).length === 0;
  };

  // ==========================
  // CART VALIDATION
  // ==========================

  const validateCheckout = () => {
    if (cartItems.length === 0) {
      showMessage("Your cart is empty", "error");
      return false;
    }

    if (!validateAddress()) {
      showMessage("Please fill all required fields", "error");
      return false;
    }

    return true;
  };

  // ==========================
  // CREATE ORDER
  // ==========================

  const placeOrder = async (paymentInfo = {}) => {
    try {
      setPlacingOrder(true);

      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item.product._id,
          qty: item.quantity,
        })),

        shippingAddress: address,

        paymentMethod,

        paymentInfo,
      };

      const token = localStorage.getItem("token");

      const { data } = await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!data.success) {
        throw new Error(data.message || "Order creation failed");
      }

      // Clear cart only after
      // successful order creation

      await clearCart();

      await fetchNotifications();

      localStorage.removeItem("shippingAddress");

      showMessage("✅ Order Placed Successfully");

      setTimeout(() => {
        navigate("/orders");
      }, 1200);

      return true;
    } catch (error) {
      console.log(error);

      showMessage(
        error.response?.data?.message ||
          error.message ||
          "Order placement failed",
        "error",
      );

      return false;
    } finally {
      setPlacingOrder(false);
    }
  };

  // ==========================
  // CASH ON DELIVERY
  // ==========================

  const handleCOD = async () => {
    if (placingOrder || loading) return;

    if (!validateCheckout()) return;

    await placeOrder({
      status: "Pending",
    });
  };

  // ==========================
  // RAZORPAY PAYMENT
  // ==========================

  const paymentHandler = async () => {
    if (loading || placingOrder) return;

    if (!validateCheckout()) return;

    try {
      setLoading(true);

      // --------------------------
      // CREATE RAZORPAY ORDER
      // --------------------------

      const { data } = await api.post("/payment/create-order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: data.razorpayOrder.amount,

        currency: data.currency,

        order_id: data.razorpayOrder.id,

        name: "MERN Shop",

        description: "Order Payment",

        prefill: {
          name: address.fullName,

          contact: address.phone,
        },

        notes: {
          address: address.address,
        },

        theme: {
          color: "#16a34a",
        },

        modal: {
          ondismiss() {
            setLoading(false);

            showMessage("Payment Cancelled", "error");
          },
        },

        handler: async function (response) {
          try {
            // --------------------------
            // VERIFY PAYMENT
            // --------------------------

            const verify = await api.post("/payment/verify", response);

            if (!verify.data.success) {
              throw new Error("Payment verification failed");
            }

            // --------------------------
            // CREATE ORDER
            // --------------------------

            const success = await placeOrder({
              paymentId: response.razorpay_payment_id,

              orderId: response.razorpay_order_id,

              signature: response.razorpay_signature,

              status: "Paid",
            });

            if (!success) {
              showMessage(
                "Payment successful but order could not be created.",
                "error",
              );
            }
          } catch (error) {
            console.log(error);

            showMessage(
              error.response?.data?.message ||
                "Payment successful but order creation failed.",
              "error",
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", function (response) {
        console.log(response);

        showMessage(response.error?.description || "Payment Failed", "error");

        setLoading(false);
      });

      razor.open();
    } catch (error) {
      console.log(error);

      showMessage(
        error.response?.data?.message || "Unable to start Razorpay.",
        "error",
      );

      setLoading(false);
    }
  };

  // ==========================
  // PLACE ORDER BUTTON
  // ==========================

  const handlePlaceOrder = async () => {
    if (paymentMethod === "COD") {
      await handleCOD();
    } else {
      await paymentHandler();
    }
  };

  return (
    <div className="checkout-container">
      {message && (
        <div className={`checkout-message ${messageType}`}>{message}</div>
      )}

      <h1 className="checkout-title">Secure Checkout</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty 🛒</h2>

          <Link to="/">
            <button className="shop-btn">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="checkout-layout">
          {/* ==========================
            LEFT SIDE
        ========================== */}

          <div className="checkout-left">
            {/* ==========================
              PRODUCTS
          ========================== */}

            <section className="checkout-section">
              <h2 className="section-title">
                Order Items ({cartItems.length})
              </h2>

              <div className="checkout-products">
                {cartItems.map((item) => (
                  <div key={item._id} className="checkout-card">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="checkout-image"
                    />

                    <div className="checkout-info">
                      <h3>{item.product.name}</h3>

                      <p className="checkout-category">
                        {item.product.category}
                      </p>

                      <p className="checkout-qty">
                        Quantity :<strong> {item.quantity}</strong>
                      </p>

                      <h4 className="checkout-price">
                        ₹{item.product.price.toLocaleString()}
                      </h4>

                      <p className="checkout-total">
                        Total :
                        <strong>
                          {" "}
                          ₹
                          {(
                            item.product.price * item.quantity
                          ).toLocaleString()}
                        </strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ==========================
              SHIPPING ADDRESS
          ========================== */}

            <section className="checkout-section">
              <h2 className="section-title">Shipping Address</h2>

              <div className="checkout-address">
                <div className="form-group">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={address.fullName}
                    onChange={handleAddressChange}
                  />

                  {errors.fullName && (
                    <small className="input-error">{errors.fullName}</small>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={handleAddressChange}
                  />

                  {errors.phone && (
                    <small className="input-error">{errors.phone}</small>
                  )}
                </div>

                <div className="form-group">
                  <textarea
                    rows="4"
                    name="address"
                    placeholder="House No, Street, Area..."
                    value={address.address}
                    onChange={handleAddressChange}
                  />

                  {errors.address && (
                    <small className="input-error">{errors.address}</small>
                  )}
                </div>

                <div className="address-grid">
                  <div className="form-group">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={address.city}
                      onChange={handleAddressChange}
                    />

                    {errors.city && (
                      <small className="input-error">{errors.city}</small>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={address.state}
                      onChange={handleAddressChange}
                    />

                    {errors.state && (
                      <small className="input-error">{errors.state}</small>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                  />

                  {errors.pincode && (
                    <small className="input-error">{errors.pincode}</small>
                  )}
                </div>
              </div>
            </section>

            {/* ==========================
              PAYMENT METHOD
          ========================== */}

            <section className="checkout-section">
              <h2 className="section-title">Payment Method</h2>

              <div className="payment-box">
                <label
                  className={
                    paymentMethod === "COD"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <span>Cash On Delivery</span>
                </label>

                <label
                  className={
                    paymentMethod === "RAZORPAY"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    value="RAZORPAY"
                    checked={paymentMethod === "RAZORPAY"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />

                  <span>Razorpay (UPI / Card / NetBanking)</span>
                </label>
              </div>
            </section>
          </div>

          {/* ==========================
            ORDER SUMMARY
        ========================== */}

          <aside className="co-summary-card">
            <h2>Order Summary</h2>

            <div className="co-summary-row">
              <span>Items</span>

              <span>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className="co-summary-row">
              <span>Subtotal</span>

              <span>₹{subtotal.toLocaleString()}</span>
            </div>

            <div className="co-summary-row">
              <span>GST (5%)</span>

              <span>₹{gst.toLocaleString()}</span>
            </div>

            <div className="co-summary-row">
              <span>Shipping</span>

              <span className={shipping === 0 ? "free-shipping" : ""}>
                {shipping === 0 ? "FREE" : `₹${shipping}`}
              </span>
            </div>

            <hr />

            <div className="co-summary-row total-row">
              <span>Total Payable</span>

              <span>₹{total.toLocaleString()}</span>
            </div>

            {paymentMethod === "COD" ? (
              <button
                className="co-checkout-btn"
                onClick={handlePlaceOrder}
                disabled={placingOrder || loading || cartItems.length === 0}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            ) : (
              <button
                className="pay-btn"
                onClick={handlePlaceOrder}
                disabled={placingOrder || loading || cartItems.length === 0}
              >
                {loading
                  ? "Opening Razorpay..."
                  : `Pay ₹${total.toLocaleString()}`}
              </button>
            )}

            <p className="secure-text">
              🔒 100% Secure Payments powered by Razorpay
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Checkout;
