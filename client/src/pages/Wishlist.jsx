import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./Wishlist.css";

function Wishlist() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const { addToCart } = useContext(CartContext);
  const { wishlistItems, fetchWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchWishlist();

      showMessage("Removed from wishlist", "error");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);

    showMessage(`${product.name} added to cart`, "success");
  };

  return (
    <div className="wishlist-container">
      {message && (
        <div className={`wishlist-message ${messageType}`}>{message}</div>
      )}

      <h1 className="wishlist-title">❤️ My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Wishlist is Empty</h2>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-card">
              <img src={item.product?.image} alt={item.product?.name} />

              <h3>{item.product?.name}</h3>

              <p className="wishlist-price">₹{item.product?.price}</p>

              <div className="wishlist-actions">
                <button
                  className="cart-btn"
                  onClick={() => handleAddToCart(item.product)}
                >
                  Add To Cart
                </button>

                <button
                  className="wishlist-remove-btn"
                  onClick={() => removeFromWishlist(item.product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
