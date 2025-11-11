import type { User } from "../types/users.ts";
import { API_BASE_URL, apiCall } from "./utils";

export const login = async (login: string, password: string) => {
  try {
    const response = await apiCall(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      body: JSON.stringify({ login, password }),
    });

    const loginData = await response.json();

    if (!response.ok) {
      throw new Error(loginData.message || "Login failed");
    }

    return loginData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch current user: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching current user:", error);
    throw error;
  }
};
