import { createContext, useState, useEffect, useCallback } from "react";

import api from "../services/api";
import { toast } from "react-toastify";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [updatingItems, setUpdatingItems] = useState([]);

  const getToken = () => localStorage.getItem("token");

  // ==========================
  // FETCH CART
  // ==========================

  const fetchCart = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.get("/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(data);
    } catch (err) {
      console.log(err);

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================
  // LOAD CART
  // ==========================

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // ==========================
  // ADD TO CART
  // ==========================

  const addToCart = async (productId) => {
    const token = getToken();

    if (!token) return;

    try {
      await api.post(
        "/cart",
        {
          productId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // REMOVE FROM CART
  // ==========================

  const removeFromCart = async (cartId) => {
    const token = getToken();

    if (!token) return;

    const backup = JSON.parse(JSON.stringify(cartItems));

    setCartItems((prev) => prev.filter((item) => item._id !== cartId));

    try {
      await api.delete(`/cart/${cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
    } catch (err) {
      console.log(err);

      setCartItems(backup);
    }
  };

  // ==========================
  // INCREASE QUANTITY
  // ==========================

  const increaseQty = async (item) => {
    if (updatingItems.includes(item._id)) return;

    if (item.quantity >= item.product.stock) {
      toast.warning(`Only ${item.product.stock} item(s) available`);
      return;
    }

    const token = getToken();

    if (!token) return;

    const newQty = item.quantity + 1;

    const backup = JSON.parse(JSON.stringify(cartItems));

    // Optimistic UI
    setCartItems((prev) =>
      prev.map((cart) =>
        cart._id === item._id
          ? {
              ...cart,
              quantity: newQty,
            }
          : cart,
      ),
    );

    await fetchCart();

    setUpdatingItems((prev) => [...prev, item._id]);

    try {
      const { data } = await api.put(
        `/cart/${item._id}`,
        {
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCartItems((prev) =>
        prev.map((cart) => (cart._id === item._id ? data : cart)),
      );
    } catch (err) {
      console.log(err);

      setCartItems(backup);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== item._id));
    }
  };

  // ==========================
  // DECREASE QUANTITY
  // ==========================

  const decreaseQty = async (item) => {
    if (updatingItems.includes(item._id)) return;

    if (item.quantity <= 1) return;

    const token = getToken();

    if (!token) return;

    const newQty = item.quantity - 1;

    const backup = JSON.parse(JSON.stringify(cartItems));

    // Optimistic UI
    setCartItems((prev) =>
      prev.map((cart) =>
        cart._id === item._id
          ? {
              ...cart,
              quantity: newQty,
            }
          : cart,
      ),
    );

    await fetchCart();

    setUpdatingItems((prev) => [...prev, item._id]);

    try {
      const { data } = await api.put(
        `/cart/${item._id}`,
        {
          quantity: newQty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCartItems((prev) =>
        prev.map((cart) => (cart._id === item._id ? data : cart)),
      );
    } catch (err) {
      console.log(err);

      setCartItems(backup);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== item._id));
    }
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const clearCart = async () => {
    const token = getToken();

    if (!token) return;

    const backup = JSON.parse(JSON.stringify(cartItems));

    setCartItems([]);

    try {
      await api.delete("/cart/clear/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await fetchCart();
    } catch (err) {
      console.log(err);

      setCartItems(backup);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        updatingItems,
        fetchCart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
