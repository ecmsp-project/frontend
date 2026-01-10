import { createContext, useContext } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  refetchCart: () => Promise<void>;
  updateProductQuantity: (productId: string, quantity: number, delta: number) => Promise<void>;
  overwriteProductQuantity: (productId: string, newQuantity: number) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  clearFullCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within an CartProvider");
  }
  return context;
}
