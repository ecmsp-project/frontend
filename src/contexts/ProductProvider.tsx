import { type ReactNode, useCallback, useEffect, useState } from "react";
import {getAllCategories} from "../api/product-service";
import type { CategoryFromAPI } from "../types/cms";
import { ProductContext } from "./ProductContext";

export default function ProductProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCategories();
      console.log(response);
      setCategories(response.categories || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetchCategories();
  }, [refetchCategories]);

  const contextValue = {
    categories,
    loading,
    error,
    refetchCategories,
  };

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>;
}

