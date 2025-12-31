import type { OrderDetailsResponse } from "../types/orders";
import { API_BASE_URL, apiCall } from "./utils";

export const fetchUserOrders = async (): Promise<OrderDetailsResponse[]> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/orders/grpc`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching user orders:", error);
    throw error;
  }
};

export const fetchAllOrders = async (): Promise<OrderDetailsResponse[]> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/orders/grpc/all`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching user orders:", error);
    throw error;
  }
};
