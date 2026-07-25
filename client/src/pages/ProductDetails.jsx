import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "../services/api";

import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import Rating from "../components/Rating";

import "./ProductDetails.css";

function ProductDetails() {
  const { id } = useParams();

  const { user } = useContext(AuthContext);

  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);

  const [rating, setRating] = useState("");

  const [comment, setComment] = useState("");

  const [qty, setQty] = useState(1);

  const [loading, setLoading] = useState(true);

  const [cartLoading, setCartLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("");

  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  // -----------------------
  // MESSAGE HELPER
  // -----------------------

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // -----------------------
  // FETCH PRODUCT
  // -----------------------

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/products/${id}`);

      setProduct(res.data.product);
      setQty(1);

      // Prefill review

      if (user) {
        const myReview = res.data.product.reviews.find(
          (review) =>
            String(review.user?._id || review.user) === String(user.id),
        );

        if (myReview) {
          setRating(myReview.rating);
          setComment(myReview.comment);
        }
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // -----------------------
  // CHECK WISHLIST
  // -----------------------

  const wishlisted =
    product && wishlistItems.some((item) => item.product?._id === product._id);

  // -----------------------
  // REVIEW
  // -----------------------

  const submitReviewHandler = async (e) => {
    e.preventDefault();

    if (!rating || !comment) {
      return showMessage("Please provide rating and comment.", "error");
    }

    try {
      const res = await api.post(`/products/${product._id}/reviews`, {
        rating,
        comment,
      });

      if (res.data.action === "created") {
        showMessage("Review Submitted Successfully ✅");
      } else {
        showMessage("Review Updated Successfully ✏️");
      }

      await fetchProduct();
    } catch (error) {
      showMessage(error.response?.data?.message || "Review Failed", "error");
    }
  };

  // -----------------------
  // WISHLIST
  // -----------------------

  const wishlistHandler = async () => {
    if (!user) {
      return showMessage("Please login first.", "error");
    }

    try {
      await toggleWishlist(product);

      showMessage(
        wishlisted ? "Removed from Wishlist 🤍" : "Added to Wishlist ❤️",
      );
    } catch (error) {
      showMessage("Wishlist Error", "error");
    }
  };

  // -----------------------
  // QUANTITY
  // -----------------------

  const increaseQty = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // -----------------------
  // ADD TO CART
  // -----------------------

  const addCartHandler = async () => {
    if (!user) {
      return showMessage("Please login first.", "error");
    }

    try {
      setCartLoading(true);

      for (let i = 0; i < qty; i++) {
        await addToCart(product._id, qty);
      }

      showMessage("Added To Cart 🛒");
    } catch (err) {
      console.error(err);

      showMessage(err.response?.data?.message || "Unable To Add Cart", "error");
    } finally {
      setCartLoading(false);
    }
  };

  // -----------------------
  // LOAD
  // -----------------------

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return <h2 className="pd-loading">Loading...</h2>;
  }

  return (
    <div className="pd-product-details-container">
      {message && (
        <div
          className={`message ${
            messageType === "success" ? "success-message" : "error-message"
          }`}
        >
          {message}
        </div>
      )}

      <div className="pd-product-card">
        {/* LEFT */}

        <div className="pd-product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* RIGHT */}

        <div className="pd-product-info">
          <h1>{product.name}</h1>

          <Rating value={product.rating} />

          <p className="pd-rating-text">
            {product.rating?.toFixed(1)} ⭐ ({product.numReviews} Reviews)
          </p>

          <h3 className="pd-category">{product.category}</h3>

          <h2 className="pd-price">₹{product.price}</h2>

          <p className={product.stock > 0 ? "stock available" : "stock out"}>
            {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
          </p>

          <p className="pd-description">{product.description}</p>

          {/* Quantity */}

          {product.stock > 0 && (
            <div className="pd-qty-box">
              <button onClick={decreaseQty}>−</button>

              <span>{qty}</span>

              <button onClick={increaseQty}>+</button>
            </div>
          )}

          {/* Buttons */}

          <div className="pd-action-buttons">
            <button
              className="pd-cart-btn"
              disabled={cartLoading || product.stock === 0}
              onClick={addCartHandler}
            >
              {cartLoading
                ? "Adding..."
                : product.stock === 0
                  ? "Out Of Stock"
                  : "🛒 Add To Cart"}
            </button>

            <button className="pd-wishlist-btn"  onClick={wishlistHandler} disabled={!product}>
              {wishlisted ? "🤍 Remove Wishlist" : "❤️ Add Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}

      <div className="pd-reviews-wrapper">
        <h2>Customer Reviews</h2>

        {product.reviews.length === 0 ? (
          <div className="pd-empty-review">No Reviews Yet</div>
        ) : (
          product.reviews.map((review) => (
            <div key={review._id} className="pd-review-card">
              <div className="pd-review-top">
                <strong>{review.name}</strong>

                <Rating value={review.rating} />
              </div>

              <p>{review.comment}</p>

              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>

      {/* Review Form */}

      <div className="pd-review-form-container">
        <h2>{rating ? "Edit Your Review" : "Write a Review"}</h2>

        {user ? (
          <form className="pd-review-form" onSubmit={submitReviewHandler}>
            <label>Rating</label>

            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              <option value="">Select Rating</option>

              <option value="1">⭐ 1</option>

              <option value="2">⭐⭐ 2</option>

              <option value="3">⭐⭐⭐ 3</option>

              <option value="4">⭐⭐⭐⭐ 4</option>

              <option value="5">⭐⭐⭐⭐⭐ 5</option>
            </select>

            <label>Comment</label>

            <textarea
              rows="5"
              value={comment}
              placeholder="Write your review..."
              onChange={(e) => setComment(e.target.value)}
            />

            <button type="submit" className="pd-submit-review-btn">
              {rating ? "Update Review" : "Submit Review"}
            </button>
          </form>
        ) : (
          <div className="pd-login-message">
            Please login to write a review.
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
