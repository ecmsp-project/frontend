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
