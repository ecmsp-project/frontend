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
    // Don't refetch if cart was manually cleared
    if (hasBeenCleared) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const fetchedCart = await fetchCartProducts();
      const rawItems = fetchedCart.productDtos || [];

      // Map each cart item (productId is variantId) to CartItem by fetching variant details
      const completeItems: CartItem[] = await Promise.all(
        rawItems.map(async (rawItem) => {
          try {
            // productId in cart is actually variantId
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
            // Return a placeholder item if variant fetch fails
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
      setError("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  }, [hasBeenCleared]);

  const removeProduct = useCallback(
    async (productId: string) => {
      // Optimistic update
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));

      try {
        await deleteCartProduct(productId);
        // Refetch to ensure consistency
        await refetchCart();
      } catch (err) {
        console.error("Error removing product:", err);
        // Revert optimistic update on error
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

      // Optimistic update
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
        // Refetch to ensure consistency
        await refetchCart();
      } catch (err) {
        console.error("Error updating quantity:", err);
        // Revert optimistic update on error
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

      // Optimistic update
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );

      try {
        await overwriteCartProduct(productId, newQuantity);
        // Refetch to ensure consistency
        await refetchCart();
      } catch (err) {
        console.error("Error updating quantity:", err);
        // Revert optimistic update on error
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
    clearFullCart,
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}
