import { createContext, useContext } from "react";
import type { Permission } from "../types/permissions.ts";

interface IndividualUserContextType {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  refreshCurrentUser: () => Promise<void>;
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
