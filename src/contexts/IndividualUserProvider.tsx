import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { Permission } from "../types/permissions.ts";
import { getPermissionsFromToken } from "../utils/jwt";
import { IndividualUserContext } from "./IndividualUserContext";

export default function IndividualUserProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setPermissions([]);
      localStorage.removeItem("permissions");
      setLoading(false);
      setError(null);
      return;
    }

    // Wyciągnij permissions z tokenu
    const perms = getPermissionsFromToken(token);
    setPermissions(perms);
    localStorage.setItem("permissions", JSON.stringify(perms));

    setLoading(true);
  }, []);

  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      return permissions.includes(permission);
    },
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (requiredPermissions: Permission[]): boolean => {
      return requiredPermissions.some((perm) => permissions.includes(perm));
    },
    [permissions],
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    setPermissions([]);
    setError(null);
  }, []);

  const contextValue = {
    permissions,
    loading,
    error,
    refreshCurrentUser,
    hasPermission,
    hasAnyPermission,
    logout,
  };

  return (
    <IndividualUserContext.Provider value={contextValue}>{children}</IndividualUserContext.Provider>
  );
}
