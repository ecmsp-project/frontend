import type { Cart, DeleteProductRequest, ProductDtos } from "../types/cart.ts";
import { API_BASE_URL, apiCall } from "./utils.ts";

export const fetchCartProducts = async (): Promise<Cart> => {
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

export const addCartProduct = async (productId: number, quantity: number): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const addBody: ProductDtos = { productId, quantity };

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
  } catch (error) {
    console.error(`API Error adding product ${productId} to cart:`, error);
    throw error;
  }
};

export const subtractCartProduct = async (productId: number, quantity: number): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const addBody: ProductDtos = { productId, quantity };

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart/subtractProduct`, {
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
  } catch (error) {
    console.error(`API Error adding product ${productId} to cart:`, error);
    throw error;
  }
};

export const overwriteCartProduct = async (productId: number, quantity: number): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const addBody: ProductDtos = { productId, quantity };

  try {
    const response = await apiCall(`${API_BASE_URL}/api/cart/updateQuantity`, {
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
  } catch (error) {
    console.error(`API Error adding product ${productId} to cart:`, error);
    throw error;
  }
};

export const deleteCartProduct = async (productId: number): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  const deleteBody: DeleteProductRequest = { productId };

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
  } catch (error) {
    console.error(`API Error deleting product ${productId} from cart:`, error);
    throw error;
  }
};
