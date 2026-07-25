import { createContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export const CartContext = createContext();

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingItems, setUpdatingItems] = useState([]);

  // ==========================
  // TOKEN
  // ==========================

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

      const { data } = await api.get("/cart");

      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
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
    
  const addToCart = async (productId, quantity = 1) => {
  await api.post("/cart", {
    productId,
    quantity,
  });

  await fetchCart();
};

  // ==========================
  // REMOVE FROM CART
  // ==========================

  const removeFromCart = async (cartId) => {
    if (!getToken()) return;

    const backup = [...cartItems];

    setCartItems((prev) => prev.filter((item) => item._id !== cartId));

    try {
      await api.delete(`/cart/${cartId}`);

      await fetchCart();
    } catch (err) {
      console.error(err);
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

    if (!getToken()) return;

    const newQty = item.quantity + 1;
    const backup = [...cartItems];

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

    setUpdatingItems((prev) => [...prev, item._id]);

    try {
      const { data } = await api.put(`/cart/${item._id}`, {
        quantity: newQty,
      });

      setCartItems((prev) =>
        prev.map((cart) => (cart._id === item._id ? data : cart)),
      );
    } catch (err) {
      console.error(err);
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

    if (!getToken()) return;

    const newQty = item.quantity - 1;
    const backup = [...cartItems];

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

    setUpdatingItems((prev) => [...prev, item._id]);

    try {
      const { data } = await api.put(`/cart/${item._id}`, {
        quantity: newQty,
      });

      setCartItems((prev) =>
        prev.map((cart) => (cart._id === item._id ? data : cart)),
      );
    } catch (err) {
      console.error(err);
      setCartItems(backup);
    } finally {
      setUpdatingItems((prev) => prev.filter((id) => id !== item._id));
    }
  };

  // ==========================
  // CLEAR CART
  // ==========================

  const clearCart = async () => {
    if (!getToken()) return;

    const backup = [...cartItems];

    setCartItems([]);

    try {
      await api.delete("/cart/clear/all");
      await fetchCart();
    } catch (err) {
      console.error(err);
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
