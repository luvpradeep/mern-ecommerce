import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";

import { toast } from "react-toastify";

import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
} from "react-icons/fa";

import Rating from "./Rating";
import "./ProductCard.css";

function ProductCard({ product }) {

  const { addToCart } =
    useContext(CartContext);

  const {
    wishlistItems,
    toggleWishlist,
  } = useContext(WishlistContext);

  const [addedCart, setAddedCart] =
    useState(false);

  const inWishlist =
  wishlistItems.some(
    (item) =>
      item.product?._id === product._id
  );

  const handleAddCart = () => {

    addToCart(product);

    toast.success(
      `${product.name} added to cart`
    );

    setAddedCart(true);

    setTimeout(() => {
      setAddedCart(false);
    }, 2000);
  };

  const handleWishlist = async () => {
  try {

    await toggleWishlist(product._id);

    if (inWishlist) {
      toast.info(
        `${product.name} removed from wishlist`
      );
    } else {
      toast.success(
        `${product.name} added to wishlist`
      );
    }

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Wishlist Error"
    );

  }
};

  return (
  <div className="shop-card">

    {/* Wishlist */}

    <button
      className="shop-heart-btn"
      onClick={handleWishlist}
    >
      {inWishlist ? (
        <FaHeart />
      ) : (
        <FaRegHeart />
      )}
    </button>

    {/* Product */}

    <Link
      to={`/product/${product._id}`}
      className="shop-link"
    >
      <div className="shop-image-box">

        <img
          src={product.image}
          alt={product.name}
          className="shop-image"
        />

      </div>

      <div className="shop-content">

        <h3 className="shop-name">
          {product.name}
        </h3>

        <p className="shop-category">
          {product.category}
        </p>

        <div className="shop-rating-row">

          <Rating value={product.rating} />

          <span className="shop-review">
            ({product.numReviews})
          </span>

        </div>

        <h2 className="shop-price">
          ₹{product.price.toLocaleString()}
        </h2>

      </div>
    </Link>

    {/* Button */}

    <button
      onClick={handleAddCart}
      className={
        addedCart
          ? "shop-cart-btn added"
          : "shop-cart-btn"
      }
    >
      <FaShoppingCart />

      {addedCart
        ? " Added"
        : " Add To Cart"}
    </button>

  </div>
);
}

export default ProductCard;