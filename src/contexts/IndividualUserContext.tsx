import { createContext, useContext } from "react";
import type { User } from "../types/users.ts";
import type { Permission } from "../types/permissions.ts";

interface IndividualUserContextType {
  currentUser: User | null;
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  refreshCurrentUser: () => Promise<void>;
  updateCurrentUser: (userData: Partial<User>) => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  logout: () => void;
}

export const IndividualUserContext = createContext<IndividualUserContextType | undefined>(
  undefined,
);

export function useIndividualUser() {
  const context = useContext(IndividualUserContext);
  if (!context) {
    throw new Error("useIndividualUser must be used within an IndividualUserProvider");
  }
  return context;
}
