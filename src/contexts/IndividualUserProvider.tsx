import { useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrentUser } from "../api/auth-service";
import type { User } from "../types/users.ts";
import type { Permission } from "../types/permissions.ts";
import { getPermissionsFromToken } from "../utils/jwt";
import { IndividualUserContext } from "./IndividualUserContext";

export default function IndividualUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
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
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setError(null);
    } catch (err) {
      console.error("Error fetching current user:", err);
      setError("Nie udało się załadować danych użytkownika.");
      setCurrentUser(null);
      // Jeśli token jest nieprawidłowy, usuń go
      if (err instanceof Error && err.message.includes("401")) {
        localStorage.removeItem("token");
        localStorage.removeItem("permissions");
        setPermissions([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCurrentUser();
  }, [refreshCurrentUser]);

  const updateCurrentUser = useCallback((userData: Partial<User>) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return { ...prev, ...userData };
    });
  }, []);

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
    setCurrentUser(null);
    setPermissions([]);
    setError(null);
  }, []);

  const contextValue = {
    currentUser,
    permissions,
    loading,
    error,
    refreshCurrentUser,
    updateCurrentUser,
    hasPermission,
    hasAnyPermission,
    logout,
  };

  return (
    <IndividualUserContext.Provider value={contextValue}>
      {children}
    </IndividualUserContext.Provider>
  );
}
