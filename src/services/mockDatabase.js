/**
 * Hybrid API Service - Uses backend when available, falls back to localStorage
 */
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const DELAY = 300; // Simulate network latency for localStorage
let USE_BACKEND = true; // Will be set based on backend availability

const INITIAL_PRODUCTS = [
  {
    _id: "1",
    productname: "Wireless Headphones",
    productdescription: "Noise cancelling high fidelity audio.",
    price: 199,
    ImageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "2",
    productname: "Smart Watch",
    productdescription: "Track your fitness and stay connected.",
    price: 299,
    ImageURL: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop"
  },
  {
    _id: "3",
    productname: "Mechanical Keyboard",
    productdescription: "Tactile switches for ultimate typing experience.",
    price: 149,
    ImageURL: "https://images.unsplash.com/photo-1587829741301-dc798b91add1?q=80&w=1000&auto=format&fit=crop"
  }
];

// Helper to delay response
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if backend is available
const checkBackendAvailability = async () => {
  try {
    await axios.get(`${API_BASE_URL}/`, { timeout: 2000 });
    USE_BACKEND = true;
    console.log('✅ Backend connected');
    return true;
  } catch (error) {
    USE_BACKEND = false;
    console.log('⚠️ Backend unavailable, using localStorage');
    return false;
  }
};

// Initialize backend check
checkBackendAvailability();

const apiService = {
  products: {
    getAll: async (keyword = '') => {
      if (USE_BACKEND) {
        try {
          const url = keyword ? `${API_BASE_URL}/?keyword=${keyword}` : `${API_BASE_URL}/`;
          const response = await axios.get(url);
          return response.data;
        } catch (error) {
          console.warn('Backend failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // localStorage fallback
      await delay(DELAY);
      const stored = localStorage.getItem("vcart_products");
      if (!stored) {
        localStorage.setItem("vcart_products", JSON.stringify(INITIAL_PRODUCTS));
        return INITIAL_PRODUCTS;
      }
      const products = JSON.parse(stored);
      
      // Client-side search if keyword provided
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return products.filter(p => 
          p.productname.toLowerCase().includes(lowerKeyword) ||
          p.productdescription.toLowerCase().includes(lowerKeyword)
        );
      }
      return products;
    },
    
    add: async (product) => {
      if (USE_BACKEND) {
        try {
          const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.products.add}`, product);
          return response.data;
        } catch (error) {
          console.warn('Backend failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // localStorage fallback
      await delay(DELAY);
      const products = JSON.parse(localStorage.getItem("vcart_products") || "[]");
      const newProduct = { ...product, _id: Date.now().toString() };
      products.push(newProduct);
      localStorage.setItem("vcart_products", JSON.stringify(products));
      return newProduct;
    },
    
    update: async (id, updates) => {
      if (USE_BACKEND) {
        try {
          const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.products.update(id)}`, updates);
          return response.data;
        } catch (error) {
          console.warn('Backend failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // localStorage fallback
      await delay(DELAY);
      const products = JSON.parse(localStorage.getItem("vcart_products") || "[]");
      const index = products.findIndex(p => p._id === id);
      if (index === -1) throw new Error("Product not found");
      products[index] = { ...products[index], ...updates };
      localStorage.setItem("vcart_products", JSON.stringify(products));
      return products[index];
    },
    
    delete: async (id) => {
      if (USE_BACKEND) {
        try {
          await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.products.delete(id)}`);
          return true;
        } catch (error) {
          console.warn('Backend failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // localStorage fallback
      await delay(DELAY);
      const products = JSON.parse(localStorage.getItem("vcart_products") || "[]");
      const filtered = products.filter(p => p._id !== id);
      localStorage.setItem("vcart_products", JSON.stringify(filtered));
      return true;
    }
  },
  
  cart: {
    get: async () => {
      await delay(DELAY);
      return JSON.parse(localStorage.getItem("VJ_cart") || "[]");
    },
    
    save: async (cartItems) => {
      await delay(DELAY);
      localStorage.setItem("VJ_cart", JSON.stringify(cartItems));
      return cartItems;
    },
    
    placeOrder: async (items) => {
      const orderData = {
        items: items,
        date: new Date().toISOString(),
        status: 'Processing',
        total: items.reduce((sum, item) => sum + Number(item.price), 0)
      };
      
      if (USE_BACKEND) {
        try {
          // Backend expects array of items directly
          await axios.post(`${API_BASE_URL}${API_ENDPOINTS.cart.placeOrder}`, items);
          
          // Also save to localStorage for order history
          const orders = JSON.parse(localStorage.getItem("vcart_orders") || "[]");
          const newOrder = { ...orderData, _id: Date.now().toString() };
          orders.push(newOrder);
          localStorage.setItem("vcart_orders", JSON.stringify(orders));
          localStorage.setItem("VJ_cart", "[]");
          
          return newOrder;
        } catch (error) {
          console.warn('Backend failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // localStorage fallback
      await delay(DELAY * 2);
      const orders = JSON.parse(localStorage.getItem("vcart_orders") || "[]");
      const newOrder = { ...orderData, _id: Date.now().toString() };
      orders.push(newOrder);
      localStorage.setItem("vcart_orders", JSON.stringify(orders));
      localStorage.setItem("VJ_cart", "[]");
      return newOrder;
    }
  },
  
  orders: {
    getAll: async () => {
      if (USE_BACKEND) {
        try {
          const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.cart.getOrders}`);
          // Backend returns flat array of items, we need to group them
          const backendOrders = response.data;
          
          // Also get localStorage orders
          const localOrders = JSON.parse(localStorage.getItem("vcart_orders") || "[]");
          
          // Combine and deduplicate
          return localOrders.length > 0 ? localOrders : backendOrders.map((item, idx) => ({
            _id: item._id || `order-${idx}`,
            items: [item],
            date: new Date().toISOString(),
            status: 'Delivered',
            total: item.price
          }));
        } catch (error) {
          console.warn('Backend failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // localStorage fallback
      await delay(DELAY);
      return JSON.parse(localStorage.getItem("vcart_orders") || "[]");
    },
    
    cancel: async (id) => {
      if (USE_BACKEND) {
        try {
          await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.cart.cancelOrder(id)}`);
        } catch (error) {
          console.warn('Backend cancel failed, using localStorage', error);
          USE_BACKEND = false;
        }
      }
      
      // Always update localStorage
      await delay(DELAY);
      const orders = JSON.parse(localStorage.getItem("vcart_orders") || "[]");
      const filtered = orders.filter(o => o._id !== id);
      localStorage.setItem("vcart_orders", JSON.stringify(filtered));
      return true;
    }
  },
  
  // Utility to manually retry backend connection
  reconnect: checkBackendAvailability
};

export default apiService;

