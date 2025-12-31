import { createContext, useContext } from "react";
import type { CategoryFromAPI } from "../types/cms";

interface ProductContextType {
  categories: CategoryFromAPI[];
  loading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
}
