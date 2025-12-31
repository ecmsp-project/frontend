import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  fetchCartProducts,
  deleteCartProduct,
  addCartProduct,
  subtractCartProduct,
  overwriteCartProduct,
} from "../api/cart-service";
import { CartContext, type CartItem } from "./CartContext";

const USE_MOCK_DATA = true;

const productMocks: CartItem[] = [
  {
    id: 1,
    name: "Wireless Headphones PRO",
    price: 599.99,
    quantity: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Smartwatch V3",
    price: 999.0,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Cotton T-Shirt (M)",
    price: 79.5,
    quantity: 3,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
  },
];

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBeenCleared, setHasBeenCleared] = useState(false);

  const refetchCart = useCallback(async () => {
    // Don't refetch if cart was manually cleared
    if (hasBeenCleared && USE_MOCK_DATA) {
      return;
    }

    setLoading(true);
    try {
      if (USE_MOCK_DATA) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Only set products if cart hasn't been cleared
        if (!hasBeenCleared) {
          setCartItems([...productMocks]);
        }
        setError(null);
      } else {
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
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  }, [hasBeenCleared]);

  const removeProduct = useCallback(
    async (productId: number) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

      if (USE_MOCK_DATA) {
        return;
      }

      try {
        await deleteCartProduct(productId);
      } catch (err) {
        console.error("Error removing product:", err);
        await refetchCart();
        throw new Error("Failed to remove product from cart.");
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

      if (USE_MOCK_DATA) {
        return;
      }

      try {
        if (delta > 0) {
          await addCartProduct(productId, 1);
        } else {
          await subtractCartProduct(productId, 1);
        }
      } catch (err) {
        console.error("Error updating quantity:", err);
        await refetchCart();
        throw new Error("Failed to update quantity in cart.");
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

      if (USE_MOCK_DATA) {
        return;
      }

      try {
        await overwriteCartProduct(productId, newQuantity);
      } catch (err) {
        console.error("Error updating quantity:", err);
        await refetchCart();
        throw new Error("Failed to update quantity in cart.");
      }
    },
    [refetchCart, removeProduct],
  );

  const clearCart = useCallback(async () => {
    setCartItems([]);
    setHasBeenCleared(true); // Mark as cleared so refetchCart doesn't restore products
    // TODO: Implement API call to clear cart when not using mock data
    // if (!USE_MOCK_DATA) {
    //   try {
    //     await clearCartAPI();
    //   } catch (err) {
    //     console.error("Error clearing cart:", err);
    //     throw new Error("Failed to clear cart.");
    //   }
    // }
  }, []);

  useEffect(() => {
    refetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = {
    cartItems,
    loading,
    error,
    refetchCart,
    updateProductQuantity,
    overwriteProductQuantity,
    removeProduct,
    clearCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
