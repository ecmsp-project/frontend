import type { GlobalSettings } from "../types/cms";
import { API_BASE_URL, apiCall } from "./utils";

export const fetchGlobalSettings = async (): Promise<GlobalSettings> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/users/globalsettings`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch global settings: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching global settings:", error);
    throw error;
  }
};

export const saveGlobalSettings = async (settings: GlobalSettings): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/users/globalsettings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to save global settings: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error("API Error saving global settings:", error);
    throw error;
  }
};
