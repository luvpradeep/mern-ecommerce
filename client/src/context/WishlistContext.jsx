import {
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import axios from "axios";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ===========================
  // TOKEN
  // ===========================

  const getToken = () =>
    localStorage.getItem("token");

  // ===========================
  // FETCH
  // ===========================

  const fetchWishlist = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        setWishlistItems([]);
        return;
      }

      setLoading(true);

      const { data } = await axios.get(
        "http://localhost:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWishlistItems(
        Array.isArray(data) ? data : []
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ===========================
  // TOGGLE
  // ===========================

  const toggleWishlist = async (productId) => {
  try {
    const token = getToken();

    if (!token) return;

    const exists = wishlistItems.some(
      (item) => item.product?._id === productId
    );

    if (exists) {
      await axios.delete(
        `http://localhost:5000/api/wishlist/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      await axios.post(
        `http://localhost:5000/api/wishlist/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    // Refresh wishlist immediately
    await fetchWishlist();

  } catch (err) {
    console.log(err);
  }
};

  // ===========================
  // CLEAR
  // ===========================

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        loading,

        wishlistItems,

        wishlistCount:
          wishlistItems.length,

        fetchWishlist,

        toggleWishlist,

        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}