import { create } from "zustand";
import axios from "axios";
import type { Product } from "../types/Product";


type ProductState = {
    products: Array<Product>;
    loading: boolean;
    error: string | null;
    fetchProducts: () => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

const useProducts = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null})
    try {
      const response = await axios.get(`${apiUrl}/api/products/`);
      set({ products: response.data, loading: false});
    } catch (err) {
      set({ error: "Failed to fetch products", loading: false});
      console.error(err);
    }
  },
}));

export default useProducts;