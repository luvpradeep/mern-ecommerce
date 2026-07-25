import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import "./Wishlist.css";

function Wishlist() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const { addToCart } = useContext(CartContext);

  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // ==========================
  // REMOVE
  // ==========================

  const removeFromWishlist = async (product) => {
    try {
      await toggleWishlist(product);

      showMessage("Removed from Wishlist", "error");
    } catch (err) {
      console.error(err);

      showMessage("Unable to remove product", "error");
    }
  };

  // ==========================
  // ADD TO CART
  // ==========================

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id);

      showMessage(`${product.name} added to cart`);
    } catch (err) {
      console.error(err);

      showMessage("Unable to add to cart", "error");
    }
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
                  onClick={() => removeFromWishlist(item.product)}
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
