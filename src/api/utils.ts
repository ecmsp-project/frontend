const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const apiCall = async (url: string, options: RequestInit = {}) => {
  const defaultOptions: RequestInit = {
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  };

  const response = await fetch(url, { ...defaultOptions });
  if (!response.ok) {
    if (response.status === 401) {
      console.error("Unauthorized - redirecting to login");
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

export { apiCall, API_BASE_URL };

export const getUserRoles = (): string[] => {
  const roles = localStorage.getItem("userRoles");
  return roles ? JSON.parse(roles) : [];
};

export const isAdmin = (): boolean => {
  const roles = getUserRoles();
  return roles.includes("ADMIN") || roles.includes("ROLE_ADMIN");
};
