import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================
  // TOKEN
  // ==========================

  const getToken = () => localStorage.getItem("token");

  // ==========================
  // FETCH WISHLIST
  // ==========================

  const fetchWishlist = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setWishlistItems([]);
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get("/wishlist");

      setWishlistItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================
  // LOAD
  // ==========================

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // ==========================
  // TOGGLE WISHLIST
  // ==========================

  const toggleWishlist = async (product) => {
    const token = getToken();

    if (!token) return;

    const productId = typeof product === "string" ? product : product._id;

    const exists = wishlistItems.some(
      (item) => item.product?._id === productId,
    );

    const backup = [...wishlistItems];

    try {
      // Optimistic Update
      if (exists) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.product?._id !== productId),
        );

        await api.delete(`/wishlist/${productId}`);
      } else {
        if (typeof product === "object") {
          setWishlistItems((prev) => [
            ...prev,
            {
              _id: Date.now().toString(),
              product,
            },
          ]);
        }

        await api.post(`/wishlist/${productId}`);
      }

      // Sync with server
      await fetchWishlist();
    } catch (err) {
      console.error(err);
      setWishlistItems(backup);
    }
  };

  // ==========================
  // CLEAR
  // ==========================

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        loading,
        wishlistItems,
        wishlistCount: wishlistItems.length,
        fetchWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
