import { type ReactNode, useCallback, useEffect, useState } from "react";
import {
  fetchCartProducts,
  deleteCartProduct,
  addCartProduct,
  subtractCartProduct,
  overwriteCartProduct,
  clearCart,
} from "../api/cart-service";
import { getVariantDetails } from "../api/product-service";
import { CartContext, type CartItem } from "./CartContext";

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBeenCleared, setHasBeenCleared] = useState(false);

  const refetchCart = useCallback(async () => {
    if (hasBeenCleared) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setCartItems([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedCart = await fetchCartProducts();
      const rawItems = fetchedCart.productDtos || [];

      const completeItems: CartItem[] = await Promise.all(
        rawItems.map(async (rawItem) => {
          try {
            const variantDetails = await getVariantDetails(rawItem.productId);
            const variant = variantDetails.variant;
            const mainImage =
              variant.variantImages?.find((img) => img.isMain) || variant.variantImages?.[0];

            return {
              id: rawItem.productId,
              name: variant.name,
              price: variant.price,
              quantity: rawItem.quantity,
              image: mainImage?.url || "",
            };
          } catch (err) {
            console.error(
              `Failed to fetch variant details for variantId ${rawItem.productId}:`,
              err,
            );
            return {
              id: rawItem.productId,
              name: `Product ${rawItem.productId}`,
              price: 0,
              quantity: rawItem.quantity,
              image: "",
            };
          }
        }),
      );

      setCartItems(completeItems);
    } catch (err) {
      console.error("Error fetching cart:", err);
      if (token) {
        setError("Failed to fetch cart items");
      } else {
        setCartItems([]);
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  }, [hasBeenCleared]);

  const removeProduct = useCallback(
    async (productId: string) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

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
    async (productId: string, quantity: number, delta: number) => {
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
        console.error("Error updating quantity:", err);
        await refetchCart();
        throw new Error("Failed to update quantity in cart.");
      }
    },
    [refetchCart, removeProduct],
  );

  const overwriteProductQuantity = useCallback(
    async (productId: string, newQuantity: number) => {
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
        console.error("Error updating quantity:", err);
        await refetchCart();
        throw new Error("Failed to update quantity in cart.");
      }
    },
    [refetchCart, removeProduct],
  );

  const clearFullCart = useCallback(async () => {
    setCartItems([]);
    setHasBeenCleared(true);
    await clearCart(cartItems.map((item) => item.id));
  }, [cartItems]);

  useEffect(() => {
    refetchCart();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        refetchCart();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleTokenChange = () => {
      refetchCart();
    };
    window.addEventListener("token-changed", handleTokenChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("token-changed", handleTokenChange);
    };
  }, [refetchCart]);

  const contextValue = {
    cartItems,
    loading,
    error,
    refetchCart,
    updateProductQuantity,
    overwriteProductQuantity,
    removeProduct,
    clearFullCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
