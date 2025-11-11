import { useState, useEffect, useCallback, type ReactNode } from "react";
import { getCurrentUser } from "../api/auth-service";
import type { User } from "../types/users.ts";
import { IndividualUserContext } from "./IndividualUserContext";

export default function IndividualUserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCurrentUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentUser(null);
      setLoading(false);
      setError(null);
      return;
    }

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

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setError(null);
  }, []);

  const contextValue = {
    currentUser,
    loading,
    error,
    refreshCurrentUser,
    updateCurrentUser,
    logout,
  };

  return (
    <IndividualUserContext.Provider value={contextValue}>
      {children}
    </IndividualUserContext.Provider>
  );
}
