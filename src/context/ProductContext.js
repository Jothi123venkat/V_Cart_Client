import React, { createContext, useContext, useState, useEffect } from "react";

import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../config/api';

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      // Fetch products
      const res = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.products.getAll}`); 
      setProducts(res.data);
      
      // Fetch categories
      const catRes = await axios.get(`${API_BASE_URL}/api/categories`); // Assuming category endpoint isn't fully in helper yet or correct it
      setCategories(catRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData) => {
    try {
        await axios.post(`${API_BASE_URL}${API_ENDPOINTS.products.add}`, productData);
        await refreshProducts();
    } catch (error) {
        console.error("Add failed", error);
        throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
        await axios.put(`http://localhost:5000/api/products/${id}`, productData);
        await refreshProducts();
    } catch (error) {
        console.error("Update failed", error);
        throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        await refreshProducts();
    } catch (error) {
        console.error("Delete failed", error);
        throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, categories, loading, addProduct, updateProduct, deleteProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
