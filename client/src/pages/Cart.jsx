import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, increaseQty, decreaseQty, updatingItems } =
    useContext(CartContext);

  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your Cart is Empty 🛒</h2>

          <Link to="/">
            <button className="shop-btn">Continue Shopping</button>
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-card">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="cart-image"
                  onClick={() => navigate(`/product/${item.product._id}`)}
                />

                <div className="cart-info">
                  <h3
                    className="cart-product-title"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    {item.product.name}
                  </h3>

                  <p className="category">{item.product.category}</p>

                  <h2>₹{item.product.price}</h2>

                  <div className="qty-box">
                    <button
                      disabled={
                        updatingItems.includes(item._id) || item.quantity <= 1
                      }
                      onClick={() => decreaseQty(item)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      disabled={
                        updatingItems.includes(item._id) ||
                        item.quantity >= item.product.stock
                      }
                      onClick={() => increaseQty(item)}
                    >
                      +
                    </button>
                  </div>

                  <p className="stock-text">Stock : {item.product.stock}</p>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-card">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <div className="summary-row">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>

            <Link to="/checkout">
              <button className="checkout-btn">Proceed to Checkout</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
