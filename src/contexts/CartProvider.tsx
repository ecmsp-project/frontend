import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  fetchCartProducts,
  deleteCartProduct,
  addCartProduct,
  subtractCartProduct,
  overwriteCartProduct,
} from "../api/cart-service";
import { CartContext, type CartItem } from "./CartContext";

const productMocks: CartItem[] = [
  {
    id: 1,
    name: "Słuchawki Bezprzewodowe PRO",
    price: 599.99,
    quantity: 0,
    image: "https://via.placeholder.com/100x100?text=Słuchawki",
  },
  {
    id: 2,
    name: "Smartwatch V3",
    price: 999.0,
    quantity: 0,
    image: "https://via.placeholder.com/100x100?text=Smartwatch",
  },
  {
    id: 3,
    name: "T-Shirt Bawełniany (M)",
    price: 79.5,
    quantity: 0,
    image: "https://via.placeholder.com/100x100?text=T-shirt",
  },
];

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedCart = await fetchCartProducts();
      const rawItems = fetchedCart.productDtos || [];

      const completeItems: CartItem[] = rawItems
        .map((rawItem) => {
          const productDetails = productMocks.find((mock) => mock.id === rawItem.productId);
          if (productDetails) {
            return {
              ...productDetails,
              quantity: rawItem.quantity,
            };
          }
          return null;
        })
        .filter((item): item is CartItem => item !== null);

      setCartItems(completeItems);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeProduct = useCallback(
    async (productId: number) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

      try {
        await deleteCartProduct(productId);
      } catch (err) {
        console.error("Błąd usuwania produktu:", err);
        await refetchCart();
        throw new Error("Nie udało się usunąć produktu z koszyka.");
      }
    },
    [refetchCart],
  );

  const updateProductQuantity = useCallback(
    async (productId: number, quantity: number, delta: number) => {
      const newQuantity = quantity + delta;
      if (newQuantity <= 0) {
        await removeProduct(productId);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      try {
        if (delta > 0) {
          await addCartProduct(productId, 1);
        } else {
          await subtractCartProduct(productId, 1);
        }
      } catch (err) {
        console.error("Błąd aktualizacji ilości:", err);
        await refetchCart();
        throw new Error("Nie udało się zaktualizować ilości w koszyku.");
      }
    },
    [refetchCart, removeProduct],
  );

  const overwriteProductQuantity = useCallback(
    async (productId: number, newQuantity: number) => {
      if (newQuantity <= 0) {
        await removeProduct(productId);
        return;
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      try {
        await overwriteCartProduct(productId, newQuantity);
      } catch (err) {
        console.error("Błąd aktualizacji ilości:", err);
        await refetchCart();
        throw new Error("Nie udało się zaktualizować ilości w koszyku.");
      }
    },
    [refetchCart, removeProduct],
  );

  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  const contextValue = {
    cartItems,
    loading,
    error,
    refetchCart,
    updateProductQuantity,
    overwriteProductQuantity,
    removeProduct,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
