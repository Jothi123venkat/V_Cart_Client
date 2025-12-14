import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/mockDatabase";
import Swal from "sweetalert2";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initial load
    const loadCart = async () => {
      const items = await apiService.cart.get();
      setCartItems(items);
    };
    loadCart();
  }, []);

  const addToCart = async (product) => {
    const exists = cartItems.find((item) => item._id === product._id);
    if (exists) {
      Swal.fire({
        title: "Already in Cart",
        text: `${product.productname} is already in your cart.`,
        icon: "warning",
      });
      return;
    }

    const newCart = [...cartItems, product];
    setCartItems(newCart);
    await apiService.cart.save(newCart);
    
    Swal.fire({
      title: "Added!",
      text: `${product.productname} added to cart.`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false
    });
  };

  const removeFromCart = async (productId) => {
    const newCart = cartItems.filter((item) => item._id !== productId);
    setCartItems(newCart);
    await apiService.cart.save(newCart);
  };

  const clearCart = async () => {
    setCartItems([]);
    await apiService.cart.save([]);
  };

  const checkout = async () => {
    setLoading(true);
    try {
      await apiService.cart.placeOrder(cartItems);
      setCartItems([]);
      Swal.fire("Order Placed!", "Your order has been recorded.", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to place order.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, checkout, loading }}>
      {children}
    </CartContext.Provider>
  );
};
