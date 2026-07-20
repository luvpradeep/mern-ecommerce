import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import CartProvider from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AuthProvider from "./context/AuthContext";
import NotificationProvider from "./context/NotificationContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);