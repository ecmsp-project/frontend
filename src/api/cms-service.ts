import type {
  GlobalSettings,
  HomePageContent,
  FaqPageContent,
  ContactPageContent,
} from "../types/cms";
import { API_BASE_URL, apiCall } from "./utils";

// ==================== HOME PAGE ====================

export const fetchHomeSettings = async (): Promise<HomePageContent> => {
  try {
    const response = await apiCall(`${API_BASE_URL}/api/settings/home`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch home settings: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching home settings:", error);
    throw error;
  }
};

export const saveHomeSettings = async (settings: HomePageContent): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/settings/home`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`Failed to save home settings: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error saving home settings:", error);
    throw error;
  }
};

// ==================== FAQ PAGE ====================

export const fetchFaqSettings = async (): Promise<FaqPageContent> => {
  try {
    const response = await apiCall(`${API_BASE_URL}/api/settings/faq`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch FAQ settings: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching FAQ settings:", error);
    throw error;
  }
};

export const saveFaqSettings = async (settings: FaqPageContent): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/settings/faq`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`Failed to save FAQ settings: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error saving FAQ settings:", error);
    throw error;
  }
};

// ==================== CONTACT PAGE ====================

export const fetchContactSettings = async (): Promise<ContactPageContent> => {
  try {
    const response = await apiCall(`${API_BASE_URL}/api/settings/contact`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch contact settings: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching contact settings:", error);
    throw error;
  }
};

export const saveContactSettings = async (settings: ContactPageContent): Promise<void> => {
  const jwtToken = localStorage.getItem("token");

  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/settings/contact`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error(`Failed to save contact settings: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error saving contact settings:", error);
    throw error;
  }
};

// ==================== LEGACY GLOBAL SETTINGS (deprecated) ====================

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
      throw new Error(`Failed to fetch global settings: ${response.status} ${response.statusText}`);
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
      throw new Error(`Failed to save global settings: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error saving global settings:", error);
    throw error;
  }
};
