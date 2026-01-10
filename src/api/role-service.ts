import type { Role } from "../types/users.ts";
import { API_BASE_URL, apiCall } from "./utils.ts";

export const fetchRoles = async (): Promise<Role[]> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/roles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch roles: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching roles:", error);
    throw error;
  }
};

export const addRole = async (role: Role): Promise<void> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/roles`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Failed to add role: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`API Error adding role ${role.name}`, error);
    throw error;
  }
};

export const updateRole = async (role: Role): Promise<void> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/roles`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(role),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error updating user:", error);
    throw error;
  }
};

export const deleteRole = async (roleName: string): Promise<void> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/roles/${roleName}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete role: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error("API Error deleting role:", error);
    throw error;
  }
};

export const addUsersToRole = async (roleName: string, userIds: string[]): Promise<void> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const requestBody = { userIds: userIds };
    const response = await apiCall(`${API_BASE_URL}/api/roles/${roleName}/users`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to add users to role: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error(`API Error adding users ${userIds} to role ${roleName}`, error);
    throw error;
  }
};

export const deleteUsersFromRole = async (roleName: string, userIds: string[]): Promise<void> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const requestBody = { userIds: userIds };
    const response = await apiCall(`${API_BASE_URL}/api/roles/${roleName}/users`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete users from role: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    console.error(`API Error deleting users ${userIds} from role ${roleName}`, error);
    throw error;
  }
};

export const fetchRolesPermissions = async (): Promise<string[]> => {
  const jwtToken = localStorage.getItem("token");
  if (!jwtToken) {
    throw new Error("Authorization token not found. Please log in.");
  }

  try {
    const response = await apiCall(`${API_BASE_URL}/api/roles/permissions`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch roles permissions: ${response.status} ${response.statusText}`,
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error fetching roles permissions:", error);
    throw error;
  }
};
