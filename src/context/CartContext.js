import React, { createContext, useContext, useState, useEffect } from "react";
import axios from 'axios';
import toast from '../utils/toast';
import API_BASE_URL, { API_ENDPOINTS } from "../config/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // Monitor user state

  const getHeaders = () => {
      const token = localStorage.getItem('vcart_token');
      return { 'x-auth-token': token };
  }

  const loadCart = async () => {
    if(!user) {
        setCartItems([]);
        return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.cart.get}`, {
          headers: getHeaders()
      });
      setCartItems(res.data);
    } catch (err) {
      console.error("Load cart error", err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (product) => {
    if(!user) {
        toast.info("Please login to add items to cart");
        return;
    }

    // Check if product has stock
    if (product.stock !== undefined && product.stock <= 0) {
        toast.error("This item is out of stock");
        return;
    }

    // Check if adding would exceed stock (optional, if we have local cart state)
    const existingItem = cartItems.find(item => item.product._id === product._id);
    if (existingItem && product.stock !== undefined) {
        if (existingItem.quantity + 1 > product.stock) {
             toast.error(`Only ${product.stock} items available in stock`);
             return;
        }
    }

    try {
        const res = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.cart.add}`, 
            { productId: product._id, quantity: 1 },
            { headers: getHeaders() }
        );
        
        setCartItems(res.data); // Server returns updated list
        toast.success(`${product.productname} added to cart!`);
    } catch (err) {
        console.error("Add cart error", err);
        // Improved error handling
        const msg = err.response?.data?.msg || "Failed to add to cart";
        toast.error(msg);
    }
  };

  const removeFromCart = async (productId) => {
    try {
        const res = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.cart.remove(productId)}`, {
            headers: getHeaders()
        });
        setCartItems(res.data);
    } catch (err) {
        console.error("Remove cart error", err);
    }
  };

  const updateCartItem = async (productId, quantity) => {
      try {
          const res = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.cart.update}`, 
            { productId, quantity },
            { headers: getHeaders() }
          );
          setCartItems(res.data);
      } catch (err) {
          console.error("Update cart error", err);
          toast.error("Failed to update quantity");
      }
  };

  const clearCart = async () => {
      try {
        await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.cart.clear}`, {
            headers: getHeaders()
        });
        setCartItems([]);
      } catch (err) {
          console.error("Clear cart error", err);
      }
  };

  const checkout = async () => {
    // Checkout logic creates an order then clears cart
    // We already have 'placeOrder' api in some other context? 
    // Usually checkout calls POST /api/orders.
    // The previous implementation used apiService.cart.placeOrder which likely did nothing or mock.
    // Now we should direct user to Checkout page, and Checkout page calls Order API.
    // OR we do it here. let's keep it here if it's simple or just return generic success.
    
    // Actually, Checkout Page usually handles the "Place Order" button.
    // The CartContext 'checkout' function might just be a utility or trigger.
    // In previous code: apiService.cart.placeOrder(cartItems) -> sets cart to empty. A bit ambiguous.
    // Let's assume Checkout Component calls an Order Service. 
    // For now, I'll allow this function to just navigate or be a placeholder if not used, 
    // BUT the previous file had it.
    // Let's implement full integration: create order from cart items.
    
    setLoading(true);
    try {
      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      const orderData = {
          items: cartItems.map(item => ({
              productId: item.product._id,
              productname: item.product.productname,
              quantity: item.quantity,
              price: item.product.price,
              ImageURL: item.product.ImageURL
          })),
          total: total,
          shippingInfo: { address: "Default Address" } // Placeholder, real app should get from form
      };

      await axios.post(`${API_BASE_URL}${API_ENDPOINTS.orders.place}`, orderData, {
        headers: getHeaders()
      });
      
      // Clear cart after success
      await clearCart();
      
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItem, clearCart, checkout, loading }}>
      {children}
    </CartContext.Provider>
  );
};
