import React, { createContext, useContext, useState, useEffect } from "react";
import apiService from "../services/mockDatabase";

const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.products.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  const addProduct = async (productData) => {
    await apiService.products.add(productData);
    await refreshProducts();
  };

  const updateProduct = async (id, productData) => {
    await apiService.products.update(id, productData);
    await refreshProducts();
  };

  const deleteProduct = async (id) => {
    await apiService.products.delete(id);
    await refreshProducts();
  };

  return (
    <ProductContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};
