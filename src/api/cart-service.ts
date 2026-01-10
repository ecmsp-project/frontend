import type { CartDto, CartProductDto } from "../types/cart.ts";
import { API_BASE_URL, apiCall } from "./utils.ts";

export const fetchCartProducts = async (): Promise<CartDto> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching user cart:", error);
    throw error;
  }
};

export const addCartProduct = async (productId: string, quantity: number): Promise<CartDto> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const addBody: CartProductDto = { productId, quantity };

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart/addProduct`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to add product to cart: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error adding product ${productId} to cart:`, error);
    throw error;
  }
};

export const subtractCartProduct = async (
  productId: string,
  quantity: number,
): Promise<CartDto> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const subtractBody: CartProductDto = { productId, quantity };

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart/subtractProduct`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subtractBody),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to subtract product from cart: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error subtracting product ${productId} from cart:`, error);
    throw error;
  }
};

export const overwriteCartProduct = async (
  productId: string,
  quantity: number,
): Promise<CartDto> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const updateBody: CartProductDto = { productId, quantity };

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart/updateQuantity`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateBody),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update product quantity in cart: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error updating product ${productId} quantity in cart:`, error);
    throw error;
  }
};

export const deleteCartProduct = async (productId: string): Promise<CartDto> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const deleteBody: CartProductDto = { productId, quantity: 0 };

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart/deleteProduct`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deleteBody),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete product from cart: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error deleting product ${productId} from cart:`, error);
    throw error;
  }
};

export const clearCart = async (productIds: string[]): Promise<CartDto> => {
  productIds.forEach(async (productId) => {
    await deleteCartProduct(productId);
  });

  return await fetchCartProducts();
};
