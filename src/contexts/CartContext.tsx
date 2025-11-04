import { createContext, useContext } from "react";

export interface CartItem {
  id: number;
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
  updateProductQuantity: (productId: number, quantity: number, delta: number) => Promise<void>;
  overwriteProductQuantity: (productId: number, newQuantity: number) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within an CartProvider");
  }
  return context;
}
