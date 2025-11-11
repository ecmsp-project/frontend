import type { Permission } from "../types/permissions";

interface JWTPayload {
  sub?: string;
  permissions?: Permission[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT token format");
      return null;
    }

    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodedPayload) as JWTPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getPermissionsFromToken = (token: string): Permission[] => {
  const decoded = decodeJWT(token);
  return decoded?.permissions || [];
};

export const hasPermission = (
  permissions: Permission[],
  requiredPermission: Permission,
): boolean => {
  return permissions.includes(requiredPermission);
};

export const hasAnyPermission = (
  permissions: Permission[],
  requiredPermissions: Permission[],
): boolean => {
  return requiredPermissions.some((perm) => permissions.includes(perm));
};
